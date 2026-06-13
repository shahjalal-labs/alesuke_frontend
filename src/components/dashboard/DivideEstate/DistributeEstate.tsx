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

// Initialize allocations with equal integer distribution
function initializeEqualDistributions(distributions: DistributionRecord[]): EditableDistributionRecord[] {
  if (!distributions.length) return [];
  
  const percentages = distributeIntegerPercentages(distributions.length);
  
  return distributions.map((dist, index) => ({
    ...dist,
    percentage: percentages[index]
  }));
}

function normalizeLoadedAllocations(distributions: DistributionRecord[]): EditableDistributionRecord[] {
  if (!distributions.length) return [];
  
  // Check if any percentages are already set
  const hasPercentages = distributions.some(d => typeof d.percentage === 'number' && d.percentage !== null);
  
  if (!hasPercentages) {
    return initializeEqualDistributions(distributions);
  }
  
  // Load existing percentages and ensure they're integers
  let loaded = distributions.map(d => ({
    ...d,
    percentage: Math.round(d.percentage ?? 0)
  }));
  
  // Ensure total is 100%
  const total = loaded.reduce((sum, d) => sum + d.percentage, 0);
  if (total !== TOTAL_PERCENT && loaded.length > 0) {
    // Adjust the first distribution to make total 100%
    const adjustment = TOTAL_PERCENT - total;
    loaded = loaded.map((dist, idx) => {
      if (idx === 0) {
        return { ...dist, percentage: Math.max(0, dist.percentage + adjustment) };
      }
      return dist;
    });
  }
  
  return loaded;
}

// Function to rebalance all percentages to integers that sum to 100
function rebalanceToIntegers(distributions: EditableDistributionRecord[]): EditableDistributionRecord[] {
  if (!distributions.length) return distributions;
  
  const total = distributions.reduce((sum, d) => sum + d.percentage, 0);
  const count = distributions.length;
  
  if (total === TOTAL_PERCENT) {
    // Already sums to 100, just ensure integers
    return distributions.map(d => ({
      ...d,
      percentage: Math.round(d.percentage)
    }));
  }
  
  // Redistribute evenly as integers
  const equalShare = Math.floor(TOTAL_PERCENT / count);
  const remainder = TOTAL_PERCENT - (equalShare * count);
  
  return distributions.map((dist, index) => ({
    ...dist,
    percentage: equalShare + (index < remainder ? 1 : 0)
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
    
    // Get the current value from temp or from state
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
    
    // Update and rebalance
    setEditableDistributions(current => {
      // First update the changed value
      let updated = current.map(dist =>
        dist.id === distributionId
          ? { ...dist, percentage: value }
          : dist
      );
      
      // Calculate new total
      let total = updated.reduce((sum, d) => sum + d.percentage, 0);
      
      // If total is not 100, adjust other beneficiaries
      if (total !== TOTAL_PERCENT && updated.length > 0) {
        const difference = TOTAL_PERCENT - total;
        const otherIndices = updated
          .map((_, idx) => idx)
          .filter(idx => updated[idx].id !== distributionId);
        
        if (otherIndices.length > 0) {
          // Distribute the difference among other beneficiaries
          let remainingDiff = difference;
          
          for (const idx of otherIndices) {
            if (remainingDiff === 0) break;
            
            const currentOtherValue = updated[idx].percentage;
            let newOtherValue = currentOtherValue + remainingDiff;
            
            // If adjusting a single beneficiary would make it negative or >100, distribute differently
            if (newOtherValue < 0) {
              newOtherValue = 0;
              remainingDiff = currentOtherValue + remainingDiff;
            } else if (newOtherValue > TOTAL_PERCENT) {
              newOtherValue = TOTAL_PERCENT;
              remainingDiff = currentOtherValue + remainingDiff - TOTAL_PERCENT;
            } else {
              remainingDiff = 0;
            }
            
            updated[idx] = {
              ...updated[idx],
              percentage: Math.round(newOtherValue)
            };
          }
          
          // Recalculate total after adjustments
          total = updated.reduce((sum, d) => sum + d.percentage, 0);
          
          // If still not 100, force the last one to adjust
          if (total !== TOTAL_PERCENT && otherIndices.length > 0) {
            const lastIndex = otherIndices[otherIndices.length - 1];
            const finalAdjustment = TOTAL_PERCENT - total;
            updated[lastIndex] = {
              ...updated[lastIndex],
              percentage: Math.max(0, Math.min(TOTAL_PERCENT, updated[lastIndex].percentage + finalAdjustment))
            };
          }
        } else if (updated.length === 1) {
          // Only one beneficiary, force to 100%
          updated[0] = { ...updated[0], percentage: TOTAL_PERCENT };
        }
      }
      
      // Ensure all percentages are integers
      updated = updated.map(dist => ({
        ...dist,
        percentage: Math.round(dist.percentage)
      }));
      
      return updated;
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
      
      // Update the value
      let updated = current.map(dist =>
        dist.id === distributionId
          ? { ...dist, percentage: newValue }
          : dist
      );
      
      // Ensure total is 100% by adjusting others
      let total = updated.reduce((sum, d) => sum + d.percentage, 0);
      const difference = TOTAL_PERCENT - total;
      
      if (difference !== 0) {
        const otherIndices = updated
          .map((_, idx) => idx)
          .filter(idx => updated[idx].id !== distributionId);
        
        if (otherIndices.length > 0) {
          // Distribute difference across others
          let remainingDiff = difference;
          
          for (const idx of otherIndices) {
            if (remainingDiff === 0) break;
            
            const currentOtherValue = updated[idx].percentage;
            let newOtherValue = currentOtherValue + remainingDiff;
            
            if (newOtherValue < 0) {
              newOtherValue = 0;
              remainingDiff = currentOtherValue + remainingDiff;
            } else if (newOtherValue > TOTAL_PERCENT) {
              newOtherValue = TOTAL_PERCENT;
              remainingDiff = currentOtherValue + remainingDiff - TOTAL_PERCENT;
            } else {
              remainingDiff = 0;
            }
            
            updated[idx] = {
              ...updated[idx],
              percentage: Math.round(newOtherValue)
            };
          }
          
          // Recalculate total
          total = updated.reduce((sum, d) => sum + d.percentage, 0);
          
          // Final adjustment if needed
          if (total !== TOTAL_PERCENT && otherIndices.length > 0) {
            const lastIndex = otherIndices[otherIndices.length - 1];
            const finalAdjustment = TOTAL_PERCENT - total;
            updated[lastIndex] = {
              ...updated[lastIndex],
              percentage: Math.max(0, Math.min(TOTAL_PERCENT, updated[lastIndex].percentage + finalAdjustment))
            };
          }
        }
      }
      
      // Ensure all percentages are integers
      updated = updated.map(dist => ({
        ...dist,
        percentage: Math.round(dist.percentage)
      }));
      
      return updated;
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