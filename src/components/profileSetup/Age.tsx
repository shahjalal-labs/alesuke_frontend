"use client";

import { useRouter } from "next/navigation";
import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChoiceCard, ProfileSetupShell } from "./ProfileSetupShell";
import type { AppDispatch } from "@/redux/store";
import { setAge } from "@/redux/profileSetupSlice";
import type { RootState } from "@/redux/store";

export default function Age() {
  const storedAge = useSelector((state: RootState) => state.profileSetup.age);
  const [choice, setChoice] = useState<"over" | "under">(storedAge ?? "over");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleNext = () => {
    dispatch(setAge(choice));
    router.push("/profile-setup/religion");
  };

  return (
    <ProfileSetupShell
      step={2}
      stepLabel="A few questions to get us started"
      title={
        <>
          Are you over 21 years old?
        </>
      }
      backHref="/profile-setup/get-started"
      nextHref="/profile-setup/religion"
      nextDisabled={choice === "under"}
      onNext={handleNext}
    >
      <div className="rounded-[10px] bg-[#f3e6d7] px-5 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ChoiceCard
            selected={choice === "over"}
            onClick={() => setChoice("over")}
            title={<span>I am over 21</span>}
            icon={<CircleCheck className="h-6 w-6" />}
          />
          <ChoiceCard
            selected={choice === "under"}
            onClick={() => setChoice("under")}
            title={<span>I am under 21</span>}
            icon={<CircleX className="h-6 w-6" />}
          />
        </div>
      </div>

      {choice === "under" ? (
        <p className="mt-6 max-w-[640px] text-base leading-[1.45] text-gray-600 bg-red-200 border-t-4 border-red-400 py-5 text-center sm:text-[1rem]">
          You must be over 21 to create a will.
        </p>
      ) : null}
    </ProfileSetupShell>
  );
}