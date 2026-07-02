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

import {
  useAddManualDistributionMutation,
  useGetDistributionsQuery,
} from "@/redux/api/executorApi";

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

const TOTAL_PERCENT = 100;

// Function to distribute integer percentages that sum to 100
function distributeIntegerPercentages(count: number): number[] {
  if (count === 0) return [];
  
  const equalShare = Math.floor(TOTAL_PERCENT / count);
  const remainder = TOTAL_PERCENT - (equalShare * count);
  
  // Create array with equal shares
  const percentages = new Array(count).fill(equalShare);
  
  // Distribute remainder (1% each to first 'remainder' beneficiaries)
  for (let i = 0; i < remainder; i++) {
    percentages[i] += 1;
  }
  
  return percentages;
}

function normalizeLoadedAllocations(distributions: DistributionRecord[]): EditableDistributionRecord[] {
  if (!distributions.length) return [];

  return distributions.map(d => ({
    ...d,
    percentage: Math.round(d.percentage ?? 0)
  }));
}

function DistributeEstate() {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetDistributionsQuery(undefined);
  const [addManualDistribution, { isLoading: isSubmitting }] = useAddManualDistributionMutation();

  const distributions = useMemo(() => {
    return ((data as { data?: DistributionRecord[] } | undefined)?.data ??
      []) as DistributionRecord[];
  }, [data]);

  const [editableDistributions, setEditableDistributions] = useState<
    EditableDistributionRecord[]
  >([]);
  
  // Track which input is being edited to prevent rebalancing during typing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!distributions.length) {
      setEditableDistributions([]);
      return;
    }

    const normalized = normalizeLoadedAllocations(distributions);
    setEditableDistributions(normalized);
  }, [distributions]);

  const totalAllocated = useMemo(() => {
    return editableDistributions.reduce(
      (sum, distribution) => sum + distribution.percentage,
      0,
    );
  }, [editableDistributions]);

  const handlePercentageChange = (
    distributionId: string,
    inputValue: string
  ) => {
    // Store temp value for the input being edited
    setTempValues(prev => ({ ...prev, [distributionId]: inputValue }));
    
    // Allow any input while typing (including empty, partial numbers)
    if (inputValue === '' || inputValue === '-') {
      return;
    }
    
    let parsedValue = Number(inputValue);
    
    // Check if valid number
    if (isNaN(parsedValue)) {
      return;
    }
    
    // Allow any number between 0 and 100 while typing
    if (parsedValue < 0 || parsedValue > TOTAL_PERCENT) {
      return;
    }
    
    // Round to integer for display
    parsedValue = Math.round(parsedValue);
    
    // Update the distribution without rebalancing
    setEditableDistributions(current =>
      current.map(dist => 
        dist.id === distributionId 
          ? { ...dist, percentage: parsedValue }
          : dist
      )
    );
  };

  const handlePercentageBlur = (distributionId: string) => {
    setEditingId(null);

    let value: number;

    if (tempValues[distributionId] !== undefined) {
      value = Number(tempValues[distributionId]);
      if (isNaN(value)) value = 0;
      setTempValues(prev => {
        const newValues = { ...prev };
        delete newValues[distributionId];
        return newValues;
      });
    } else {
      const dist = editableDistributions.find(d => d.id === distributionId);
      value = dist?.percentage ?? 0;
    }
    
    // Round to integer and clamp to valid range
    value = Math.max(0, Math.min(TOTAL_PERCENT, Math.round(value)));

    setEditableDistributions(current => {
      return current.map(dist =>
        dist.id === distributionId
          ? { ...dist, percentage: value }
          : dist
      );
    });
  };

  const handleStepChange = (distributionId: string, direction: 1 | -1) => {
    setEditableDistributions(current => {
      const target = current.find(d => d.id === distributionId);
      if (!target) return current;

      let newValue = target.percentage + direction;

      // Clamp to valid range
      newValue = Math.max(0, Math.min(TOTAL_PERCENT, newValue));

      if (newValue === target.percentage) return current;

      return current.map(dist =>
        dist.id === distributionId
          ? { ...dist, percentage: newValue }
          : dist
      );
    });
  };

  const handleEqualDistribution = () => {
    if (!editableDistributions.length) return;
    
    const percentages = distributeIntegerPercentages(editableDistributions.length);
    
    setEditableDistributions(current =>
      current.map((dist, index) => ({
        ...dist,
        percentage: percentages[index]
      }))
    );
    
    toast.success(`Distribution evenly divided into ${percentages.join('%, ')}%`);
  };

  const handleContinue = async () => {
    if (!editableDistributions.length) {
      toast.error("No distributions to save.");
      return;
    }

    if (totalAllocated !== TOTAL_PERCENT) {
      toast.error(`Please make sure all allocations add up to ${TOTAL_PERCENT}%. Currently at ${totalAllocated}%.`);
      return;
    }

    // Prepare the distribution data for the API
    const distributionData = {
      distributions: editableDistributions.map((distribution) => ({
        peopleId: distribution.peopleId,
        percentage: distribution.percentage,
      })),
    };

    try {
      await addManualDistribution(distributionData).unwrap();
      toast.success("Distribution saved successfully!");
      
      // Refetch to get updated data
      await refetch();
      
      // Navigate to next step
      router.push("/will/divide-estate/choose-backup-option");
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to save distribution. Please try again.";
      toast.error(errorMessage);
      console.error("Save distribution failed:", error);
    }
  };

  // Get status color for total allocation
  const getTotalStatusColor = () => {
    if (totalAllocated === TOTAL_PERCENT) return "text-green-600";
    if (totalAllocated > TOTAL_PERCENT) return "text-red-600";
    return "text-amber-600";
  };

  // Get display value for input
  const getDisplayValue = (distribution: EditableDistributionRecord) => {
    if (editingId === distribution.id && tempValues[distribution.id] !== undefined) {
      return tempValues[distribution.id];
    }
    return distribution.percentage;
  };

  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Divide your estate</FlowTitle>
          <FlowLead>
            Your estate is divided using a simple % for each beneficiary
          </FlowLead>
          <BodyCopy>Please adjust the % number below.</BodyCopy>
          
          <button
            type="button"
            onClick={handleEqualDistribution}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Distribute Evenly
          </button>
        </div>

        <SuccessSummary>
          <p className={`text-[0.95rem] font-semibold leading-[1.3] md:text-[1rem] ${getTotalStatusColor()}`}>
            You have allocated {totalAllocated}% of your estate
            {totalAllocated === TOTAL_PERCENT && " ✓"}
            {totalAllocated > TOTAL_PERCENT && " (Exceeds 100% - Please adjust)"}
            {totalAllocated < TOTAL_PERCENT && ` (Need ${TOTAL_PERCENT - totalAllocated}% more)`}
          </p>
          <p className="text-[0.82rem] leading-[1.45] text-[#7b8594] md:text-[0.9rem]">
            {totalAllocated === TOTAL_PERCENT 
              ? "You can proceed to the next step, or review the % distribution below."
              : "Please adjust percentages to total 100% before continuing."}
          </p>
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
                        {distribution.person?.fullName ??
                          `Beneficiary ${index + 1}`}
                      </span>
                    </span>

                    <div className="flex items-center justify-between gap-3 md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleStepChange(distribution.id, -1)}
                        disabled={isSubmitting}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5dde6] bg-[#f8fafc] text-[#394355] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Decrease ${distribution.person?.fullName ?? `beneficiary ${index + 1}`} by 1 percent`}
                      >
                        <span className="text-lg leading-none">−</span>
                      </button>

                      <input
                        type="number"
                        inputMode="numeric"
                        step="1"
                        min={0}
                        max={TOTAL_PERCENT}
                        value={getDisplayValue(distribution)}
                        onChange={(event) =>
                          handlePercentageChange(
                            distribution.id,
                            event.target.value,
                          )
                        }
                        onFocus={() => {
                          setEditingId(distribution.id);
                          setTempValues(prev => ({
                            ...prev,
                            [distribution.id]: String(distribution.percentage)
                          }));
                        }}
                        onBlur={() => handlePercentageBlur(distribution.id)}
                        disabled={isSubmitting}
                        className="h-11 w-20 rounded-[8px] border border-[#d5dde6] bg-white px-3 text-center text-[1rem] font-medium text-[#657081] outline-none focus:border-[#25b6e8] focus:ring-1 focus:ring-[#25b6e8] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Set ${distribution.person?.fullName ?? `beneficiary ${index + 1}`} allocation percentage`}
                      />

                      <button
                        type="button"
                        onClick={() => handleStepChange(distribution.id, 1)}
                        disabled={isSubmitting}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5dde6] bg-[#f8fafc] text-[#394355] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Increase ${distribution.person?.fullName ?? `beneficiary ${index + 1}`} by 1 percent`}
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

        <FooterActions
          previousHref="/will/divide-estate/choose-beneficaries"
          nextLabel={isSubmitting ? "Saving..." : "Save & Continue"}
          onNext={handleContinue}
          nextDisabled={!editableDistributions.length || isSubmitting || totalAllocated !== TOTAL_PERCENT}
        />
      </section>
    </DivideEstateShell>
  );
}

export default DistributeEstate;