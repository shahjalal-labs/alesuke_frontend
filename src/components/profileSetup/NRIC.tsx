"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProfileSetupShell } from "./ProfileSetupShell";
import type { AppDispatch } from "@/redux/store";
import { setNRIC } from "@/redux/profileSetupSlice";
import type { RootState } from "@/redux/store";

export default function NRIC() {
  const storedNRIC = useSelector((state: RootState) => state.profileSetup.nric);
  const [nric, setNRICValue] = useState(storedNRIC || "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleNext = () => {
    if (nric.trim()) {
      dispatch(setNRIC(nric.trim()));
      router.push("/profile-setup/marital-status");
    }
  };

  // Format NRIC/FIN input (optional - you can customize this)
  const handleNRICChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.toUpperCase();
    
    // Basic formatting: S/T/F/G + 7 digits + letter
    // This is just for display, you can modify as needed
    value = value.replace(/[^A-Z0-9]/g, "");
    
    // Limit to 9 characters (S1234567A format)
    if (value.length <= 9) {
      setNRICValue(value);
    }
  };

  return (
    <ProfileSetupShell
      step={6}
      stepLabel="A few questions to get us started"
      title="What's your NRIC/FIN?"
      description={
        <span>
          We need your NRIC or FIN number for official verification purposes. 
          This information is required to complete your profile setup.
        </span>
      }
      backHref="/profile-setup/nickname"
      nextHref="/profile-setup/marital-status"
      nextDisabled={!nric.trim()}
      onNext={handleNext}
    >
      <div className="rounded-[10px] bg-[#f3e6d7] px-5 py-6 sm:px-8 sm:py-8">
        <input
          value={nric}
          onChange={handleNRICChange}
          placeholder="e.g., S1234567A"
          className="h-12 w-full rounded-[4px] border-0 bg-white px-4 text-[0.98rem] text-[#2f3646] outline-none ring-0 placeholder:text-[#a9afbb] focus-visible:outline-none"
          maxLength={9}
          aria-label="NRIC or FIN number"
        />
        <p className="mt-2 text-[0.8rem] text-[#7a8090]">
          Format: S/T/F/G followed by 7 digits and a letter (e.g., S1234567A)
        </p>
      </div>
    </ProfileSetupShell>
  );
}