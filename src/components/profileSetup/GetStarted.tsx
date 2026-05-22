"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { ProfileSetupShell } from "./ProfileSetupShell";
import type { AppDispatch } from "@/redux/store";
import { setCountry } from "@/redux/profileSetupSlice";
import type { RootState } from "@/redux/store";

export default function GetStarted() {
  const storedCountry = useSelector((state: RootState) => state.profileSetup.country);
  const [selectedCountry, setSelectedCountry] = useState(storedCountry);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const countryCode = selectedCountry === "Singapore" ? "SG" : selectedCountry.slice(0, 2).toUpperCase();

  return (
    <ProfileSetupShell
      step={1}
      stepLabel="Let's get started!"
      title={
        <>
          Write a will
          <br />
          designed around you
        </>
      }
      description={
        <span>
          You may want to have the following handy before starting:
        </span>
      }
      nextHref="/profile-setup/age"
      nextLabel="Get Started"
      footerLabel={selectedCountry}
      onCountryChange={(country) => {
        setSelectedCountry(country);
        dispatch(setCountry(country));
      }}
      onNext={() => router.push("/profile-setup/age")}
    >
      <div className="rounded-[10px] bg-[#f3e6d7] px-5 py-5 sm:px-6 sm:py-6">
        <div className="space-y-4 text-[#6d7688] sm:space-y-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#71798a]" />
            <p className="text-[1rem] font-semibold leading-[1.35] tracking-[-0.02em] sm:text-[1.05rem]">
              The names and IDs of the people you want in this will
            </p>
          </div>

          <div className="flex items-start gap-3 sm:gap-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#71798a]" />
            <p className="text-[1rem] font-semibold leading-[1.35] tracking-[-0.02em] sm:text-[1.05rem]">
              The addresses of any NON joint-tenancy properties that you own.
              I.e. tenancy in common.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#6f6a61]">
            Your legal documents are for the following:
          </p>
          <div className="mt-2 flex items-center gap-3 rounded-[3px] bg-white px-4 py-3 text-[#8f96a5] shadow-[0_1px_0_rgba(17,24,39,0.03)]">
            <span className="text-[0.92rem] font-medium tracking-[0.02em]">{countryCode}</span>
            <span className="text-[0.92rem]">{selectedCountry}</span>
          </div>
        </div>
      </div>

      <p className="mt-8 text-[1rem] text-[#7c8190] sm:text-[1.05rem]">
        You can also start now, and finish later
      </p>

    </ProfileSetupShell>
  );
}