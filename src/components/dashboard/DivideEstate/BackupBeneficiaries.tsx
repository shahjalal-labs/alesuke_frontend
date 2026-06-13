"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import AddPersonModal from "@/components/ui/AddPersonModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AddPersonRow,
  BodyCopy,
  PersonRow,
  DivideEstateShell,
  FooterActions,
  FlowLead,
  FlowTitle,
  Panel,
  SectionEyebrow,
} from "./DivideEstateShell";

import { useGetAllMemberListQuery } from "@/redux/api/profileApi";
import { 
  useAddBackupDistributionMutation, 
  useRemoveBackupDistributionMutation,
  useGetDistributionsQuery 
} from "@/redux/api/executorApi";

type MemberRecord = {
  id: string;
  fullName?: string | null;
  relationType?: string | null;
};

type DistributionRecord = {
  id?: string;
  peopleId?: string | null;
  percentage?: number | null;
  order?: number | null;
  backupDistributors?: Array<{ 
    id?: string;
    peopleId?: string | null; 
    person?: { id?: string; fullName?: string | null };
  }>;
  person?: { id?: string; fullName?: string | null };
};

function formatSharePercent(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return '0%';
  }
  return `${value}%`;
}

function BackupBeneficiaries() {
  const router = useRouter();
  const { data: members = [], isLoading: isLoadingMembers } = useGetAllMemberListQuery(undefined);
  const { data: distributionResponse, isLoading: isLoadingDistributions, refetch } = useGetDistributionsQuery(undefined);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  const [selectedDistributorId, setSelectedDistributorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addBackupDistribution] = useAddBackupDistributionMutation();
  const [removeBackupDistribution] = useRemoveBackupDistributionMutation();

  // Filter out PET members
  const nonPetMembers = useMemo(() => {
    return (members as MemberRecord[]).filter((member) => member.relationType !== "PET");
  }, [members]);

  const distributorRows = useMemo(() => {
    const distributions = ((distributionResponse as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];
    
    return distributions.map((distribution, index) => ({
      id: distribution.id ?? `distribution-${index}`,
      name: distribution.person?.fullName ?? `Distributor ${index + 1}`,
      peopleId: distribution.peopleId ?? distribution.person?.id ?? '',
      percentage: distribution.percentage,
      backupDistributors: distribution.backupDistributors || []
    }));
  }, [distributionResponse]);

  // Get current selected distributor
  const currentDistributor = useMemo(() => {
    if (!selectedDistributorId) return null;
    return distributorRows.find(d => d.id === selectedDistributorId);
  }, [distributorRows, selectedDistributorId]);

  // Get current backup for selected distributor (single backup)
  const currentBackup = useMemo(() => {
    if (!currentDistributor || !currentDistributor.backupDistributors || currentDistributor.backupDistributors.length === 0) {
      return null;
    }
    
    const backup = currentDistributor.backupDistributors[0];
    const backupId = backup.peopleId || backup.person?.id;
    const backupMember = nonPetMembers.find(m => m.id === backupId);
    
    return {
      id: backup.id,
      peopleId: backupId,
      name: backupMember?.fullName || backup.person?.fullName || 'Unknown',
      member: backupMember
    };
  }, [currentDistributor, nonPetMembers]);

  // Set initial selected distributor
  useEffect(() => {
    if (distributorRows.length > 0 && !selectedDistributorId) {
      setSelectedDistributorId(distributorRows[0].id);
    }
  }, [distributorRows, selectedDistributorId]);

  // Reset selected backup when distributor changes
  useEffect(() => {
    // Update selectedBackupId based on current distributor's backup
    if (currentBackup?.peopleId) {
      setSelectedBackupId(currentBackup.peopleId);
    } else {
      setSelectedBackupId(null);
    }
  }, [currentDistributor, currentBackup]);

  // Get available backup candidates (exclude current distributor and already selected backup)
  const backupCandidates = useMemo(() => {
    if (!currentDistributor) return [];
    
    return nonPetMembers.filter((member) => {
      // Don't show the distributor themselves as backup
      if (member.id === currentDistributor.peopleId) return false;
      // Don't show already selected backup
      if (currentBackup?.peopleId === member.id) return false;
      return true;
    });
  }, [nonPetMembers, currentDistributor, currentBackup]);

  const handleSelectBackup = async (memberId: string) => {
    if (!currentDistributor?.id) {
      toast.error("Please select a distributor first");
      return;
    }

    // If clicking the already selected backup, do nothing
    if (selectedBackupId === memberId) return;

    setIsSubmitting(true);
    
    try {
      // If there's an existing backup, remove it first
      if (currentBackup?.id) {
        await removeBackupDistribution(currentBackup.id).unwrap();
      }
      
      // Add new backup
      await addBackupDistribution({
        id: currentDistributor.id,
        data: { peopleId: memberId },
      }).unwrap();
      
      setSelectedBackupId(memberId);
      await refetch();
      toast.success(`Backup beneficiary added successfully`);
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to add backup beneficiary";
      toast.error(errorMessage);
      console.error("Add backup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveBackup = async () => {
    if (!currentBackup?.id) {
      toast.error("No backup to remove");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await removeBackupDistribution(currentBackup.id).unwrap();
      setSelectedBackupId(null);
      await refetch();
      toast.success("Backup beneficiary removed successfully");
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to remove backup beneficiary";
      toast.error(errorMessage);
      console.error("Remove backup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedDistributorId) {
      toast.error("Please select a distributor");
      return;
    }

    router.push("/will/divide-estate/complete");
  };

  const isLoading = isLoadingMembers || isLoadingDistributions;

  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Backup beneficiaries for {currentDistributor?.name || 'Distributor'}</FlowTitle>
          <FlowLead>
            If {currentDistributor?.name || 'the distributor'}'s share of their estate cannot be given, then who should inherit their share?
          </FlowLead>
          <BodyCopy>
            When planning your estate, it is important to decide who should receive assets if the primary recipient is unable to take them. This situation might occur if the beneficiary:
          </BodyCopy>
          <ul className="space-y-1 pl-5 text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]">
            <li>Passes away before you.</li>
            <li>Decides they do not want the inheritance.</li>
            <li>Cannot be located by the executors.</li>
          </ul>

          <div className="space-y-3 pt-1">
            <h2 className="text-[1rem] font-semibold text-[#191715] md:text-[1.08rem]">How to Assign Backup Heirs</h2>
            <BodyCopy>
              You need to designate a secondary beneficiary. The backup will inherit the entire share if the primary beneficiary cannot.
            </BodyCopy>
            <ol className="space-y-2 pl-5 text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]">
              <li>Single Successor: Name one specific individual to take over the entire share.</li>
              <li>You can change or remove the backup at any time.</li>
            </ol>
          </div>
        </div>

        <Panel className="space-y-3">
          <h2 className="text-[1rem] font-semibold text-[#191715] md:text-[1.08rem]">Current distributors</h2>
          {distributorRows.length ? (
            <div className="space-y-3">
              {distributorRows.map((distribution) => {
                const isSelectedDistributor = selectedDistributorId === distribution.id;

                return (
                  <button
                    key={distribution.id}
                    type="button"
                    onClick={() => setSelectedDistributorId(distribution.id)}
                    className={`w-full rounded-[10px] bg-white px-4 py-4 text-left text-[0.92rem] text-[#52606f] shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow ${
                      isSelectedDistributor ? 'ring-2 ring-[#152035] shadow-[0_8px_24px_rgba(17,24,39,0.08)]' : ''
                    }`}
                  >
                    <div className="font-medium text-[#1d2430]">{distribution.name}</div>
                    {distribution.percentage != null ? (
                      <div className="mt-1 text-[0.84rem] text-[#7b8594]">Share: {formatSharePercent(distribution.percentage)}</div>
                    ) : null}
                    {distribution.backupDistributors && distribution.backupDistributors.length > 0 ? (
                      <div className="mt-1 text-[0.84rem] text-green-600">
                        Backup: {distribution.backupDistributors[0]?.person?.fullName || 'Assigned'}
                      </div>
                    ) : null}
                    {isSelectedDistributor ? (
                      <div className="mt-2 inline-flex rounded-full bg-[#152035] px-3 py-1 text-[0.75rem] font-medium text-white">
                        Selected distributor
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">
              No distributors have been saved yet.
            </div>
          )}
        </Panel>

        <Panel>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-[#6e7886]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 md:space-y-5">
              <div className="space-y-2">
                <h3 className="text-[1rem] font-semibold text-[#191715] md:text-[1.08rem]">
                  Choose backup member for {currentDistributor?.name || 'selected distributor'}
                </h3>
                <BodyCopy>
                  Select ONE person to be the backup beneficiary. They will inherit the entire share if the primary cannot.
                </BodyCopy>
              </div>

              {/* Show current backup if exists */}
              {currentBackup && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Current Backup</p>
                      <p className="text-base font-semibold text-green-900">{currentBackup.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveBackup}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Backup candidates list */}
              {backupCandidates.length ? (
                <div className="space-y-3">
                  {backupCandidates.map((member, index) => {
                    const isSelected = selectedBackupId === member.id;
                    
                    return (
                      <PersonRow
                        key={member.id}
                        title={member.fullName ?? `Person ${index + 1}`}
                        subtitle={member.relationType ? `(${member.relationType})` : undefined}
                        selected={isSelected}
                        action={isSelected ? "remove" : undefined}
                        onClick={() => handleSelectBackup(member.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">
                  No other members available for backup.
                </div>
              )}

              <AddPersonRow onClick={() => setIsAddPersonOpen(true)} />
            </div>
          )}
        </Panel>

        <FooterActions
          previousHref="/will/divide-estate/choose-backup-option"
          nextLabel="Save & Continue"
          onNext={handleContinue}
        />
      </section>

      <AddPersonModal 
        open={isAddPersonOpen} 
        onClose={() => setIsAddPersonOpen(false)} 
        title="Add a new person" 
        actionLabel="Create a person" 
        onSuccess={() => {
          setIsAddPersonOpen(false);
          refetch();
        }} 
        showRelationshipDropdown={true} 
      />
    </DivideEstateShell>
  );
}

export default BackupBeneficiaries;