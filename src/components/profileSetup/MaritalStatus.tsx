"use client";

import { Heart, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLazyGetMeDataQuery } from "@/redux/api/authApi";
import { useDeleteMemberMutation, useGetAllMemberListQuery, useUpdateProfileMutation } from "@/redux/api/profileApi";
import { setUser } from "@/redux/ReduxFunction";
import { resetProfileSetup, setMaritalStatus } from "@/redux/profileSetupSlice";
import type { AppDispatch, RootState } from "@/redux/store";

import { ChoiceCard, ProfileSetupShell } from "./ProfileSetupShell";

type MaritalStatusValue = "single" | "married" | "relationship";

const toApiMaritalStatus = (value: MaritalStatusValue) => {
  if (value === "married") return "MARRIED" as const;
  if (value === "relationship") return "LONG_TERM_PARTNER" as const;
  return "SINGLE" as const;
};

const fromApiMaritalStatus = (value: NonNullable<ReturnType<typeof toApiMaritalStatus>>) => {
  if (value === "MARRIED") return "married" as const;
  if (value === "LONG_TERM_PARTNER") return "relationship" as const;
  return "single" as const;
};

export default function MaritalStatus() {
  const profileSetup = useSelector((state: RootState) => state.profileSetup);
  const auth = useSelector((state: RootState) => state.auth);
  const [status, setStatus] = useState<MaritalStatusValue>(
    profileSetup.maritalStatus ? fromApiMaritalStatus(profileSetup.maritalStatus) : "single"
  );
  const [saving, setSaving] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [fetchMeData] = useLazyGetMeDataQuery();
  const { data: allMembers = [] } = useGetAllMemberListQuery(undefined);
  const [deleteMember] = useDeleteMemberMutation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const relatedMemberIds = (allMembers as Array<{ id?: string; relationType?: string }>).
    filter((member) => ["SPOUSE", "PARTNER", "CHILD"].includes(member.relationType ?? ""))
    .map((member) => member.id)
    .filter((id): id is string => Boolean(id));

  useEffect(() => {
    if (profileSetup.maritalStatus) {
      setStatus(fromApiMaritalStatus(profileSetup.maritalStatus));
    }
  }, [profileSetup.maritalStatus]);

  const handleNext = async () => {
    const apiMaritalStatus = toApiMaritalStatus(status);
    dispatch(setMaritalStatus(apiMaritalStatus));
    setSaving(true);

    const finalProfileData = {
      ...profileSetup,
      maritalStatus: apiMaritalStatus,
    };

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        fullName: finalProfileData.fullName,
        nickname: finalProfileData.nickname,
        religion: finalProfileData.religion,
        maritalStatus: finalProfileData.maritalStatus,
      })
    );

    try {
      await updateProfile(formData).unwrap();

      if (status !== "married" && relatedMemberIds.length) {
        await Promise.all(relatedMemberIds.map((id) => deleteMember(id).unwrap()));
      }

      const meResponse = await fetchMeData(undefined).unwrap();

      dispatch(
        setUser({
          role: auth.role,
          token: auth.token,
          email: auth.email,
          me: meResponse?.data ?? auth.me,
        })
      );
      dispatch(resetProfileSetup());

      toast.success("Profile completed successfully.");
      router.push("/will");
    } catch (error) {
      console.error("Profile completion failed:", error);
      toast.error("Unable to complete profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSetupShell
      step={6}
      stepLabel="A few questions to get us started"
      title={<>Your marital status</>}
      description={<span>You must update your will if there is a change in your marital status.</span>}
      backHref="/profile-setup/nickname"
      nextHref="/will"
      nextDisabled={isLoading || saving}
      onNext={handleNext}
    >
      <div className="space-y-5">
        <p className="text-[0.95rem] text-[#1f1f1f] sm:text-[1rem]">Select 1 option below</p>

        <div className="rounded-[10px] bg-[#f3e6d7] px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ChoiceCard
              selected={status === "single"}
              onClick={() => setStatus("single")}
              title={<span>Single</span>}
              icon={<User className="h-5 w-5" />}
              compact
            />
            <ChoiceCard
              selected={status === "married"}
              onClick={() => setStatus("married")}
              title={<span>Married</span>}
              icon={<Users className="h-5 w-5" />}
              compact
            />
            <ChoiceCard
              selected={status === "relationship"}
              onClick={() => setStatus("relationship")}
              title={
                <span>
                  In a
                  <br />
                  relationship
                </span>
              }
              icon={<Heart className="h-5 w-5" />}
              compact
            />
          </div>
        </div>

        {status === "single" ? (
          <p className="text-[0.98rem] text-[#5e6574]">Pick an option that currently describes your status.</p>
        ) : (
          <p className="text-[0.98rem] text-[#5e6574]">
            You can manage spouse or partner details in the You & your family section after you save.
          </p>
        )}
      </div>
    </ProfileSetupShell>
  );
}