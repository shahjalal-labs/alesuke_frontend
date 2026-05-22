"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, OTPBoxes, PrimaryButton } from "../AuthUI";
import { useAuthVerifyOtpMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

function Verification() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [userVerifyOTP, { isLoading }] = useAuthVerifyOtpMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      toast.error("Missing email address. Please restart the reset password flow.");
      return;
    }

    try {
      const response = await userVerifyOTP({
        email,
        code,
        purpose: "PASSWORD_RESET",
      }).unwrap();
      if (response?.success) {
        const token = response?.data?.token ?? response?.token ?? response?.data?.verificationToken;
        toast.success("Verification successful. Create your new password.");
        router.push(`/new-password?email=${encodeURIComponent(email)}${token ? `&token=${encodeURIComponent(token)}` : ""}`);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Invalid verification code. Please try again.");
    }
  };

  return (
    <AuthShell>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-full text-start"
      >
        <h1 className="font-serif text-[30px] leading-tight text-[#111827]">
          Verification code
        </h1>
        <p className="mt-3 text-[0.95rem] text-[#7b8596]">We sent a six digit code to your email address</p>

        <div className="mt-8">
          <OTPBoxes
            value={code}
            onChange={(value) => {
              setCode(value);
              console.log("reset verification code", value);
            }}
          />
        </div>

        <div className="mt-8">
          <PrimaryButton type="submit" disabled={isLoading}>{isLoading ? "VERIFYING..." : "SUBMIT"}</PrimaryButton>
        </div>
      </form>
    </AuthShell>
  );
}

export default Verification;