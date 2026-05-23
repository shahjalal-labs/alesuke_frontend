"use client";

import { useEffect, useMemo, useState } from "react";
import { Circle, Heart, Loader2, UserRound, UsersRound } from "lucide-react";
import AddPersonModal from "@/components/ui/AddPersonModal";

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
  TipButton,
  TipCallout,
} from "./DivideEstateShell";

import { useGetAllMemberListQuery } from "@/redux/api/profileApi";

type MemberRecord = {
  id: string;
  fullName?: string | null;
  email?: string | null;
  relationType?: string | null;
};

function Beneficiaries() {
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const beneficiaryMembers = useMemo(() => {
    return (members as MemberRecord[]).filter(
      (member) => member.relationType === "SPOUSE" || member.relationType === "PARTNER" || member.relationType === "CHILD"
    );
  }, [members]);

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId]
    );
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
          {!mounted || isLoading ? (
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
                    {beneficiaryMembers.map((member, index) => {
                      const isAdultBeneficiary = member.relationType === "SPOUSE" || member.relationType === "PARTNER";
                      const selected = selectedMemberIds.includes(member.id);

                      return (
                        <PersonRow
                          key={member.id}
                          icon={isAdultBeneficiary ? <Heart className="h-4.5 w-4.5 fill-current" /> : <UserRound className="h-4.5 w-4.5" />}
                          title={member.fullName ?? `Beneficiary ${index + 1}`}
                          subtitle={member.relationType === "SPOUSE" ? "Spouse" : member.relationType === "PARTNER" ? "Partner" : "Child"}
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

        <div className="space-y-4 border-l-2 border-[#90d8ef] pl-4">
          <div className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-[#55c4e9]">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#90d8ef] text-[0.68rem]">i</span>
            Tip
          </div>
          <BodyCopy className="text-[#748192]">
            You can edit the details of your family, your pets and people in your will in your Address book.
          </BodyCopy>
          <BodyCopy className="text-[#748192]">Any new people you add will also be added to your Address book.</BodyCopy>
          <TipButton>View my address book</TipButton>
        </div>

        <FooterActions previousHref="/will/divide-estate/partner" nextHref="/will/divide-estate/distribute-estate" />
      </section>

      <AddPersonModal
        open={isAddPersonOpen}
        onClose={() => setIsAddPersonOpen(false)}
        title="Add a new person"
        actionLabel="Create a person"
        onSuccess={() => setIsAddPersonOpen(false)}
      />
    </DivideEstateShell>
  );
}

export default Beneficiaries;
