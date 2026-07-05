"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthField, AuthShell, AuthTabs, Divider, PrimaryButton, SocialRow } from "./AuthUI";
import { useLazyGetMeDataQuery, useLoginUserMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/ReduxFunction";
import type { AppDispatch } from "@/redux/store";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [fetchMeData] = useLazyGetMeDataQuery();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await loginUser({
        email,
        password,
        keepMeLogin: false,
      }).unwrap();
      // console.log("login response", response);
      const token = response?.data?.accessToken ;

      if (token) {
        Cookies.set("accessToken", token);
      }

      toast.success("Login successful.");

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

      const isProfileCompleted = meResponse?.data?.isProfileCompleted;

      router.push(isProfileCompleted ? "/will" : "/profile-setup/get-started");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  //  const handleGoogleLogin = () => {
  //   setGoogleLoading(true);
  //   localStorage.setItem("googleSignIn", "true");

  //   signIn("google").catch((err) => {
  //     console.error("Google login error:", err);
  //     toast.error("Google login failed. Please try again.");
  //     setGoogleLoading(false);
  //   });
  // };


  return (
    <AuthShell
      tabs={
        <AuthTabs
          active="login"
          onChange={(value) => {
            router.push(value === "login" ? "/login" : "/signUp");
          }}
        />
      }
    >
      <form
        onSubmit={handleLogin}
        className="w-full"
      >
        <div className="text-start">
          <h1 className="font-serif text-[30px] leading-tight text-[#111827]">
            Welcome back to your legacy
          </h1>
          <p className="mt-3 text-[0.95rem] text-[#7b8596]">Please authenticate to access your private vault.</p>
        </div>

        <div className="mt-8 space-y-6">
          <AuthField
            label="Email Address"
            placeholder="name@legacy.com"
            icon="mail"
            value={email}
            onChange={(value) => {
              setEmail(value);
              // console.log("login email", value);
            }}
          />

          <div>
            <AuthField
              label="Password"
              placeholder="••••••••••••"
              icon="lock"
              type="password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                // console.log("login password", value);
              }}
              showToggle
            />
            <button
              type="button"
              onClick={() => router.push("/reset-password")}
              className="mt-3 ml-auto block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#e11d48] transition hover:opacity-80"
            >
              Forgot Password?
            </button>
          </div>

          <PrimaryButton type="submit" disabled={isLoading}>{isLoading ? "LOGGING IN..." : "LOG IN"}</PrimaryButton>
        </div>

        <Divider label="Or Secure Login Via" />
        <SocialRow />
      </form>
    </AuthShell>
  );
}

export default Login;