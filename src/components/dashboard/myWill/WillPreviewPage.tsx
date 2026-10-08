"use client";

import html2canvas from "html2canvas";
import {
  ChevronDown,
  Download,
  Lock,
  PenLine,
  Shield,
  Users2,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import logo from "@/assets/logo.png";
import { useGetWillDetailsQuery } from "@/redux/api/profileApi";
import DigitalAssetPdfPreview from "./DigitalAssetPdfPreview";

// Add html2pdf dependency
import { useGetMeDataQuery } from "@/redux/api/authApi";

type FamilyMember = {
  id: string;
  fullName?: string | null;
  relationType?: string | null;
  typeOfIdentifier?: string | null;
  identifierValue?: string | null;
  dateOfBirth?: string | null;
  governmentIssuedId?: boolean | null;
  petType?: string | null;
  petDescription?: string | null;
};

type ExecutorRecord = {
  person?: FamilyMember | null;
  backupPerson?: FamilyMember | null;
};

type EstateDistributionRecord = {
  id: string;
  percentage?: number | null;
  distributionType?: string | null;
  person?: FamilyMember | null;
  backupDistributors?: Array<{ person?: FamilyMember | null }>;
};

type GiftRecord = {
  id: string;
  recipientName?: string | null;
  giftType?: string | null;
  amount?: number | null;
  description?: string | null;
  itemName?: string | null;
  personalMessage?: string | null;
  asset?: {
    id?: string;
    type?: string;
    institutionName?: string | null;
    accountNumber?: string | null;
    policyNumber?: string | null;
    approximateValue?: number | null;
    faceValue?: number | null;
    description?: string | null;
  } | null;
  property?: {
    id?: string;
    type?: string;
    streetAddress?: string | null;
    estimatedValue?: number | null;
    country?: string | null;
    postcode?: string | null;
    unitNumber?: string | null;
  } | null;
};

type PetCaretakerRecord = {
  id: string;
  pet?: FamilyMember | null;
  caretaker?: FamilyMember | null;
};

type WillDetailsResponse = {
  user?: {
    name?: string | null;
    nid?: string | null;
  };
  family?: FamilyMember[];
  executors?: ExecutorRecord[];
  estateDistributions?: EstateDistributionRecord[];
  gifts?: GiftRecord[];
  petCaretakers?: PetCaretakerRecord[];
  assets?: {
    financialAssets?: Array<{ id: string }>;
    properties?: Array<{ id: string }>;
    loans?: Array<{ id: string }>;
  };
  summary?: {
    totalFinancial?: number;
    totalProperties?: number;
    totalLoansGiven?: number;
    totalOutstanding?: number;
    netWorth?: number;
  };
};

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#ece8e2] bg-white px-4 py-4">
      <p className="text-[0.78rem] uppercase tracking-[0.12em] text-[#8c8072]">
        {label}
      </p>
      <p className="mt-2 text-[1.1rem] font-medium text-[#2b221a]">{value}</p>
    </div>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="text-inherit font-semibold text-[#c35b43]">
      {children}
    </span>
  );
}

function formatMoney(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return "S$ 0";
  }
  return `S$ ${Number(value).toLocaleString()}`;
}

function formatPercent(value?: number | null) {
  if (value == null || Number.isNaN(Number(value))) {
    return "0%";
  }

  const normalized = Number(value);
  const formatted = Number.isInteger(normalized)
    ? normalized.toString()
    : normalized.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");

  return `${formatted}%`;
}

