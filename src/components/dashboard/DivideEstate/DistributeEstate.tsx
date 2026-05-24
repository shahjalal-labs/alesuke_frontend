"use client";

import { useMemo } from "react";
import { Heart, Loader2 } from "lucide-react";
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

import { useGetDistributionsQuery } from "@/redux/api/executorApi";

type MemberRecord = {
  id: string;
  fullName?: string | null;
};

type DistributionRecord = {
  id: string;
  percentage?: number | null;
  order?: number | null;
  peopleId?: string | null;
  person?: MemberRecord | null;
};

function DistributeEstate() {
  const router = useRouter();
  const { data, isLoading } = useGetDistributionsQuery(undefined);

  const distributions = useMemo(() => {
    return ((data as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];
  }, [data]);

  const totalAllocated = useMemo(() => {
    return distributions.reduce((sum, distribution) => sum + (distribution.percentage ?? 0), 0);
  }, [distributions]);

  const handleContinue = () => {
    if (!distributions.length) {
      return;
    }

    router.push("/will/divide-estate/choose-backup-option");
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
          <p className="text-[0.95rem] font-semibold leading-[1.3] text-[#191715] md:text-[1rem]">
            You have allocated {totalAllocated}% of your estate
          </p>
          <p className="text-[0.82rem] leading-[1.45] text-[#7b8594] md:text-[0.9rem]">You can proceed to the next step, or review the % distribution below.</p>
        </SuccessSummary>

        <Panel>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-[#6e7886]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : distributions.length ? (
            <div className="space-y-3 md:space-y-4">
              {distributions.map((distribution, index) => {
                const percent = `${distribution.percentage ?? 0}%`;

                return (
                  <PercentageRow
                    key={distribution.id}
                    title={distribution.person?.fullName ?? `Beneficiary ${index + 1}`}
                    percent={percent}
                    selected={false}
                    icon={<Heart className="h-4.5 w-4.5 fill-current" />}
                  />
                );
              })}

            </div>
          ) : (
            <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">
              No distributions have been saved yet.
            </div>
          )}
        </Panel>

        <FooterActions previousHref="/will/divide-estate/choose-beneficaries" nextLabel="Save & Continue" onNext={handleContinue} nextDisabled={!distributions.length} />
      </section>
    </DivideEstateShell>
  );
}

export default DistributeEstate;
