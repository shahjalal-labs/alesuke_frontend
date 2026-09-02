"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, BriefcaseBusiness, X } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import logo from "@/assets/logo.png";

import { assetsApi } from "@/redux/api/assetsApi";
import type { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";

type LoanType = "OUTSTANDING" | "GIVEN";

type LoanRecord = {
  id?: string;
  type?: LoanType;
  loanType?: LoanType;
  institutionName?: string | null;
  accountNumber?: string | null;
  approximateBalance?: number | null;
};

type LoanPayload = {
  loanType: LoanType;
  institutionName: string;
  accountNumber: string;
  approximateBalance: number;
};

type LoanModalProps = {
  open: boolean;
  loanType: LoanType | null;
  onClose: () => void;
  onSave: (payload: LoanPayload) => Promise<void> | void;
  initialValues?: Partial<LoanPayload> | null;
};

const loanOptions: Array<{ id: LoanType; label: string; icon: typeof House }> =
  [
    { id: "OUTSTANDING", label: "Add Outstanding loans", icon: House },
    { id: "GIVEN", label: "Add Loans given", icon: BriefcaseBusiness },
  ];

function normalizeLoans(response: unknown): LoanRecord[] {
  if (Array.isArray(response)) return response as LoanRecord[];

  if (!response || typeof response !== "object") return [];

  const candidate = response as {
    data?: unknown;
    items?: unknown;
    results?: unknown;
  };
  const direct = candidate.data ?? candidate.items ?? candidate.results;

  if (Array.isArray(direct)) return direct as LoanRecord[];

  return [];
}

function formatLoanType(type?: LoanType) {
  if (!type) return "Loan";
  return type === "OUTSTANDING" ? "Outstanding loans" : "Loans given";
}

function getLoanTitle(loan: LoanRecord) {
  return loan.institutionName || loan.accountNumber || "Loan";
}

function getLoanSubtitle(loan: LoanRecord) {
  if (loan.accountNumber && loan.institutionName)
    return `${loan.institutionName} • ${loan.accountNumber}`;
  return loan.institutionName || loan.accountNumber || "Loan detail";
}

function getLoanValue(loan: LoanRecord) {
  const value = loan.approximateBalance ?? 0;
  return `S$ ${Number(value).toLocaleString()}`;
}

function LoanModal({
  open,
  loanType,
  onClose,
  onSave,
  initialValues,
}: LoanModalProps) {
  const [mounted, setMounted] = useState(false);
  const [institutionName, setInstitutionName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [approximateBalance, setApproximateBalance] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setInstitutionName("");
      setAccountNumber("");
      setApproximateBalance("");
      setSaving(false);
      return;
    }

    setInstitutionName(initialValues?.institutionName ?? "");
    setAccountNumber(initialValues?.accountNumber ?? "");
    setApproximateBalance(
      initialValues?.approximateBalance != null
        ? String(initialValues.approximateBalance)
        : "",
    );
  }, [initialValues, open]);

  if (!open || !mounted || !loanType) return null;

  const title =
    loanType === "OUTSTANDING" ? "Add outstanding loans" : "Add loans given";
  const intro =
    loanType === "OUTSTANDING"
      ? "This is a loan which is still owed by you to a creditor, who may be a person, a bank, or a different loan provider."
      : "This is a loan which you have given to another person, which has not yet been paid back.";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/55 p-4 pt-10"
      onClick={onClose}
    >
      <div className="mx-auto flex min-h-full w-full items-start justify-center">
        <div
          className="w-full max-w-[560px] overflow-hidden rounded-[18px] bg-[#f3e5d7] text-[#1a202f] shadow-[0_28px_80px_rgba(17,24,39,0.28)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="max-h-[92vh] overflow-y-auto px-5 py-5 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[1.55rem] font-medium tracking-[-0.03em] text-[#111827] sm:text-[1.9rem]">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-[#7c7c7c] transition-colors hover:text-[#111827]"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-5 max-w-[52rem] text-[1rem] leading-[1.45] text-[#5d6475] sm:text-[1.05rem]">
              {intro}
            </p>

            <div className="mt-8 space-y-6 sm:space-y-7">
              <div>
                <label className="mb-3 block text-[0.9rem] uppercase tracking-[0.14em] text-[#404452]">
                  Name of institution/person and account number
                </label>
                <input
                  value={institutionName}
                  onChange={(event) => setInstitutionName(event.target.value)}
                  placeholder="Name of Institution/person and Account Number"
                  className="w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 py-3 text-[1rem] text-[#334155] outline-none placeholder:text-[#a0a6b3] sm:px-5 sm:py-4"
                />
              </div>

              <div>
                <p className="text-[1.35rem] font-medium tracking-[-0.03em] text-[#111827] sm:text-[1.55rem]">
                  Approximate Balance
                </p>
                <p className="mb-4 mt-3 text-[0.95rem] leading-[1.45] text-[#7f8695] sm:text-[1rem]">
                  Balances help you understand the size of your current estate,
                  and helps with distribution of assets.
                </p>
                <p className="mb-4 text-[0.95rem] leading-[1.45] text-[#7f8695] sm:text-[1rem]">
                  It is not reflected in the Will itself, but only in the
                  Schedule of Assets.
                </p>
                <input
                  value={approximateBalance}
                  onChange={(event) =>
                    setApproximateBalance(event.target.value)
                  }
                  placeholder="$"
                  inputMode="numeric"
                  className="w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 py-3 text-[1rem] text-[#334155] outline-none placeholder:text-[#5d6475] sm:px-5 sm:py-4"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-[#ece0d2] pt-5 sm:mt-10">
              <button
                type="button"
                onClick={onClose}
                className="h-[46px] rounded-[4px] border border-[#1b2434] bg-transparent px-5 text-[1rem] text-[#1b2434] transition-colors hover:bg-[#efe3d4]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  if (!institutionName.trim()) {
                    toast.error("Enter the institution or person name");
                    return;
                  }

                  const balance = Number(approximateBalance);
                  if (!Number.isFinite(balance)) {
                    toast.error("Enter a valid balance");
                    return;
                  }

                  setSaving(true);
                  try {
                    await onSave({
                      loanType,
                      institutionName: institutionName.trim(),
                      accountNumber: accountNumber.trim(),
                      approximateBalance: balance,
                    });
                    toast.success("Loan saved");
                    onClose();
                  } catch (error) {
                    toast.error("Unable to save loan");
                  } finally {
                    setSaving(false);
                  }
                }}
                className="h-[46px] rounded-[4px] bg-[#111827] px-5 text-[1rem] text-white transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function AddOtherAssets() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [activeLoanType, setActiveLoanType] = useState<LoanType | null>(null);
  const [editingLoan, setEditingLoan] = useState<LoanRecord | null>(null);

  useEffect(() => {
    const promise = dispatch(
      assetsApi.endpoints.getAssetLoan.initiate(undefined),
    );

    return () => {
      promise.unsubscribe();
    };
  }, [dispatch]);

  const loanQuery = useSelector((state: RootState) =>
    assetsApi.endpoints.getAssetLoan.select(undefined)(state),
  ) as
    | {
        data?: { data?: LoanRecord[] };
        isLoading?: boolean;
        isFetching?: boolean;
      }
    | undefined;

  const loans = useMemo(
    () => normalizeLoans(loanQuery?.data?.data),
    [loanQuery?.data?.data],
  );
  const isLoading = Boolean(loanQuery?.isLoading || loanQuery?.isFetching);
  const isFetching = Boolean(loanQuery?.isFetching);

  const outstandingLoans = useMemo(
    () =>
      loans.filter((loan) => (loan.type ?? loan.loanType) === "OUTSTANDING"),
    [loans],
  );

  const givenLoans = useMemo(
    () => loans.filter((loan) => (loan.type ?? loan.loanType) === "GIVEN"),
    [loans],
  );

  const handleSaveLoan = async (payload: LoanPayload) => {
    await dispatch(assetsApi.endpoints.addAssetLoan.initiate(payload)).unwrap();
  };

  const handleEditLoan = (loan: LoanRecord) => {
    setEditingLoan(loan);
    setActiveLoanType(
      (loan.type ?? loan.loanType ?? "OUTSTANDING") as LoanType,
    );
  };

  const activeModalInitialValues = editingLoan
    ? {
        institutionName: editingLoan.institutionName ?? "",
        accountNumber: editingLoan.accountNumber ?? "",
        approximateBalance: editingLoan.approximateBalance ?? 0,
      }
    : null;

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#171612]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ece2d7] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
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
            className="rounded-[3px] border border-[#d9cec1] bg-transparent px-4 py-2 text-[0.9rem] text-[#1d1b18] transition-colors hover:bg-[#f2e7db]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <section>
          <p className="text-[0.82rem] text-[#45413c] md:text-[0.9rem]">
            Adding your assets
          </p>
          <div className="mt-2 h-px w-full bg-[#d8d8d8]" />

          <h1 className="mt-8 text-[2.1rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#12100e] md:text-[3.45rem]">
            Other finances
          </h1>

          <div className="mt-10">
            {loans.length ? (
              <div className="space-y-3 md:space-y-4">
                {outstandingLoans.length ? (
                  <div>
                    <h2 className="mb-3 text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">
                      Outstanding loans
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                      {outstandingLoans.map((loan, index) => {
                        const isLast = index === outstandingLoans.length - 1;
                        return (
                          <div
                            key={loan.id ?? `outstanding-${index}`}
                            className={`flex items-center gap-4 rounded-[10px] bg-white px-4 py-4 shadow-[0_1px_0_rgba(17,24,39,0.02)] md:px-5 ${!isLast ? "" : ""}`}
                          >
                            <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">
                              <span className="text-[1.15rem] leading-none">
                                ⌂
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-[0.78rem] text-[#8c8f98] md:text-[0.82rem]">
                                {formatLoanType(loan.type ?? loan.loanType)}
                              </p>
                              <h3 className="truncate text-[1rem] font-semibold leading-[1.15] text-[#191715] md:text-[1.08rem]">
                                {getLoanTitle(loan)}
                              </h3>
                              <p className="text-[0.92rem] font-semibold leading-[1.2] text-[#191715] md:text-[0.98rem]">
                                {getLoanSubtitle(loan)}
                              </p>
                              <p className="mt-2 text-[1.02rem] font-semibold leading-[1.2] text-[#191715] md:text-[1.08rem]">
                                {getLoanValue(loan)}
                              </p>
                            </div>

                            {/* <button
                              type="button"
                              onClick={() => handleEditLoan(loan)}
                              className="inline-flex h-10 items-center justify-center rounded-[4px] border border-[#121826] px-5 text-[0.95rem] text-[#121826] transition-colors hover:bg-[#f2e7db]"
                            >
                              Edit
                            </button> */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {givenLoans.length ? (
                  <div>
                    <h2 className="mb-3 mt-6 text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">
                      Loans given
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                      {givenLoans.map((loan, index) => {
                        const isLast = index === givenLoans.length - 1;
                        return (
                          <div
                            key={loan.id ?? `given-${index}`}
                            className={`flex items-center gap-4 rounded-[10px] bg-white px-4 py-4 shadow-[0_1px_0_rgba(17,24,39,0.02)] md:px-5 ${!isLast ? "" : ""}`}
                          >
                            <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">
                              <span className="text-[1.15rem] leading-none">
                                ⌂
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-[0.78rem] text-[#8c8f98] md:text-[0.82rem]">
                                {formatLoanType(loan.type ?? loan.loanType)}
                              </p>
                              <h3 className="truncate text-[1rem] font-semibold leading-[1.15] text-[#191715] md:text-[1.08rem]">
                                {getLoanTitle(loan)}
                              </h3>
                              <p className="text-[0.92rem] font-semibold leading-[1.2] text-[#191715] md:text-[0.98rem]">
                                {getLoanSubtitle(loan)}
                              </p>
                              <p className="mt-2 text-[1.02rem] font-semibold leading-[1.2] text-[#191715] md:text-[1.08rem]">
                                {getLoanValue(loan)}
                              </p>
                            </div>

                            {/* <button
                              type="button"
                              onClick={() => handleEditLoan(loan)}
                              className="inline-flex h-10 items-center justify-center rounded-[4px] border border-[#121826] px-5 text-[0.95rem] text-[#121826] transition-colors hover:bg-[#f2e7db]"
                            >
                              Edit
                            </button> */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <h2 className="mt-10 text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">
            Add a new loan
          </h2>
          <div className="mt-4 rounded-[6px] bg-[#f2e5d8] p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {loanOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setEditingLoan(null);
                      setActiveLoanType(option.id);
                    }}
                    className="flex w-full items-center gap-4 rounded-[8px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)] md:px-5 md:py-5"
                  >
                    <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="block text-[1rem] font-medium text-[#8b8f99] md:text-[1.08rem]">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {(isLoading || isFetching) && !loans.length ? (
            <p className="mt-4 text-[0.95rem] text-[#6f7685]">
              Loading saved loans...
            </p>
          ) : null}

          <footer className="mt-10 border-t border-[#e6ddd3] pt-5">
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/will/assets/add-property"
                className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]"
              >
                ← Previous Step
              </Link>

              <button
                type="button"
                onClick={() => router.push("/will")}
                className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)]"
              >
                Skip this step
              </button>
            </div>
          </footer>
        </section>
      </main>

      <LoanModal
        open={activeLoanType !== null}
        loanType={activeLoanType}
        onClose={() => {
          setActiveLoanType(null);
          setEditingLoan(null);
        }}
        onSave={handleSaveLoan}
        initialValues={activeLoanType ? activeModalInitialValues : null}
      />
    </div>
  );
}
