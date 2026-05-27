"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CheckCircle, Heart, PencilLine, PawPrint, UserRound, UsersRound, Banknote, House, BriefcaseBusiness } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import { useGetWillDetailsQuery } from "@/redux/api/profileApi";

type FamilyMember = {
  id: string;
  fullName?: string | null;
  relationType?: string | null;
};

type ExecutorRecord = {
  person?: FamilyMember | null;
  backupPerson?: FamilyMember | null;
};

type EstateDistributionRecord = {
  id: string;
  percentage?: number | null;
  distributionType?: string | null;
  person?: FamilyMember | null;
  backupDistributors?: Array<{ person?: FamilyMember | null }>;
};

type GiftRecord = {
  id: string;
  recipientName?: string | null;
  giftType?: string | null;
  amount?: number | null;
  description?: string | null;
};

type PetCaretakerRecord = {
  id: string;
  pet?: FamilyMember | null;
  caretaker?: FamilyMember | null;
};

type WillDetailsResponse = {
  user?: {
    name?: string | null;
    profileImage?: string | null;
  };
  family?: FamilyMember[];
  executors?: ExecutorRecord[];
  estateDistributions?: EstateDistributionRecord[];
  gifts?: GiftRecord[];
  petCaretakers?: PetCaretakerRecord[];
  assets?: {
    financialAssets?: Array<{ id: string }>;
    properties?: Array<{ id: string }>;
    loans?: Array<{ id: string; type?: string }>;
  };
  summary?: {
    totalFinancial?: number;
    totalProperties?: number;
    totalLoansGiven?: number;
    totalOutstanding?: number;
    netWorth?: number;
  };
};

function getMemberBadge(member: FamilyMember) {
  if (member.relationType === "PET") return { label: "Pet", icon: PawPrint };
  if (member.relationType === "CHILD") return { label: "Child", icon: UserRound };
  if (member.relationType === "SPOUSE") return { label: "Spouse", icon: UsersRound };
  if (member.relationType === "PARTNER") return { label: "Partner", icon: UsersRound };
  return { label: "Member", icon: UserRound };
}

function getExecutorIcon(relationType?: string | null) {
  if (relationType === "CHILD") return UserRound;
  if (relationType === "PET") return PawPrint;
  return Heart;
}

function formatMoney(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "S$ 0";
  return `S$ ${value.toLocaleString()}`;
}

function PrerequisiteMessage() {
  return (
    <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">
      Complete{" "}
      <Link href="/will/you-and-your-family/marital-status" className="text-sky-500 underline-offset-2 hover:underline">
        You and your family
      </Link>{" "}
      first
    </p>
  );
}

