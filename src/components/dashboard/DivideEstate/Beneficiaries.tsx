"use client";

import { useEffect, useMemo, useState } from "react";
import { Circle, Heart, Loader2, UserRound, UsersRound } from "lucide-react";
import AddPersonModal from "@/components/ui/AddPersonModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AddPersonRow,
  BodyCopy,
  DivideEstateShell,
  FooterActions,
  FlowLead,
  FlowTitle,
  HelpCard,
  Panel,
  PersonRow,
  SectionEyebrow,
} from "./DivideEstateShell";

import { useGetAllMemberListQuery } from "@/redux/api/profileApi";
import { useAddDistributionMutation, useGetDistributionsQuery } from "@/redux/api/executorApi";

type MemberRecord = {
  id: string;
  fullName?: string | null;
  email?: string | null;
  relationType?: string | null;
};

type DistributionRecord = {
  peopleId?: string | null;
  backupDistributors?: Array<{
    person?: {
      id?: string;
      fullName?: string;
    };
  }>;
};

// Helper function to get display label for relation type
const getRelationLabel = (relationType?: string | null): string => {
  const relationMap: Record<string, string> = {
    'SPOUSE': 'Spouse',
    'PARTNER': 'Partner',
    'CHILD': 'Child',
    'FRIEND': 'Friend',
    'SISTER': 'Sister',
    'BROTHER': 'Brother',
    'COUSIN': 'Cousin',
    'FATHER': 'Father',
    'MOTHER': 'Mother',
    'SIBLING': 'Sibling',
    'GRANDPARENT': 'Grandparent',
    'PARENT': 'Parent',
    'NEPHEW': 'Nephew',
    'OTHER': 'Other',
    'PET': 'Pet',
  };
  return relationMap[relationType || ''] || relationType || 'Family Member';
};

function Beneficiaries() {
  const router = useRouter();
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined);
  const { data: distributionResponse, isLoading: isLoadingDistributions } = useGetDistributionsQuery(undefined);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addDistribution] = useAddDistributionMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter out PET type members - they should NOT show in beneficiaries
  const beneficiaryMembers = useMemo(() => {
    return (members as MemberRecord[]).filter(
      (member) => member.relationType !== "PET"
    );
  }, [members]);

  // Get saved distribution member IDs (primary beneficiaries)
  const savedDistributionMemberIds = useMemo(() => {
    const distributions = ((distributionResponse as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];
    return distributions
      .map((distribution) => distribution.peopleId)
      .filter((peopleId): peopleId is string => Boolean(peopleId));
  }, [distributionResponse]);

  // Get backup distribution member IDs (people who appear as backup)
  const backupDistributionMemberIds = useMemo(() => {
    const distributions = ((distributionResponse as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];
    const backupIds: string[] = [];
    distributions.forEach((distribution) => {
      if (distribution.backupDistributors) {
        distribution.backupDistributors.forEach((backup) => {
          if (backup.person?.id) {
            backupIds.push(backup.person.id);
          }
        });
      }
    });
    return backupIds;
  }, [distributionResponse]);

  // Combine all saved IDs (primary + backup)
  const allSavedMemberIds = useMemo(() => {
    const combined = [...savedDistributionMemberIds, ...backupDistributionMemberIds];
    // Remove duplicates
    return [...new Set(combined)];
  }, [savedDistributionMemberIds, backupDistributionMemberIds]);

  // Set selected members based on saved data - FIXED to run when data is loaded
  useEffect(() => {
    if (allSavedMemberIds.length > 0) {
      setSelectedMemberIds(allSavedMemberIds);
    }
  }, [allSavedMemberIds]);

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId]
    );
  };

  const handleSaveAndContinue = async () => {
    if (!selectedMemberIds.length) {
      toast.error("Select at least one beneficiary before continuing.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDistribution({
        distributions: selectedMemberIds.map((peopleId) => ({ peopleId })),
      }).unwrap();
      toast.success("Beneficiaries saved successfully.");
      router.push("/will/divide-estate/distribute-estate");
    } catch (error) {
      console.error(error);
      toast.error("Unable to save beneficiaries. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Beneficiaries</FlowTitle>
          <FlowLead>Choose who you wish to leave you estate to, in accorded percentages.</FlowLead>
          <BodyCopy>If you wish to gift something personal, i.e. a watch. Please add it in the gifts section</BodyCopy>
        </div>

        <Panel>
          {!mounted || isLoading || isLoadingDistributions ? (
            <div className="flex items-center justify-center py-12 text-[#6e7886]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 md:space-y-5">
              <HelpCard>
                Children under 21 can be assigned a percentage of your estate, however appointed guardians will safeguard your intentions as a custodian until they reach 21 years of age.
              </HelpCard>

              <div className="space-y-3">
                {beneficiaryMembers.length ? (
                  <div className="space-y-3">
                    {beneficiaryMembers.map((member) => {
                      const isAdultBeneficiary = member.relationType === "SPOUSE" || member.relationType === "PARTNER";
                      const selected = selectedMemberIds.includes(member.id);
                      const relationLabel = getRelationLabel(member.relationType);

                      return (
                        <PersonRow
                          key={member.id}
                          icon={isAdultBeneficiary ? <Heart className="h-4.5 w-4.5 fill-current" /> : <UserRound className="h-4.5 w-4.5" />}
                          title={member.fullName ?? "Unnamed"}
                          subtitle={relationLabel}
                          selected={selected}
                          onClick={() => toggleMember(member.id)}
                          trailing={!selected ? (
                            <span
                              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#fff] text-[#9199a6]"
                              aria-hidden="true"
                            >
                              <Circle className="h-5 w-5" />
                            </span>
                          ) : undefined}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">No beneficiaries have been added yet.</div>
                )}

                <AddPersonRow onClick={() => setIsAddPersonOpen(true)} />
              </div>
            </div>
          )}
        </Panel>

        <FooterActions
          previousHref="/will/divide-estate/partner"
          nextLabel={isSubmitting ? "Saving..." : "Save & Continue"}
          onNext={handleSaveAndContinue}
          nextDisabled={isSubmitting || !selectedMemberIds.length}
        />
      </section>

      <AddPersonModal
        open={isAddPersonOpen}
        onClose={() => setIsAddPersonOpen(false)}
        title="Add a new person"
        actionLabel="Create a person"
        onSuccess={() => setIsAddPersonOpen(false)}
        showRelationshipDropdown={true}
      />
    </DivideEstateShell>
  );
}

export default Beneficiaries;