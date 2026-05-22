"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, OTPBoxes, PrimaryButton } from "./AuthUI";
import { useAuthVerifyOtpMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import Cookies from "js-cookie";

function Verification() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [userVerifyOTP, { isLoading }] = useAuthVerifyOtpMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error("Missing email address. Please restart the sign up flow.");
      return;
    }

    try {
      const response = await userVerifyOTP({
        email,
        code,
        purpose: "EMAIL_VERIFICATION",
      }).unwrap();

      if (response?.success) {
        const token = response?.data?.token ;
        if (token) {
          Cookies.set("accessToken", token);
        }
        toast.success("Email verified successfully. You can now log in.");
        router.push("/will");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Invalid verification code. Please try again.");
    }
  };

  return (
    <AuthShell>
      <form
        onSubmit={handleSubmit}
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
              console.log("verification code", value);
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