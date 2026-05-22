"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  MessageCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type ProfileSetupShellProps = {
  step: number;
  stepLabel: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
  footerLabel?: string;
  onCountryChange?: (country: string) => void;
};

type ChoiceCardProps = {
  title: ReactNode;
  icon: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
};

export function ProfileSetupShell({
  step,
  stepLabel,
  title,
  description,
  children,
  backHref,
  backLabel = "Previous Step",
  nextHref,
  nextLabel = "Save & Continue",
  nextDisabled,
  onNext,
  footerLabel = "Singapore",
  onCountryChange,
}: ProfileSetupShellProps) {
  const totalSteps = 8;
  const countryOptions = useMemo(() => ["United States", "Singapore", "India"], []);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [country, setCountry] = useState(footerLabel);

  useEffect(() => {
    setCountry(footerLabel);
  }, [footerLabel]);

  const handleCountrySelect = (nextCountry: string) => {
    setCountry(nextCountry);
    onCountryChange?.(nextCountry);
  };

  useEffect(() => {
    if (!isCountryModalOpen) {
      setIsCountryDropdownOpen(false);
    }
  }, [isCountryModalOpen]);

  useEffect(() => {
    if (!isCountryModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isCountryModalOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8F3] text-[#1b2333]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_transparent_48%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,248,243,1)_0%,rgba(255,248,243,0)_100%)]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-[760px] flex-col px-6 py-8 sm:px-8 sm:py-10 lg:px-0">
        <section className="w-full max-w-[640px]">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 items-center rounded-full bg-[#162030] px-2.5 text-[0.64rem] font-semibold tracking-[0.08em] text-white shadow-[0_6px_16px_rgba(22,32,48,0.18)]">
              STEP {String(step).padStart(2, "0")}
            </span>
            <p className="text-[0.9rem] font-medium text-[#2d3446]">{stepLabel}</p>
          </div>

          <div className="mt-3 flex gap-2 sm:gap-3">
            {Array.from({ length: totalSteps }, (_, index) => {
              const position = index + 1;
              const isCurrent = position === step;
              const isComplete = position < step;

              return (
                <span
                  key={position}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    isCurrent
                      ? "bg-[#1e283a]"
                      : isComplete
                        ? "bg-[#67d5ef]"
                        : "bg-[#d9dce2]"
                  )}
                />
              );
            })}
          </div>

          <div className="mt-10 sm:mt-12">
            <h1 className="max-w-[620px] text-[2.7rem] leading-[0.95] tracking-[-0.04em] text-[#101010] sm:text-[3.5rem] lg:text-[3.75rem]">
              {title}
            </h1>
            {description ? (
              <div className="mt-5 max-w-[620px] text-[1rem] leading-[1.45] text-[#7a8090] sm:text-[1.08rem]">
                {description}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-7 w-full max-w-[640px]">
          {children}
        </section>

        <section className="mt-10 w-full max-w-[640px]">
          <div className="border-t border-[#ded8cf] pt-4 sm:pt-5">
            <div className="flex items-center justify-between gap-4">
              {backHref ? (
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#5f697e] transition-colors hover:text-[#1b2333]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{backLabel}</span>
                </Link>
              ) : (
                <span />
              )}

              {nextHref ? (
                onNext ? (
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={nextDisabled}
                    className={cn(
                      "inline-flex min-w-[150px] items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(18,28,44,0.22)] transition-all",
                      nextDisabled
                        ? "cursor-not-allowed bg-[#aeb3bc]"
                        : "bg-[#192233] hover:bg-[#111929]"
                    )}
                  >
                    <span>{nextLabel}</span>
                    {!nextDisabled ? <ArrowRight className="h-4 w-4" /> : null}
                  </button>
                ) : (
                  <Link
                    href={nextDisabled ? "#" : nextHref}
                    aria-disabled={nextDisabled}
                    tabIndex={nextDisabled ? -1 : 0}
                    className={cn(
                      "inline-flex min-w-[150px] items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(18,28,44,0.22)] transition-all",
                      nextDisabled
                        ? "pointer-events-none bg-[#aeb3bc]"
                        : "bg-[#192233] hover:bg-[#111929]"
                    )}
                  >
                    <span>{nextLabel}</span>
                    {!nextDisabled ? <ArrowRight className="h-4 w-4" /> : null}
                  </Link>
                )
              ) : (
                <button
                  type="button"
                  disabled={nextDisabled}
                  className={cn(
                    "inline-flex min-w-[150px] items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(18,28,44,0.22)] transition-all",
                    nextDisabled
                      ? "cursor-not-allowed bg-[#aeb3bc]"
                      : "bg-[#192233] hover:bg-[#111929]"
                  )}
                >
                  <span>{nextLabel}</span>
                  {!nextDisabled ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              )}
            </div>
          </div>

          <div className="mt-9 flex items-center gap-3 text-[0.95rem] text-[#9a9da6] sm:mt-10">
            <span>{country}</span>
            <span>-</span>
            <button
              type="button"
              onClick={() => setIsCountryModalOpen(true)}
              className="font-semibold text-[#242635] transition-colors hover:text-[#0f1726]"
            >
              Change Location
            </button>
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

      {isCountryModalOpen ? (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 px-4 py-4 sm:px-6 sm:py-6"
          onClick={() => setIsCountryModalOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-[940px]"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <div className="w-full overflow-visible rounded-[12px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
              <div className="flex items-center justify-between px-6 py-5 sm:px-7 sm:py-6">
                <h2 className="text-[1.45rem] leading-none tracking-[-0.03em] text-[#111111] sm:text-[2rem]">
                  Change country
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5"
                  aria-label="Close country picker"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-[#f5ece3] px-6 py-7 sm:px-7 sm:py-8">
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.2em] text-[#5d5f66]">
                  Pick a country
                </p>

                <div className="relative mx-auto mt-4 max-w-[980px]">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen((current) => !current)}
                    className="flex h-[72px] w-full items-center justify-between rounded-[12px] border border-[#f0e6dc] bg-white px-6 text-left text-[0.98rem] text-[#9098a8] shadow-[0_2px_0_rgba(17,24,39,0.03)] transition-shadow hover:shadow-[0_6px_18px_rgba(17,24,39,0.04)] sm:px-7 sm:text-[1.05rem]"
                  >
                    <span>{country}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-[#b2b8c3] transition-transform",
                        isCountryDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isCountryDropdownOpen ? (
                    <div className="mt-3 overflow-hidden rounded-[12px] bg-white shadow-[0_26px_70px_rgba(0,0,0,0.18)]">
                      {countryOptions.map((option, index) => {
                        const isSelected = option === country;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              handleCountrySelect(option);
                              setIsCountryDropdownOpen(false);
                            }}
                            className={cn(
                              "block w-full px-6 py-4 text-left text-[1rem] font-medium transition-colors sm:px-7 sm:py-5 sm:text-[1.1rem]",
                              index === 0 ? "bg-[#f6eee7]" : "bg-white",
                              isSelected ? "text-[#4d525c]" : "text-[#4d525c] hover:bg-[#faf6f1]"
                            )}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ChoiceCard({
  title,
  icon,
  selected,
  onClick,
  className,
  compact,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[142px] flex-1 flex-col items-center justify-center rounded-[3px] border bg-white px-4 py-6 text-center transition-all",
        selected
          ? "border-[#5c6473] shadow-[inset_0_0_0_1px_rgba(16,24,40,0.08)]"
          : "border-transparent hover:border-[#d5d9df]",
        compact && "min-h-[126px] py-5",
        className
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-[#e7ebef] text-[#384152]",
          compact ? "mb-3 h-12 w-12" : "mb-4 h-14 w-14"
        )}
      >
        {icon}
      </span>
      <span className="max-w-[10ch] text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-[#667085]">
        {title}
      </span>
    </button>
  );
}

export function DetailRow({
  title,
  icon,
  isPrimary = false,
  actionLabel,
  actionIcon,
}: {
  title: string;
  icon: ReactNode;
  isPrimary?: boolean;
  actionLabel?: string;
  actionIcon?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-[8px] px-4 py-4 sm:px-5",
        isPrimary ? "bg-[#d8e0e1]" : "bg-white"
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dde1e5] text-[#4b5668]">
          {icon}
        </span>
        <span className="text-[1.05rem] leading-tight tracking-[-0.02em] text-[#5b6271]">{title}</span>
      </div>
      {actionLabel ? (
        <div className="flex items-center gap-2 text-[0.96rem] text-[#5b6271]">
          {actionIcon ? <span className="text-[#ff4d4d]">{actionIcon}</span> : null}
          <span>{actionLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

export function AddRow({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[8px] bg-white px-4 py-4 text-left transition-colors hover:bg-[#faf8f5]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dde1e5] text-[#162030]">
        {icon}
      </span>
      <span className="text-[1.05rem] tracking-[-0.02em] text-[#5b6271]">{label}</span>
    </button>
  );
}

export function DeleteIcon() {
  return <Trash2 className="h-4 w-4" />;
}

export function AddIcon() {
  return <Plus className="h-4 w-4" />;
}