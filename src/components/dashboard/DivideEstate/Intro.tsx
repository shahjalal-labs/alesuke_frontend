import {
  BodyCopy,
  DivideEstateShell,
  FooterActions,
  FlowLead,
  FlowTitle,
  IncludedExcludedList,
  SectionEyebrow,
} from "./DivideEstateShell";

function Intro() {
  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4 md:space-y-5">
          <FlowTitle>Distributing your estate</FlowTitle>
          <div className="space-y-2">
            <FlowLead>Residuary Estate: What’s Covered and What’s Not</FlowLead>
            <p className="text-[1rem] font-medium leading-[1.45] text-[#191715] md:text-[1.08rem]">
              The residuary estate represents the total balance of your assets once all specific legacies, taxes, and liabilities have been addressed.
            </p>
            <BodyCopy>This is everything you own after gifts, debts, and taxes have been given out</BodyCopy>
          </div>
        </div>

        <IncludedExcludedList
          included={[
            "Cash & Personal Bank accounts held in your name",
            "Real Estate: Owned Solely or tenancy in common",
            "Investments: Portfolio of stocks, equities etc.",
            "Personals: Miscellaneous belonging and physical items",
          ]}
          excluded={[
            "Nominated Insurance policies where beneficiaries are named",
            "CPF accounts",
            "Shared Properties: Real estate under joint tenancy",
            "Shared Finances: Any bank accounts held jointly with another person",
          ]}
        />

        <FooterActions previousHref="/will" previousLabel="Back to dashboard" nextHref="/will/divide-estate/partner" nextLabel="Get started" />
      </section>
    </DivideEstateShell>
  );
}

export default Intro;