"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  BadgeCheck,
  CalendarDays,
  Package,
  Users,
  FileText,
  Home,
  LucideIcon,
  Check,
  Sparkles,
  Infinity,
} from "lucide-react";

import logo from "@/assets/logo.png";
import checkIcon from "@/assets/check.png";
import centerCImage from "@/assets/CloseUPenPaper.png";
import bookIcon from "@/assets/book.png";
import {
  useCheckoutEssentialWillMutation,
  useCheckoutUnlimitedWillMutation,
} from "@/redux/api/checkoutApi";
import { useGetMeDataQuery } from "@/redux/api/authApi";

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-white/80 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(17,24,39,0.05)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef0f5] text-[#202734]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[0.92rem] font-semibold text-[#1a1f27]">{title}</p>
        <p className="text-[0.82rem] text-[#6e7480]">{subtitle}</p>
      </div>
    </div>
  );
}

function DocumentRow({
  title,
  icon: Icon,
  description,
}: {
  title: string;
  icon: LucideIcon;
  description?: string;
}) {
  return (
    <div className="border-b border-[#ece7df] px-4 py-4 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0f5] text-[#2b3140]">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[0.92rem] font-semibold text-[#171b22]">
              {title}
            </p>
            {description ? (
              <p className="mt-1 text-[0.8rem] leading-[1.4] text-[#7a8190]">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-[#6f7784]" />
      </div>
    </div>
  );
}

function CheckIcon() {
  return <Image src={checkIcon} alt="Check" className="h-5 w-5" />;
}

const essentialFeatures = [
  "Comprehensive last will and final intentions",
  "Time & Value. Get your will in 15 mins that traditional firms provide in 15 days",
  "Final intentions – you last words of love",
  "Zero-access Legacy vault to revise your will. (Strictly confidential including us)",
  "30 days unlimited revisions",
  "Digital Asset Memorandum — your digital life doesn't end after you pass on. Netflix, Grab, iCloud etc. Our will authorizes your executor/administrator to act and close your accounts.",
];

const unlimitedFeatures = [
  "Comprehensive last will and final intentions",
  "Time & Value. Get your will in 15 mins that traditional firms provide in 15 days",
  "Final intentions – you last words of love",
  "Zero-access Legacy vault to revise your will. (Strictly confidential including us)",
  "Unlimited revision for life",
  "Digital Asset Memorandum — your digital life doesn't end after you pass on. Netflix, Grab, iCloud etc. Our will authorizes your executor/administrator to act and close your accounts.",
];

function CheckOut() {
  const [activeTab, setActiveTab] = useState<"essential" | "unlimited">(
    "essential",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutEssentialWill, { isLoading: isEssentialLoading }] =
    useCheckoutEssentialWillMutation();
  const [checkoutUnlimitedWill, { isLoading: isUnlimitedLoading }] =
    useCheckoutUnlimitedWillMutation();
  const { data: getMeData } = useGetMeDataQuery({});
  const userData = getMeData?.data;
  const fullName = userData?.fullName || "";

  const isLoading =
    activeTab === "essential" ? isEssentialLoading : isUnlimitedLoading;
  const checkoutPayload = {
    successUrl: "https://will-way.smtsigma.com/will/checkout/success",
    cancelUrl: "https://will-way.smtsigma.com/will/checkout/cancel",
  };

  const handleCheckout = async () => {
    setErrorMessage(null);

    try {
      const response =
        activeTab === "essential"
          ? await checkoutEssentialWill(checkoutPayload).unwrap()
          : await checkoutUnlimitedWill(checkoutPayload).unwrap();

      const checkoutUrl = response?.data?.checkoutUrl ?? response?.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      setErrorMessage(
        "Checkout session could not be created. Please try again.",
      );
    } catch (error) {
      const apiError = error as {
        data?: {
          message?: string;
          errorMessages?: Array<{ path?: string; message?: string }>;
        };
      };

      const backendMessage =
        apiError?.data?.message ??
        apiError?.data?.errorMessages?.[0]?.message ??
        "Payment could not be processed. Please try again.";

      setErrorMessage(backendMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#111827]">
      <header className="border-b border-[#f0e6dd] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src={logo}
              alt="Will & Way"
              className="h-auto w-[96px] md:w-[138px]"
              priority
            />
          </Link>

          <Link
            href="/will/preview"
            className="rounded-[3px] border border-[#d8cec1] bg-transparent px-4 py-2 text-[0.9rem] font-medium text-[#1d1b18] transition-colors hover:bg-[#f3e9de]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-4 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section className="space-y-6">
            <Link
              href="/will/preview"
              className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-[#1f2733] hover:opacity-80"
            >
              <span className="text-[1.1rem]">←</span>
              Back to will review
            </Link>

            <SectionHeader
              icon={CalendarDays}
              title={`${fullName || "Your"}’s Estate Plan`}
              subtitle="Everything you need for the future"
            />

            <div className="rounded-[16px] border border-white/80 bg-white shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
              <div className="border-b border-[#ece7df] px-4 py-4">
                <p className="text-[1.05rem] font-semibold text-[#1a1f27]">
                  Documents included
                </p>
              </div>

              <DocumentRow
                title="Easy to follow instructions"
                icon={FileText}
                description="Step by step document to help you make your will legally valid."
              />
              <DocumentRow title="Last will & testament" icon={ShieldCheck} />
              <DocumentRow title="Guardianship arrangements" icon={Users} />
              <DocumentRow title="Schedule of assets" icon={Package} />
            </div>

            <div className="rounded-[16px] border border-white/80 bg-white shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
              <div className="border-b border-[#ece7df] px-4 py-4">
                <DocumentRow
                  title="Easily update anytime"
                  icon={HelpCircle}
                  description="Make secure changes online, print, and sign with neutral witnesses to legalise your will anytime."
                />
              </div>
              <div className="border-b border-[#ece7df] px-4 py-4">
                <DocumentRow
                  title="Legally valid in Singapore"
                  icon={BadgeCheck}
                  description="Fully valid after signing with two neutral witnesses. Professional will review included with every purchase."
                />
              </div>
              <div className="px-4 py-4">
                <DocumentRow
                  title="Global coverage"
                  icon={Home}
                  description="Made in Singapore, to cover assets locally and abroad, especially for common law countries."
                />
              </div>
            </div>
          </section>

          <aside>
            <div className="rounded-[16px] border border-white/80 bg-[#f8efe5] p-4 shadow-[0_12px_30px_rgba(17,24,39,0.06)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#20242d]">
                Choose Your Plan
              </p>

              {/* Tab Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("essential")}
                  className={`flex flex-1 items-center justify-between rounded-[6px] px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.08em] transition-colors ${
                    activeTab === "essential"
                      ? "bg-[#2ea0ff] text-white"
                      : "bg-[#cfe0ed] text-[#1d2430]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    Essential Will
                    {activeTab === "essential" && (
                      <Sparkles className="h-3 w-3" />
                    )}
                  </span>
                  {activeTab === "essential" ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-[#1d2430]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("unlimited")}
                  className={`flex flex-1 items-center justify-between rounded-[6px] px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.08em] transition-colors ${
                    activeTab === "unlimited"
                      ? "bg-[#2ea0ff] text-white"
                      : "bg-[#cfe0ed] text-[#1d2430]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    Unlimited Legacy
                    {activeTab === "unlimited" && (
                      <Infinity className="h-3 w-3" />
                    )}
                  </span>
                  {activeTab === "unlimited" ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-[#1d2430]" />
                  )}
                </button>
              </div>

              {/* Essential Will Content */}
              {activeTab === "essential" && (
                <div className="mt-5 rounded-[12px] border border-[#e6ddd2] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
                  <div className="">
                    <p className="text-[25px] font-semibold text-[#1d1f26] pb-4">
                      Essential Will
                    </p>
                    <p className="text-[0.95rem] font-semibold text-[#1d1f26]">
                      <span className="text-[64px] font-bold">$88</span>
                    </p>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {essentialFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckIcon />
                        <span className="text-[0.85rem] leading-[1.45] text-[#4a525f]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-[0.78rem] leading-[1.5] text-[#687080]">
                    After purchasing, you'll be able to download your will. All
                    transactions are secured and encrypted by Stripe.
                  </p>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="mt-5 w-full rounded-[2px] bg-gradient-to-r from-[#151d2d] to-[#0d1320] px-6 py-3 text-[0.98rem] font-semibold text-white shadow-[0_10px_22px_rgba(18,24,38,0.18)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Redirecting..." : "Checkout"}
                  </button>
                </div>
              )}

              {/* Unlimited Legacy Content */}
              {activeTab === "unlimited" && (
                <div className="mt-5 rounded-[12px] border border-[#e6ddd2] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
                  <div className="relative">
                    <div className="absolute -top-2 right-0">
                      <span className="inline-block rounded-full bg-gradient-to-r from-[#081220] to-[#1D2736] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
                        OPTIONAL
                      </span>
                    </div>
                  </div>

                  <div className="pb-4">
                    <div>
                      <p className="text-[25px] font-semibold text-[#1d1f26]">
                        Unlimited Legacy
                      </p>
                      {/* <span className="inline-flex items-center gap-1 text-[0.7rem] text-[#2ea0ff]">
                        <Infinity className="h-3 w-3" />
                        Unlimited updates
                      </span> */}
                    </div>
                    <p className="text-[0.95rem] font-semibold text-[#1d1f26]">
                      <span className="text-[64px] font-bold">$88</span> one
                      time fee + <span className="font-bold">$2</span>/mth
                      (billed annually)
                    </p>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {unlimitedFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckIcon />
                        {feature === "Unlimited revision for life" ? (
                          <span className="text-[0.95rem] font-bold leading-[1.45] text-[#4a525f]">
                            {feature}
                          </span>
                        ) : (
                          <span className="text-[0.85rem] leading-[1.45] text-[#4a525f]">
                            {feature}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-[0.78rem] leading-[1.5] text-[#687080]">
                    First year includes one-time fee + annual subscription.
                    Cancel anytime.
                  </p>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="mt-5 w-full rounded-[2px] bg-gradient-to-r from-[#151d2d] to-[#0d1320] px-6 py-3 text-[0.98rem] font-semibold text-white shadow-[0_10px_22px_rgba(18,24,38,0.18)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Redirecting..." : "Subscribe Now"}
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.85rem] text-red-600">
                  {errorMessage}
                </div>
              )}

              <p className="mt-4 text-center text-[0.7rem] text-[#687080]">
                All transactions are secured and encrypted by Stripe
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CheckOut;
