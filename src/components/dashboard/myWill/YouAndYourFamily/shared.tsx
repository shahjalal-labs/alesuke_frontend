import { Heart, PencilLine, Trash2, UserRound, UsersRound, PawPrint } from "lucide-react";

type OptionCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon?: "single" | "married" | "relationship" | "yes" | "no";
  layout?: "column" | "row";
};

type DetailItemProps = {
  label: string;
  action?: "delete" | "edit";
  actionText?: string;
};

function OptionIcon({ icon }: { icon?: OptionCardProps["icon"] }) {
  if (icon === "married") return <UsersRound className="h-5 w-5" />;
  if (icon === "relationship") return <UsersRound className="h-5 w-5" />;
  if (icon === "yes") return <span className="text-[1.1rem]">✓</span>;
  if (icon === "no") return <span className="text-[1.1rem]">×</span>;
  return <UserRound className="h-5 w-5" />;
}

export function OptionCard({ label, selected, onClick, disabled = false, icon, layout = "column" }: OptionCardProps) {
  const isRowLayout = layout === "row";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[112px] flex-1 flex-col items-center justify-center rounded-[4px] bg-[#f4f5f7] px-4 py-6 text-center transition-all md:min-h-[112px] ${
        selected ? "border-2 border-[#2e3b4f]" : "border border-transparent"
      } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
    >
      {isRowLayout ? (
        <div className="flex w-full items-center gap-4 text-left">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#dde0e4] text-[#525a67] md:h-14 md:w-14">
            <OptionIcon icon={icon} />
          </span>
          <span className="text-[1.5rem] font-semibold leading-[1.12] text-[#616a79] md:text-[1.8rem]">{label}</span>
        </div>
      ) : (
        <>
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#525a67] md:h-16 md:w-16">
            <OptionIcon icon={icon} />
          </span>
          <span className="text-[1.7rem] font-semibold leading-[1.15] text-[#616a79] md:text-[2rem]">{label}</span>
        </>
      )}
    </button>
  );
}

export function OptionGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[8px] bg-[#eee7de] p-4 md:p-6 ${className}`}>
      <div className="grid grid-cols-1 gap-3 md:[grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] md:gap-4">{children}</div>
    </div>
  );
}

function DetailLeadingIcon() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#525a67] md:h-14 md:w-14">
      <UserRound className="h-4 w-4 md:h-5 md:w-5" />
    </span>
  );
}

export function DetailItem({ label, action, actionText }: DetailItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f4f5f7] px-4 py-4 md:px-5 md:py-5">
      <div className="flex items-center gap-3">
        <DetailLeadingIcon />
        <span className="text-[1.1rem] font-semibold text-[#616a79] md:text-[1.9rem]">{label}</span>
      </div>

      {action === "delete" ? (
        <button type="button" className="text-[#ff2f2f]">
          <Trash2 className="h-5 w-5" />
        </button>
      ) : action === "edit" ? (
        <button type="button" className="text-[#223048]">
          <PencilLine className="h-5 w-5" />
        </button>
      ) : actionText ? (
        <span className="text-[0.95rem] font-medium text-[#616a79]">{actionText}</span>
      ) : null}
    </div>
  );
}

export function AddItemRow({ label, subLabel, pet = false, onClick }: { label: string; subLabel?: string; pet?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-[8px] bg-[#f4f5f7] px-4 py-4 text-left md:px-5 md:py-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#152035] md:h-14 md:w-14">
        {pet ? <PawPrint className="h-4 w-4 md:h-5 md:w-5" /> : <Heart className="h-4 w-4 md:h-5 md:w-5" />}
      </span>
      <span>
        <span className="block text-[1.1rem] font-semibold text-[#616a79] md:text-[1.9rem]">{label}</span>
        {subLabel ? <span className="block text-[0.9rem] text-[#6f7786] md:text-[1rem]">{subLabel}</span> : null}
      </span>
    </button>
  );
}

export function RemoveActionRow({ text }: { text: string }) {
  return (
    <button type="button" className="flex w-full items-center gap-3 rounded-[8px] bg-[#f4f5f7] px-4 py-4 text-left md:px-5 md:py-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#ff2f2f] md:h-14 md:w-14">
        <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
      </span>
      <span className="text-[1.05rem] font-semibold text-[#616a79] md:text-[1.6rem]">{text}</span>
    </button>
  );
}

export function MemberRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f4f5f7] px-4 py-4 md:px-5 md:py-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[#dde0e4] md:h-14 md:w-14" />
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded-full bg-[#dde0e4] md:h-5 md:w-48" />
          <div className="h-3 w-24 animate-pulse rounded-full bg-[#e3e7ec] md:w-32" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[#dde0e4]" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-[#dde0e4]" />
      </div>
    </div>
  );
}

export function MemberListSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <MemberRowSkeleton key={index} />
      ))}
    </div>
  );
}
