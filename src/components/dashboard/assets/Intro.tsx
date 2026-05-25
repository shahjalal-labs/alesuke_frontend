"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X } from "lucide-react";

import willPrviewImage from "@/assets/will/Will Preview.png";

const assetDetails = [
  {
    title: "Centralized Record",
    description: "Your inputs are organized into a single, cohesive document for easy reference.",
  },
  {
    title: "Complete Control",
    description: "You decide the level of detail provided based on what your family needs to know.",
  },
  {
    title: "Protection of Wealth",
    description: "Cataloging assets helps guarantee that your beneficiaries can claim their rightful shares.",
  },
  {
    title: "Property",
    description: "Residential or commercial real estate holdings.",
  },
  {
    title: "Bank Accounts",
    description: "Standard checking, savings, or fixed-deposit accounts.",
  },
  {
    title: "Investment Accounts",
    description: "Stocks, bonds, or other brokerage portfolios.",
  },
  {
    title: "Insurance Policies",
    description: "Unnominated life, endowment, or general protection plans.",
  },
  {
    title: "Business Interests",
    description: "Ownership stakes or professional corporate entities.",
  },
];

function ChoiceCard({
  label,
  selected,
  icon,
  onClick,
}: {
  label: string;
  selected: boolean;
  icon: "yes" | "no";
  onClick: () => void;
}) {
  const isYes = icon === "yes";

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-[136px] flex-1 flex-col items-center justify-center rounded-[4px] border bg-white px-4 py-6 text-center transition-shadow ${
        selected ? "border-[#2b3545] shadow-[0_8px_24px_rgba(17,24,39,0.08)]" : "border-transparent shadow-[0_1px_0_rgba(17,24,39,0.02)]"
      }`}
    >
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">
        {isYes ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </span>
      <span className="text-[1.05rem] font-medium text-[#677182] md:text-[1.15rem]">{label}</span>
    </button>
  );
}

export default function Intro() {
  const [selectedChoice, setSelectedChoice] = useState<"yes" | "no" | null>(null);
  const shouldContinue = selectedChoice === "yes";
  const footerHref = shouldContinue ? "/will/assets/add-financials" : "/will";
  const footerLabel = shouldContinue ? "Continue" : "Skip this step";

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#161616]">
      <header className="border-b border-[#ece6de] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4">
          <div className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#171612] md:text-[1.8rem]">Will &amp; Way</div>

          <Link
            href="/will"
            className="rounded-[4px] border border-[#d8d1c8] px-4 py-2 text-[0.9rem] text-[#1b1b1b] transition-colors hover:bg-[#f0e8df]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-8 md:px-8 md:pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(320px,420px)_1fr] lg:items-start xl:grid-cols-[minmax(420px,520px)_1fr]">
          <section className="order-2 lg:order-1 lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-[4px] border border-[#e8dfd2] bg-white shadow-[0_1px_0_rgba(17,24,39,0.02)]">
              <div className="relative aspect-[3/4] w-full bg-[#f8f4ef]">
                <Image
                  src={willPrviewImage}
                  alt="Will preview"
                  fill
                  className="object-contain object-top p-3 md:p-4"
                  priority
                />
              </div>
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="max-w-[640px]">
              <p className="text-[0.82rem] text-[#45413c] md:text-[0.9rem]">Adding your assets</p>
              <div className="mt-4 border-t border-[#ece8e2]" />

              <h1 className="mt-8 text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.02em] text-[#101010] md:text-[3.4rem]">
                Adding your assets
              </h1>

              <p className="mt-5 text-[1rem] leading-[1.6] text-[#737b8b] md:text-[1.05rem]">
                The goal of this process is to simplify the transition of your estate to your family and chosen executor. By
                listing your holdings now, you ensure your loved ones receive their intended portions without unnecessary
                confusion.
              </p>

              <div className="mt-6 space-y-5 text-[#161616]">
                {assetDetails.map((item) => (
                  <div key={item.title}>
                    <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">{item.title}:</h2>
                    <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-[1rem] font-medium text-[#161616] md:text-[1.05rem]">Would you like to add your assets?</p>

                <div className="mt-4 rounded-[8px] bg-[#eee7de] p-4 md:p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ChoiceCard label="No" selected={selectedChoice === "no"} icon="no" onClick={() => setSelectedChoice("no")} />
                    <ChoiceCard label="Yes" selected={selectedChoice === "yes"} icon="yes" onClick={() => setSelectedChoice("yes")} />
                  </div>
                </div>
              </div>

              <footer className="mt-10 border-t border-[#ddd6cd] pt-6">
                <div className="flex items-center justify-between gap-4">
                  <Link href="/will" className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]">
                    ← Back to Menu
                  </Link>

                  <Link
                    href={footerHref}
                    className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)]"
                  >
                    {footerLabel}
                  </Link>
                </div>
              </footer>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
