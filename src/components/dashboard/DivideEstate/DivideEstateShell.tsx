"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BookOpenText,
  Check,
  //   ChevronDown,
  CircleCheck,
  Heart,
  MessageCircle,
  Megaphone,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

type DivideEstateShellProps = {
  children: ReactNode;
  mainClassName?: string;
};

type FooterActionsProps = {
  previousHref: string;
  previousLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
};

type OptionCardProps = {
  label: string;
  selected?: boolean;
  checked?: boolean;
  onClick?: () => void;
  href?: string;
};

type EntityRowProps = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  action?: "remove";
  trailing?: ReactNode;
  onClick?: () => void;
};

export function DivideEstateShell({
  children,
  mainClassName,
}: DivideEstateShellProps) {
  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#171612]">
      <header className="border-b border-[#ece2d7] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4">
          <Link href="/will" className="inline-flex items-center">
            <Image
              src={logo}
              alt="Will & Way"
              className="h-auto w-[96px] md:w-[138px]"
              priority
            />
          </Link>

          <Link
            href="/will"
            className="rounded-[3px] border border-[#d9cec1] bg-transparent px-4 py-2 text-[0.9rem] text-[#1d1b18] transition-colors hover:bg-[#f2e7db]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main
        className={cn(
          "mx-auto w-full max-w-[760px] px-5 pb-24 pt-10 md:px-8 md:pt-14",
          mainClassName,
        )}
      >
        {children}
      </main>

      <button
        type="button"
        className="fixed bottom-5 right-5 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#172031] text-white shadow-[0_16px_30px_rgba(22,32,49,0.26)] transition-transform hover:scale-105"
        aria-label="Open support chat"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.82rem] text-[#45413c] md:text-[0.9rem]">{children}</p>
  );
}

export function FlowTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-[#12100e] md:text-[3.45rem]">
      {children}
    </h1>
  );
}

export function FlowLead({ children }: { children: ReactNode }) {
  return (
    <p className="text-[1rem] leading-[1.55] text-[#12100e] md:text-[1.08rem]">
      {children}
    </p>
  );
}

export function BodyCopy({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[0.96rem] leading-[1.55] text-[#727b8b] md:text-[1rem]",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function TipCallout({
  children,
  title = "Tip",
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="border-l-2 border-[#90d8ef] pl-4 text-[#738095]">
      <div className="mb-2 inline-flex items-center gap-2 text-[0.92rem] font-medium text-[#55c4e9]">
        <Megaphone className="h-4 w-4" />
        {title}
      </div>
      <div className="space-y-3 text-[0.95rem] leading-[1.6] text-[#677182] md:text-[1rem]">
        {children}
      </div>
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[6px] bg-[#f2e5d8] p-4 md:p-6", className)}>
      {children}
    </section>
  );
}

export function NoteCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-4 py-4 text-[0.86rem] leading-[1.45] text-[#7b8594]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FooterActions({
  previousHref,
  previousLabel = "Previous Step",
  nextHref,
  nextLabel = "Save & Continue",
  onNext,
  nextDisabled = false,
}: FooterActionsProps) {
  return (
    <footer className="mt-10 border-t border-[#e6ddd3] pt-5">
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={previousHref}
          className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]"
        >
          <ArrowLeft className="h-4 w-4" />
          {previousLabel}
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
            disabled={nextDisabled}
            className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </footer>
  );
}

