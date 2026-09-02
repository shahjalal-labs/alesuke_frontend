"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import logo from "@/assets/logo.png";

import AddAccountModal, { type AccountType } from "@/components/ui/AddAccountModal";
import { useAddAssetsMutation, useDeleteAssetsMutation, useEditAssetsMutation, useGetAllAssetsQuery } from "@/redux/api/assetsApi";
import { useGetGiftsTypeQuery } from "@/redux/api/giftApi";
// import { useGetAllMemberListQuery } from "@/redux/api/profileApi";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AssetType =
  | "BANK_ACCOUNT"
  | "INVESTMENT_ACCOUNT"
  | "BUSINESS_INTEREST"
  | "RETIREMENT_ACCOUNT"
  | "INSURANCE_PLAN"
  | "SAFE_DEPOSIT_BOX"
  | "CRYPTO";

type AssetRecord = {
  id?: string | number;
  type?: AssetType | string;
  institutionName?: string | null;
  companyName?: string | null;
  description?: string | null;
  accountNumber?: string | null;
  policyNumber?: string | null;
  coverType?: string | null;
  maturityDate?: string | null;
  approximateValue?: number | null;
  faceValue?: number | null;
  isJointlyOwned?: boolean | null;
  isNominated?: boolean | null;
};

type MemberRecord = {
  id: string;
  fullName?: string | null;
  relationType?: string | null;
};

type FinancialAccountGiftRecord = {
  id?: string;
  giftType?: "FINANCIAL_ACCOUNT";
  assetId?: string | null;
  asset?: AssetRecord | null;
  recipients?: Array<{
    peopleID?: string | null;
    recipient?: {
      id?: string;
      fullName?: string | null;
    };
  }>;
};

const addOptions: Array<{ id: AccountType; label: string }> = [
  { id: "bank", label: "Add Bank Account" },
  { id: "investment", label: "Add Investment Account" },
  { id: "business", label: "Add Business Interest" },
  // { id: "retirement", label: "Add Supplememtary Retirement Scheme (SRS)" },
  { id: "insurance", label: "Add Insurance Plan" },
  { id: "safe", label: "Add Safe deposit box" },
  { id: "crypto", label: "Add Crypto" },
];

const assetTypeMap: Record<AccountType, AssetType> = {
  bank: "BANK_ACCOUNT",
  investment: "INVESTMENT_ACCOUNT",
  business: "BUSINESS_INTEREST",
  retirement: "RETIREMENT_ACCOUNT",
  insurance: "INSURANCE_PLAN",
  safe: "SAFE_DEPOSIT_BOX",
  crypto: "CRYPTO",
};

