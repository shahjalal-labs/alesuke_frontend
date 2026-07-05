"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, OTPBoxes, PrimaryButton } from "./AuthUI";
import { useAuthVerifyOtpMutation, useLazyGetMeDataQuery, useResendVerifyOtpMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/ReduxFunction";
import type { AppDispatch } from "@/redux/store";

function Verification() {
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [userVerifyOTP, { isLoading }] = useAuthVerifyOtpMutation();
  const [resentOtp, { isLoading: isResending }] = useResendVerifyOtpMutation();
  const [fetchMeData] = useLazyGetMeDataQuery();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error("Missing email address. Please restart the sign up flow.");
      return;
    }

    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      const response = await userVerifyOTP({
        email,
        code,
        purpose: "EMAIL_VERIFICATION",
      }).unwrap();

      if (response?.success) {
        const token = response?.data?.accessToken;
        if (token) {
          Cookies.set("accessToken", token);
        }

        const meResponse = await fetchMeData(undefined).unwrap();
        const me = meResponse?.data;

        dispatch(
          setUser({
            role: me?.role ?? "",
            token: token ?? "",
            email: me?.email ?? email,
            me,
          })
        );

        toast.success("Email verified successfully.");
        router.push(meResponse?.data?.isProfileCompleted ? "/will" : "/profile-setup/get-started");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Invalid verification code. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) {
      toast.info(`Please wait ${resendCooldown} seconds before requesting another code.`);
      return;
    }

    if (!email) {
      toast.error("Email address is missing. Please restart the sign up flow.");
      return;
    }

    try {
      const response = await resentOtp({
        email: email,
        purpose: "EMAIL_VERIFICATION",
      }).unwrap();

      if (response?.success) {
        toast.success("A new verification code has been sent to your email.");
        // Start cooldown timer (60 seconds)
        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(response?.message || "Failed to resend verification code.");
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
      toast.error("Failed to resend verification code. Please try again.");
    }
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    if (seconds === 0) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="w-full text-start">
        <h1 className="font-serif text-[30px] leading-tight text-[#111827]">
          Verification code
        </h1>
        <p className="mt-3 text-[0.95rem] text-[#7b8596]">
          We sent a six digit code to your email address
        </p>

        <div className="mt-8">
          <OTPBoxes
            value={code}
            onChange={(value) => {
              setCode(value);
              // console.log("verification code", value);
            }}
          />
        </div>

        <div className="mt-8">
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? "VERIFYING..." : "SUBMIT"}
          </PrimaryButton>
        </div>

        {/* Resend OTP Section */}
        <div className="mt-6 text-center">
          <p className="text-base text-[#7b8596]">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending || resendCooldown > 0}
              className={`font-medium transition-colors ${
                isResending || resendCooldown > 0
                  ? "text-[#7b8596] cursor-not-allowed"
                  : "text-[#b8860b] hover:text-[#a0760a] cursor-pointer border-b-2 border-transparent hover:border-[#b8860b]"
              }`}
            >
              {isResending
                ? "SENDING..."
                : resendCooldown > 0
                ? `Resend (${formatTime(resendCooldown)})`
                : "Resend Code"}
            </button>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}

export default Verification;