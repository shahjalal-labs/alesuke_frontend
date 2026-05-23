import {
  BodyCopy,
  CheckBulletList,
  ExecutorLayout,
  FooterActions,
  IntroHeading,
  PageTitle,
  SectionLabel,
  StepHeader,
} from "@/components/dashboard/executor/executor-flow";

export default function GetStarted() {
  return (
    <ExecutorLayout>
      <div className="space-y-10">
        <StepHeader step={1} label="Choosing your executor" />

        <section className="space-y-5">
          <PageTitle title="Choose Your Executor" />

          <div className="space-y-3">
            <SectionLabel>What is an executor?</SectionLabel>
            <BodyCopy>
              Think of an executor as the "manager" whom legally carries out your final to-do list. Their job is to settle
              your affairs and make sure your estate is distributed how you intended.
            </BodyCopy>
          </div>

          <div className="space-y-4 pt-3">
            <SectionLabel>What They Actually Do:</SectionLabel>
            <CheckBulletList
              items={[
                "Round up everything: They list out what you own and consolidate your bank accounts.",
                "Handle the paperwork: They deal with the court and legal steps needed to prove the will is valid.",
                "Pay the bills: They use your money to pay off any debts or taxes you still owe.",
              ]}
            />
          </div>

          <div className="space-y-3 pt-4">
            <SectionLabel>Pass it on:</SectionLabel>
            <BodyCopy>
              Once the bills are paid, they hand out the remaining money and items to the people you named.
            </BodyCopy>
          </div>
        </section>

        <FooterActions previousHref="/will" previousLabel="Back to dashboard" primaryLabel="Get started" primaryHref="/will/executor/choose-executor" />
      </div>
    </ExecutorLayout>
  );
}