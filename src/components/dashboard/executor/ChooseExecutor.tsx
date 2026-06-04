"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  BodyCopy,
  BackupSelectorRow,
  ExecutorLayout,
  ExecutorActionRow,
  ExecutorPersonRow,
  FooterActions,
  FlowPanel,
  HeartIcon,
  IntroHeading,
  PageTitle,
  PawIcon,
  PersonIcon,
  SectionLabel,
  StepHeader,
  TipCallout,
} from "@/components/dashboard/executor/executor-flow";
import AddPersonModal from "@/components/ui/AddPersonModal";
import {
  useAddBackupExecutorMutation,
  useAddExecutorMutation,
  useGetWillQuery,
  useRemoveExecutorMutation,
  useRemoveBackupExecutorMutation,
} from "@/redux/api/executorApi";
import { useGetAllMemberListQuery } from "@/redux/api/profileApi";

type MemberRecord = {
  id: string;
  fullName?: string | null;
  relationType?: string | null;
};

type WillExecutorRecord = {
  id: string;
  peopleId?: string | null;
  backupPeopleId?: string | null;
  person?: MemberRecord | null;
  backupPerson?: MemberRecord | null;
};

function getApiErrorMessage(error: any) {
  return error?.data?.message || error?.error || "Something went wrong. Please try again.";
}

function getExecutorId(result: any) {
  return result?.data?.id ?? result?.id ?? null;
}

