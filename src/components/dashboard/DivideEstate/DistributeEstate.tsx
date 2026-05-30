"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  BodyCopy,
  DivideEstateShell,
  FooterActions,
  FlowLead,
  FlowTitle,
  Panel,
  SectionEyebrow,
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

type EditableDistributionRecord = DistributionRecord & {
  percentage: number;
};

const PERCENT_STEP = 5;
const TOTAL_PERCENT = 100;

function normalizeToStep(value: number) {
  return Math.max(0, Math.min(TOTAL_PERCENT, Math.round(value / PERCENT_STEP) * PERCENT_STEP));
}

function buildStepAllocation(distributions: DistributionRecord[]) {
  if (!distributions.length) return [] as EditableDistributionRecord[];

  const baseShare = Math.floor((TOTAL_PERCENT / distributions.length) / PERCENT_STEP) * PERCENT_STEP;
  const remaining = TOTAL_PERCENT - baseShare * distributions.length;
  const bonusCount = remaining / PERCENT_STEP;

  return distributions.map((distribution, index) => ({
    ...distribution,
    percentage: baseShare + (index < bonusCount ? PERCENT_STEP : 0),
  }));
}

function rebalanceAllocation(
  current: EditableDistributionRecord[],
  targetId: string,
  nextValue: number
) {
  if (!current.length) return current;

  const targetIndex = current.findIndex((distribution) => distribution.id === targetId);
  if (targetIndex < 0) return current;

  const normalizedTarget = normalizeToStep(nextValue);
  const target = current[targetIndex];
  const otherDistributions = current.filter((distribution) => distribution.id !== targetId);
  const otherTotal = otherDistributions.reduce((sum, distribution) => sum + distribution.percentage, 0);
  const targetShare = Math.min(normalizedTarget, TOTAL_PERCENT);
  const delta = targetShare - target.percentage;

  if (delta === 0) {
    return current.map((distribution) =>
      distribution.id === targetId ? { ...distribution, percentage: targetShare } : distribution
    );
  }

  if (delta > 0) {
    const cappedTargetShare = Math.min(target.percentage + delta, target.percentage + otherTotal);
    let remainingReduction = cappedTargetShare - target.percentage;

    const updatedOthers = otherDistributions
      .slice()
      .reverse()
      .map((distribution) => {
        if (remainingReduction <= 0) return distribution;

        const reduction = Math.min(distribution.percentage, remainingReduction);
        remainingReduction -= reduction;
        return { ...distribution, percentage: distribution.percentage - reduction };
      })
      .reverse();

    return current.map((distribution) => {
      if (distribution.id === targetId) {
        return { ...distribution, percentage: cappedTargetShare };
      }

      return updatedOthers.find((item) => item.id === distribution.id) ?? distribution;
    });
  }

  const increaseAmount = Math.abs(delta);
  let remainingIncrease = increaseAmount;

  const updatedOthers = otherDistributions.map((distribution) => {
    if (remainingIncrease <= 0) return distribution;

    const headroom = TOTAL_PERCENT - distribution.percentage;
    const increase = Math.min(headroom, remainingIncrease);
    remainingIncrease -= increase;
    return { ...distribution, percentage: distribution.percentage + increase };
  });

  const finalTargetShare = target.percentage - (increaseAmount - remainingIncrease);

  return current.map((distribution) => {
    if (distribution.id === targetId) {
      return { ...distribution, percentage: finalTargetShare };
    }

    return updatedOthers.find((item) => item.id === distribution.id) ?? distribution;
  });
}

function normalizeLoadedAllocations(distributions: DistributionRecord[]) {
  if (!distributions.length) return [] as EditableDistributionRecord[];

  const normalized = distributions.map((distribution) => ({
    ...distribution,
    percentage: normalizeToStep(Number(distribution.percentage ?? 0)),
  }));

  const currentTotal = normalized.reduce((sum, distribution) => sum + distribution.percentage, 0);
  if (currentTotal === TOTAL_PERCENT) {
    return normalized;
  }

  const targetId = normalized[normalized.length - 1]?.id;
  if (!targetId) return normalized;

  return rebalanceAllocation(normalized, targetId, normalized[normalized.length - 1].percentage + (TOTAL_PERCENT - currentTotal));
}

