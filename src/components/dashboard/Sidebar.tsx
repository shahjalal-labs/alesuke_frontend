"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Cookies from "js-cookie";
import { useGetAllMemberListQuery } from "@/redux/api/profileApi";

import logo from "@/assets/logo.png";

type SidebarProps = {
  onNavigate?: () => void;
  mobile?: boolean;
};

export default function Sidebar({ onNavigate, mobile = false }: SidebarProps) {
  const pathname = usePathname() || "/";
  const { data: members = [] } = useGetAllMemberListQuery(undefined);
  const makeClass = (path: string) =>
    pathname === path
      ? "rounded-[4px] bg-white px-3 py-3 text-sm font-medium text-[#162030] shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
      : "rounded-[4px] px-3 py-3 text-sm text-[#6b7280] transition-colors hover:bg-white/70 hover:text-[#162030]";
      const router = useRouter();

      const handleLogout = () => {
        // Clear the token from cookies
        Cookies.remove("accessToken");  
        // Optionally, you can also clear any user-related state in your application here
        router.push("/login"); // Redirect to the login page after logout
      }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/will"
        onClick={onNavigate}
        className={mobile ? "mb-6 inline-flex items-center" : "mb-6 inline-flex items-center pl-5"}
      >
        <Image src={logo} alt="Will & Way" className={mobile ? "h-auto w-[170px]" : "h-auto w-[210px]"} priority />
      </Link>

      <div className="flex min-h-0 flex-1 flex-col rounded-[8px] border border-[#e8ddd0] bg-[#f2e5d8] px-3 py-4">
        {(() => {
          const completedTypes = new Set(members.map((member: any) => member.relationType));
          const progress = members.length ? 15 + completedTypes.size * 5 : 15;

          return (
            <div className="mb-4 border-b border-[#1b2333]/20 px-1 pb-4 pt-2">
              <div className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#24201c]">Drafting Will</div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-[0.22em] text-[#8d7f70]">Your will is {progress}% complete</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7ddd2]">
                <div className="h-full rounded-full bg-[#192233] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        })()}

        <nav className="mt-4 flex flex-col gap-2 px-1">
          <Link href="/will" className={makeClass("/will")} onClick={onNavigate}>
            My Will
          </Link>
          <Link href="/my-loved-ones" className={makeClass("/my-loved-ones")} onClick={onNavigate}>
            My Loved Ones
          </Link>
          <Link href="/assets" className={makeClass("/assets")} onClick={onNavigate}>
            Assets
          </Link>
        </nav>

        <div className="mt-auto px-1 pb-2 pt-6">
          <button onClick={handleLogout} className="w-full rounded-[3px] bg-[#e8ddd1] px-3 py-2 text-left text-sm text-[#ff4d2d]">
            ↪ Logout
          </button>
        </div>
      </div>
    </div>
  );
}
