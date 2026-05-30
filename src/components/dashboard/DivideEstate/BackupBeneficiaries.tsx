"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { useAddBackupDistributionMutation, useGetDistributionsQuery } from "@/redux/api/executorApi";

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
  backupDistributors?: Array<{ peopleId?: string | null; person?: { id?: string } }>;
  person?: { id?: string; fullName?: string | null };
};

function formatSharePercent(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return '0%';
  }

  return `${Math.round(Number(value) / 5) * 5}%`;
}

function BackupBeneficiaries() {
  const router = useRouter();
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined);
  const { data: distributionResponse, isLoading: isLoadingDistributions } = useGetDistributionsQuery(undefined);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [selectedBackupIds, setSelectedBackupIds] = useState<string[]>([]);
  const [selectedDistributorId, setSelectedDistributorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addBackupDistribution] = useAddBackupDistributionMutation();

  const childMembers = useMemo(() => {
    return (members as MemberRecord[]).filter((member) => member.relationType === "CHILD");
  }, [members]);

  const primaryChildId = childMembers[0]?.id;
  const primaryChildName = childMembers[0]?.fullName ?? "Child 01";

  // derive saved backup ids from distributions: find distribution for primary child and read backupDistributors
  const savedBackupIds = useMemo(() => {
    const distributions = ((distributionResponse as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];
    if (!primaryChildId) return [] as string[];
    const dist = distributions.find((d) => d.peopleId === primaryChildId || d.person?.id === primaryChildId);
    if (!dist) return [] as string[];
    const list: string[] = [];
    (dist.backupDistributors ?? []).forEach((bd) => {
      if (bd.peopleId) list.push(bd.peopleId);
      else if (bd.person?.id) list.push(bd.person.id as string);
    });
    return list;
  }, [distributionResponse, primaryChildId]);

  const distributorRows = useMemo(() => {
    const distributions = ((distributionResponse as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];

    return distributions.map((distribution, index) => ({
      id: distribution.id ?? `distribution-${index}`,
      name: distribution.person?.fullName ?? `Distributor ${index + 1}`,
      peopleId: distribution.peopleId ?? distribution.person?.id ?? '',
      percentage: distribution.percentage,
    }));
  }, [distributionResponse]);

  const primaryDistribution = useMemo(() => {
    const distributions = ((distributionResponse as { data?: DistributionRecord[] } | undefined)?.data ?? []) as DistributionRecord[];

    return distributions.find((distribution) => distribution.peopleId === primaryChildId || distribution.person?.id === primaryChildId);
  }, [distributionResponse, primaryChildId]);

  useEffect(() => {
    const firstSelectedDistributor =
      distributorRows.find((distribution) => distribution.id === primaryDistribution?.id) ?? distributorRows[0] ?? null;

    if (!selectedDistributorId && firstSelectedDistributor?.id) {
      setSelectedDistributorId(firstSelectedDistributor.id);
    }
  }, [distributorRows, primaryDistribution?.id, selectedDistributorId]);

  // backup candidates: all members except the primary child
  const backupCandidates = useMemo(() => {
    return (members as MemberRecord[]).filter((m) => m.id !== primaryChildId);
  }, [members, primaryChildId]);

  const toggleBackup = (id: string) => {
    setSelectedBackupIds((current) => (current.includes(id) ? current.filter((i) => i !== id) : [...current, id]));
  };

  const getDistributorById = (distributionId: string | null) => {
    if (!distributionId) return null;

    return distributorRows.find((distribution) => distribution.id === distributionId) ?? null;
  };

  const handleSaveBackups = async () => {
    const chosenDistributor = getDistributorById(selectedDistributorId ?? primaryDistribution?.id ?? null);

    if (!selectedBackupIds.length && !chosenDistributor) {
      toast.error("Select at least one backup beneficiary before continuing.");
      return;
    }

    if (!chosenDistributor?.id) {
      toast.error("Unable to find the saved distributor record for this child.");
      return;
    }

    setIsSubmitting(true);
    try {
      const distributionId = chosenDistributor.id;

      await Promise.all(
        selectedBackupIds.map((peopleId) =>
          addBackupDistribution({
            id: distributionId,
            data: { peopleId },
          }).unwrap()
        )
      );

      toast.success("Backup beneficiaries saved.");
      router.push("/will/divide-estate/complete");
    } catch (err) {
      console.error(err);
      toast.error("Unable to save backup beneficiaries. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DivideEstateShell>
      <section className="space-y-6 md:space-y-8">
        <SectionEyebrow>Estate Distribution</SectionEyebrow>

        <div className="space-y-4">
          <FlowTitle>Backup beneficiaries for {primaryChildName}</FlowTitle>
          <FlowLead>
            If {primaryChildName}'s share of their estate cannot be given, then who should inherit their share?
          </FlowLead>
          <BodyCopy>
            When planning your estate, it is important to decide who should receive assets if the primary recipient ({primaryChildName}) is unable to take them. This situation might occur if the child:
          </BodyCopy>
          <ul className="space-y-1 pl-5 text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]">
            <li>Passes away before you.</li>
            <li>Decides they do not want the inheritance.</li>
            <li>Cannot be located by the executors.</li>
          </ul>

          <div className="space-y-3 pt-1">
            <h2 className="text-[1rem] font-semibold text-[#191715] md:text-[1.08rem]">How to Assign Backup Heirs</h2>
            <BodyCopy>
              If {primaryChildName} cannot receive their portion, you need to designate a secondary beneficiary. You have two main options for distributing that specific share:
            </BodyCopy>
            <ol className="space-y-2 pl-5 text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]">
              <li>Single Successor: Name one specific individual to take over the entire share.</li>
              <li>Group Distribution: Name several people to split that share equally among themselves.</li>
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
                    <div className="mt-1 text-[0.84rem] text-[#7b8594]">People ID: {distribution.peopleId || 'N/A'}</div>
                    {distribution.percentage != null ? <div className="mt-1 text-[0.84rem] text-[#7b8594]">Share: {formatSharePercent(distribution.percentage)}</div> : null}
                    {isSelectedDistributor ? <div className="mt-2 inline-flex rounded-full bg-[#152035] px-3 py-1 text-[0.75rem] font-medium text-white">Selected distributor</div> : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">No distributors have been saved yet.</div>
          )}
        </Panel>

        <Panel>
          {isLoading || isLoadingDistributions ? (
            <div className="flex items-center justify-center py-12 text-[#6e7886]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 md:space-y-5">
              <div className="space-y-2">
                <h3 className="text-[1rem] font-semibold text-[#191715] md:text-[1.08rem]">Choose backup members for the selected distributor</h3>
                <BodyCopy>
                  The selected distributor is used as the parent record. Backups are saved under that distributor's id.
                </BodyCopy>
              </div>

              {backupCandidates.length ? (
                <div className="space-y-3">
                  {backupCandidates.map((member, index) => {
                    const selected = selectedBackupIds.includes(member.id);
                    return (
                      <PersonRow
                        key={member.id}
                        title={member.fullName ?? `Person ${index + 1}`}
                        selected={selected}
                        action={selected ? "remove" : undefined}
                        onClick={() => toggleBackup(member.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[10px] bg-white px-4 py-4 text-[0.9rem] text-[#7b8594]">No people available for backup.</div>
              )}

              <AddPersonRow onClick={() => setIsAddPersonOpen(true)} />
            </div>
          )}
        </Panel>

        <FooterActions
          previousHref="/will/divide-estate/choose-backup-option"
          nextLabel={isSubmitting ? "Saving..." : "Save & Continue"}
          onNext={handleSaveBackups}
          nextDisabled={isSubmitting || !selectedBackupIds.length || !selectedDistributorId}
        />
      </section>

      <AddPersonModal open={isAddPersonOpen} onClose={() => setIsAddPersonOpen(false)} title="Add a new person" actionLabel="Create a person" onSuccess={() => setIsAddPersonOpen(false)} />
    </DivideEstateShell>
  );
}

export default BackupBeneficiaries;
