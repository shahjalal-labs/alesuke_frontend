"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Heart,
  PencilLine,
  PawPrint,
  UserRound,
  UsersRound,
  Banknote,
  House,
  BriefcaseBusiness,
  Gift,
  Globe,
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import { useGetWillDetailsQuery } from "@/redux/api/profileApi";
import { useGetMeDataQuery } from "@/redux/api/authApi";
import { useEffect, useRef } from "react";
import { useGetDigitalAssetsQuery } from "@/redux/api/assetsApi";

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
  backupDistributors?: Array<{
    id?: string;
    person?: FamilyMember | null;
  }>;
};

type GiftRecord = {
  id: string;
  recipientName?: string | null;
  giftType?: string | null;
  amount?: number | null;
  description?: string | null;
  itemName?: string | null;
  asset?: {
    id: string;
    type?: string | null;
    institutionName?: string | null;
    accountNumber?: string | null;
    policyNumber?: string | null;
    approximateValue?: number | null;
    faceValue?: number | null;
    coverType?: string | null;
    maturityDate?: string | null;
    companyName?: string | null;
    description?: string | null;
  } | null;
  property?: {
    id: string;
    type?: string | null;
    streetAddress?: string | null;
    unitNumber?: string | null;
    postcode?: string | null;
    country?: string | null;
    estimatedValue?: number | null;
    isJointProperty?: boolean;
  } | null;
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
    maritalStatus?: string | null;
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

type GetMeResponse = {
  fullName?: string;
  maritalStatus?: string;
  addresses?: Array<{ id: string }>;
  haveChildren?: boolean;
  havePets?: boolean;
};

type DigitalAssetsResponse = {
  id?: string;
  hasNetflix?: boolean;
  hasDisneyPlus?: boolean;
  hasPrimeVideo?: boolean;
  hasViu?: boolean;
  hasAppleTVPlus?: boolean;
  hasSpotify?: boolean;
  hasYouTubePremium?: boolean;
  hasAudible?: boolean;
  hasICloud?: boolean;
  hasGoogleDrive?: boolean;
  hasOneDrive?: boolean;
  hasGrab?: boolean;
  hasFoodpanda?: boolean;
  hasBrokerageETF?: boolean;
  brokerageDetails?: string | null;
};

// Helper function to get relation label
function getRelationLabel(relationType?: string | null): string {
  const relationMap: Record<string, string> = {
    SPOUSE: "Spouse",
    PARTNER: "Partner",
    CHILD: "Child",
    FRIEND: "Friend",
    SISTER: "Sister",
    BROTHER: "Brother",
    COUSIN: "Cousin",
    FATHER: "Father",
    MOTHER: "Mother",
    SIBLING: "Sibling",
    GRANDPARENT: "Grandparent",
    PARENT: "Parent",
    NEPHEW: "Nephew",
    OTHER: "Other",
    PET: "Pet",
  };
  return relationMap[relationType || ""] || relationType || "Member";
}

function getMemberBadge(member: FamilyMember) {
  if (member.relationType === "PET") return { label: "Pet", icon: PawPrint };
  if (member.relationType === "CHILD")
    return { label: "Child", icon: UserRound };
  if (member.relationType === "SPOUSE")
    return { label: "Spouse", icon: UsersRound };
  if (member.relationType === "PARTNER")
    return { label: "Partner", icon: UsersRound };
  // Map other relation types
  const label = getRelationLabel(member.relationType);
  return { label, icon: UserRound };
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
      <Link
        href="/will/you-and-your-family/marital-status"
        className="text-sky-500 underline-offset-2 hover:underline"
      >
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
        <h2 className="text-[1.05rem] font-medium text-[#2b221a] sm:text-[1.1rem]">
          {title}
        </h2>
        {completed ? (
          <span className="inline-flex items-center gap-2 rounded px-3 py-1 text-[0.9rem] font-medium text-emerald-700 bg-emerald-100">
            <CheckCircle className="h-4 w-4 text-emerald-700" />
            Completed
          </span>
        ) : (
          <div className="text-[0.95rem] text-[#2f241c]">
            Takes about {time}
          </div>
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
      <p className="min-w-0 shrink-0 text-[0.98rem] text-[#4b5361] sm:text-[1.05rem]">
        {label}
      </p>
      <div className="h-px flex-1 bg-[#cfd5de]" />
      {value ? (
        <p className="shrink-0 text-[0.98rem] text-[#4b5361] sm:text-[1.05rem]">
          {value}
        </p>
      ) : null}
      {icons ? (
        <div className="flex shrink-0 items-center gap-1">{icons}</div>
      ) : null}
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
          {member?.relationType
            ? getRelationLabel(member.relationType)
            : "Not selected"}
        </p>
      </div>
    </div>
  );
}

function DistributionPeopleBadge({ member }: { member?: FamilyMember | null }) {
  const badge = member
    ? getMemberBadge(member)
    : { label: "Member", icon: UserRound };
  const BadgeIcon = badge.icon;

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[10px] border border-[#ece8e2] bg-[#fcfaf7] px-3 py-3">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
        <BadgeIcon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[0.92rem] font-medium text-[#2b221a] sm:text-[0.98rem]">
          {member?.fullName ?? "Not selected"}
        </p>
        <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#8c8072]">
          {badge.label}
        </p>
      </div>
    </div>
  );
}

// Helper function to get gift icon
function getGiftIcon(giftType?: string | null) {
  if (giftType === "CASH") return Banknote;
  if (giftType === "PROPERTY") return House;
  if (giftType === "COLLECTION") return Gift;
  if (giftType === "FINANCIAL_ACCOUNT") return BriefcaseBusiness;
  return Heart;
}

// Helper function to get gift type label
function getGiftTypeLabel(giftType?: string | null) {
  if (giftType === "CASH") return "Cash";
  if (giftType === "PROPERTY") return "Property";
  if (giftType === "ITEM") return "Item";
  if (giftType === "COLLECTION") return "Collection";
  if (giftType === "VEHICLE") return "Vehicle";
  if (giftType === "FINANCIAL_ACCOUNT") return "Financial Account";
  return "Gift";
}

// Helper function to get gift value display
function getGiftValueDisplay(gift: GiftRecord) {
  if (gift.giftType === "CASH" && typeof gift.amount === "number") {
    return formatMoney(gift.amount);
  }
  if (gift.description) {
    return gift.description;
  }
  return "No description";
}

// Helper function to get digital assets count
function getDigitalAssetsCount(
  digitalAssets: DigitalAssetsResponse | null | undefined,
): number {
  if (!digitalAssets) return 0;

  const platforms = [
    digitalAssets.hasNetflix,
    digitalAssets.hasDisneyPlus,
    digitalAssets.hasPrimeVideo,
    digitalAssets.hasViu,
    digitalAssets.hasAppleTVPlus,
    digitalAssets.hasSpotify,
    digitalAssets.hasYouTubePremium,
    digitalAssets.hasAudible,
    digitalAssets.hasICloud,
    digitalAssets.hasGoogleDrive,
    digitalAssets.hasOneDrive,
    digitalAssets.hasGrab,
    digitalAssets.hasFoodpanda,
    digitalAssets.hasBrokerageETF,
  ];

  return platforms.filter(Boolean).length;
}

// Helper function to get platform names
function getPlatformNames(
  digitalAssets: DigitalAssetsResponse | null | undefined,
): string[] {
  if (!digitalAssets) return [];

  const platforms: { key: keyof DigitalAssetsResponse; name: string }[] = [
    { key: "hasNetflix", name: "Netflix" },
    { key: "hasDisneyPlus", name: "Disney+" },
    { key: "hasPrimeVideo", name: "Prime Video" },
    { key: "hasViu", name: "Dropbox" },
    { key: "hasAppleTVPlus", name: "Apple TV+" },
    { key: "hasSpotify", name: "Spotify" },
    { key: "hasYouTubePremium", name: "YouTube Premium" },
    { key: "hasAudible", name: "Audible" },
    { key: "hasICloud", name: "iCloud" },
    { key: "hasGoogleDrive", name: "Google Drive" },
    { key: "hasOneDrive", name: "OneDrive" },
    { key: "hasGrab", name: "Grab" },
    { key: "hasFoodpanda", name: "Foodpanda" },
    { key: "hasBrokerageETF", name: "Brokerage/ETF" },
  ];

  return platforms
    .filter((p) => digitalAssets[p.key] === true)
    .map((p) => p.name);
}

export default function MyWillPage() {
  const router = useRouter();
  const {
    data: willResponse,
    isLoading,
    refetch: refetchWillDetails,
  } = useGetWillDetailsQuery(undefined);
  const { data: getMeData, refetch: refetchMeData } = useGetMeDataQuery({});
  const { data: digitalAssetsResponse, refetch: refetchDigitalAssets } =
    useGetDigitalAssetsQuery({});

  const dashboardResponse = willResponse as
    | { data?: WillDetailsResponse }
    | undefined;
  const dashboard = (dashboardResponse?.data ?? {}) as WillDetailsResponse;
  const userData = (getMeData?.data ?? {}) as GetMeResponse;
  const digitalAssets = (digitalAssetsResponse?.data ??
    null) as DigitalAssetsResponse | null;

  const isHydrating = isLoading && !dashboardResponse?.data;

  // Use ref to track if initial mount has happened
  const hasMounted = useRef(false);

  // Refetch data when component mounts or when returning from sub-pages
  useEffect(() => {
    const handleRouteChange = () => {
      // Refetch all data when returning to this page
      refetchWillDetails();
      refetchMeData();
      refetchDigitalAssets();
    };

    // Only refetch on initial mount if not already loaded
    if (!hasMounted.current && !dashboardResponse?.data) {
      handleRouteChange();
      hasMounted.current = true;
    }

    // Listen for popstate events (browser back/forward)
    window.addEventListener("popstate", handleRouteChange);

    // Listen for page visibility changes (when tab becomes active again)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleRouteChange();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    refetchWillDetails,
    refetchMeData,
    refetchDigitalAssets,
    dashboardResponse?.data,
  ]);

  const userName = dashboard.user?.name ?? userData.fullName ?? "User";
  const family = dashboard.family ?? [];
  const executors = dashboard.executors ?? [];
  const estateDistributions = dashboard.estateDistributions ?? [];
  const gifts = dashboard.gifts ?? [];
  const petCaretakers = dashboard.petCaretakers ?? [];
  const financialAssets = dashboard.assets?.financialAssets ?? [];
  const properties = dashboard.assets?.properties ?? [];
  const loans = dashboard.assets?.loans ?? [];

  // Modified logic for family completion
  const hasAddress = (userData.addresses ?? []).length > 0;
  const isSingle =
    dashboard.user?.maritalStatus === "SINGLE" ||
    userData.maritalStatus === "SINGLE";
  const hasFamilyMembers = family.length > 0;

  // Family flow is complete if:
  // 1. User has address AND (is single OR has family members)
  // OR
  // 2. User is not single and has family members
  const hasFamilyData = hasAddress && (isSingle || hasFamilyMembers);

  const hasExecutorData = executors.length > 0;
  const hasEstateDistributionData = estateDistributions.length > 0;
  const hasGiftsData = gifts.length > 0;
  
  // UPDATED: Pet caretaker logic
  // Check if there are any pets in the family
  const hasPets = family.some((member) => member.relationType === "PET");
  
  // Pet caretaker is complete if:
  // 1. There are no pets (no action needed) - OR -
  // 2. There are pets AND caretakers have been assigned
  const hasPetCaretakerData = !hasPets || petCaretakers.length > 0;
  
  const hasAssetsData =
    financialAssets.length > 0 || properties.length > 0 || loans.length > 0;
  const hasDigitalAssetsData = !!(
    digitalAssets && getDigitalAssetsCount(digitalAssets) > 0
  );

  const sectionStates = [
    hasFamilyData,
    hasExecutorData,
    hasEstateDistributionData,
    hasGiftsData,
    hasPetCaretakerData,
    hasAssetsData,
    hasDigitalAssetsData,
  ];

  const completedSections = sectionStates.filter(Boolean).length;
  const completionPercent = Math.round(
    (completedSections / sectionStates.length) * 100,
  );
  const allComplete = sectionStates.every(Boolean);
  const canAccessOtherSections = hasFamilyData;

  const familySummary = family.filter((member) =>
    ["SPOUSE", "PARTNER", "CHILD", "PET"].includes(member.relationType ?? ""),
  );
  const primaryExecutor = executors[0]?.person ?? null;
  const backupExecutor = executors[0]?.backupPerson ?? null;
  const previewHref = "/will/preview";

  // Check if user is single and has no family members but has address
  const showSingleUserOnly = isSingle && !hasFamilyMembers && hasAddress;

  // Create handleNavigation function to refetch before navigation
  const handleNavigation = (href: string) => {
    router.push(href);
  };

  // Get pet names for display
  const petNames = family
    .filter((member) => member.relationType === "PET")
    .map((pet) => pet.fullName)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-full">
      <DashboardHeader />

      {/* Manual refresh button - optional */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            refetchWillDetails();
            refetchMeData();
            refetchDigitalAssets();
          }}
          className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div className="mb-6 rounded-[3px] border border-[#eadfcf] bg-[#F6ECE2] px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.86rem] uppercase tracking-[0.12em] text-[#8c8072]">
              Progress
            </p>
            <h2 className="mt-1 text-[1.15rem] font-medium text-[#2b221a] sm:text-[1.2rem]">
              Your will is {completionPercent}% complete
            </h2>
          </div>
          <div className="text-right text-[0.95rem] text-[#2f241c]">
            {allComplete
              ? "All sections complete"
              : `${completedSections}/7 complete`}
          </div>
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
                  onClick={() =>
                    handleNavigation("/will/you-and-your-family/marital-status")
                  }
                >
                  <PencilLine className="h-4 w-4" />
                  Edit
                </Link>
              ) : (
                <Link
                  href="/will/you-and-your-family/marital-status"
                  className="inline-flex items-center rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                  onClick={() =>
                    handleNavigation("/will/you-and-your-family/marital-status")
                  }
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
              <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">
                About You and Your Loved Ones
              </p>

              {/* Show single user info when applicable */}
              {showSingleUserOnly ? (
                <div className="flex items-center gap-3 rounded-[6px] border border-[#ece8e2] px-3 py-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e8da] text-[#223048]">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.92rem] font-medium text-[#2b221a]">
                      {userName}
                    </p>
                    <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#8c8072]">
                      Single
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {family.map((member) => {
                    const badge = getMemberBadge(member);
                    const BadgeIcon = badge.icon;

                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 rounded-[6px] border border-[#ece8e2] px-3 py-3"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e8da] text-[#223048]">
                          <BadgeIcon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.92rem] font-medium text-[#2b221a]">
                            {member.fullName}
                          </p>
                          <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#8c8072]">
                            {badge.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                        onClick={() =>
                          handleNavigation("/will/executor/get-started")
                        }
                      >
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/executor/get-started"
                        className="inline-flex items-center rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                        onClick={() =>
                          handleNavigation("/will/executor/get-started")
                        }
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
                      <PersonBubble
                        member={primaryExecutor}
                        fallback="Not selected"
                      />
                      <PersonBubble
                        member={backupExecutor}
                        fallback="Not selected"
                      />
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
                        onClick={() =>
                          handleNavigation("/will/divide-estate/intro")
                        }
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/divide-estate/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                        onClick={() =>
                          handleNavigation("/will/divide-estate/intro")
                        }
                      >
                        Distribute your estate
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                <div className="space-y-3">
                  {estateDistributions.map((distribution) => {
                    const backupMembers = distribution.backupDistributors ?? [];

                    return (
                      <div
                        key={distribution.id}
                        className="rounded-[10px] border border-[#ece8e2] bg-[#fcfaf7] p-3 sm:p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                              <UserRound className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[0.98rem] font-medium text-[#2b221a] sm:text-[1.05rem]">
                                {distribution.person?.fullName ??
                                  "Not selected"}
                              </p>
                              <p className="mt-1 text-[0.82rem] uppercase tracking-[0.12em] text-[#8c8072]">
                                {distribution.person?.relationType
                                  ? getRelationLabel(
                                      distribution.person.relationType,
                                    )
                                  : "Estate distribution"}
                              </p>
                            </div>
                          </div>

                          <div className="inline-flex items-center self-start rounded-full bg-[#f4e8da] px-3 py-1 text-[0.84rem] font-medium text-[#2b221a] sm:self-center">
                            {Math.round(
                              Number(distribution.percentage ?? 0) / 5,
                            ) * 5}{" "}
                            %
                          </div>
                        </div>

                        <div className="mt-4 border-t border-[#ece8e2] pt-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8c8072]">
                              Backup Distributees
                            </p>
                            <span className="text-[0.78rem] text-[#7a8190]">
                              {backupMembers.length
                                ? `${backupMembers.length} selected`
                                : "None selected"}
                            </span>
                          </div>

                          {backupMembers.length ? (
                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                              {backupMembers.map((backup) => (
                                <DistributionPeopleBadge
                                  key={
                                    backup.id ??
                                    backup.person?.id ??
                                    `${distribution.id}-backup`
                                  }
                                  member={backup.person ?? null}
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="rounded-[8px] bg-white px-3 py-3 text-[0.92rem] text-[#6f7685]">
                              No backup distributees have been added for this
                              distribution.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <PrerequisiteMessage />
              )}
            </SectionShell>

            {/* Gifts Section - Responsive 2 columns */}
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
                        onClick={() => handleNavigation("/will/gifts")}
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/gifts"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                        onClick={() => handleNavigation("/will/gifts")}
                      >
                        Add Gifts
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                gifts.length > 0 ? (
                  <div className="space-y-4">
                    {/* Gift Cards Grid - 2 columns on md/lg, 1 column on mobile */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                      {gifts.map((gift) => {
                        const GiftIcon = getGiftIcon(gift.giftType);
                        const giftTypeLabel = getGiftTypeLabel(gift.giftType);
                        let giftValue = getGiftValueDisplay(gift);

                        // If it's a financial account, get detailed info
                        let financialDetails = null;
                        if (
                          gift.giftType === "FINANCIAL_ACCOUNT" &&
                          gift.asset
                        ) {
                          const asset = gift.asset;
                          financialDetails = (
                            <div className="mt-2 space-y-1 border-t border-[#f0ece6] pt-2 text-[0.8rem] text-[#6f7685]">
                              {asset.type && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Type:
                                  </span>
                                  <span className="truncate">
                                    {asset.type.replace(/_/g, " ")}
                                  </span>
                                </div>
                              )}
                              {asset.institutionName && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Institution:
                                  </span>
                                  <span className="truncate">
                                    {asset.institutionName}
                                  </span>
                                </div>
                              )}
                              {(asset.accountNumber || asset.policyNumber) && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    {asset.accountNumber
                                      ? "Account:"
                                      : "Policy:"}
                                  </span>
                                  <span className="truncate font-mono text-xs">
                                    {asset.accountNumber || asset.policyNumber}
                                  </span>
                                </div>
                              )}
                              {(asset.approximateValue || asset.faceValue) && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Value:
                                  </span>
                                  <span className="font-semibold text-[#2b221a]">
                                    {formatMoney(
                                      asset.approximateValue || asset.faceValue,
                                    )}
                                  </span>
                                </div>
                              )}
                              {asset.coverType && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Cover:
                                  </span>
                                  <span className="truncate">
                                    {asset.coverType.replace(/_/g, " ")}
                                  </span>
                                </div>
                              )}
                              {asset.description && (
                                <div className="flex items-start gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Note:
                                  </span>
                                  <span className="truncate">
                                    {asset.description}
                                  </span>
                                </div>
                              )}
                              {gift.description && !asset.description && (
                                <div className="flex items-start gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Note:
                                  </span>
                                  <span className="truncate">
                                    {gift.description}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        // For PROPERTY gifts, show property details
                        let propertyDetails = null;
                        if (gift.giftType === "PROPERTY" && gift.property) {
                          const property = gift.property;
                          propertyDetails = (
                            <div className="mt-2 space-y-1 border-t border-[#f0ece6] pt-2 text-[0.8rem] text-[#6f7685]">
                              {property.type && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Type:
                                  </span>
                                  <span className="truncate">
                                    {property.type.replace(/_/g, " ")}
                                  </span>
                                </div>
                              )}
                              {property.streetAddress && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Address:
                                  </span>
                                  <span className="truncate">
                                    {property.streetAddress}
                                  </span>
                                </div>
                              )}
                              {property.estimatedValue && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Value:
                                  </span>
                                  <span className="font-semibold text-[#2b221a]">
                                    {formatMoney(property.estimatedValue)}
                                  </span>
                                </div>
                              )}
                              {property.isJointProperty && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Joint:
                                  </span>
                                  <span className="text-emerald-600">✓</span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        // For ITEM gifts
                        let itemDetails = null;
                        if (gift.giftType === "ITEM" && gift.itemName) {
                          itemDetails = (
                            <div className="mt-2 space-y-1 border-t border-[#f0ece6] pt-2 text-[0.8rem] text-[#6f7685]">
                              {gift.itemName && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Item:
                                  </span>
                                  <span className="truncate">
                                    {gift.itemName}
                                  </span>
                                </div>
                              )}
                              {gift.description && (
                                <div className="flex items-start gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Description:
                                  </span>
                                  <span className="truncate">
                                    {gift.description}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        // For COLLECTION gifts
                        let collectionDetails = null;
                        if (gift.giftType === "COLLECTION") {
                          collectionDetails = (
                            <div className="mt-2 space-y-1 border-t border-[#f0ece6] pt-2 text-[0.8rem] text-[#6f7685]">
                              {gift.itemName && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Item:
                                  </span>
                                  <span className="truncate">
                                    {gift.itemName}
                                  </span>
                                </div>
                              )}
                              {gift.description && (
                                <div className="flex items-start gap-1.5">
                                  <span className="font-medium text-[#5a4e42]">
                                    Description:
                                  </span>
                                  <span className="truncate">
                                    {gift.description}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={gift.id}
                            className="flex flex-col rounded-[10px] border border-[#ece8e2] bg-[#fcfaf7] p-4 transition-all hover:shadow-sm hover:border-[#d5c9bc]"
                          >
                            <div className="flex items-start gap-3">
                              <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                                <GiftIcon className="h-5 w-5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-baseline gap-1.5">
                                  <p className="truncate text-[0.95rem] font-medium text-[#2b221a] sm:text-[1rem]">
                                    {gift.recipientName ?? "Recipient"}
                                  </p>
                                  <span className="inline-flex shrink-0 rounded-full bg-[#e8e0d6] px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-[#5a4e42]">
                                    {giftTypeLabel}
                                  </span>
                                </div>
                                <p className="mt-1 truncate text-[0.85rem] leading-[1.4] text-[#6f7685] sm:text-[0.9rem]">
                                  {giftValue}
                                </p>

                                {/* Show financial details if available */}
                                {financialDetails}

                                {/* Show property details if available */}
                                {propertyDetails}

                                {/* Show item details if available */}
                                {itemDetails}

                                {/* Show collection details if available */}
                                {collectionDetails}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary row for gifts count */}
                  </div>
                ) : (
                  <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">
                    No gifts have been added yet. Add specific gifts to leave to
                    your loved ones.
                  </p>
                )
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
                        onClick={() =>
                          handleNavigation("/will/caretakers-of-pets/intro")
                        }
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/caretakers-of-pets/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                        onClick={() =>
                          handleNavigation("/will/caretakers-of-pets/intro")
                        }
                      >
                        Add caretaker for pets
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                hasPets ? (
                  petCaretakers.length > 0 ? (
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
                    <div className="space-y-2">
                      <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">
                        You have pets in your family. Please add a caretaker for:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {family
                          .filter((member) => member.relationType === "PET")
                          .map((pet) => (
                            <span
                              key={pet.id}
                              className="inline-flex items-center gap-2 rounded-full bg-[#f5eadd] px-3 py-1.5 text-[0.85rem] text-[#2b221a]"
                            >
                              <PawPrint className="h-3.5 w-3.5" />
                              {pet.fullName}
                            </span>
                          ))}
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-[0.95rem] leading-[1.45] text-[#6f7685] sm:text-[1rem]">
                    No pets added to your family.
                  </p>
                )
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
                        onClick={() => handleNavigation("/will/assets/intro")}
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/assets/intro"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                        onClick={() => handleNavigation("/will/assets/intro")}
                      >
                        Add your assets
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                hasAssetsData ? (
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
                  <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">
                    Add your assets here to help your family locate them
                  </p>
                )
              ) : (
                <PrerequisiteMessage />
              )}
            </SectionShell>

            {/* Digital Assets Section */}
            <SectionShell
              title="Digital Assets"
              completed={hasDigitalAssetsData}
              time="2 min"
              footer={
                canAccessOtherSections ? (
                  <div className="mt-4 flex justify-end border-t border-[#ece8e2] pt-4">
                    {hasDigitalAssetsData ? (
                      <Link
                        href="/will/digital-assets"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                        onClick={() => handleNavigation("/will/digital-assets")}
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                    ) : (
                      <Link
                        href="/will/digital-assets"
                        className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                        onClick={() => handleNavigation("/will/digital-assets")}
                      >
                        Add Digital Assets
                      </Link>
                    )}
                  </div>
                ) : null
              }
            >
              {canAccessOtherSections ? (
                hasDigitalAssetsData ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                        <Globe className="h-4 w-4" />
                      </span>
                      <p className="text-[0.95rem] font-medium text-[#2b221a] sm:text-[1rem]">
                        Digital Subscriptions & Accounts
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {getPlatformNames(digitalAssets).map(
                        (platform, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-[6px] border border-[#ece8e2] bg-[#fcfaf7] px-3 py-3"
                          >
                            <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[0.92rem] font-medium text-[#2b221a]">
                                {platform}
                              </p>
                              <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#8c8072]">
                                Digital Account
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {digitalAssets?.brokerageDetails && (
                      <div className="mt-3 rounded-[8px] bg-[#f4f0ea] px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e0d6] text-[#5a4e42]">
                              <BriefcaseBusiness className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-[0.85rem] font-medium text-[#5a4e42]">
                                Brokerage/ETF Details
                              </p>
                              <p className="text-[0.9rem] text-[#2b221a]">
                                {digitalAssets.brokerageDetails}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f5eadd] text-[#172031]">
                        <Globe className="h-4 w-4" />
                      </span>
                      <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">
                        Add your digital subscriptions and accounts to ensure
                        your loved ones can access or close them.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <PrerequisiteMessage />
              )}
            </SectionShell>

            {allComplete ? (
              <div className="flex justify-end pb-2">
                <Link
                  href={previewHref}
                  className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-6 py-3 text-[0.98rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                  onClick={() => handleNavigation(previewHref)}
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