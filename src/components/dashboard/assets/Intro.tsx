"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Building2, Landmark, Wallet, Banknote } from "lucide-react";
import logo from "@/assets/logo.png";

import { useGetWillDetailsQuery } from "@/redux/api/profileApi";
import Image from "next/image";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function getAssetTypeLabel(type?: string | null): string {
  if (!type) return "Asset";

  switch (type) {
    case "BANK_ACCOUNT":
      return "Bank";
    case "INVESTMENT_ACCOUNT":
      return "Investment";
    case "INSURANCE_PLAN":
      return "Insurance";
    case "CRYPTO":
      return "Crypto";
    case "RESIDENTIAL":
      return "Home";
    case "LAND":
      return "Land";
    default:
      return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

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

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-20 rounded-xl bg-[#eae2d8]" />
      <div className="space-y-3 rounded-xl border border-[#ece8e2] bg-[#f9f6f3] p-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center justify-between gap-3 pb-2 last:pb-0">
            <div className="h-4 w-24 rounded bg-[#eae2d8]" />
            <div className="h-4 w-20 rounded bg-[#eae2d8]" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[#ece8e2] bg-white p-3">
        <div className="mb-3 h-4 w-28 rounded bg-[#eae2d8]" />
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-9 rounded-lg bg-[#f1ede8]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Intro() {
  const [selectedChoice, setSelectedChoice] = useState<"yes" | "no" | null>(null);
  const { data: getWillDetails, isLoading } = useGetWillDetailsQuery({});
  
  const willData = getWillDetails?.data;
  const summary = willData?.summary;
  const assets = willData?.assets;

  const financialAssets = assets?.financialAssets ?? [];
  const properties = assets?.properties ?? [];
  const loans = assets?.loans ?? [];

  const assetBreakdown = [
    ...financialAssets.map((asset: any) => ({
      id: asset.id,
      label: `${getAssetTypeLabel(asset.type)}${asset.institutionName ? `: ${asset.institutionName}` : ""}`,
      value: Number(asset.approximateValue ?? 0),
      tone: "default" as const,
    })),
    ...properties.map((property: any) => ({
      id: property.id,
      label: `${getAssetTypeLabel(property.type)}${property.streetAddress ? `: ${property.streetAddress}` : ""}`,
      value: Number(property.estimatedValue ?? 0),
      tone: "default" as const,
    })),
    ...loans.map((loan: any) => ({
      id: loan.id,
      label: `Loan${loan.institutionName ? `: ${loan.institutionName}` : ""}`,
      value: Number(loan.approximateBalance ?? 0),
      tone: "danger" as const,
    })),
  ];

  const shouldContinue = selectedChoice === "yes";
  const footerHref = shouldContinue ? "/will/assets/add-financials" : "/will";
  const footerLabel = shouldContinue ? "Continue" : "Skip this step";

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#161616]">
      <header className="border-b border-[#ece6de] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4">
         <div className="flex items-center gap-4 sm:gap-12">
          <Link href="/">
            <Image
              src={logo}
              alt="Will & Way Logo"
              className="h-auto w-[160px]"
            />
          </Link>
        </div>

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
          {/* Left Column - Asset Summary (replaces image) */}
          <section className="order-2 lg:order-1 lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-[4px] border border-[#e8dfd2] bg-white shadow-[0_1px_0_rgba(17,24,39,0.02)]">
              <div className="p-5 bg-[#f8f4ef]">
                <h2 className="text-lg font-semibold text-[#161616] mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-[#737b8b]" />
                  Your Assets Summary
                </h2>
                
                {isLoading ? (
                  <LoadingSkeleton />
                ) : summary ? (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-gradient-to-br from-[#152035] to-[#1e2a4a] p-4 text-white shadow-[0_12px_30px_rgba(21,32,53,0.18)]">
                      <p className="text-sm font-medium text-white/80">Net Worth</p>
                      <p className="mt-1 text-3xl font-bold tracking-[-0.03em]">{formatCurrency(summary.netWorth ?? 0)}</p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-[#ece8e2] bg-[#f9f6f3] p-3">
                      <div className="flex items-center justify-between gap-3 border-b border-[#ece8e2] pb-2">
                        <div className="flex items-center gap-2 text-[#566070]">
                          <Landmark className="h-4 w-4" />
                          <span className="text-sm">Financial Assets</span>
                        </div>
                        <span className="text-sm font-semibold text-[#161616]">{formatCurrency(summary.totalFinancial ?? 0)}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-b border-[#ece8e2] pb-2">
                        <div className="flex items-center gap-2 text-[#566070]">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">Properties</span>
                        </div>
                        <span className="text-sm font-semibold text-[#161616]">{formatCurrency(summary.totalProperties ?? 0)}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[#566070]">
                          <Banknote className="h-4 w-4" />
                          <span className="text-sm">Outstanding Loans</span>
                        </div>
                        <span className="text-sm font-semibold text-[#d9534f]">{formatCurrency(summary.totalOutstanding ?? 0)}</span>
                      </div>
                    </div>

                    {assetBreakdown.length > 0 && (
                      <div className="rounded-xl border border-[#ece8e2] bg-white p-3 shadow-[0_4px_14px_rgba(17,24,39,0.03)]">
                        <p className="mb-3 text-sm font-semibold text-[#161616]">Asset Breakdown</p>
                        <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                          {assetBreakdown.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#f0e9e2] bg-[#faf7f4] px-2.5 py-2 text-sm">
                              <span className="min-w-0 truncate pr-2 text-[#5d6778]">{item.label}</span>
                              <span className={`shrink-0 font-semibold ${item.tone === "danger" ? "text-[#d9534f]" : "text-[#161616]"}`}>
                                {formatCurrency(item.value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#737b8b]">No assets added yet</p>
                    <p className="text-sm text-[#737b8b] mt-2">Add your assets to see summary</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Column - Content */}
          <section className="order-2 lg:order-2">
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
                <div>
                  <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">Centralized Record:</h2>
                  <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">Your inputs are organized into a single, cohesive document for easy reference.</p>
                </div>
                <div>
                  <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">Complete Control:</h2>
                  <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">You decide the level of detail provided based on what your family needs to know.</p>
                </div>
                <div>
                  <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">Protection of Wealth:</h2>
                  <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">Cataloging assets helps guarantee that your beneficiaries can claim their rightful shares.</p>
                </div>
                <div>
                  <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">Property:</h2>
                  <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">Residential or commercial real estate holdings.</p>
                </div>
                <div>
                  <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">Bank Accounts:</h2>
                  <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">Standard checking, savings, or fixed-deposit accounts.</p>
                </div>
                <div>
                  <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">Investment Accounts:</h2>
                  <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">Stocks, bonds, or other brokerage portfolios.</p>
                </div>
                <div>
                  <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">Insurance Policies:</h2>
                  <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">Unnominated life, endowment, or general protection plans.</p>
                </div>
                <div>
                  <h2 className="text-[1.02rem] font-semibold text-[#161616] md:text-[1.08rem]">Business Interests:</h2>
                  <p className="mt-1 text-[0.95rem] leading-[1.6] text-[#7b8594] md:text-[1rem]">Ownership stakes or professional corporate entities.</p>
                </div>
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