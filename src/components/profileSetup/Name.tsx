"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProfileSetupShell } from "./ProfileSetupShell";
import type { AppDispatch } from "@/redux/store";
import { setFullName } from "@/redux/profileSetupSlice";
import type { RootState } from "@/redux/store";

export default function Name() {
  const storedName = useSelector((state: RootState) => state.profileSetup.fullName);
  const [name, setName] = useState(storedName);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleNext = () => {
    dispatch(setFullName(name.trim()));
    router.push("/profile-setup/nickname");
  };

  return (
    <ProfileSetupShell
      step={4}
      stepLabel="A few questions to get us started"
      title={<>What is your name?</>}
      description={<span>This is your full legal name.</span>}
      backHref="/profile-setup/religion"
      nextHref="/profile-setup/nickname"
      nextDisabled={!name.trim()}
      onNext={handleNext}
    >
      <div className="rounded-[10px] bg-[#f3e6d7] px-5 py-6 sm:px-8 sm:py-8">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Type your full name here"
          className="h-12 w-full rounded-[4px] border-0 bg-white px-4 text-[0.98rem] text-[#2f3646] outline-none ring-0 placeholder:text-[#a9afbb] focus-visible:outline-none"
        />
      </div>
    </ProfileSetupShell>
  );
}