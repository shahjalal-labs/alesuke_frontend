"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProfileSetupShell } from "./ProfileSetupShell";
import type { AppDispatch } from "@/redux/store";
import { setNickname } from "@/redux/profileSetupSlice";
import type { RootState } from "@/redux/store";

export default function NickName() {
  const storedNickname = useSelector((state: RootState) => state.profileSetup.nickname);
  const [nickName, setNickName] = useState(storedNickname);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleNext = () => {
    dispatch(setNickname(nickName.trim()));
    router.push("/profile-setup/nric"); // Changed from marital-status to nric
  };

  return (
    <ProfileSetupShell
      step={5}
      stepLabel="A few questions to get us started"
      title={
        <>
          And what should we call you?
          <br />
          <span className="text-[1.45rem] sm:text-[1.7rem]">(Optional)</span>
        </>
      }
      description={
        <span>
          We'll use your preferred name here to keep things friendly, saving the full legal
          name for the official paperwork
        </span>
      }
      backHref="/profile-setup/name"
      nextHref="/profile-setup/nric" // Changed from marital-status to nric
      nextDisabled={false}
      onNext={handleNext}
    >
      <div className="rounded-[10px] bg-[#f3e6d7] px-5 py-6 sm:px-8 sm:py-8">
        <input
          value={nickName}
          onChange={(event) => setNickName(event.target.value)}
          placeholder="What shall we call you?"
          className="h-12 w-full rounded-[4px] border-0 bg-white px-4 text-[0.98rem] text-[#2f3646] outline-none ring-0 placeholder:text-[#a9afbb] focus-visible:outline-none"
        />
      </div>
    </ProfileSetupShell>
  );
}