function SectionShell({
  title,
  completed,
  time,
  children,
  footer,
}: {
  title: string;
  completed: boolean;
  time: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-[3px] border border-dashed border-[#dfcfbf] bg-[#F6ECE2] p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-4 px-2">
        <h2 className="text-[1.05rem] font-medium text-[#2b221a] sm:text-[1.1rem]">{title}</h2>
        {completed ? (
          <span className="inline-flex items-center gap-2 rounded px-3 py-1 text-[0.9rem] font-medium text-emerald-700 bg-emerald-100">
            <CheckCircle className="h-4 w-4 text-emerald-700" />
            Completed
          </span>
        ) : (
          <div className="text-[0.95rem] text-[#2f241c]">Takes about {time}</div>
        )}
      </div>

      <div className="rounded-[2px] bg-white px-4 py-3 sm:px-5 sm:py-4">
        {children}
        {footer ? <>{footer}</> : null}
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  icons,
}: {
  label: string;
  value?: string;
  icons?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <p className="min-w-0 shrink-0 text-[0.98rem] text-[#4b5361] sm:text-[1.05rem]">{label}</p>
      <div className="h-px flex-1 bg-[#cfd5de]" />
      {value ? <p className="shrink-0 text-[0.98rem] text-[#4b5361] sm:text-[1.05rem]">{value}</p> : null}
      {icons ? <div className="flex shrink-0 items-center gap-1">{icons}</div> : null}
    </div>
  );
}

function PersonBubble({
  member,
  fallback,
}: {
  member?: FamilyMember | null;
  fallback: string;
}) {
  const Icon = getExecutorIcon(member?.relationType);

  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[#F5EADD] text-[#172031]">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[1.05rem] font-medium leading-[1.2] text-[#4b5361] sm:text-[1.15rem]">
          {member?.fullName ?? fallback}
        </p>
        <p className="mt-1 text-[0.94rem] leading-[1.35] text-[#767e8c] sm:text-[1rem]">
          {member?.relationType ?? "Not selected"}
        </p>
      </div>
    </div>
  );
}

export default function MyWillPage() {
  const { data: willResponse, isLoading } = useGetWillDetailsQuery(undefined);
  const dashboardResponse = willResponse as { data?: WillDetailsResponse } | undefined;
  const dashboard = (dashboardResponse?.data ?? {}) as WillDetailsResponse;
  const isHydrating = isLoading && !dashboardResponse?.data;

  const userName = dashboard.user?.name ?? "User";
  const family = dashboard.family ?? [];
  const executors = dashboard.executors ?? [];
  const estateDistributions = dashboard.estateDistributions ?? [];
  const gifts = dashboard.gifts ?? [];
  const petCaretakers = dashboard.petCaretakers ?? [];
  const financialAssets = dashboard.assets?.financialAssets ?? [];
  const properties = dashboard.assets?.properties ?? [];
  const loans = dashboard.assets?.loans ?? [];

  const hasFamilyData = family.length > 0;
  const hasExecutorData = executors.length > 0;
  const hasEstateDistributionData = estateDistributions.length > 0;
  const hasGiftsData = gifts.length > 0;
  const hasPetCaretakerData = petCaretakers.length > 0;
  const hasAssetsData = financialAssets.length > 0 || properties.length > 0 || loans.length > 0;

  const sectionStates = [
    hasFamilyData,
    hasExecutorData,
    hasEstateDistributionData,
    hasGiftsData,
    hasPetCaretakerData,
    hasAssetsData,
  ];

  const completedSections = sectionStates.filter(Boolean).length;
  const completionPercent = Math.round((completedSections / sectionStates.length) * 100);
  const allComplete = sectionStates.every(Boolean);
  const canAccessOtherSections = hasFamilyData;

  const familySummary = family.filter((member) => ["SPOUSE", "PARTNER", "CHILD", "PET"].includes(member.relationType ?? ""));
  const primaryExecutor = executors[0]?.person ?? null;
  const backupExecutor = executors[0]?.backupPerson ?? null;
  const previewHref = "/will/preview";

  return (
    <div className="w-full">
      <DashboardHeader />

      <div className="mb-6 rounded-[3px] border border-[#eadfcf] bg-[#F6ECE2] px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.86rem] uppercase tracking-[0.12em] text-[#8c8072]">Progress</p>
            <h2 className="mt-1 text-[1.15rem] font-medium text-[#2b221a] sm:text-[1.2rem]">Your will is {completionPercent}% complete</h2>
          </div>
          <div className="text-right text-[0.95rem] text-[#2f241c]">{allComplete ? "All sections complete" : `${completedSections}/6 complete`}</div>
        </div>
      </div>

      <div className="space-y-6">
        <SectionShell
          title="You and your family"
          completed={hasFamilyData}
          time="3 min"
          footer={
            <div className="mt-4 flex justify-end border-t border-[#ece8e2] pt-4">
              {hasFamilyData ? (
                <Link
                  href="/will/you-and-your-family/marital-status"
                  className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                >
                  <PencilLine className="h-4 w-4" />
                  Edit
                </Link>
              ) : (
                <Link
                  href="/will/you-and-your-family/marital-status"
                  className="inline-flex items-center rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                >
                  Add you and your family
                </Link>
              )}
            </div>
          }
        >
          {isHydrating ? (
            <div className="space-y-3">
              <div className="h-11 animate-pulse rounded-[4px] bg-[#f2f2f2]" />
              <div className="h-11 animate-pulse rounded-[4px] bg-[#f2f2f2]" />
            </div>
          ) : hasFamilyData ? (
            <div className="space-y-4">
              <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">About You and Your Loved Ones</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {family.map((member) => {
                  const badge = getMemberBadge(member);
                  const BadgeIcon = badge.icon;

                  return (
                    <div key={member.id} className="flex items-center gap-3 rounded-[6px] border border-[#ece8e2] px-3 py-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e8da] text-[#223048]">
                        <BadgeIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.92rem] font-medium text-[#2b221a]">{member.fullName}</p>
                        <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#8c8072]">{badge.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </SectionShell>

        {!isHydrating ? (
          <>
            <SectionShell
              title="Your Executor"
              completed={hasExecutorData}
              time="2 min"
              footer={
                canAccessOtherSections ? (
                  <div className="mt-4 flex justify-end border-t border-[#ece8e2] pt-4">
                    {hasExecutorData ? (
                      <Link
                        href="/will/executor/get-started"
                        className="inline-flex items-center justify-center rounded-[3px] bg-[#172031] px-7 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/executor/get-started"
                        className="inline-flex items-center rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        Pick an executor
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                hasExecutorData ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <PersonBubble member={primaryExecutor} fallback="Not selected" />
                      <PersonBubble member={backupExecutor} fallback="Not selected" />
                    </div>
                  </div>
                ) : (
                  <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">
                    Nominate someone you trust to manage your will.
                  </p>
                )
              ) : (
                <PrerequisiteMessage />
              )}
            </SectionShell>

            <SectionShell
              title="Estate Distribution"
              completed={hasEstateDistributionData}
              time="3 min"
              footer={
                canAccessOtherSections ? (
                  <div className="mt-4 flex justify-end border-t border-[#ece8e2] pt-4">
                    {hasEstateDistributionData ? (
                      <Link
                        href="/will/divide-estate/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/divide-estate/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        Distribute your estate
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                <div className="space-y-1">
                  {estateDistributions.map((distribution) => (
                    <SummaryRow
                      key={distribution.id}
                      label={distribution.person?.fullName ?? "Not selected"}
                      value={`${Number(distribution.percentage ?? 0).toFixed(2).replace(/\.00$/, "")} %`}
                      icons={
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                          <UserRound className="h-4 w-4" />
                        </span>
                      }
                    />
                  ))}
                </div>
              ) : (
                <PrerequisiteMessage />
              )}
            </SectionShell>

            <SectionShell
              title="Gifts"
              completed={hasGiftsData}
              time="3 min"
              footer={
                canAccessOtherSections ? (
                  <div className="mt-4 flex justify-end border-t border-[#ece8e2] pt-4">
                    {hasGiftsData ? (
                      <Link
                        href="/will/gifts"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/gifts"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        Add Gifts
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                <div className="space-y-1">
                  {gifts.map((gift) => (
                    <SummaryRow
                      key={gift.id}
                      label={gift.recipientName ?? "Recipient"}
                      value={gift.giftType === "CASH" && typeof gift.amount === "number" ? formatMoney(gift.amount) : gift.description ?? "Gift"}
                      icons={
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                          <Heart className="h-4 w-4" />
                        </span>
                      }
                    />
                  ))}
                </div>
              ) : (
                <PrerequisiteMessage />
              )}
            </SectionShell>

            <SectionShell
              title="Caretaker for pets"
              completed={hasPetCaretakerData}
              time="1 min"
              footer={
                canAccessOtherSections ? (
                  <div className="mt-4 flex justify-end border-t border-[#ece8e2] pt-4">
                    {hasPetCaretakerData ? (
                      <Link
                        href="/will/caretakers-of-pets/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/caretakers-of-pets/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        Add caretaker for pets
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                <div className="space-y-1">
                  {petCaretakers.map((record) => (
                    <SummaryRow
                      key={record.id}
                      label={record.pet?.fullName ?? "Pet"}
                      value={record.caretaker?.fullName ?? "Not selected"}
                      icons={
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                          <PawPrint className="h-4 w-4" />
                        </span>
                      }
                    />
                  ))}
                </div>
              ) : (
                <PrerequisiteMessage />
              )}
            </SectionShell>

            <SectionShell
              title="Assets"
              completed={hasAssetsData}
              time="4-10 min"
              footer={
                canAccessOtherSections ? (
                  <div className="mt-4 flex justify-end border-t border-[#ece8e2] pt-4">
                    {hasAssetsData ? (
                      <Link
                        href="/will/assets/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/assets/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                      >
                        Add your assets
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                <div className="space-y-1">
                  <SummaryRow
                    label={`${financialAssets.length} Financial Assets`}
                    icons={
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                        <Banknote className="h-4 w-4" />
                      </span>
                    }
                  />
                  <SummaryRow
                    label={`${properties.length} property`}
                    icons={
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                        <House className="h-4 w-4" />
                      </span>
                    }
                  />
                  <SummaryRow
                    label={`${gifts.length + petCaretakers.length + loans.length} Other Assets`}
                    icons={
                      <>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                          <UserRound className="h-4 w-4" />
                        </span>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                          <PawPrint className="h-4 w-4" />
                        </span>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                          <BriefcaseBusiness className="h-4 w-4" />
                        </span>
                      </>
                    }
                  />
                </div>
              ) : (
                <PrerequisiteMessage />
              )}
            </SectionShell>

            {allComplete ? (
              <div className="flex justify-end pb-2">
                <Link
                  href={previewHref}
                  className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-6 py-3 text-[0.98rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                >
                  Will Preview
                </Link>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      </div>
  );
}
