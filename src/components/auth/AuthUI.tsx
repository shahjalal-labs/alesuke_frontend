"use client";
import googleIcon from '@/assets/google.png';
import appleIcon from '@/assets/apple.png';
import React, { useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, CheckCircle2 } from "lucide-react";
import Image from 'next/image';

type AuthShellProps = {
  children: React.ReactNode;
  tabs?: React.ReactNode;
};

export function AuthShell({ children, tabs }: AuthShellProps) {
  return (
    <section className="min-h-screen bg-[#f8f2ea] px-4 py-10 text-[#1f2937] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[760px] items-center justify-center">
        <div className="w-full max-w-[430px]">
          {tabs ? <div className="mb-8 flex justify-center">{tabs}</div> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

type TabsProps = {
  active: "login" | "signup";
  onChange: (value: "login" | "signup") => void;
};

export function AuthTabs({ active, onChange }: TabsProps) {
  return (
    <div className="inline-flex rounded-xl bg-[#f2e7d8] p-1 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      <button
        type="button"
        onClick={() => onChange("login")}
        className={`min-w-[90px] rounded-lg px-6 py-2 text-sm font-medium transition ${
          active === "login" ? "bg-white text-[#1f2937] shadow-sm" : "text-[#64748b]"
        }`}
      >
        Log in
      </button>
      <button
        type="button"
        onClick={() => onChange("signup")}
        className={`min-w-[90px] rounded-lg px-6 py-2 text-sm font-medium transition ${
          active === "signup" ? "bg-white text-[#1f2937] shadow-sm" : "text-[#64748b]"
        }`}
      >
        Sign-up
      </button>
    </div>
  );
}

type FieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  icon: "user" | "mail" | "lock";
  value: string;
  onChange: (value: string) => void;
  showToggle?: boolean;
};

export function AuthField({ label, placeholder, type = "text", icon, value, onChange, showToggle }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const resolvedType = showToggle ? (visible ? "text" : "password") : type;

  const iconNode = useMemo(() => {
    const common = "h-5 w-5 text-[#98a2b3]";
    if (icon === "user") return <User className={common} />;
    if (icon === "lock") return <Lock className={common} />;
    return <Mail className={common} />;
  }, [icon]);

  return (
    <label className="block">
      <span className="mb-3 block text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#6b7280]">
        {label}
      </span>
      <div className="flex h-[64px] items-center rounded-xl border border-[#e5e7eb] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition focus-within:border-[#cfd6e4] focus-within:shadow-[0_0_0_3px_rgba(15,23,42,0.03)]">
        <span className="mr-4 flex w-5 items-center justify-center">{iconNode}</span>
        <input
          type={resolvedType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[1rem] text-[#111827] outline-none placeholder:text-[#98a2b3]"
        />
        {showToggle ? (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="ml-3 flex items-center justify-center text-[#c0c7d2] transition hover:text-[#64748b]"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        ) : null}
      </div>
    </label>
  );
}

export function PrimaryButton({
  children,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="flex h-[60px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0d1524] to-[#1c2639] text-[1rem] font-medium tracking-[0.08em] text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
    >
      {children}
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-5 text-[#C5C6CC]">
      <span className="h-px flex-1 bg-[#C5C6CC]" />
      <span className="text-[0.72rem] uppercase tracking-[0.25em] text-[#C5C6CC]">{label}</span>
      <span className="h-px flex-1 bg-[#C5C6CC]" />
    </div>
  );
}

export function SocialRow() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => console.log("continue with google")}
        className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#ccd4e1] bg-white text-sm font-medium text-[#111827] transition hover:bg-[#fbfcfe] col-span-full"
      >
        <Image src={googleIcon} alt="Google"  className="h-6 w-6" />
        Continue with Google
      </button>
      {/* <button
        type="button"
        onClick={() => console.log("continue with apple")}
        className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#ccd4e1] bg-white text-sm font-medium text-[#111827] transition hover:bg-[#fbfcfe]"
      >
        <Image src={appleIcon} alt="Apple"  className="h-6 w-6" />
        Continue with Apple
      </button> */}
    </div>
  );
}

export function OTPBoxes({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const otpLength = 6;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: otpLength }, (_, index) => value[index] ?? "");

  const updateValue = (nextDigits: string[], focusIndex?: number) => {
    const merged = nextDigits.slice(0, otpLength).join("");
    onChange(merged);

    if (typeof focusIndex === "number") {
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength);
    if (!pasted) return;

    event.preventDefault();

    const nextDigits = value.padEnd(otpLength, "").split("");
    pasted.split("").forEach((digit, offset) => {
      nextDigits[startIndex + offset] = digit;
    });

    const nextFocusIndex = Math.min(startIndex + pasted.length, otpLength - 1);
    updateValue(nextDigits, nextFocusIndex);
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          aria-label={`otp-${index + 1}`}
          maxLength={1}
          value={digit}
          onChange={(event) => {
            const inputValue = event.target.value.replace(/\D/g, "");

            if (!inputValue) {
              const nextDigits = value.padEnd(otpLength, "").split("");
              nextDigits[index] = "";
              updateValue(nextDigits);
              return;
            }

            const nextDigits = value.padEnd(otpLength, "").split("");
            nextDigits[index] = inputValue.slice(-1);
            updateValue(nextDigits, Math.min(index + 1, otpLength - 1));
          }}
          onPaste={(event) => handlePaste(event, index)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }}
          className="h-[62px] w-[62px] rounded-2xl border border-[#cfd6e4] bg-white text-center text-[1.3rem] font-semibold text-[#111827] outline-none transition focus:border-[#1f2937] sm:h-[60px] sm:w-[60px]"
        />
      ))}
    </div>
  );
}

export function PasswordSuccessModal({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-[470px] rounded-[32px] bg-white px-8 py-12 text-center shadow-2xl">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#eceef1]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dfe3e8] text-[#162236]">
            <CheckCircle2 className="h-11 w-11" />
          </div>
        </div>
        <h3 className="mb-8 text-[clamp(1.6rem,3vw,2.2rem)] font-serif font-semibold leading-tight text-[#111827]">
          Password Changed
          <br />
          Successfully
        </h3>
        <button
          type="button"
          onClick={() => {
            onClose();
            onDone();
          }}
          className="flex h-[60px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0d1524] to-[#1c2639] text-[1rem] font-medium tracking-[0.08em] text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] transition hover:brightness-110"
        >
          DONE
        </button>
      </div>
    </div>
  );
}