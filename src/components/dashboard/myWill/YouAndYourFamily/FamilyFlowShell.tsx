"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

type FamilyFlowShellProps = {
  step: number;
  title: string;
  subtitle?: string;
  description?: string;
  hintLines?: string[];
  optionsBlock: React.ReactNode;
  detailsBlock?: React.ReactNode;
  prevHref: string;
  nextHref?: string;
  nextLabel?: string;
  onNext?: () => void;
};

const TOTAL_STEPS = 5;

export default function FamilyFlowShell({
  step,
  title,
  subtitle,
  description,
  hintLines,
  optionsBlock,
  detailsBlock,
  prevHref,
  nextHref,
  nextLabel = "Save & Continue",
  onNext,
}: FamilyFlowShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#161616]">
      <header className="sticky top-0 z-20 border-b border-[#ece6de] bg-[#f6f1eb]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between">
          <Link href="/will" className="inline-flex items-center">
            <Image src={logo} alt="Will & Way" className="h-auto w-[96px] md:w-[130px]" priority />
          </Link>
          <Link
            href="/will"
            className="rounded-[4px] border border-[#d8d1c8] px-4 py-2 text-[0.9rem] text-[#1b1b1b] transition-colors hover:bg-[#f0e8df]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-10 md:px-8 md:pt-14">
        <section>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 items-center rounded-full bg-[#0f1d33] px-3 text-[0.62rem] font-semibold tracking-[0.06em] text-white">
              STEP {String(step).padStart(2, "0")}
            </span>
            <span className="text-[0.88rem] font-medium text-[#394253]">You and your family</span>
          </div>

          <div className="mt-3 flex gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, index) => {
              const position = index + 1;
              const className =
                position < step ? "bg-[#57c9e8]" : position === step ? "bg-[#152035]" : "bg-[#c7ced7]";

              return <span key={position} className={`h-1.5 flex-1 rounded-full ${className}`} />;
            })}
          </div>
        </section>

        <section className="mt-10">
          <h1 className="text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.02em] text-[#101010] md:text-[3.4rem]">
            {title}
          </h1>
          {subtitle ? <p className="mt-3 text-[1.1rem] text-[#121212]">{subtitle}</p> : null}
          {description ? <p className="mt-4 text-[1.02rem] text-[#737b8b]">{description}</p> : null}

          {hintLines?.length ? (
            <div className="mt-6 border-l-2 border-[#91dff3] pl-4 text-[#738095]">
              <p className="mb-2 text-[1.2rem] text-[#59c4e8]">Tip</p>
              {hintLines.map((line) => (
                <p key={line} className="text-[0.95rem] leading-[1.6] md:text-[1rem]">
                  {line}
                </p>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-7">{optionsBlock}</section>
        {detailsBlock ? <section className="mt-5">{detailsBlock}</section> : null}

        <section className="mt-10 border-t border-[#ddd6cd] pt-6">
          <div className="flex items-center justify-between gap-4">
            <Link href={prevHref} className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]">
              <ArrowLeft className="h-4 w-4" />
              Previous Step
            </Link>

            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)]"
              >
                {nextLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)]"
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