function toNumber(value: string) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function normalizeAssets(response: unknown): AssetRecord[] {
  if (Array.isArray(response)) {
    return response as AssetRecord[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const candidate = response as {
    data?: unknown;
    assets?: unknown;
    items?: unknown;
    results?: unknown;
  };

  const direct = candidate.data ?? candidate.assets ?? candidate.items ?? candidate.results;

  if (Array.isArray(direct)) {
    return direct as AssetRecord[];
  }

  if (direct && typeof direct === "object") {
    const nested = direct as { data?: unknown; assets?: unknown; items?: unknown; results?: unknown };
    const nestedList = nested.data ?? nested.assets ?? nested.items ?? nested.results;

    if (Array.isArray(nestedList)) {
      return nestedList as AssetRecord[];
    }
  }

  return [];
}

function formatAssetType(type?: string) {
  if (!type) return "Asset";

  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getAssetTitle(asset: AssetRecord) {
  return asset.institutionName || asset.companyName || asset.description || asset.accountNumber || asset.policyNumber || "Asset";
}

function getAssetSubtitle(asset: AssetRecord) {
  if (asset.accountNumber && asset.institutionName) {
    return `• ${asset.accountNumber}`;
  }

  if (asset.policyNumber && asset.institutionName) {
    return `• ${asset.policyNumber}`;
  }

  return asset.institutionName || asset.companyName || asset.description || "Financial item";
}

function getAssetValue(asset: AssetRecord) {
  const value = asset.faceValue ?? asset.approximateValue;

  if (typeof value === "number") {
    return `S$ ${value.toLocaleString()}`;
  }

  return "S$ 0";
}

function getAccountTypeFromAssetType(type?: AssetRecord["type"]) {
  switch (type) {
    case "BANK_ACCOUNT":
      return "bank";
    case "INVESTMENT_ACCOUNT":
      return "investment";
    case "BUSINESS_INTEREST":
      return "business";
    case "RETIREMENT_ACCOUNT":
      return "retirement";
    case "INSURANCE_PLAN":
      return "insurance";
    case "SAFE_DEPOSIT_BOX":
      return "safe";
    case "CRYPTO":
      return "crypto";
    default:
      return null;
  }
}

function getAssetInitialValues(asset: AssetRecord, type: AccountType) {
  const values: Record<string, string> = {};

  switch (type) {
    case "bank":
      values.institutionName = asset.institutionName ?? "";
      values.accountNumber = asset.accountNumber ?? "";
      values.approximateValue = asset.approximateValue != null ? String(asset.approximateValue) : "";
      break;
    case "investment":
      values.companyName = asset.companyName ?? "";
      values.institutionName = asset.institutionName ?? "";
      values.approximateValue = asset.approximateValue != null ? String(asset.approximateValue) : "";
      break;
    case "business":
      values.companyName = asset.companyName ?? "";
      values.approximateValue = asset.approximateValue != null ? String(asset.approximateValue) : "";
      break;
    case "retirement":
      values.institutionName = asset.institutionName ?? "";
      values.accountNumber = asset.accountNumber ?? "";
      values.approximateValue = asset.approximateValue != null ? String(asset.approximateValue) : "";
      break;
    case "insurance":
      values.institutionName = asset.institutionName ?? "";
      values.policyNumber = asset.policyNumber ?? "";
      values.coverType = asset.coverType ?? "TERM_LIFE";
      values.maturityDate = asset.maturityDate ? String(asset.maturityDate).slice(0, 10) : "";
      values.faceValue = asset.faceValue != null ? String(asset.faceValue) : "";
      break;
    case "safe":
      values.description = asset.description ?? "";
      values.approximateValue = asset.approximateValue != null ? String(asset.approximateValue) : "";
      break;
    case "crypto":
      values.description = asset.description ?? "";
      values.institutionName = asset.institutionName ?? "";
      values.approximateValue = asset.approximateValue != null ? String(asset.approximateValue) : "";
      break;
  }

  return values;
}

export default function AddFinancials() {
//   const { data: members = [] } = useGetAllMemberListQuery(undefined);
  const { data: assetsResponse, isLoading, isFetching } = useGetAllAssetsQuery(undefined);
  const { data: financialAccountGiftResponse } = useGetGiftsTypeQuery("FINANCIAL_ACCOUNT");
  const [addAssets] = useAddAssetsMutation();
  const [deleteAssets] = useDeleteAssetsMutation();
  const [editAssets] = useEditAssetsMutation();
//   const [addGift] = useAddGiftMutation();
  const [activeType, setActiveType] = useState<AccountType | null>(null);
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<Array<string | number>>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [submittingGift, setSubmittingGift] = useState(false);

//   const recipientRows = useMemo(() => {
//     return (members as MemberRecord[]).map((member, index) => ({
//       id: member.id,
//       name: member.fullName ?? `Person ${index + 1}`,
//       icon: (member.fullName ?? "P").charAt(0).toUpperCase(),
//       helper: member.relationType || undefined,
//     }));
//   }, [members]);

//   const toggleRecipient = (recipientId: string | number) => {
//     setSelectedRecipientIds((current) =>
//       current.includes(recipientId) ? current.filter((item) => item !== recipientId) : [...current, recipientId]
//     );
//   };

  const savedAssets = useMemo(() => normalizeAssets(assetsResponse), [assetsResponse]);

  const selectedFinancialAccountGift = useMemo(() => {
    const gifts = ((financialAccountGiftResponse as { data?: FinancialAccountGiftRecord[] } | undefined)?.data ?? []) as FinancialAccountGiftRecord[];

    return gifts[0] ?? null;
  }, [financialAccountGiftResponse]);

  const selectedAsset = useMemo(() => {
    if (selectedAssetId == null) return null;

    return savedAssets.find((asset) => String(asset.id) === String(selectedAssetId)) ?? null;
  }, [savedAssets, selectedAssetId]);

  useEffect(() => {
    if (!selectedFinancialAccountGift) {
      return;
    }

    const savedAssetId = selectedFinancialAccountGift.assetId ?? selectedFinancialAccountGift.asset?.id ?? null;
    if (savedAssetId != null) {
      setSelectedAssetId(savedAssetId);
    }

    const savedRecipientIds = (selectedFinancialAccountGift.recipients ?? [])
      .map((recipient) => recipient.peopleID ?? recipient.recipient?.id ?? "")
      .filter((recipientId): recipientId is string => Boolean(recipientId));

    setSelectedRecipientIds(savedRecipientIds);
  }, [selectedFinancialAccountGift]);

  const handleDeleteAsset = async (id?: string | number) => {
    if (id == null) return;

    const result = await Swal.fire({
      title: "Delete this account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#c34141",
      cancelButtonColor: "#d9cec1",
      background: "#fbf4ed",
      color: "#171612",
    });

    if (!result.isConfirmed) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteAssets(String(id)).unwrap();
      setSelectedAssetId((current) => (current === id ? null : current));
      toast.success("Account deleted");
    } catch (error) {
      toast.error("Unable to delete account");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditAsset = (asset: AssetRecord) => {
    const type = getAccountTypeFromAssetType(asset.type);

    if (!type) {
      toast.error("Unable to edit this account");
      return;
    }

    setEditingAsset(asset);
    setActiveType(type);
  };

  const handleSelectAsset = (assetId?: string | number) => {
    if (assetId == null) return;

    setSelectedAssetId(assetId);
  };

  const openModal = (type: AccountType) => {
    setEditingAsset(null);
    setActiveType(type);
  };

  const handleSaveAsset = async ({
    type,
    fields,
    joint,
    nominated,
  }: {
    type: AccountType;
    fields: Record<string, string>;
    joint: boolean;
    nominated: boolean;
  }) => {
    const assetType = assetTypeMap[type];
    const editTargetId = editingAsset?.id;
    const editTargetFlags = editingAsset ?? null;

    const payload = (() => {
      switch (type) {
        case "bank":
          return {
            type: assetType,
            institutionName: fields.institutionName ?? "",
            accountNumber: fields.accountNumber ?? "",
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ""),
          };
        case "investment":
          return {
            type: assetType,
            companyName: fields.companyName ?? "",
            institutionName: fields.institutionName ?? "",
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ""),
          };
        case "business":
          return {
            type: assetType,
            companyName: fields.companyName ?? "",
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ""),
          };
        case "retirement":
          return {
            type: assetType,
            institutionName: fields.institutionName ?? "",
            accountNumber: fields.accountNumber ?? "",
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ""),
          };
        case "insurance":
          return {
            type: assetType,
            institutionName: fields.institutionName ?? "",
            policyNumber: fields.policyNumber ?? "",
            isNominated: nominated,
            coverType: (fields.coverType ?? "TERM_LIFE") as "TERM_LIFE" | "WHOLE_LIFE" | "ENDOWMENT" | "UNIVERSAL_LIFE" | "INVESTMENT" | "OTHER",
            maturityDate: fields.maturityDate ? new Date(fields.maturityDate).toISOString() : "2030-12-31T00:00:00.000Z",
            faceValue: toNumber(fields.faceValue ?? ""),
          };
        case "safe":
          return {
            type: assetType,
            description: fields.description ?? "",
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ""),
          };
        case "crypto":
          return {
            type: assetType,
            description: fields.description ?? "",
            institutionName: fields.institutionName ?? "",
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ""),
          };
      }
    })();

    const nextPayload = editTargetFlags
      ? {
          ...payload,
          isJointlyOwned: editTargetFlags.isJointlyOwned ?? false,
          isNominated: editTargetFlags.isNominated ?? false,
        }
      : payload;

    if (editTargetId != null) {
      await editAssets({ id: editTargetId, data: nextPayload }).unwrap();
      setEditingAsset(null);
      setActiveType(null);
      return;
    }

    await addAssets(nextPayload).unwrap();
  };
  const router = useRouter();

  const handleSaveGift = async () => {
    if (selectedAssetId == null) {
      toast.error("Select one account to continue.");
      return;
    }

    router.push("/will/assets/add-property");
  };

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
          <Link href="/will" className="rounded-[4px] border border-[#d8d1c8] px-4 py-2 text-[0.9rem] text-[#1b1b1b] transition-colors hover:bg-[#f0e8df]">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-8 md:px-8 md:pt-10">
        <div className="mx-auto max-w-[900px]">
          <div className="max-w-[760px]">
            <div className="text-[0.95rem] font-medium text-[#5f6571]">Adding your assets</div>
            <div className="mt-2 h-px w-full bg-[#d8d8d8]" />

            <h1 className="mt-8 text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#101010] md:text-[3.35rem]">Your finances</h1>
            <p className="mt-5 text-[1.04rem] leading-[1.65] text-[#111111]">Building Your Asset Inventory</p>

            <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7] text-[#111111] md:text-[1.08rem]">
              <div>
                <p className="font-semibold">Financial Accounts:</p>
                <p className="mt-2 text-[#6d7a90]">Include details for all bank accounts and investment portfolios.</p>
              </div>

              <div>
                <p className="font-semibold">Long-Term Holdings:</p>
                <p className="mt-2 text-[#6d7a90]">List your retirement funds and any business ownership interests.</p>
              </div>

              <div>
                <p className="font-semibold">Insurance Plans:</p>
                <p className="mt-2 text-[#6d7a90]">You may also incorporate your various insurance policies into this record.</p>
              </div>
            </div>

            <p className="mt-12 max-w-[720px] text-[1rem] leading-[1.6] text-[#6d7a90] md:text-[1.06rem]">
              This schedule of assets is stored directly with your will to provide a clear summary of your estate for your executors and beneficiaries.
            </p>
          </div>

          <section className="mt-8">
           

            {savedAssets.length ? (
              <div className="mt-4">
                <div className="space-y-3 md:space-y-4">
                  {savedAssets.map((asset, index) => {
                    const isLast = index === savedAssets.length - 1;
                    const isSelected = selectedAssetId === asset.id;

                    return (
                      <div
                        key={asset.id ?? `${asset.type}-${index}`}
                        onClick={() => handleSelectAsset(asset.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSelectAsset(asset.id);
                          }
                        }}
                        className={`flex w-full items-center gap-4 rounded-[6px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow ${
                          isSelected ? "ring-2 ring-[#152035] shadow-[0_8px_24px_rgba(17,24,39,0.08)]" : ""
                        } ${!isLast ? "border-b border-[#ece3d6]" : ""}`}
                      >
                        <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[#d8d8d8] bg-[#f9fbfc] text-[#27a5f7]">
                          <span className="text-[1.2rem] leading-none">⌂</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[0.78rem] text-[#8c8f98] md:text-[0.82rem]">{formatAssetType(asset.type)}</p>
                          <h3 className="truncate text-[1rem] font-semibold leading-[1.15] text-[#0f3b3b] md:text-[1.06rem]">{getAssetTitle(asset)}</h3>
                          <p className="text-[0.92rem] font-semibold leading-[1.2] text-[#0f3b3b] md:text-[0.98rem]">{getAssetSubtitle(asset)}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {asset.isNominated ? (
                              <span className="inline-flex items-center rounded-[2px] border border-[#d8d8d8] bg-[#fcfbf8] px-2 py-1 text-[0.72rem] text-[#3b3b3b]">This asset is nominated</span>
                            ) : null}
                            {asset.isJointlyOwned ? (
                              <span className="inline-flex items-center rounded-[2px] border border-[#d8d8d8] bg-[#fcfbf8] px-2 py-1 text-[0.72rem] text-[#3b3b3b]">Jointly owned</span>
                            ) : null}
                          </div>
                          <p className="mt-2 text-[0.95rem] font-semibold leading-[1.2] text-[#0f3b3b] md:text-[1rem]">{getAssetValue(asset)}</p>
                          {isSelected ? (
                            <span className="mt-2 inline-flex rounded-full bg-[#152035] px-3 py-1 text-[0.75rem] font-medium text-white">Selected account</span>
                          ) : null}
                        </div>

                        <div className="flex flex-none items-center gap-2">
                          <button
                            type="button"
                            aria-label="Edit account"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEditAsset(asset);
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#152035] transition-colors hover:bg-[#eef2f7]"
                          >
                            <PencilLine className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            aria-label="Delete account"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteAsset(asset.id);
                            }}
                            disabled={deletingId === asset.id}
                            className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-[#c34141] transition-colors hover:bg-[#feecec] disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <h3 className="mt-6 text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Add a new financial item</h3>
            <div className="mt-4">
              <div className="space-y-3 md:space-y-4">
                {addOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => openModal(opt.id)}
                    className="flex w-full items-center gap-4 rounded-[6px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)]"
                  >
                    <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">◍</span>
                    <span className="block text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {(isLoading || isFetching) && !savedAssets.length ? <p className="mt-4 text-[0.95rem] text-[#6f7685]">Loading saved assets...</p> : null}
          </section>

          

          <footer className="mt-10 border-t border-[#e6ddd3] pt-5">
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/will" className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]">
                ← Back to Dashboard
              </Link>

              <button
                type="button"
                onClick={handleSaveGift}
                disabled={submittingGift || selectedAssetId == null}
                className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingGift ? "Saving..." : "Save & continue"}
              </button>
            </div>
          </footer>
        </div>
      </main>

      <AddAccountModal
        open={activeType !== null}
        type={activeType}
        mode={editingAsset ? 'edit' : 'create'}
        initialValues={editingAsset && activeType ? getAssetInitialValues(editingAsset, activeType) : undefined}
        onClose={() => {
          setActiveType(null);
          setEditingAsset(null);
        }}
        onSave={handleSaveAsset}
      />
    </div>
  );
}