function DistributeEstate() {
  const router = useRouter();
  const { data, isLoading } = useGetDistributionsQuery(undefined);

  const distributions = useMemo(() => {
    return ((data as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];
  }, [data]);

  const [editableDistributions, setEditableDistributions] = useState<EditableDistributionRecord[]>([]);

  useEffect(() => {
    if (!distributions.length) {
      setEditableDistributions([]);
      return;
    }

    const savedPercentages = distributions.some((distribution) => typeof distribution.percentage === "number");

    if (!savedPercentages) {
      setEditableDistributions(buildStepAllocation(distributions));
      return;
    }

    setEditableDistributions(normalizeLoadedAllocations(distributions));
  }, [distributions]);

  const totalAllocated = useMemo(() => {
    return editableDistributions.reduce((sum, distribution) => sum + distribution.percentage, 0);
  }, [editableDistributions]);

  const handlePercentageChange = (distributionId: string, nextValue: string) => {
    const parsedValue = Number(nextValue);

    setEditableDistributions((current) => rebalanceAllocation(current, distributionId, Number.isFinite(parsedValue) ? parsedValue : 0));
  };

  const handleStepChange = (distributionId: string, direction: 1 | -1) => {
    setEditableDistributions((current) => {
      const target = current.find((distribution) => distribution.id === distributionId);

      if (!target) return current;

      return rebalanceAllocation(current, distributionId, target.percentage + direction * PERCENT_STEP);
    });
  };

  const handleContinue = () => {
    if (!editableDistributions.length) {
      return;
    }

    if (totalAllocated !== TOTAL_PERCENT) {
      toast.error("Please make sure all allocations add up to 100%.");
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
          ) : editableDistributions.length ? (
            <div className="space-y-3 md:space-y-4">
              {editableDistributions.map((distribution, index) => {
                const percent = `${distribution.percentage}%`;

                return (
                  <div
                    key={distribution.id}
                    className="flex w-full flex-col gap-3 rounded-[10px] border border-[#d5dde6] bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5 md:py-5"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e8ebef] text-[#293246]">
                        <Heart className="h-4.5 w-4.5 fill-current" />
                      </span>
                      <span className="min-w-0 truncate text-[1rem] font-medium text-[#657081] md:text-[1.18rem]">
                        {distribution.person?.fullName ?? `Beneficiary ${index + 1}`}
                      </span>
                    </span>

                    <div className="flex items-center justify-between gap-3 md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleStepChange(distribution.id, -1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5dde6] bg-[#f8fafc] text-[#394355] transition-colors hover:bg-white"
                        aria-label={`Decrease ${distribution.person?.fullName ?? `beneficiary ${index + 1}`} by 5 percent`}
                      >
                        <span className="text-lg leading-none">−</span>
                      </button>

                      <input
                        type="number"
                        inputMode="numeric"
                        step={PERCENT_STEP}
                        min={0}
                        max={TOTAL_PERCENT}
                        value={distribution.percentage}
                        onChange={(event) => handlePercentageChange(distribution.id, event.target.value)}
                        className="h-11 w-20 rounded-[8px] border border-[#d5dde6] bg-white px-3 text-center text-[1rem] font-medium text-[#657081] outline-none focus:border-[#25b6e8]"
                        aria-label={`Set ${distribution.person?.fullName ?? `beneficiary ${index + 1}`} allocation percentage`}
                      />

                      <button
                        type="button"
                        onClick={() => handleStepChange(distribution.id, 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5dde6] bg-[#f8fafc] text-[#394355] transition-colors hover:bg-white"
                        aria-label={`Increase ${distribution.person?.fullName ?? `beneficiary ${index + 1}`} by 5 percent`}
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>

                      <span className="min-w-[58px] text-right text-[1rem] font-medium text-[#657081] md:text-[1.12rem]">
                        {percent}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>
          ) : (
            <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">
              No distributions have been saved yet.
            </div>
          )}
        </Panel>

        <FooterActions previousHref="/will/divide-estate/choose-beneficaries" nextLabel="Save & Continue" onNext={handleContinue} nextDisabled={!editableDistributions.length} />
      </section>
    </DivideEstateShell>
  );
}

export default DistributeEstate;
