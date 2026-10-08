"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthShell,
  AuthTabs,
  Divider,
  PrimaryButton,
  SocialRow,
} from "./AuthUI";
import { useUserSignUpMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const router = useRouter();

  const [userSignUp, { isLoading }] = useUserSignUpMutation();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsDuplicate(false);
    try {
      const response = await userSignUp({
        fullName,
        email,
        password,
        logInProcess: "EMAIL",
        keepMeLogin: false,
      }).unwrap();
      if (response?.success) {
        toast.success(
          "Sign up successful! Please check your email for the OTP.",
        );
        router.push(`/verification?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      console.error("Sign up failed:", error);
      const rawMsg =
        error?.data?.message ||
        error?.message ||
        "Sign up failed. Please try again.";
      const isExisting = rawMsg.toLowerCase().includes("already exists");
      const friendlyMsg = isExisting
        ? "An account with this email already exists. Please log in instead."
        : rawMsg;

      setErrorMessage(friendlyMsg);
      setIsDuplicate(isExisting);
      toast.error(friendlyMsg);
    }
  };

  return (
    <AuthShell
      tabs={
        <AuthTabs
          active="signup"
          onChange={(value) => {
            router.push(value === "login" ? "/login" : "/signUp");
          }}
        />
      }
    >
      <form onSubmit={(e) => handleSignUp(e)} className="w-full">
        <div className="text-start">
          <h1 className="font-serif text-[30px] leading-tight text-[#111827]">
            Create Your Account
          </h1>
          <p className="mt-3 text-[0.95rem] text-[#7b8596]">
            Create account and enjoy all services
          </p>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-[6px] border border-amber-300 bg-[#fffbeb] p-3.5 text-[0.9rem] text-[#92400e] flex items-center justify-between gap-3">
            <span>{errorMessage}</span>
            {isDuplicate && (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold underline text-[#78350f] hover:text-[#451a03] whitespace-nowrap"
              >
                Log In →
              </button>
            )}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <AuthField
            label="Full Name"
            placeholder="Full Name"
            icon="user"
            value={fullName}
            onChange={(value) => {
              setFullName(value);
              // console.log("sign up full name", value);
            }}
          />

          <AuthField
            label="Email Address"
            placeholder="name@legacy.com"
            icon="mail"
            value={email}
            onChange={(value) => {
              setEmail(value);
              // console.log("sign up email", value);
            }}
          />

          <AuthField
            label="Password"
            placeholder="••••••••••••"
            icon="lock"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              // console.log("sign up password", value);
            }}
            showToggle
          />

          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? "SIGNING UP..." : "SIGN UP"}
          </PrimaryButton>
        </div>

        <Divider label="OR" />
        <SocialRow />
      </form>
    </AuthShell>
  );
}

export default SignUp;