function getMemberLabel(relationType?: string | null) {
  if (relationType === "SPOUSE") return "Spouse";
  if (relationType === "PARTNER") return "Partner";
  if (relationType === "CHILD") return "Child";
  if (!relationType) return "Family member";

  return relationType
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getMemberIcon(relationType?: string | null) {
  if (relationType === "SPOUSE") return <HeartIcon />;
  if (relationType === "PARTNER") return <HeartIcon />;
  if (relationType === "CHILD") return <PersonIcon />;
  return <PersonIcon />;
}

export default function ChooseExecutor() {
  const router = useRouter();
  const { data: allMembers = [], isLoading } = useGetAllMemberListQuery(undefined);
  const { data: willResponse } = useGetWillQuery(undefined);
  const members = useMemo(
    () => (allMembers as MemberRecord[]).filter((member) => member.relationType !== "PET"),
    [allMembers]
  );
  const executorRecord = (willResponse?.data?.executors?.[0] ?? null) as WillExecutorRecord | null;
  const savedPrimaryId = executorRecord?.peopleId ?? null;
  const savedBackupId = executorRecord?.backupPeopleId ?? null;
  const savedExecutorId = executorRecord?.id ?? null;

  const [primaryExecutorId, setPrimaryExecutorId] = useState<string | null>(null);
  const [backupExecutorId, setBackupExecutorId] = useState<string | null>(null);
  const [activeExecutorId, setActiveExecutorId] = useState<string | null>(savedExecutorId);
  const [isBackupListOpen, setIsBackupListOpen] = useState(false);
  const [isAddExecutorOpen, setIsAddExecutorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addExecutor] = useAddExecutorMutation();
  const [addBackupExecutor] = useAddBackupExecutorMutation();
  const [removeExecutor] = useRemoveExecutorMutation();
  const [removeBackupExecutor] = useRemoveBackupExecutorMutation();

  const primaryId = primaryExecutorId ?? savedPrimaryId;
  const backupId = backupExecutorId ?? savedBackupId;

  const primaryExecutor = members.find((member) => member.id === primaryId) ?? executorRecord?.person ?? null;
  const backupExecutor = members.find((member) => member.id === backupId) ?? executorRecord?.backupPerson ?? null;
  const backupOptions = members.filter((member) => member.id !== primaryId && member.id !== backupId);

  useEffect(() => {
    if (savedPrimaryId) {
      setPrimaryExecutorId(savedPrimaryId);
      setBackupExecutorId(savedBackupId);
      setActiveExecutorId(savedExecutorId);
      setIsBackupListOpen(false);
      return;
    }

    if (primaryExecutorId) {
      setIsBackupListOpen(false);
      return;
    }

    setBackupExecutorId(null);
    setIsBackupListOpen(false);
  }, [primaryExecutorId, savedBackupId, savedPrimaryId]);

  useEffect(() => {
    if (!backupExecutorId && savedBackupId) {
      setBackupExecutorId(savedBackupId);
    }
  }, [backupExecutorId, savedBackupId]);

  const handlePrimarySelect = async (member: MemberRecord) => {
    if (isSubmitting || primaryId === member.id) return;

    setIsSubmitting(true);
    try {
      const result = await addExecutor({ peopleId: member.id }).unwrap();
      const executorId = getExecutorId(result);
      setPrimaryExecutorId(member.id);
      setActiveExecutorId(executorId);
      toast.success(`${member.fullName ?? "Executor"} selected as primary executor.`);
    } catch (error: any) {
      const message = getApiErrorMessage(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackupSelect = async (member: MemberRecord) => {
    if (!primaryId || !activeExecutorId || isSubmitting || backupId === member.id) return;

    setIsSubmitting(true);
    try {
      await addBackupExecutor({ executorId: activeExecutorId, backupPeopleId: member.id }).unwrap();
      setBackupExecutorId(member.id);
      setIsBackupListOpen(false);
      toast.success(`${member.fullName ?? "Executor"} selected as backup executor.`);
    } catch (error: any) {
      const message = getApiErrorMessage(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveBackup = async () => {
    if (!backupExecutor || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await removeBackupExecutor(backupExecutor.id).unwrap();
      setBackupExecutorId(null);
      setIsBackupListOpen(false);
      toast.success("Backup executor removed.");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePrimary = async () => {
    if (!activeExecutorId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await removeExecutor(activeExecutorId).unwrap();
      setPrimaryExecutorId(null);
      setBackupExecutorId(null);
      setActiveExecutorId(null);
      setIsBackupListOpen(false);
      toast.success("Primary executor removed.");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (!primaryExecutorId) {
      toast.error("Please select an executor before continuing.");
      return;
    }

    router.push("/will/executor/great-work");
  };

  const handleExecutorAdded = async (result: any) => {
    const peopleId = result?.data?.id ?? result?.id ?? null;

    if (!peopleId) {
      toast.error("Unable to create an executor. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const executorResult = await addExecutor({ peopleId }).unwrap();
      const executorId = getExecutorId(executorResult);
      setPrimaryExecutorId(peopleId);
      setActiveExecutorId(executorId);
      setIsAddExecutorOpen(false);
      toast.success("Executor added successfully.");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ExecutorLayout>
      <div className="space-y-10">
        <StepHeader step={2} label="Choosing your executor" />

        <section className="space-y-5">
          <PageTitle title="Tips on Choosing Your Executor" />

          <IntroHeading>Think about who you trust to carry out your wishes when you are no longer around</IntroHeading>

          <div className="space-y-5">
            <BodyCopy>
              Usually the executor is your spouse, family member, or even a friend you've known for a long time.
            </BodyCopy>
            <BodyCopy>
              You can name anyone over 21 years old to be your executor. They’ll be entitled to reasonable compensation from the estate.
            </BodyCopy>
            <BodyCopy>Choosing the right person to handle your will is a big decision.</BodyCopy>
          </div>

          <TipCallout>
            Beneficiaries can also act as executors. They will take a lawyer's help to settle the estate in case something happens.
          </TipCallout>
        </section>

        <section className="space-y-3 pt-1">
          <SectionLabel>Here is a simple breakdown of how to pick your executor:</SectionLabel>
          <SectionLabel>Who can you pick?</SectionLabel>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#5dbce5] text-white">
                <span className="text-[0.7rem] font-bold leading-none">✓</span>
              </span>
              <BodyCopy>
                Trustworthy People: Usually a partner, a relative, or a close, long-term friend.
              </BodyCopy>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#5dbce5] text-white">
                <span className="text-[0.7rem] font-bold leading-none">✓</span>
              </span>
              <BodyCopy>Age Requirement: Anyone who is at least 21 years old.</BodyCopy>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#5dbce5] text-white">
                <span className="text-[0.7rem] font-bold leading-none">✓</span>
              </span>
              <BodyCopy>Beneficiaries: It is perfectly fine to choose someone who is also inheriting from you.</BodyCopy>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#5dbce5] text-white">
                <span className="text-[0.7rem] font-bold leading-none">✓</span>
              </span>
              <BodyCopy>You have the right to update or change your choice at any time.</BodyCopy>
            </div>
          </div>
        </section>

        <FlowPanel className="space-y-4 py-5 md:py-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-16 animate-pulse rounded-[10px] bg-white/80" />
              <div className="h-16 animate-pulse rounded-[10px] bg-white/80" />
              <div className="h-16 animate-pulse rounded-[10px] bg-white/80" />
            </div>
          ) : primaryExecutor ? (
            <div className="space-y-5">
              <ExecutorPersonRow
                icon={getMemberIcon(primaryExecutor.relationType)}
                name={primaryExecutor.fullName ?? "Unnamed"}
                badge={getMemberLabel(primaryExecutor.relationType)}
              />
              <ExecutorActionRow
                icon={<Trash2 className="h-5 w-5" />}
                text={`Remove ${primaryExecutor.fullName ?? "this person"} as a primary executor`}
                tone="danger"
                onClick={handleRemovePrimary}
              />
            </div>
          ) : members.length ? (
            <div className="space-y-3">
              {members.map((member) => (
                <ExecutorPersonRow
                  key={member.id}
                  icon={getMemberIcon(member.relationType)}
                  name={member.fullName ?? "Unnamed"}
                  badge={getMemberLabel(member.relationType)}
                  selected={primaryId === member.id}
                  onClick={() => handlePrimarySelect(member)}
                />
              ))}

              <button
                type="button"
                onClick={() => setIsAddExecutorOpen(true)}
                disabled={isSubmitting}
                className="flex w-full items-center justify-between gap-4 rounded-[10px] border border-dashed border-[#d5cabd] bg-white/80 px-4 py-4 text-left text-[#5c6677] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 md:px-5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e9ecef] text-[#2b3448]">
                    <Plus className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[1rem] font-medium leading-[1.2] md:text-[1.08rem]">Add Executor</span>
                    <span className="mt-0.5 block text-[0.82rem] leading-[1.25] text-[#8a92a0] md:text-[0.88rem]">
                      Create someone new if the right person is not in your list yet.
                    </span>
                  </span>
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <BodyCopy>No family members found yet.</BodyCopy>
              <button
                type="button"
                onClick={() => setIsAddExecutorOpen(true)}
                disabled={isSubmitting}
                className="flex w-full items-center justify-between gap-4 rounded-[10px] border border-dashed border-[#d5cabd] bg-white/80 px-4 py-4 text-left text-[#5c6677] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 md:px-5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e9ecef] text-[#2b3448]">
                    <Plus className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[1rem] font-medium leading-[1.2] md:text-[1.08rem]">Add Executor</span>
                    <span className="mt-0.5 block text-[0.82rem] leading-[1.25] text-[#8a92a0] md:text-[0.88rem]">
                      Create someone new if the right person is not in your list yet.
                    </span>
                  </span>
                </span>
              </button>
            </div>
          )}
        </FlowPanel>

        {primaryExecutor ? (
          <section className="space-y-4 pt-1">
            <SectionLabel>You can choose to have a backup executor (Optional)</SectionLabel>
            <BodyCopy>
              You trust to carry out your wishes and you trust them knowing where your will is stored.
            </BodyCopy>

            <FlowPanel className="space-y-4 py-5 md:py-6">
              <BackupSelectorRow
                label="Choose a backup executor"
                value={backupExecutor ? backupExecutor.fullName ?? "Choose a backup executor" : undefined}
                isOpen={isBackupListOpen}
                onClick={() => {
                  if (backupExecutor) {
                    setIsBackupListOpen((current) => !current);
                    return;
                  }

                  setIsBackupListOpen((current) => !current);
                }}
              />

              {backupExecutor ? (
                <div className="space-y-4">
                  <ExecutorPersonRow
                    icon={getMemberIcon(backupExecutor.relationType)}
                    name={backupExecutor.fullName ?? "Unnamed"}
                    badge={getMemberLabel(backupExecutor.relationType)}
                  />
                  <ExecutorActionRow
                    icon={<Trash2 className="h-5 w-5" />}
                    text={`Remove ${backupExecutor.fullName ?? "this person"} as backup executor`}
                    tone="danger"
                    onClick={handleRemoveBackup}
                  />
                </div>
              ) : isBackupListOpen ? (
                <div className="space-y-3 pt-1">
                  {backupOptions.length ? (
                    backupOptions.map((member) => (
                      <ExecutorPersonRow
                        key={member.id}
                        icon={getMemberIcon(member.relationType)}
                        name={member.fullName ?? "Unnamed"}
                        badge={getMemberLabel(member.relationType)}
                        selected={backupExecutorId === member.id}
                        onClick={() => handleBackupSelect(member)}
                      />
                    ))
                  ) : (
                    <BodyCopy>No other members available for backup selection.</BodyCopy>
                  )}
                </div>
              ) : null}
            </FlowPanel>
          </section>
        ) : null}

        <FooterActions
          previousHref="/will/executor/get-started"
          previousLabel="Previous Step"
          primaryLabel={isSubmitting ? "Saving..." : "Finish Section"}
          primaryHref="/will"
          primaryOnClick={handleFinish}
          primaryDisabled={isSubmitting}
        />

       <AddPersonModal
          open={isAddExecutorOpen}
          onClose={() => setIsAddExecutorOpen(false)}
          title="Add an executor"
          actionLabel="Create Executor"
          allowGenericPerson
          showRelationshipDropdown={true}  // Add this line
          onSuccess={handleExecutorAdded}
        />
      </div>
    </ExecutorLayout>
  );
}