export function OptionCard({
  label,
  selected = false,
  checked = false,
  onClick,
  href,
}: OptionCardProps) {
  const className = cn(
    "flex min-h-[146px] flex-1 flex-col items-center justify-center rounded-[4px] bg-white px-4 py-6 text-center transition-shadow",
    selected
      ? "ring-1 ring-[#1b2232] shadow-[0_8px_24px_rgba(17,24,39,0.08)]"
      : "shadow-[0_1px_0_rgba(17,24,39,0.02)]",
  );

  const content = (
    <>
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">
        {checked ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </span>
      <span className="text-[1.02rem] leading-[1.15] text-[#677182] md:text-[1.16rem]">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-pressed={selected}
    >
      {content}
    </button>
  );
}

export function DualChoicePanel({
  leftLabel,
  rightLabel,
  leftHref,
  rightHref,
  leftOnClick,
  rightOnClick,
  activeChoice = null,
}: {
  leftLabel: string;
  rightLabel: string;
  leftHref?: string;
  rightHref?: string;
  leftOnClick?: () => void;
  rightOnClick?: () => void;
  activeChoice?: "left" | "right" | null;
}) {
  return (
    <Panel>
      <div className="grid gap-4 sm:grid-cols-2">
        <OptionCard
          label={leftLabel}
          selected={activeChoice === "left"}
          onClick={leftOnClick}
          href={leftHref}
        />
        <OptionCard
          label={rightLabel}
          selected={activeChoice === "right"}
          checked
          onClick={rightOnClick}
          href={rightHref}
        />
      </div>
    </Panel>
  );
}

export function IncludedExcludedList({
  included,
  excluded,
}: {
  included: string[];
  excluded: string[];
}) {
  const rows = [
    {
      title: "Included In the Will",
      items: included,
      tone: "included" as const,
    },
    {
      title: "Excluded (Handled Seperately)",
      items: excluded,
      tone: "excluded" as const,
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      {rows.map((column) => (
        <div key={column.title}>
          <h2 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">
            {column.title}
          </h2>
          <div className="mt-5 space-y-4 md:mt-6">
            {column.items.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-[0.96rem] leading-[1.45] text-[#616b7b] md:text-[1rem]"
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-white",
                    column.tone === "included"
                      ? "bg-[#58b7e6]"
                      : "bg-[#f6a2a0]",
                  )}
                >
                  {column.tone === "included" ? (
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  ) : (
                    <X className="h-3.5 w-3.5 stroke-[3]" />
                  )}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function InfoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[10px] bg-white px-4 py-4 text-[0.86rem] leading-[1.45] text-[#7b8594] shadow-[0_1px_0_rgba(17,24,39,0.02)] md:px-5 md:py-5">
      {children}
    </div>
  );
}

export function PersonRow({
  icon = <UserRound className="h-4.5 w-4.5" />,
  title,
  subtitle,
  selected = false,
  action,
  trailing,
  onClick,
}: EntityRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-[10px] border px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-transform hover:-translate-y-0.5 md:px-5",
        selected
          ? "border-[#25b6e8] bg-[#d9f3fb] shadow-[0_10px_24px_rgba(37,182,232,0.14)]"
          : "border-[#d5dde6] bg-white",
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e8ebef] text-[#293246]">
          {icon}
        </span>
        <span className="min-w-0 text-left">
          <span className="block truncate text-[1.02rem] font-medium leading-[1.2] text-[#657081] md:text-[1.18rem]">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-1 block text-[0.84rem] leading-[1.35] text-[#7e8796] md:text-[0.92rem]">
              {subtitle}
            </span>
          ) : null}
        </span>
      </span>

      {selected ? (
        <span
          className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#edf9fd] text-[#22aedd]"
          aria-hidden="true"
        >
          <Check className="h-5 w-5" />
        </span>
      ) : action === "remove" ? (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f2f4] text-[#ff2c2c]">
          <Trash2 className="h-4.5 w-4.5" />
        </span>
      ) : trailing ? (
        trailing
      ) : null}
    </button>
  );
}

export function AddPersonRow({
  title = "Add Person",
  subtitle = "A Family member or friends",
  onClick,
}: {
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <PersonRow
      icon={<UserRound className="h-4.5 w-4.5" />}
      title={title}
      subtitle={subtitle}
      onClick={onClick}
    />
  );
}

export function BeneficiaryRow({
  title,
  selected = false,
  action,
}: {
  title: string;
  selected?: boolean;
  action?: "remove";
}) {
  return (
    <PersonRow
      icon={<UsersRound className="h-4.5 w-4.5" />}
      title={title}
      selected={selected}
      action={action}
    />
  );
}

export function PercentageRow({
  title,
  percent,
  icon = <Heart className="h-4.5 w-4.5 fill-current" />,
  selected = false,
  onClick,
}: {
  title: string;
  percent: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-[10px] border bg-white px-4 py-4 text-left transition-all md:px-5 md:py-5",
        selected
          ? "border-[#25b6e8] shadow-[0_10px_24px_rgba(37,182,232,0.14)]"
          : "border-[#d5dde6]",
      )}
      aria-pressed={selected}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e8ebef] text-[#293246]">
          {icon}
        </span>
        <span className="min-w-0 truncate text-[1rem] font-medium text-[#657081] md:text-[1.18rem]">
          {title}
        </span>
      </span>
      <span className="text-[1rem] font-medium text-[#657081] md:text-[1.12rem]">
        {percent}
      </span>
    </button>
  );
}

export function SuccessSummary({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[320px] rounded-[2px] border border-[#f2c187] bg-[#f5fce8] p-4 md:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#7fcf1d] text-[#7fcf1d]">
          <CircleCheck className="h-5 w-5" />
        </span>
        <div className="space-y-2 text-[#191715]">{children}</div>
      </div>
    </div>
  );
}

export function HelpCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[10px] bg-white px-4 py-4 text-[0.86rem] leading-[1.45] text-[#7b8594] shadow-[0_1px_0_rgba(17,24,39,0.02)] md:px-5 md:py-5">
      {children}
    </div>
  );
}

export function TipButton({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[4px] border border-[#e6e8eb] px-4 py-2 text-[0.82rem] text-[#7b8694]">
      <BookOpenText className="h-4 w-4" />
      {children}
    </span>
  );
}

export function PrimarySummary({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[6px] bg-[#f2e5d8] p-4 md:p-6">
      <InfoBanner>
        <div className="space-y-2">
          <p className="text-[0.86rem] leading-[1.45] text-[#7b8594] md:text-[0.92rem]">
            {title}
          </p>
          <p className="text-[0.86rem] leading-[1.45] text-[#7b8594] md:text-[0.92rem]">
            {description}
          </p>
        </div>
      </InfoBanner>
    </div>
  );
}

export function BackupChoicePanel({ children }: { children: ReactNode }) {
  return <Panel>{children}</Panel>;
}
