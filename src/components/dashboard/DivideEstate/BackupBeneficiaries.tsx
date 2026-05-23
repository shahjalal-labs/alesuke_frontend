import {
  AddPersonRow,
  BodyCopy,
  BeneficiaryRow,
  DivideEstateShell,
  FooterActions,
  FlowLead,
  FlowTitle,
  Panel,
  SectionEyebrow,
} from "./DivideEstateShell";

function BackupBeneficiaries() {
  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Backup beneficiaries for Child 01</FlowTitle>
          <FlowLead>If Child 01's share of their estate cannot be given, then who should inherit their share?</FlowLead>
          <BodyCopy>
            When planning your estate, it is important to decide who should receive assets if the primary recipient (Child 01) is unable to take them. This situation might occur if the child:
          </BodyCopy>
          <ul className="space-y-1 pl-5 text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]">
            <li>Passes away before you.</li>
            <li>Decides they do not want the inheritance.</li>
            <li>Cannot be located by the executors.</li>
          </ul>

          <div className="space-y-3 pt-1">
            <h2 className="text-[1rem] font-semibold text-[#191715] md:text-[1.08rem]">How to Assign Backup Heirs</h2>
            <BodyCopy>
              If Child 01 cannot receive their portion, you need to designate a secondary beneficiary. You have two main options for distributing that specific share:
            </BodyCopy>
            <ol className="space-y-2 pl-5 text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]">
              <li>Single Successor: Name one specific individual to take over the entire share.</li>
              <li>Group Distribution: Name several people to split that share equally among themselves.</li>
            </ol>
          </div>
        </div>

        <Panel>
          <div className="space-y-4 md:space-y-5">
            <BeneficiaryRow title="Leslie Alexander" action="remove" />
            <BeneficiaryRow title="Child 01" action="remove" />
            <AddPersonRow />
          </div>
        </Panel>

        <FooterActions previousHref="/will/divide-estate/choose-backup-option" nextHref="/will/divide-estate/complete" />
      </section>
    </DivideEstateShell>
  );
}

export default BackupBeneficiaries;
