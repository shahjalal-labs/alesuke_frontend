"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import AddPersonModal from "@/components/ui/AddPersonModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AddPersonRow,
  BodyCopy,
  PersonRow,
  DivideEstateShell,
  FooterActions,
  FlowLead,
  FlowTitle,
  Panel,
  SectionEyebrow,
} from "./DivideEstateShell";

import { useGetAllMemberListQuery } from "@/redux/api/profileApi";
import { useAddDistributionMutation, useGetDistributionsQuery } from "@/redux/api/executorApi";

type MemberRecord = {
  id: string;
  fullName?: string | null;
  relationType?: string | null;
};

type DistributionRecord = {
  id?: string;
  peopleId?: string | null;
  backupDistributors?: Array<{ peopleId?: string | null; person?: { id?: string } }>;
  person?: { id?: string };
};

function BackupBeneficiaries() {
  const router = useRouter();
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined);
  const { data: distributionResponse, isLoading: isLoadingDistributions } = useGetDistributionsQuery(undefined);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [selectedBackupIds, setSelectedBackupIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addDistribution] = useAddDistributionMutation();

  const childMembers = useMemo(() => {
    return (members as MemberRecord[]).filter((member) => member.relationType === "CHILD");
  }, [members]);

  const primaryChildId = childMembers[0]?.id;
  const primaryChildName = childMembers[0]?.fullName ?? "Child 01";

  // derive saved backup ids from distributions: find distribution for primary child and read backupDistributors
  const savedBackupIds = useMemo(() => {
    const distributions = ((distributionResponse as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];
    if (!primaryChildId) return [] as string[];
    const dist = distributions.find((d) => d.peopleId === primaryChildId || d.person?.id === primaryChildId);
    if (!dist) return [] as string[];
    const list: string[] = [];
    (dist.backupDistributors ?? []).forEach((bd) => {
      if (bd.peopleId) list.push(bd.peopleId);
      else if (bd.person?.id) list.push(bd.person.id as string);
    });
    return list;
  }, [distributionResponse, primaryChildId]);

  useEffect(() => {
    if (savedBackupIds.length) setSelectedBackupIds(savedBackupIds);
  }, [savedBackupIds]);

  // backup candidates: all members except the primary child
  const backupCandidates = useMemo(() => {
    return (members as MemberRecord[]).filter((m) => m.id !== primaryChildId);
  }, [members, primaryChildId]);

  const toggleBackup = (id: string) => {
    setSelectedBackupIds((current) => (current.includes(id) ? current.filter((i) => i !== id) : [...current, id]));
  };

  const handleSaveBackups = async () => {
    if (!selectedBackupIds.length && !primaryChildId) {
      toast.error("Select at least one backup beneficiary before continuing.");
      return;
    }
    setIsSubmitting(true);
    try {
      const allIds = Array.from(new Set([...(primaryChildId ? [primaryChildId] : []), ...selectedBackupIds]));
      await addDistribution({ distributions: allIds.map((peopleId) => ({ peopleId })) }).unwrap();
      toast.success("Backup beneficiaries saved.");
      router.push("/will/divide-estate/complete");
    } catch (err) {
      console.error(err);
      toast.error("Unable to save backup beneficiaries. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Backup beneficiaries for {primaryChildName}</FlowTitle>
          <FlowLead>
            If {primaryChildName}'s share of their estate cannot be given, then who should inherit their share?
          </FlowLead>
          <BodyCopy>
            When planning your estate, it is important to decide who should receive assets if the primary recipient ({primaryChildName}) is unable to take them. This situation might occur if the child:
          </BodyCopy>
          <ul className="space-y-1 pl-5 text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]">
            <li>Passes away before you.</li>
            <li>Decides they do not want the inheritance.</li>
            <li>Cannot be located by the executors.</li>
          </ul>

          <div className="space-y-3 pt-1">
            <h2 className="text-[1rem] font-semibold text-[#191715] md:text-[1.08rem]">How to Assign Backup Heirs</h2>
            <BodyCopy>
              If {primaryChildName} cannot receive their portion, you need to designate a secondary beneficiary. You have two main options for distributing that specific share:
            </BodyCopy>
            <ol className="space-y-2 pl-5 text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]">
              <li>Single Successor: Name one specific individual to take over the entire share.</li>
              <li>Group Distribution: Name several people to split that share equally among themselves.</li>
            </ol>
          </div>
        </div>

        <Panel>
          {isLoading || isLoadingDistributions ? (
            <div className="flex items-center justify-center py-12 text-[#6e7886]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 md:space-y-5">
              {/* Primary child card (non-interactive, always shown first) */}
              <div className="space-y-3">
                <PersonRow title={primaryChildName} selected={true} />
              </div>

              {backupCandidates.length ? (
                <div className="space-y-3">
                  {backupCandidates.map((member, index) => {
                    const selected = selectedBackupIds.includes(member.id);
                    return (
                      <PersonRow
                        key={member.id}
                        title={member.fullName ?? `Person ${index + 1}`}
                        selected={selected}
                        action={selected ? "remove" : undefined}
                        onClick={() => toggleBackup(member.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">No people available for backup.</div>
              )}

              <AddPersonRow onClick={() => setIsAddPersonOpen(true)} />
            </div>
          )}
        </Panel>

        <FooterActions
          previousHref="/will/divide-estate/choose-backup-option"
          nextLabel={isSubmitting ? "Saving..." : "Save & Continue"}
          onNext={handleSaveBackups}
          nextDisabled={isSubmitting || (!selectedBackupIds.length && !primaryChildId)}
        />
      </section>

      <AddPersonModal open={isAddPersonOpen} onClose={() => setIsAddPersonOpen(false)} title="Add a new person" actionLabel="Create a person" onSuccess={() => setIsAddPersonOpen(false)} />
    </DivideEstateShell>
  );
}

export default BackupBeneficiaries;
