"use client";

import { useRouter } from "next/navigation";
import { CircleDot, Circle } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProfileSetupShell } from "./ProfileSetupShell";
import type { AppDispatch } from "@/redux/store";
import { setReligion } from "@/redux/profileSetupSlice";
import type { RootState } from "@/redux/store";

type ReligionCategory = "muslim" | "non-muslim";
type NonMuslimReligion = "CHRISTIAN" | "BUDDHIST" | "HINDU" | "JUDAISM" | "SIKH"| "TAOISM" | "OTHER";

export default function Religion() {
  const storedReligion = useSelector((state: RootState) => state.profileSetup.religion);
  const [category, setCategory] = useState<ReligionCategory>(storedReligion && storedReligion !== "MUSLIM" ? "non-muslim" : "muslim");
  const [selectedReligion, setSelectedReligion] = useState<NonMuslimReligion | "MUSLIM" | null>(storedReligion ?? "MUSLIM");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const nonMuslimOptions: Array<{ value: NonMuslimReligion; label: string }> = [
    { value: "CHRISTIAN", label: "Christian" },
    { value: "BUDDHIST", label: "Buddhist" },
    { value: "HINDU", label: "Hindu" },
    { value: "JUDAISM", label: "Judaism" },
    { value: "SIKH", label: "Sikh" },
    { value: "TAOISM", label: "Taoism" },
    { value: "OTHER", label: "Other" },
  ];

  const handleNext = () => {
    if (!selectedReligion) return;
    dispatch(setReligion(selectedReligion));
    router.push("/profile-setup/name");
  };

  const selectMuslim = () => {
    setCategory("muslim");
    setSelectedReligion("MUSLIM");
  };

  const selectNonMuslim = () => {
    setCategory("non-muslim");
    setSelectedReligion(storedReligion && storedReligion !== "MUSLIM" ? storedReligion : null);
  };

  const selectNonMuslimReligion = (value: NonMuslimReligion) => {
    setCategory("non-muslim");
    setSelectedReligion(value);
  };

  return (
    <ProfileSetupShell
      step={3}
      stepLabel="A few questions to get us started"
      title={<>State your religion</>}
      description={
        <span>Succession laws are based on religious affiliation in Singapore.</span>
      }
      backHref="/profile-setup/age"
      nextHref="/profile-setup/name"
      nextDisabled={!selectedReligion || selectedReligion === "MUSLIM"}
      onNext={handleNext}
    >
      <div className="space-y-4">
        <div className="rounded-[10px] bg-[#f3e6d7] px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-5">
            <button
              type="button"
              onClick={selectMuslim}
              className="flex w-full items-center justify-between rounded-[6px] bg-white px-5 py-4 text-left transition-shadow hover:shadow-[0_0_0_1px_rgba(34,41,56,0.08)]"
            >
              <span className={`text-[1rem] font-medium ${category === 'muslim' ? 'text-[#2f3646]' : 'text-[#9aa1af]'}`}>
                Muslim
              </span>
              {category === 'muslim' ? (
                <CircleDot className="h-5 w-5 text-[#1f2534]" />
              ) : (
                <Circle className="h-5 w-5 text-[#b1b8c4]" />
              )}
            </button>

            <button
              type="button"
              onClick={selectNonMuslim}
              className="flex w-full items-center justify-between rounded-[6px] bg-white px-5 py-4 text-left transition-shadow hover:shadow-[0_0_0_1px_rgba(34,41,56,0.08)]"
            >
              <span className={`text-[1rem] font-medium ${category === 'non-muslim' ? 'text-[#2f3646]' : 'text-[#9aa1af]'}`}>
                Non-Muslim
              </span>
              {category === 'non-muslim' ? (
                <CircleDot className="h-5 w-5 text-[#1f2534]" />
              ) : (
                <Circle className="h-5 w-5 text-[#b1b8c4]" />
              )}
            </button>
          </div>
        </div>

        {category === "non-muslim" ? (
          <div className="rounded-[10px] bg-[#f3e6d7] px-5 py-5 sm:px-8 sm:py-6">
            <p className="mb-4 text-[0.95rem] font-medium text-[#1f1f1f] sm:text-[1rem]">
              Select your religion
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {nonMuslimOptions.map((option) => {
                const isSelected = selectedReligion === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectNonMuslimReligion(option.value)}
                    className="flex w-full items-center justify-between rounded-[6px] bg-white px-5 py-4 text-left transition-shadow hover:shadow-[0_0_0_1px_rgba(34,41,56,0.08)]"
                  >
                    <span className={`text-[1rem] font-medium ${isSelected ? 'text-[#2f3646]' : 'text-[#9aa1af]'}`}>
                      {option.label}
                    </span>
                    {isSelected ? (
                      <CircleDot className="h-5 w-5 text-[#1f2534]" />
                    ) : (
                      <Circle className="h-5 w-5 text-[#b1b8c4]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {selectedReligion === "MUSLIM" ? (
        <p className="mt-6 max-w-[620px] text-[0.95rem] leading-[1.45] text-[#7b8190] sm:text-[1rem]">
          If you are a Muslim, you are governed by the Administration of Muslim Law Act (AMLA)
          and Syariah law (Faraid). please do not proceed with our service as we do not cater to
          these laws
        </p>
      ) : null}
    </ProfileSetupShell>
  );
}