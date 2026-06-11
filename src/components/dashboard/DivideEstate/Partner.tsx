"use client";

import {
  BodyCopy,
  DivideEstateShell,
  DualChoicePanel,
  FooterActions,
  FlowLead,
  FlowTitle,
  SectionEyebrow,
  TipCallout,
} from "./DivideEstateShell";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetWillDetailsQuery, useDistributionTypeMutation } from "@/redux/api/profileApi";
import { toast } from "sonner";

function Partner() {
  const router = useRouter();
  const [selectedChoice, setSelectedChoice] = useState<"no" | "yes" | null>(null);
  const [hasSetInitialChoice, setHasSetInitialChoice] = useState(false);
  
  const { data: willDetails, isLoading } = useGetWillDetailsQuery(undefined);
  const [updateDistributionType, { isLoading: isUpdating }] = useDistributionTypeMutation();

  const nextHref = selectedChoice === "yes" ? "/will/divide-estate/choose-backup-option" : "/will/divide-estate/choose-beneficaries";

  useEffect(() => {
    if (willDetails?.data?.estateDistributionType && !hasSetInitialChoice) {
      if (willDetails.data.estateDistributionType === "MANUAL") setSelectedChoice("no");
      else if (willDetails.data.estateDistributionType === "AUTO") setSelectedChoice("yes");
      setHasSetInitialChoice(true);
    }
  }, [willDetails, hasSetInitialChoice]);

  const handleChoice = (choice: "no" | "yes") => {
    setSelectedChoice(choice);
  };

  const handleNext = async () => {
    if (!selectedChoice) return;

    if (willDetails?.data?.id) {
      try {
        await updateDistributionType({
          willId: willDetails.data.id,
          data: {
            estateDistributionType: selectedChoice === "yes" ? "AUTO" : "MANUAL"
          }
        }).unwrap();
        router.push(nextHref);
      } catch (error) {
        toast.error("Failed to update estate distribution type");
        console.error(error);
      }
    } else {
      toast.error("Will details not found. Please refresh the page.");
    }
  };

  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Planning For Your Partner & Family</FlowTitle>

          <TipCallout>
            <BodyCopy className="text-[#748192]">
              Primary Choice: Many people choose to leave 100% of their estate to their spouse/partner first.
            </BodyCopy>
            <BodyCopy className="text-[#748192]">
              Backup planning: You might name your spouse for the full amount, but list your children as backups if your spouse cannot inherit
            </BodyCopy>
            <BodyCopy className="text-[#748192]">
              For example, you might name your spouse as the primary beneficiary of 100% of the estate, and your two children as backup beneficiaries to receive 50% each.
            </BodyCopy>
          </TipCallout>

          <FlowLead>Do you want to give 100% of your residuary estate to Spouse / Children?</FlowLead>

          <DualChoicePanel
            leftLabel="No"
            rightLabel="Yes (Most Common)"
            leftOnClick={() => handleChoice("no")}
            rightOnClick={() => handleChoice("yes")}
            activeChoice={selectedChoice === "no" ? "left" : selectedChoice === "yes" ? "right" : null}
          />
        </div>

        <FooterActions
          previousHref="/will/divide-estate/intro"
          nextLabel={isUpdating ? "Saving..." : "Save & Continue"}
          nextDisabled={!selectedChoice || isLoading || isUpdating}
          onNext={handleNext}
        />
      </section>
    </DivideEstateShell>
  );
}

export default Partner;
