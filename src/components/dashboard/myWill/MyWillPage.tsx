"use client";

import Link from "next/link";
import { PencilLine, PawPrint, UserRound, UsersRound, CheckCircle } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import WillSectionCard from "./WillSectionCard";
import { useGetAllMemberListQuery } from "@/redux/api/profileApi";

function getMemberBadge(member: any) {
  if (member.relationType === "PET") return { label: "Pet", icon: PawPrint };
  if (member.relationType === "CHILD") return { label: "Child", icon: UserRound };
  if (member.relationType === "SPOUSE") return { label: "Spouse", icon: UsersRound };
  if (member.relationType === "PARTNER") return { label: "Partner", icon: UsersRound };
  return { label: "Member", icon: UserRound };
}

export default function MyWillPage() {
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined);
  const hasFamilyData = members.length > 0;

  const familyProgress = hasFamilyData
    ? 15 + new Set(members.map((member: any) => member.relationType)).size * 5
    : 15;

  const familySummary = hasFamilyData
    ? [
        members.find((member: any) => member.relationType === "SPOUSE"),
        members.find((member: any) => member.relationType === "PARTNER"),
        members.find((member: any) => member.relationType === "CHILD"),
        members.find((member: any) => member.relationType === "PET"),
      ].filter(Boolean)
    : [];

  return (
    <div className="w-full">
      <DashboardHeader />

      <div className="space-y-6">
        <section className="rounded-[3px] border border-dashed border-[#dfcfbf] bg-[#F6ECE2] p-4 sm:p-5">
          <div className="mb-3 flex items-start justify-between gap-4 px-2">
            <h2 className="text-[1.05rem] font-medium text-[#2b221a] sm:text-[1.1rem]">You and your family</h2>
            {hasFamilyData ? (
              <span className="inline-flex items-center gap-2 rounded px-3 py-1 text-[0.9rem] font-medium text-emerald-700 bg-emerald-100">
                <CheckCircle className="h-4 w-4 text-emerald-700" />
                Completed
              </span>
            ) : (
              <div className="text-[0.95rem] text-[#2f241c]">Complete</div>
            )}
          </div>

          <div className="rounded-[2px] bg-white px-4 py-3 sm:px-5 sm:py-4">
            <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">About You and Your Loved Ones</p>
            <div className="my-4 border-t border-[#ece8e2]" />

            {isLoading ? (
              <div className="space-y-3">
                <div className="h-11 animate-pulse rounded-[4px] bg-[#f2f2f2]" />
                <div className="h-11 animate-pulse rounded-[4px] bg-[#f2f2f2]" />
              </div>
            ) : hasFamilyData ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {familySummary.map((member: any) => {
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

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#ece8e2] pt-4">
                  <Link
                    href="/will/you-and-your-family/marital-status"
                    className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                  >
                    <PencilLine className="h-4 w-4" />
                    Edit
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/will/you-and-your-family/marital-status"
                className="inline-flex items-center rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
              >
                Add you and your family
              </Link>
            )}
          </div>
        </section>

        <WillSectionCard
          title="Choose a trusted executor"
          time="2 min"
          description="Nominate someone you trust. E.g., spouse or close friend."
          buttonLabel={hasFamilyData ? "Pick an executor" : undefined}
          buttonHref={hasFamilyData ? "/will" : undefined}
          withPrimaryButton={hasFamilyData}
          secondaryLabel={hasFamilyData ? undefined : "Complete You and your family first"}
        />

        <WillSectionCard
          title="Estate Distribution"
          time="3 min"
          description="Distribute your estate to the people and organisations you choose"
          buttonLabel={hasFamilyData ? "Distribute your estate" : undefined}
          buttonHref={hasFamilyData ? "/will" : undefined}
          withPrimaryButton={hasFamilyData}
          secondaryLabel={hasFamilyData ? undefined : "Complete You and your family first"}
        />

        <WillSectionCard
          title="Gifts"
          time="3 min"
          description="Give items such as jewellery, monies or something precious with a personalized note for them"
          buttonLabel={hasFamilyData ? "Add Gifts" : undefined}
          buttonHref={hasFamilyData ? "/will" : undefined}
          withPrimaryButton={hasFamilyData}
          secondaryLabel={hasFamilyData ? undefined : "Complete You and your family first"}
        />

        <WillSectionCard
          title="Assets"
          time="4-10 minutes"
          description="Indicate your assets here"
          buttonLabel={hasFamilyData ? "Add your assets" : undefined}
          buttonHref={hasFamilyData ? "/assets" : undefined}
          withPrimaryButton={hasFamilyData}
          secondaryLabel={hasFamilyData ? undefined : "Add your assets"}
        />
      </div>

      <div className="mt-6 rounded-[3px] border border-[#e6d8c8] bg-[#F6ECE2] p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between text-[0.9rem] text-[#2f241c]">
          <span className="font-medium">Drafting progress</span>
          <span>{familyProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#e7ddd2]">
          <div className="h-full rounded-full bg-[#192233] transition-all duration-300" style={{ width: `${familyProgress}%` }} />
        </div>
      </div>
    </div>
  );
}
