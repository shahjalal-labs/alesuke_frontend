import type { ReactNode } from "react";
import Link from "next/link";

export default function WillSectionCard({
  title,
  time,
  description,
  statusLabel,
  statusClassName,
  buttonLabel,
  buttonHref,
  secondaryLabel,
  withPrimaryButton = false,
  dashed = false,
  children,
  footerContent,
}: {
  title: string;
  time: string;
  description: string;
  statusLabel?: string;
  statusClassName?: string;
  buttonLabel?: string;
  buttonHref?: string;
  secondaryLabel?: string;
  withPrimaryButton?: boolean;
  dashed?: boolean;
  children?: ReactNode;
  footerContent?: ReactNode;
}) {
  return (
    <section
      className={
        "rounded-[3px] bg-[#F6ECE2] p-4 sm:p-5 " +
        (dashed ? "border border-dashed border-[#dfcfbf]" : "")
      }
    >
      <div className="mb-3 flex items-start justify-between gap-4 px-2">
        <h2 className="text-[1.05rem] font-medium text-[#2b221a] sm:text-[1.1rem]">{title}</h2>
        <div className="flex items-center gap-3 text-[0.95rem] text-[#2f241c]">
          <div>Takes about {time}</div>
          {statusLabel ? <div className={statusClassName ?? "text-[#52c41a]"}>{statusLabel}</div> : null}
        </div>
      </div>

      <div className="rounded-[2px] bg-white px-4 py-3 sm:px-5 sm:py-4">
        <p className="text-[0.95rem] leading-[1.45] text-[#2b221a] sm:text-[1rem]">{description}</p>
        <div className="my-4 border-t border-[#ece8e2]" />

        {children ? <div>{children}</div> : null}

        {footerContent ? <div>{footerContent}</div> : null}

        {!children && !footerContent && buttonLabel ? (
          <div className="flex flex-wrap gap-3">
            {withPrimaryButton ? (
              <Link
                href={buttonHref ?? "#"}
                className="inline-flex items-center rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
              >
                {buttonLabel}
              </Link>
            ) : null}

            {secondaryLabel ? (
              <button className="inline-flex items-center rounded-[3px] border border-[#cbbdaa] bg-white px-4 py-3 text-[0.95rem] text-[#2b221a]">
                {secondaryLabel}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
