"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthField, AuthShell, PrimaryButton } from "../AuthUI";
import { useForgetPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await forgetPassword({ email }).unwrap();

      if (response?.success) {
        toast.success("Verification code sent to your email.");
        router.push(`/reset-password/verification?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast.error("Unable to send verification code. Please try again.");
    }
  };

  return (
    <AuthShell>
      <form
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="text-start">
          <h1 className="font-serif text-[30px] leading-tight text-[#111827]">
            Reset Your Password
          </h1>
          <p className="mt-3 text-[0.95rem] text-[#7b8596]">Enter your email to get a verification code.</p>
        </div>

        <div className="mt-8 space-y-8">
          <AuthField
            label="Email Address"
            placeholder="name@legacy.com"
            icon="mail"
            value={email}
            onChange={(value) => {
              setEmail(value);
              console.log("reset password email", value);
            }}
          />

          <PrimaryButton type="submit" disabled={isLoading}>{isLoading ? "SENDING..." : "SEND CODE"}</PrimaryButton>
        </div>
      </form>
    </AuthShell>
  );
}

export default ResetPassword;