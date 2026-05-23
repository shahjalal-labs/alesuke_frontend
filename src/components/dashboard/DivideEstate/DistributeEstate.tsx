"use client";

import { useMemo, useState } from "react";
import { Loader2, Heart, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  BodyCopy,
  DivideEstateShell,
  FooterActions,
  FlowLead,
  FlowTitle,
  Panel,
  SectionEyebrow,
  PercentageRow,
  SuccessSummary,
} from "./DivideEstateShell";

import { useGetAllMemberListQuery } from "@/redux/api/profileApi";
import { useAddDistributionMutation } from "@/redux/api/executorApi";

type MemberRecord = {
  id: string;
  fullName?: string | null;
  relationType?: string | null;
};

function DistributeEstate() {
  const router = useRouter();
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined);
  const [selectedPeopleIds, setSelectedPeopleIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addDistribution] = useAddDistributionMutation();

  const distributableMembers = useMemo(() => {
    return (members as MemberRecord[]).filter(
      (member) => member.relationType === "SPOUSE" || member.relationType === "PARTNER" || member.relationType === "CHILD"
    );
  }, [members]);

  const sharePercentage = selectedPeopleIds.length ? Math.floor(100 / selectedPeopleIds.length) : 0;

  const toggleSelection = (peopleId: string) => {
    setSelectedPeopleIds((current) =>
      current.includes(peopleId) ? current.filter((id) => id !== peopleId) : [...current, peopleId]
    );
  };

  const handleSave = async () => {
    if (!selectedPeopleIds.length) {
      toast.error("Select at least one beneficiary before continuing.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDistribution({
        distributions: selectedPeopleIds.map((peopleId) => ({ peopleId })),
      }).unwrap();
      toast.success("Distribution saved successfully.");
      router.push("/will/divide-estate/choose-backup-option");
    } catch (error) {
      console.error(error);
      toast.error("Unable to save distribution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Divide your estate</FlowTitle>
          <FlowLead>Your estate is divided using a simple % for each beneficiary</FlowLead>
          <BodyCopy>Please adjust the % number below.</BodyCopy>
        </div>

        <SuccessSummary>
          <p className="text-[0.95rem] font-semibold leading-[1.3] text-[#191715] md:text-[1rem]">You have allocated 100% of your estate</p>
          <p className="text-[0.82rem] leading-[1.45] text-[#7b8594] md:text-[0.9rem]">You can proceed to the next step, or change the % distribution below.</p>
        </SuccessSummary>

        <Panel>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-[#6e7886]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : distributableMembers.length ? (
            <div className="space-y-3 md:space-y-4">
              {distributableMembers.map((member, index) => {
                const selected = selectedPeopleIds.includes(member.id);
                const isSpouseOrPartner = member.relationType === "SPOUSE" || member.relationType === "PARTNER";
                const percent = selected ? `${sharePercentage}%` : "";

                return (
                  <PercentageRow
                    key={member.id}
                    title={member.fullName ?? `Beneficiary ${index + 1}`}
                    percent={percent}
                    selected={selected}
                    onClick={() => toggleSelection(member.id)}
                    icon={isSpouseOrPartner ? <Heart className="h-4.5 w-4.5 fill-current" /> : <UserRound className="h-4.5 w-4.5" />}
                  />
                );
              })}

              {selectedPeopleIds.length ? (
                <p className="pt-1 text-[0.85rem] text-[#7b8594]">{selectedPeopleIds.length} selected</p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">No beneficiaries have been added yet.</div>
          )}
        </Panel>

        <FooterActions
          previousHref="/will/divide-estate/choose-beneficaries"
          nextLabel={isSubmitting ? "Saving..." : "Save & Continue"}
          onNext={handleSave}
          nextDisabled={isSubmitting || !selectedPeopleIds.length}
        />
      </section>
    </DivideEstateShell>
  );
}

export default DistributeEstate;
