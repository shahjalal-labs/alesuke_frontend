import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  Circle,
  CircleDot,
  Heart,
  MessageCircle,
  PawPrint,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";

import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

type StepState = 1 | 2;

function getProgressClasses(step: StepState) {
  if (step === 1) {
    return ["bg-[#182231]", "bg-[#d7dde4]"];
  }

  return ["bg-[#58c7e7]", "bg-[#182231]"];
}

export function ExecutorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#181512]">
      <header className="border-b border-[#ece2d6] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between">
          <Link href="/will" className="inline-flex items-center">
            <Image src={logo} alt="Will & Way" className="h-auto w-[96px] md:w-[138px]" priority />
          </Link>

          <Link
            href="/will"
            className="rounded-[3px] border border-[#d9cec1] bg-transparent px-4 py-2 text-[0.9rem] text-[#1d1b18] transition-colors hover:bg-[#f3e7db]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-5 pb-24 pt-10 md:px-8 md:pt-14">{children}</main>

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

export function StepHeader({ step, label }: { step: StepState; label: string }) {
  const [firstTrack, secondTrack] = getProgressClasses(step);

  return (
    <section>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-6 items-center rounded-full bg-[#172031] px-3 text-[0.62rem] font-semibold tracking-[0.08em] text-white">
          STEP {String(step).padStart(2, "0")}
        </span>
        <span className="text-[0.88rem] font-medium text-[#3d4554]">{label}</span>
      </div>

      <div className="mt-3 flex gap-2">
        <span className={cn("h-1.5 flex-1 rounded-full", firstTrack)} />
        <span className={cn("h-1.5 flex-1 rounded-full", secondTrack)} />
      </div>
    </section>
  );
}

export function PageTitle({ title }: { title: string }) {
  return <h1 className="text-[2.25rem] leading-[1.02] tracking-[-0.03em] text-[#131010] md:text-[3.55rem]">{title}</h1>;
}

export function IntroHeading({ children }: { children: ReactNode }) {
  return <p className="text-[1.08rem] font-medium leading-[1.45] text-[#141312] md:text-[1.12rem]">{children}</p>;
}

export function BodyCopy({ children }: { children: ReactNode }) {
  return <p className="text-[0.98rem] leading-[1.62] text-[#727a89] md:text-[1.02rem]">{children}</p>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[0.98rem] font-medium text-[#161412] md:text-[1.02rem]">{children}</p>;
}

export function TipCallout({ title = "Tip", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border-l-2 border-[#91dff3] pl-4 text-[#738095]">
      <div className="mb-1 inline-flex items-center gap-2 text-[0.92rem] font-medium text-[#5dc7e9]">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#91dff3] text-[0.68rem]">
          i
        </span>
        {title}
      </div>
      <p className="max-w-[560px] text-[0.95rem] leading-[1.55] text-[#667388] md:text-[1rem]">{children}</p>
    </div>
  );
}

export function CheckBulletList({ items }: { items: string[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#5dbce5] text-white">
            <Check className="h-3 w-3 stroke-[3]" />
          </span>
          <p className="max-w-[590px] text-[0.95rem] leading-[1.55] text-[#505863] md:text-[1rem]">{item}</p>
        </div>
      ))}
    </div>
  );
}

export function FlowPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-[6px] bg-[#f4ebdf] p-4 md:p-6", className)}>{children}</section>;
}

export function ChoiceCard({
  icon,
  title,
  subtitle,
  selected,
  tone = "neutral",
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  tone?: "neutral" | "danger" | "accent";
}) {
  const toneClass =
    tone === "danger"
      ? "text-[#ff2c2c]"
      : tone === "accent"
        ? "text-[#202f46]"
        : "text-[#344258]";

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-[10px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-transform hover:-translate-y-0.5",
        selected && "ring-1 ring-[#e7dccf]"
      )}
    >
      <span className="flex items-center gap-3">
        <span className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ecef]", toneClass)}>{icon}</span>
        <span className="min-w-0">
          <span className="block truncate text-[1.02rem] font-medium leading-[1.2] text-[#616c7e] md:text-[1.2rem]">{title}</span>
          {subtitle ? <span className="mt-1 block text-[0.82rem] leading-[1.35] text-[#7e8796] md:text-[0.92rem]">{subtitle}</span> : null}
        </span>
      </span>

      {tone === "danger" ? (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f2f4] text-[#ff2c2c]">
          <Trash2 className="h-4.5 w-4.5" />
        </span>
      ) : null}
    </button>
  );
}

