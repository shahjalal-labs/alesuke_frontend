"use client";

import React, { ReactNode, useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import logo from "@/assets/logo.png";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf3ea]">
      <header className="sticky top-0 z-30 border-b border-[#e8ddd0] bg-[#fbf3ea]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#d8c7b7] text-[#1b2333]"
            aria-label="Open dashboard menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="inline-flex items-center">
            <Image src={logo} alt="Will & Way" className="h-auto w-[140px]" priority />
          </Link>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-[320px] border-r-0 bg-[#fbf3ea] p-4">
          <Sidebar mobile onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen w-full gap-0">
        <aside className="hidden h-screen w-[286px] shrink-0 border-r border-[#e8ddd0] bg-[#fbf3ea] p-4 lg:fixed lg:left-0 lg:top-0 lg:block">
          <Sidebar />
        </aside>

        <main className="w-full px-4 py-5 md:px-6 md:py-6 lg:ml-[286px] lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}