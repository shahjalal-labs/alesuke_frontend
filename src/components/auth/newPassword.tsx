"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthField, AuthShell, PasswordSuccessModal, PrimaryButton } from "./AuthUI";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !token) {
      toast.error("Missing reset token. Please restart the password reset flow.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword({
        email,
        password,
        token,
      }).unwrap();

      if (response?.success) {
        setSuccessOpen(true);
      }
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error("Unable to change password. Please try again.");
    }
  };

  return (
    <AuthShell>
      <form
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="text-center lg:text-left">
          <h1 className="font-serif text-[clamp(2rem,3vw,2.9rem)] leading-tight text-[#111827]">
            Create New Password
          </h1>
          <p className="mt-3 text-[0.95rem] text-[#7b8596]">Your password must be different from previous used password</p>
        </div>

        <div className="mt-8 space-y-6">
          <AuthField
            label="New Password"
            placeholder="••••••••••••"
            icon="lock"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              // console.log("new password", value);
            }}
            showToggle
          />

          <AuthField
            label="Confirm New Password"
            placeholder="••••••••••••"
            icon="lock"
            type="password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              // console.log("confirm password", value);
            }}
            showToggle
          />

          <PrimaryButton type="submit" disabled={isLoading}>{isLoading ? "UPDATING..." : "SUBMIT"}</PrimaryButton>
        </div>
      </form>

      <PasswordSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onDone={() => router.push("/login")}
      />
    </AuthShell>
  );
}

export default NewPassword;