export function SelectRow({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-4 rounded-[10px] bg-[#bed5e3] px-4 py-4 text-left text-[#66758b] md:px-5"
    >
      <span className="text-[1rem] font-medium italic text-[#66758b] md:text-[1.15rem]">{label}</span>
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#909caf] text-white">
        <ChevronDown className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

export function BackupSelectorRow({
  label,
  value,
  isOpen,
  onClick,
}: {
  label: string;
  value?: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-[10px] bg-[#bed5e3] px-4 py-4 text-left text-[#66758b] transition-colors hover:bg-[#b7d0df] md:px-5"
    >
      <span className="min-w-0 text-left text-[1rem] font-medium italic text-[#66758b] md:text-[1.15rem]">
        {value ?? label}
      </span>
      <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#909caf] text-white">
        {isOpen ? <CircleDot className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

export function ExecutorActionRow({
  icon,
  text,
  tone = "neutral",
  onClick,
}: {
  icon: ReactNode;
  text: string;
  tone?: "neutral" | "danger";
  onClick?: () => void;
}) {
  const isDanger = tone === "danger";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-[10px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-transform hover:-translate-y-0.5 md:px-5",
        isDanger ? "text-[#ff2c2c]" : "text-[#616c7e]"
      )}
    >
      <span className={cn("flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e9ecef]", isDanger ? "text-[#ff2c2c]" : "text-[#2b3448]")}>{icon}</span>
      <span className="min-w-0 flex-1 text-[1rem] font-medium leading-[1.25] md:text-[1.08rem]">{text}</span>
    </button>
  );
}

export function ExecutorPersonRow({
  icon,
  name,
  badge,
  action,
  selected,
  onClick,
}: {
  icon: ReactNode;
  name: string;
  badge?: string;
  action?: "remove";
  selected?: boolean;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-transform md:px-5",
        onClick ? "hover:-translate-y-0.5" : "",
        selected ? "ring-1 ring-[#d7c9ba]" : ""
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e9ecef] text-[#2b3448]">{icon}</span>
        <div className="min-w-0">
          <p className="truncate text-[1rem] font-medium leading-[1.2] text-[#616c7e] md:text-[1.08rem]">{name}</p>
          {badge ? <p className="mt-0.5 text-[0.82rem] leading-[1.25] text-[#8a92a0] md:text-[0.88rem]">{badge}</p> : null}
        </div>
      </div>

      {action === "remove" ? (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f2f4] text-[#ff2c2c]">
          <Trash2 className="h-4.5 w-4.5" />
        </span>
      ) : onClick ? (
        <span className={cn("inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border", selected ? "border-[#192233] bg-[#192233]" : "border-[#9ca6b5] bg-white")}> 
          {selected ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
        </span>
      ) : null}
    </Wrapper>
  );
}

export function FooterActions({
  previousHref,
  previousLabel,
  primaryLabel,
  primaryHref,
  primaryOnClick,
  primaryDisabled = false,
}: {
  previousHref: string;
  previousLabel: string;
  primaryLabel: string;
  primaryHref: string;
  primaryOnClick?: () => void;
  primaryDisabled?: boolean;
}) {
  return (
    <section className="mt-10 border-t border-[#dfd5cb] pt-5">
      <div className="flex items-center justify-between gap-4">
        <Link href={previousHref} className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6676] transition-colors hover:text-[#1d2532]">
          <ArrowLeft className="h-4 w-4" />
          {previousLabel}
        </Link>

        {primaryOnClick ? (
          <button
            type="button"
            onClick={primaryOnClick}
            disabled={primaryDisabled}
            className="inline-flex min-w-[112px] items-center justify-center rounded-[3px] bg-[#172031] px-5 py-2.5 text-[0.92rem] font-medium text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {primaryLabel}
          </button>
        ) : (
          <Link
            href={primaryHref}
            className="inline-flex min-w-[112px] items-center justify-center rounded-[3px] bg-[#172031] px-5 py-2.5 text-[0.92rem] font-medium text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)] transition-transform hover:-translate-y-0.5"
          >
            {primaryLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

export function CircleIcon({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ecef] text-[#2b3448]">{children}</span>;
}

export function HeartIcon() {
  return <Heart className="h-4.5 w-4.5 fill-current" />;
}

export function PersonIcon() {
  return <UserRound className="h-4.5 w-4.5" />;
}

export function PawIcon() {
  return <PawPrint className="h-4.5 w-4.5" />;
}

export function FamilyIcon() {
  return <UsersRound className="h-4.5 w-4.5" />;
}