function AccordionItem({
  icon: Icon,
  title,
  description,
  open,
  onToggle,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full rounded-[10px] border border-transparent px-4 py-3 text-left transition-colors hover:bg-white/60"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#efe7de] text-[#404757]">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.98rem] font-medium text-[#323038]">{title}</p>
            <ChevronDown
              className={`h-4 w-4 text-[#838996] transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
          {open ? (
            <p className="mt-2 text-[0.92rem] leading-[1.45] text-[#6e7480]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function PdfPageFrame({
  pageNumber,
  totalPages,
  title,
  children,
}: {
  pageNumber: number;
  totalPages: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pdf-page-frame relative mx-auto w-full max-w-[720px] rounded-[2px] bg-white px-6 py-4 shadow-[0_18px_40px_rgba(17,24,39,0.08)] ring-1 ring-[#ebdfd2] lg:px-10 lg:py-6">
      <div className="pl-4" style={{ pageBreakInside: "avoid" }}>
        <p className="text-[1.45rem] font-semibold uppercase tracking-[0.04em] text-[#23262e] lg:text-[25px]">
          {title}
        </p>
        {pageNumber === 7 ? "" : <div className="mt-3 h-[2px] bg-[#c35b43]" />}
      </div>

      <div className="mt-4 space-y-4 text-[0.94rem] leading-[1.75] text-[#3f4550]">
        {children}
      </div>

      <div
        className="mt-6 border-t border-dashed border-[#ddd5cb] pt-4 text-[0.82rem] text-[#716c65]"
        style={{ pageBreakInside: "avoid" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="whitespace-nowrap">
            Testator Initials: _______ Witness 1: _______ Witness 2: _______
          </span>
          <span className="whitespace-nowrap">
            Page {pageNumber} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
}

// Helper function to format gift display text
function formatGiftDisplay(gift: GiftRecord): string {
  switch (gift.giftType) {
    case "CASH":
      return formatMoney(gift.amount);
    case "ITEM":
      return gift.itemName || gift.description || "Item";
    case "COLLECTION":
      return gift.itemName || gift.description || "Collection";
    case "PROPERTY":
      if (gift.property) {
        return `${gift.property.type || "Property"} at ${gift.property.streetAddress || "address"}`;
      }
      return gift.description || "Property";
    case "FINANCIAL_ACCOUNT":
      if (gift.asset) {
        const assetType = gift.asset.type?.replace(/_/g, " ").toLowerCase();
        return `${assetType || "Financial account"}`;
      }
      return gift.description || "Financial account";
    default:
      return gift.description || "Gift";
  }
}

// Helper to get gift type display name
function getGiftTypeDisplay(giftType?: string | null): string {
  switch (giftType) {
    case "CASH":
      return "Cash";
    case "ITEM":
      return "Item";
    case "COLLECTION":
      return "Collection";
    case "PROPERTY":
      return "Property";
    case "FINANCIAL_ACCOUNT":
      return "Financial Account";
    default:
      return "Gift";
  }
}

// Helper to get ID/NRIC display (placeholder for now)
function getBeneficiaryId(recipientName?: string | null): string {
  return `(${recipientName?.replace(/\s/g, "").substring(0, 8) || "ID"})`;
}

// Helper function to format relation phrase
function getRelationPhrase(member: FamilyMember): string {
  const rel = member.relationType;
  if (rel === "SPOUSE") return "My legal spouse is ";
  if (rel === "PARTNER") return "My partner is ";
  if (rel === "CHILD") return "My child is ";
  if (rel === "PET") {
    const petType = member.petType || "companion animal";
    return `My pet `;
  }
  return "My family member is ";
}

// Helper function to get pet display name
function getPetDisplayName(member: FamilyMember): string {
  const name = member.fullName || "Unnamed pet";
  const petType = member.petType || "";

  if (petType && name.toLowerCase().includes(petType.toLowerCase())) {
    return name;
  }
  if (petType) {
    return `${name} (${petType})`;
  }
  return name;
}

// Helper to format ID display for family members
function getFamilyMemberIdDisplay(member: FamilyMember): string {
  const hasId = member.governmentIssuedId && member.identifierValue;
  const rawType = member.typeOfIdentifier || "NRIC_OR_FIN";
  let typeLabel = "NRIC";
  if (rawType === "PASSPORT") typeLabel = "Passport";
  else if (rawType === "FOREIGN_ID") typeLabel = "Foreign ID";

  return ` (${typeLabel}: ${hasId ? member.identifierValue : "N/A"})`;
}

// Helper to get identifier type display label
function getIdentifierLabel(typeOfIdentifier?: string | null): string {
  switch (typeOfIdentifier) {
    case "NRIC_OR_FIN":
      return "NRIC/FIN";
    case "PASSPORT":
      return "Passport";
    case "FOREIGN_ID":
      return "Foreign ID";
    default:
      return "ID";
  }
}

// Helper to format Date of Birth
function formatDateOfBirth(dobString?: string | null): string {
  if (!dobString) return "";
  try {
    const date = new Date(dobString);
    if (Number.isNaN(date.getTime())) return "";
    const day = date.getUTCDate();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `, born on ${day} ${month} ${year}`;
  } catch (error) {
    return "";
  }
}

// Helper function to calculate total wealth from gifts
function calculateTotalWealth(gifts: GiftRecord[]): number {
  let total = 0;

  gifts.forEach((gift) => {
    switch (gift.giftType) {
      case "CASH":
        if (gift.amount) {
          total += gift.amount;
        }
        break;
      case "PROPERTY":
        if (gift.property?.estimatedValue) {
          total += gift.property.estimatedValue;
        }
        break;
      case "FINANCIAL_ACCOUNT":
        if (gift.asset) {
          const value =
            gift.asset.approximateValue || gift.asset.faceValue || 0;
          total += value;
        }
        break;
      case "ITEM":
      case "COLLECTION":
        break;
      default:
        break;
    }
  });

  return total;
}

export default function WillPreviewPage() {
  const { data: response, isLoading } = useGetWillDetailsQuery(undefined);
  const dashboard = (response?.data ?? {}) as WillDetailsResponse;
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [activeStep, setActiveStep] = useState<string>("children");
  const { data: getMeData } = useGetMeDataQuery(undefined);
  const userData = getMeData?.data;

  const family = dashboard.family ?? [];
  const executors = dashboard.executors ?? [];
  const estateDistributions = dashboard.estateDistributions ?? [];
  const gifts = dashboard.gifts ?? [];
  const petCaretakers = dashboard.petCaretakers ?? [];
  const financialAssets = dashboard.assets?.financialAssets ?? [];
  const properties = dashboard.assets?.properties ?? [];
  const loans = dashboard.assets?.loans ?? [];

  // Compute full net worth summation: including all financial assets, properties, loans, and gifts
  const totalWealth = (() => {
    let sum = 0;
    financialAssets.forEach((a: any) => {
      sum += (a.approximateValue || a.faceValue || 0);
    });
    properties.forEach((p: any) => {
      sum += (p.estimatedValue || 0);
    });
    loans.forEach((l: any) => {
      if (l.type === "GIVEN") sum += (l.approximateBalance || 0);
      else if (l.type === "OUTSTANDING") sum -= (l.approximateBalance || 0);
    });
    gifts.forEach((g) => {
      if (g.amount && !g.asset && !g.property) {
        sum += g.amount;
      }
    });

    if (dashboard.summary?.netWorth !== undefined && dashboard.summary?.netWorth !== null) {
      return Math.max(dashboard.summary.netWorth, sum);
    }
    return sum > 0 ? sum : calculateTotalWealth(gifts);
  })();

  // Beneficiary count is the number of estate distributions (primary beneficiaries only)
  const beneficiaryCount = estateDistributions.length;

  // Separate gifts by type
  const cashGifts = gifts.filter((g) => g.giftType === "CASH");
  const itemGifts = gifts.filter((g) => g.giftType === "ITEM");
  const collectionGifts = gifts.filter((g) => g.giftType === "COLLECTION");
  const propertyGifts = gifts.filter((g) => g.giftType === "PROPERTY");
  const financialGifts = gifts.filter(
    (g) => g.giftType === "FINANCIAL_ACCOUNT",
  );

  // Get memo text from gifts
  const memoGifts = gifts.filter(
    (gift) => gift.personalMessage || gift.description,
  );

  const userName = dashboard.user?.name ?? userData?.fullName ?? "Your will";
  const userNRIC = dashboard.user?.nid || userData?.nid || "—";

  // Executor details with identifiers
  const primaryExecutor = executors[0]?.person?.fullName ?? "Not selected";
  const primaryExecutorId = executors[0]?.person?.identifierValue ?? "N/A";
  const primaryExecutorIdType =
    executors[0]?.person?.typeOfIdentifier ?? "NRIC_OR_FIN";
  const backupExecutor = executors[0]?.backupPerson?.fullName ?? "Not selected";
  const backupExecutorId = executors[0]?.backupPerson?.identifierValue ?? "N/A";
  const backupExecutorIdType =
    executors[0]?.backupPerson?.typeOfIdentifier ?? "NRIC_OR_FIN";

  const familyNames = family
    .map((member) => member.fullName)
    .filter(Boolean) as string[];
  const firstPetCaretaker =
    petCaretakers[0]?.caretaker?.fullName ?? backupExecutor;
  const firstPetName =
    petCaretakers[0]?.pet?.fullName ?? familyNames[0] ?? "Companion animal";
  const totalPages = 9;

  const handleDownloadPDF = async () => {
    if (!pdfContentRef.current || !isClient) return;

    setIsDownloading(true);

    try {
      // A4 dimensions at 96 dpi: 794 × 1123 px
      const A4_WIDTH_PX = 794;
      const A4_HEIGHT_PX = 1123;
      const SCALE = 2; // retina quality

      const pageElements =
        pdfContentRef.current.querySelectorAll(".pdf-page-frame");
      const pageCount = pageElements.length;

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        unit: "px",
        format: [A4_WIDTH_PX, A4_HEIGHT_PX],
        orientation: "portrait",
      });

      for (let i = 0; i < pageCount; i++) {
        const pageElement = pageElements[i] as HTMLElement;

        // Build a fixed-size A4 wrapper so html2canvas captures exactly one page
        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.left = "-9999px";
        wrapper.style.top = "0px";
        wrapper.style.width = `${A4_WIDTH_PX}px`;
        wrapper.style.height = `${A4_HEIGHT_PX}px`;
        wrapper.style.overflow = "hidden";
        wrapper.style.backgroundColor = "#ffffff";
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";

        // Clone page and size it to fill the A4 wrapper
        const clone = pageElement.cloneNode(true) as HTMLElement;
        clone.style.cssText = [
          "display:flex",
          "flex-direction:column",
          `width:${A4_WIDTH_PX}px`,
          `min-height:${A4_HEIGHT_PX}px`,
          `height:${A4_HEIGHT_PX}px`,
          "padding:36px 48px 28px 48px",
          "box-sizing:border-box",
          "background:#ffffff",
          "box-shadow:none",
          "border-radius:0",
          "border:none",
          "overflow:hidden",
          "margin:0",
          "max-width:unset",
        ].join(";");

        // Remove title left-padding
        const titleDiv = clone.querySelector(".pl-4") as HTMLElement | null;
        if (titleDiv) titleDiv.style.paddingLeft = "0px";

        // Content area: fill available space so footer is pushed to bottom
        const contentDiv = clone.querySelector(
          ".space-y-4",
        ) as HTMLElement | null;
        if (contentDiv) {
          contentDiv.style.flex = "1";
          contentDiv.style.marginTop = "12px";
          contentDiv.style.overflowY = "hidden";
        }

        // Footer: always at the bottom, full width, never hidden
        const footerDiv = clone.querySelector(
          ".border-t.border-dashed",
        ) as HTMLElement | null;
        if (footerDiv) {
          footerDiv.style.marginTop = "auto";
          footerDiv.style.paddingTop = "12px";
          footerDiv.style.flexShrink = "0";
          footerDiv.style.width = "100%";
          footerDiv.style.display = "block";
          footerDiv.style.visibility = "visible";

          // Inner flex row — stretch to full width
          const footerInner = footerDiv.querySelector(
            ".flex",
          ) as HTMLElement | null;
          if (footerInner) {
            footerInner.style.display = "flex";
            footerInner.style.width = "100%";
            footerInner.style.alignItems = "center";
            footerInner.style.justifyContent = "space-between";
            footerInner.style.flexWrap = "nowrap";
          }
        }

        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        try {
          const canvas = await html2canvas(wrapper, {
            scale: SCALE,
            useCORS: true,
            logging: false,
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            backgroundColor: "#ffffff",
            windowWidth: A4_WIDTH_PX,
            windowHeight: A4_HEIGHT_PX,
          });

          if (i > 0) pdf.addPage();

          const imgData = canvas.toDataURL("image/jpeg", 0.97);
          // Fill the entire A4 page — no margins, no scaling ambiguity
          pdf.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);
        } finally {
          document.body.removeChild(wrapper);
        }
      }

      pdf.save(
        `Will_${userName.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const documentPages = useMemo(
    () => [
      // PAGE 1: Instructions & Disclaimer
      {
        pageTitle: "Step-by-Step Instructions",
        pageNumber: 1,
        body: (
          <div className="space-y-4 text-[0.88rem] leading-[1.6] text-[#4a515d]">
            {/* Company Logo */}
            <div className="flex justify-center mb-4">
              <Image
                src={logo}
                alt="Will & Way"
                className="h-auto w-[120px] opacity-80"
                priority
              />
            </div>

            <div>
              <p className="font-semibold text-[#2b221a] text-[0.92rem]">
                1. Print & Review
              </p>
              <ul className="mt-1 list-disc pl-5 space-y-0.5 text-[#4a515d]">
                <li>
                  Please print and read your completed Will carefully. Do not
                  sign the document unless you completely understand and agree
                  with everything written inside it.
                </li>
                <li>
                  If you need to make any corrections or updates, you must make
                  the changes in the system and re-print out a fresh, clean copy
                  of the final version. Never cross out words or make
                  handwritten edits on the printed page.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-[#2b221a] text-[0.92rem]">
                2. The Attestation Ceremony:
              </p>
              <p className="mt-0.5">
                You must sign this Will in the physical presence of two
                independent adult witnesses, minimum aged 21 years old.
              </p>

              <div className="mt-2 space-y-1">
                <p className="font-medium text-[#2b221a] text-[0.88rem]">
                  Who You CAN Choose:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-[#4a515d]">
                  <li>Friends, colleagues, or neighbors (recommended)</li>
                  <li>
                    An Executor only if they do not inherit anything from your
                    Will
                  </li>
                </ul>
              </div>

              <div className="mt-2 space-y-1">
                <p className="font-medium text-[#2b221a] text-[0.88rem]">
                  Who You CANNOT Choose:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-[#4a515d]">
                  <li>Anyone under 21 years old.</li>
                  <li>Your Beneficiaries (anyone inheriting from the Will)</li>
                  <li>The Spouses of your Beneficiaries</li>
                </ul>
              </div>

              <div className="mt-3 rounded-[6px] border border-[#c35b43]/30 bg-[#fdf6f3] px-3 py-2">
                <p className="text-[0.8rem] text-[#c35b43]">
                  ⚠️{" "}
                  <span className="font-semibold">Critical Legal Warning:</span>{" "}
                  Under Singapore law, if a beneficiary (or their spouse) signs
                  as a witness, the Will remains valid, but their entire
                  inheritance is completely canceled and made void. Always
                  choose neutral, third-party witnesses.
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-[#2b221a] text-[0.92rem]">
                3. Safeguarding Your Will
              </p>
              <ul className="mt-1 list-disc pl-5 space-y-0.5 text-[#4a515d]">
                <li>
                  Congratulations on completing your legally binding Will!
                </li>
                <li>
                  Store the physical document in a secure, protected location.
                  Ensure your chosen Executor knows exactly where it is kept so
                  they can retrieve it.
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="mt-3 border-t border-[#ece8e2] pt-3">
              <p className="text-[0.55rem] uppercase tracking-[0.08em] text-[#8b8a85] leading-relaxed">
                This document was generated using Will&Way, an automated
                self-help digital platform. Will&Way is not a law firm and does
                not provide legal advice, legal opinions, or specific
                recommendations. The tools and materials provided here are not a
                substitute for professional legal counsel. If you have unique or
                complex circumstances, you should consult a licensed lawyer.
                Will&Way assumes no liability for how this document is
                completed, signed, or enforced in court.
              </p>
            </div>
          </div>
        ),
      },
      // PAGE 2: The Last Will and Testament (was page 1)
      {
        pageTitle: "The Last Will and Testament",
        pageNumber: 2,
        body: (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <p className="text-[0.82rem] uppercase tracking-[0.28em] text-[#8d918d]">
              OF
            </p>
            <h3 className="mt-4 max-w-[560px] text-[2.2rem] font-semibold uppercase leading-[1.06] tracking-[0.04em] text-[#23262e] lg:text-[3rem]">
              <Highlight>{userName}</Highlight>
            </h3>
            <p className="mt-6 text-[0.92rem] uppercase tracking-[0.22em] text-[#b06248]">
              Created on {new Date().toLocaleDateString()}
            </p>

            <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
              <SummaryTile
                label="Beneficiaries"
                value={`${beneficiaryCount}`}
              />
              <SummaryTile label="Executors" value={`${executors.length}`} />
              <SummaryTile label="Net worth" value={formatMoney(totalWealth)} />
              <SummaryTile label="Gift entries" value={`${gifts.length}`} />
            </div>
          </div>
        ),
      },
      // PAGE 3: Essential Singapore Statutory Principles (was page 2)
      {
        pageTitle: "Essential Singapore Statutory Principles & ACKNOWLEDGMENTS",
        pageNumber: 3,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <p>
              1.1 Declaration of Contemplation and Effect of Marriage: I,{" "}
              <Highlight>{userName}</Highlight>, bearing Singapore NRIC/FIN:{" "}
              <Highlight>{userNRIC || "N/A"}</Highlight>, declare that this Will
              is made with the explicit awareness of statutory rules governing
              civil status changes. Pursuant to Section 13 of the Wills Act
              (Cap. 352), I acknowledge that any subsequent marriage entered
              into by me will automatically revoke this Will unless explicitly
              declared herein to be made in contemplation of such marriage.
            </p>
            <p>
              1.2 Operation of the Principle of Joint Survivorship: I explicitly
              acknowledge and direct that any real estate interests, immovable
              property, bank accounts, or financial holdings registered under a
              joint tenancy or joint framework at the time of my death shall be
              handled outside the terms of this Will. Such holdings shall pass
              automatically to the surviving joint tenant by operation of law
              under the principle of survivorship and are excluded from my
              residuary estate.
            </p>
            <p>
              1.3 Statutory Separation of Central Provident Fund (CPF): I
              recognize that my Central Provident Fund (CPF) savings, including
              balances in my Ordinary, Special, Medisave, and Retirement
              Accounts, are strictly isolated from estate distribution under
              this Will by virtue of Singapore statutory law. I acknowledge that
              such fund balances must be distributed solely in accordance with a
              valid CPF Nomination made separately with the CPF Board.
            </p>
          </div>
        ),
      },
      // PAGE 4: Testamentary Declarations (was page 3)
      {
        pageTitle: "Testamentary Declarations & Family Structure",
        pageNumber: 4,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <p>
              2.1 I, <Highlight>{userName}</Highlight>, bearing Singapore
              NRIC/FIN: <Highlight>{userNRIC || "N/A"}</Highlight>, presently
              domiciled at{" "}
              <Highlight>
                {userData?.addresses?.[0]?.streetAddress || "N/A"},{" "}
                {userData?.addresses[0]?.unitNumber || "N/A"},{" "}
                {userData?.addresses[0]?.postCode || "N/A"}
              </Highlight>{" "}
              being of sound mind and acting free from external coercion,
              declare this instrument to be my definitive Last Will and
              Testament. I hereby revoke all previous testamentary documents,
              codicils, and acts executed by me concerning assets within
              Singapore.
            </p>
            <p>
              2.2 I formally declare that my immediate family consists of the
              following individuals:
            </p>
            <ul className="space-y-3 pl-5">
              {family.length ? (
                family.map((member, index) => {
                  const relationPhrase = getRelationPhrase(member);
                  const dobDisplay = formatDateOfBirth(member.dateOfBirth);

                  if (member.relationType === "PET") {
                    const petName = getPetDisplayName(member);
                    return (
                      <li
                        key={
                          member.id ?? `${member.fullName ?? "member"}-${index}`
                        }
                        className="list-disc"
                      >
                        My pet {petName}
                        {dobDisplay}.
                      </li>
                    );
                  }

                  const idDisplay = getFamilyMemberIdDisplay(member);
                  return (
                    <li
                      key={
                        member.id ?? `${member.fullName ?? "member"}-${index}`
                      }
                      className="list-disc"
                    >
                      {relationPhrase}
                      <Highlight>
                        {member.fullName ?? "Unnamed family member"}
                      </Highlight>
                      {idDisplay}
                      {dobDisplay}.
                    </li>
                  );
                })
              ) : (
                <li className="list-disc">No family members added yet.</li>
              )}
            </ul>
            <p>
              Primary executor: <Highlight>{primaryExecutor} </Highlight>(
              {getIdentifierLabel(primaryExecutorIdType)}: {primaryExecutorId}).
              Backup executor: <Highlight>{backupExecutor} </Highlight>(
              {getIdentifierLabel(backupExecutorIdType)}: {backupExecutorId}).
            </p>
          </div>
        ),
      },
      // PAGE 5: Administrative Appointments (was page 4)
      {
        pageTitle: "Administrative Appointments & Minority Guardianship",
        pageNumber: 5,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <p>
              3.1 Fiduciary Appointment: I appoint{" "}
              <Highlight>{primaryExecutor} </Highlight>(
              {getIdentifierLabel(primaryExecutorIdType)}: {primaryExecutorId})
              to act as the sole Executor and Trustee of this my Will.
            </p>
            <p>
              3.2 Minority Guardianship Mandate: In the event that my children
              are below the age of twenty-one, I appoint{" "}
              <Highlight>{backupExecutor} </Highlight>(
              {getIdentifierLabel(backupExecutorIdType)}: {backupExecutorId}) as
              the backup guardian.
            </p>
            <p>
              3.3 Financial Indemnification of Caregivers: It is my explicit
              directive that estate resources may support my dependents as
              needed.
            </p>
          </div>
        ),
      },
      // PAGE 6: Special Bequests (was page 5)
      {
        pageTitle: "Special Bequests & Asset Distribution",
        pageNumber: 6,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            {cashGifts.length > 0 && (
              <div>
                <p className="font-semibold text-[#2b221a]">4.1 Cash Gifts:</p>
                <ul className="mt-2 space-y-2 pl-5">
                  {cashGifts.map((gift) => (
                    <li key={gift.id} className="list-disc">
                      I bequeath{" "}
                      <Highlight>{formatMoney(gift.amount)}</Highlight> in cash
                      to <Highlight>{gift.recipientName}</Highlight>.
                      {gift.description && (
                        <span className="italic text-[#6f7685]">
                          {" "}
                          ({gift.description})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {itemGifts.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-[#2b221a]">
                  4.2 Specific Items:
                </p>
                <ul className="mt-2 space-y-2 pl-5">
                  {itemGifts.map((gift) => (
                    <li key={gift.id} className="list-disc">
                      I bequeath my{" "}
                      <Highlight>
                        {gift.itemName || gift.description || "item"}
                      </Highlight>{" "}
                      to <Highlight>{gift.recipientName}</Highlight>.
                      {gift.description &&
                        gift.description !== gift.itemName && (
                          <span className="italic text-[#6f7685]">
                            {" "}
                            ({gift.description})
                          </span>
                        )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {collectionGifts.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-[#2b221a]">4.3 Collections:</p>
                <ul className="mt-2 space-y-2 pl-5">
                  {collectionGifts.map((gift) => (
                    <li key={gift.id} className="list-disc">
                      I bequeath my{" "}
                      <Highlight>{gift.itemName || "collection"}</Highlight>{" "}
                      collection to <Highlight>{gift.recipientName}</Highlight>.
                      {gift.description && (
                        <span className="italic text-[#6f7685]">
                          {" "}
                          ({gift.description})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {propertyGifts.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-[#2b221a]">
                  4.4 Property Gifts:
                </p>
                <ul className="mt-2 space-y-2 pl-5">
                  {propertyGifts.map((gift) => {
                    const property = gift.property;
                    let address = "address";
                    if (property) {
                      const parts = [];
                      if (property.streetAddress)
                        parts.push(property.streetAddress);
                      if (property.unitNumber)
                        parts.push(`Unit #${property.unitNumber}`);
                      if (property.country) parts.push(property.country);
                      if (property.postcode) parts.push(property.postcode);
                      address = parts.join(", ") || "address";
                    }
                    const propertyType = property?.type
                      ? property.type.charAt(0) +
                        property.type.slice(1).toLowerCase()
                      : "Property";

                    return (
                      <li key={gift.id} className="list-disc">
                        I bequeath my {propertyType} at{" "}
                        <Highlight>{address}</Highlight>
                        {property?.estimatedValue && (
                          <span>
                            {" "}
                            (valued at {formatMoney(property.estimatedValue)})
                          </span>
                        )}
                        to <Highlight>{gift.recipientName}</Highlight>.
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {financialGifts.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-[#2b221a]">
                  4.5 Financial Accounts:
                </p>
                <ul className="mt-2 space-y-2 pl-5">
                  {financialGifts.map((gift) => {
                    const accountValue =
                      gift.asset?.approximateValue || gift.asset?.faceValue;
                    const accountType =
                      gift.asset?.type?.replace(/_/g, " ").toLowerCase() ||
                      "financial account";
                    const institution = gift.asset?.institutionName;
                    const accountNumber = gift.asset?.accountNumber;
                    const policyNumber = gift.asset?.policyNumber;
                    const description = gift.asset?.description;

                    return (
                      <li key={gift.id} className="list-disc">
                        I bequeath my <Highlight>{accountType}</Highlight>
                        {institution && ` from ${institution}`}
                        {accountNumber && ` (Account: ${accountNumber})`}
                        {policyNumber && ` (Policy: ${policyNumber})`}
                        {accountValue &&
                          ` (valued at ${formatMoney(accountValue)})`}
                        {description && (
                          <span className="italic text-[#6f7685]">
                            {" "}
                            "{description}"
                          </span>
                        )}
                        to <Highlight>{gift.recipientName}</Highlight>.
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {gifts.length === 0 && (
              <p className="italic text-[#6f7685]">
                No specific gifts have been added to this will.
              </p>
            )}

            {petCaretakers.length > 0 && (
              <div className="mt-4 pt-2 border-t border-[#ece8e2]">
                <p className="font-semibold text-[#2b221a]">
                  4.6 Companion Animal Legacy:
                </p>
                <p className="mt-2">
                  I entrust my companion animal{" "}
                  <Highlight>{firstPetName}</Highlight> to{" "}
                  <Highlight>{firstPetCaretaker}</Highlight>.
                </p>
              </div>
            )}
          </div>
        ),
      },
      // PAGE 7: Residuary Estate (was page 6)
      {
        pageTitle: "",
        pageNumber: 7,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <p>
              <strong>5.1 Residuary Allocations:</strong> All remaining capital, real estate
              interests, and investments not specifically named elsewhere shall
              be settled and distributed among the following survivors, subject
              to the condition that if any beneficiary named below predeceases
              me, their share shall pass to the Backup Distributee as defined
              below. My Executors shall determine the status of each beneficiary
              at the time of distribution.
            </p>
            <p>If they survive me, the primary distribution shall be:</p>
            <ul className="space-y-3 pl-5">
              {estateDistributions.length ? (
                estateDistributions.map((distribution) => (
                  <li key={distribution.id} className="list-disc">
                    Allocation to{" "}
                    <Highlight>
                      {distribution.person?.fullName ?? "Not selected"}
                    </Highlight>{" "}
                    with a{" "}
                    <Highlight>
                      {formatPercent(distribution.percentage)}
                    </Highlight>{" "}
                    share.
                    <ul className="mt-1 pl-6 list-disc">
                      {distribution.backupDistributors &&
                      distribution.backupDistributors.length > 0 ? (
                        distribution.backupDistributors.map((backup, bIdx) => (
                          <li key={backup.person?.id || bIdx}>
                            If they predecease me, to{" "}
                            <Highlight>
                              {backup.person?.fullName || "N/A"}
                            </Highlight>
                            .
                          </li>
                        ))
                      ) : (
                        <li>
                          If they predecease me, to <Highlight>N/A</Highlight>.
                        </li>
                      )}
                    </ul>
                  </li>
                ))
              ) : (
                <li className="list-disc">
                  No residue allocation has been added yet.
                </li>
              )}
            </ul>
            <p>
              <strong>5.2 Severability and Validity:</strong> If any clause,
              provision, or part of this Will is determined by a court of
              competent jurisdiction to be invalid, illegal, or unenforceable,
              such determination shall not affect the validity of the rest of
              this Will. All other sections of this Instrument and the defined
              beneficiary data shall remain in full force and effect. The
              remaining provisions of this Will shall be construed and enforced
              as if such invalid, illegal, or unenforceable provision were not
              contained herein.
            </p>
            <p>
              <strong>5.3 Final Binding Declaration:</strong> I sign this document openly in the
              presence of my witnesses.
            </p>
          </div>
        ),
      },
      // PAGE 8: Final Execution Interface (was page 7)
      {
        pageTitle: "Final Execution Interface",
        pageNumber: 8,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <p>
              In witness whereof, I have set my hand to this my Last Will on
              this <Highlight>________</Highlight> day of{" "}
              <Highlight>________</Highlight>, 2026.
            </p>
            <p>
              <Highlight>{userName}</Highlight>
            </p>
            <p>
              NRIC/FIN: <Highlight>{userNRIC || "N/A"}</Highlight>
            </p>
            <p className="italic text-[#5f5b55]">
              Acknowledged and signed by the Testator as his final wishes in our
              joint simultaneous presence, whereupon, we, at his request,
              subscribe our names as witnesses:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[6px] border border-[#ece6dc] bg-[#fbfaf7] px-4 py-4 text-[0.88rem] leading-[1.7] text-[#59616e]">
                <p className="font-semibold text-[#3b4048]">WITNESS ONE:</p>
                <p>Signature: ____________________</p>
                <p>Full Name: ____________________</p>
                <p>NRIC/ID: ____________________</p>
                <p>Address: ____________________</p>
              </div>
              <div className="rounded-[6px] border border-[#ece6dc] bg-[#fbfaf7] px-4 py-4 text-[0.88rem] leading-[1.7] text-[#59616e]">
                <p className="font-semibold text-[#3b4048]">WITNESS TWO:</p>
                <p>Signature: ____________________</p>
                <p>Full Name: ____________________</p>
                <p>NRIC/ID: ____________________</p>
                <p>Address: ____________________</p>
              </div>
            </div>
          </div>
        ),
      },
      // PAGE 9: Personal Memos (was page 8)
      {
        pageTitle: "Personal Memos",
        pageNumber: 9,
        body: (
          <div className="space-y-5 text-[0.94rem] leading-[1.75] text-[#3f4550]">
            {memoGifts.length > 0 ? (
              memoGifts.map((gift, index) => {
                const memoText = gift.personalMessage || gift.description || "";

                return (
                  <div key={gift.id} className="space-y-2">
                    <p>
                      <strong>
                        Private Memorandum {index + 1} to{" "}
                        <Highlight>{gift.recipientName}</Highlight>:
                      </strong>
                    </p>
                    <p className="border-l-2 border-[#c35b43]/30 pl-4 font-medium italic text-[#2f2d24]">
                      "{memoText}"
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-[#716c65] italic">
                No private memorandums added.
              </div>
            )}
          </div>
        ),
      },
    ],
    [
      backupExecutor,
      backupExecutorId,
      backupExecutorIdType,
      cashGifts,
      collectionGifts,
      estateDistributions,
      executors.length,
      family,
      familyNames,
      financialGifts,
      firstPetCaretaker,
      firstPetName,
      gifts,
      itemGifts,
      memoGifts,
      petCaretakers.length,
      primaryExecutor,
      primaryExecutorId,
      primaryExecutorIdType,
      properties.length,
      propertyGifts,
      userName,
      userNRIC,
      userData,
      beneficiaryCount,
      totalWealth,
    ],
  );

  const nextSteps = [
    {
      id: "children",
      title: "Name guardians for your children",
      icon: Users2,
      description:
        "If you have young children, name a guardian and a backup guardian you trust to care for them and their inheritance until they reach 21 years of age.",
    },
    {
      id: "update",
      title: "Easily update anytime",
      icon: PenLine,
      description:
        "You can return later to update family, executor, gifts, distribution, caretakers, and asset details whenever life changes.",
    },
    {
      id: "gifts",
      title: "Leave gifts to your loved ones",
      icon: Wallet,
      description:
        "Assign specific cash, items, collections, or property gifts to the people who matter most.",
    },
    {
      id: "legal",
      title: "Legally valid in Singapore",
      icon: Shield,
      description:
        "Your will can be used as part of a valid estate planning process in Singapore when properly executed.",
    },
    {
      id: "pets",
      title: "Caretakers for your pets",
      icon: Users2,
      description:
        "Name a caretaker so your pets are looked after according to your wishes.",
    },
    {
      id: "finances",
      title: "Organised finances for loved ones",
      icon: Wallet,
      description:
        "Keep loans, financial accounts, properties, and other assets clearly organised in one place.",
    },
    {
      id: "coverage",
      title: "Global coverage",
      icon: Lock,
      description:
        "Keep your estate planning data centralised and accessible for the people who need it most.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbf4ed] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#c35b43] border-t-transparent"></div>
          <p className="mt-4 text-[#6f7685]">Loading your will preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#171612]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ece2d7] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
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

      <main className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-28 md:px-8 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-4">
            <div className="rounded-[28px] border border-[#e4d8cb] bg-[#efe7db] p-4 shadow-[0_20px_50px_rgba(17,24,39,0.06)]">
              <div className="flex items-center justify-between gap-4 px-2 pb-4">
                <div>
                  <p className="text-[0.76rem] uppercase tracking-[0.22em] text-[#8a8378]">
                    PDF Preview
                  </p>
                  <h2 className="mt-2 text-[1.25rem] font-semibold text-[#241f1a]">
                    Will pages from your live dashboard
                  </h2>
                  <p className="text-[0.7rem] text-[#8a8378] mt-1">
                    All {totalPages} pages included
                  </p>
                </div>
                {!!userData?.subscriptionType && (
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-4 py-2 text-[0.85rem] font-medium text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)] transition-all hover:bg-[#2a3548] disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading ? "Generating PDF..." : "Download All Pages"}
                  </button>
                )}
              </div>
              <div
                ref={pdfContentRef}
                className="max-h-[calc(100vh-220px)] space-y-5 overflow-auto pr-2"
                style={{
                  backgroundColor: "#fbf4ed",
                  padding: "20px",
                }}
              >
                {documentPages.map((page, index) => {
                  const isFree = userData?.subscriptionType === null;
                  const shouldBlur = isFree && index >= 2;

                  return (
                    <div
                      key={page.pageNumber}
                      className={shouldBlur ? "relative" : ""}
                    >
                      <div
                        className={
                          shouldBlur
                            ? "blur-[10px] select-none pointer-events-none"
                            : ""
                        }
                      >
                        <PdfPageFrame
                          pageNumber={page.pageNumber}
                          totalPages={totalPages}
                          title={page.pageTitle}
                        >
                          {page.body}
                        </PdfPageFrame>
                      </div>
                      {shouldBlur && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10">
                          <div className="bg-white/95 px-8 py-6 rounded-2xl shadow-xl border border-gray-100 text-center max-w-sm">
                            <Lock className="w-10 h-10 text-[#c35b43] mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-gray-900">
                              Premium Feature
                            </h3>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                              Upgrade to Premium to view the full document and
                              download your complete PDF.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-10">
              <DigitalAssetPdfPreview />
            </div>
          </section>

          <aside className="space-y-6">
            <div>
              <h1 className="text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#101010] md:text-[3.25rem]">
                Next Steps
              </h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/will"
                  className="inline-flex items-center rounded-[3px] border border-[#cbbdaa] bg-white px-5 py-3 text-[0.95rem] text-[#2b221a] shadow-[0_8px_18px_rgba(18,28,44,0.08)]"
                >
                  Make edits to your will
                </Link>
                <Link
                  href="/will/checkout"
                  className="inline-flex items-center rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]"
                >
                  Pay and download
                </Link>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#ece2d7] bg-[#f7efe6] p-2">
              <div className="space-y-1">
                {nextSteps.map((step) => (
                  <AccordionItem
                    key={step.id}
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    open={activeStep === step.id}
                    onToggle={() =>
                      setActiveStep((current) =>
                        current === step.id ? "" : step.id,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
