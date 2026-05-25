"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, MessageCircle, PawPrint, UserRound, UsersRound } from "lucide-react";

import logo from "@/assets/logo.png";

type CaretakersFlowShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  hint?: string;
  children?: ReactNode;
  previousHref: string;
  previousLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
};

export function CaretakerOptionCard({
  label,
  selected,
  onClick,
  icon = "caretaker",
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: "caretaker" | "pet" | "family";
}) {
  const Icon = icon === "pet" ? PawPrint : icon === "family" ? UsersRound : UserRound;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[110px] flex-1 flex-col items-center justify-center rounded-[4px] bg-[#f4f5f7] px-4 py-6 text-center transition-all ${
        selected ? "border-2 border-[#2e3b4f]" : "border border-transparent"
      }`}
    >
      <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#525a67] md:h-16 md:w-16">
        <Icon className="h-4 w-4 md:h-5 md:w-5" />
      </span>
      <span className="text-[1.1rem] font-semibold leading-[1.15] text-[#616a79] md:text-[1.35rem]">{label}</span>
    </button>
  );
}

export function CaretakerOptionGrid({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[8px] bg-[#eee7de] p-4 md:p-6">
      <div className="grid grid-cols-1 gap-3 md:[grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] md:gap-4">{children}</div>
    </div>
  );
}

export function CaretakerMemberRow({
  name,
  selected,
  onClick,
  helper,
  icon = "caretaker",
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
  helper?: string;
  icon?: "caretaker" | "pet" | "family";
}) {
  const Icon = icon === "pet" ? PawPrint : icon === "family" ? UsersRound : UserRound;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-[8px] bg-[#f4f5f7] px-4 py-4 text-left transition-all md:px-5 md:py-5 ${
        selected ? "border-2 border-[#2e3b4f]" : "border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#525a67] md:h-14 md:w-14">
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </span>
        <div>
          <p className="text-[1.05rem] font-semibold text-[#616a79] md:text-[1.35rem]">{name}</p>
          {helper ? <p className="text-[0.82rem] text-[#7d8899] md:text-[0.95rem]">{helper}</p> : null}
        </div>
      </div>

      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#a5adba]">
        {selected ? <span className="h-2.5 w-2.5 rounded-full bg-[#a5adba]" /> : null}
      </span>
    </button>
  );
}

export function CaretakerAddRow({ label, subLabel, onClick }: { label: string; subLabel?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-[8px] bg-[#f4f5f7] px-4 py-4 text-left md:px-5 md:py-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#152035] md:h-14 md:w-14">
        <PawPrint className="h-4 w-4 md:h-5 md:w-5" />
      </span>
      <span>
        <span className="block text-[1.05rem] font-semibold text-[#616a79] md:text-[1.35rem]">{label}</span>
        {subLabel ? <span className="block text-[0.9rem] text-[#6f7786] md:text-[1rem]">{subLabel}</span> : null}
      </span>
    </button>
  );
}

export default function CaretakersFlowShell({
  eyebrow = "Caretaker for pets",
  title,
  subtitle,
  description,
  hint,
  children,
  previousHref,
  previousLabel = "Back to dashboard",
  nextHref,
  nextLabel = "Get Started",
  onNext,
  nextDisabled = false,
}: CaretakersFlowShellProps) {
  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#161616]">
      <header className="border-b border-[#ece6de] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between">
          <Link href="/will" className="inline-flex items-center">
            <Image src={logo} alt="Will & Way" className="h-auto w-[96px] md:w-[130px]" priority />
          </Link>
          <Link href="/will" className="rounded-[4px] border border-[#d8d1c8] px-4 py-2 text-[0.9rem] text-[#1b1b1b] transition-colors hover:bg-[#f0e8df]">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-10 md:px-8 md:pt-14">
        <section>
          <p className="text-[0.82rem] text-[#45413c] md:text-[0.9rem]">{eyebrow}</p>
          <h1 className="mt-4 text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.02em] text-[#101010] md:text-[3.4rem]">{title}</h1>
          {subtitle ? <p className="mt-4 text-[1.02rem] text-[#121212] md:text-[1.1rem]">{subtitle}</p> : null}
          {description ? <p className="mt-3 text-[0.98rem] leading-[1.55] text-[#737b8b] md:text-[1.02rem]">{description}</p> : null}
          {hint ? (
            <div className="mt-6 border-l-2 border-[#91dff3] pl-4 text-[#738095]">
              <p className="mb-2 text-[0.95rem] font-medium text-[#59c4e8]">Tip</p>
              <p className="text-[0.95rem] leading-[1.6] md:text-[1rem]">{hint}</p>
            </div>
          ) : null}
        </section>

        {children ? <section className="mt-8">{children}</section> : null}

        <section className="mt-10 border-t border-[#ddd6cd] pt-6">
          <div className="flex items-center justify-between gap-4">
            <Link href={previousHref} className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]">
              <ArrowLeft className="h-4 w-4" />
              {previousLabel}
            </Link>

            {nextHref ? (
              <Link href={nextHref} className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)]">
                {nextLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {nextLabel}
              </button>
            )}
          </div>
        </section>
      </main>

      <button
        type="button"
        className="fixed bottom-5 right-5 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#162030] text-white shadow-[0_16px_30px_rgba(22,32,48,0.28)] transition-transform hover:scale-105"
        aria-label="Open chat"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
}