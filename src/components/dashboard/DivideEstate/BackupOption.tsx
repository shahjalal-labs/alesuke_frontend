"use client";

import {
  BodyCopy,
  DivideEstateShell,
  DualChoicePanel,
  FooterActions,
  FlowLead,
  FlowTitle,
  HelpCard,
  Panel,
  SectionEyebrow,
  TipCallout,
} from "./DivideEstateShell";

import { useRouter } from "next/navigation";
import { useState } from "react";

function BackupOption() {
  const router = useRouter();
  const [selectedChoice, setSelectedChoice] = useState<"no" | "yes" | null>(null);

  const nextHref = selectedChoice === "yes" ? "/will/divide-estate/backup-beneficiaries" : "/will/divide-estate/complete";
  const nextLabel = selectedChoice === "no" ? "Skip and Continue" : "Save & Continue";

  const handleChoice = (choice: "no" | "yes") => {
    setSelectedChoice(choice);
  };

  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Understanding Backup Beneficiaries</FlowTitle>
          <FlowLead>Is a backup beneficiary essentially a safety net for your inheritance?</FlowLead>
          <BodyCopy>
            If the person you originally chose (your primary beneficiary) passes away before you do, these backup recipients are next in line to receive those assets.
          </BodyCopy>

          <TipCallout>
            <BodyCopy className="text-[#748192]">Who gets a person’s share if they pass away before you do?</BodyCopy>
            <BodyCopy className="text-[#748192]">you can decide that their portion goes to:</BodyCopy>
            <ul className="list-disc space-y-1 pl-5 text-[#748192]">
              <li>your children</li>
              <li>someone else you choose</li>
              <li>split equally between multiple people you choose</li>
            </ul>
          </TipCallout>
        </div>

        <Panel>
          <HelpCard>
            Children under 21 can be assigned a percentage of your estate, however appointed guardians will safeguard your intentions as a custodian until they reach 21 years of age.
          </HelpCard>
        </Panel>

        <div className="space-y-4">
          <FlowLead>Would you like to choose backup beneficiaries?</FlowLead>
          <DualChoicePanel
            leftLabel="No"
            rightLabel="Yes"
            leftOnClick={() => handleChoice("no")}
            rightOnClick={() => handleChoice("yes")}
            activeChoice={selectedChoice === "no" ? "left" : selectedChoice === "yes" ? "right" : null}
          />
        </div>

        <FooterActions
          previousHref="/will/divide-estate/distribute-estate"
          nextLabel={nextLabel}
          nextDisabled={!selectedChoice}
          onNext={() => router.push(nextHref)}
        />
      </section>
    </DivideEstateShell>
  );
}

export default BackupOption;
