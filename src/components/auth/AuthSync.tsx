"use client";

import {
  useLazyGetMeDataQuery,
  useUserSocialLoginMutation,
} from "@/redux/api/authApi";
import { setUser } from "@/redux/ReduxFunction";
// import { useUserStoreMutation } from "@/redux/api/registerApi";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const AuthSync = () => {
  const { data: session, status } = useSession();
  const [storeUser] = useUserSocialLoginMutation();
  const [fetchMeData] = useLazyGetMeDataQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isStoringUser, setIsStoringUser] = useState(false);

  useEffect(() => {
    const syncUserToken = async () => {
      const isGoogleSignIn = localStorage.getItem("googleSignIn");

      const name = session?.user?.name ?? "";
      // const [firstName, ...lastNameParts] = name.split(" ");
      // const lastName = lastNameParts.join(" ");

      // Only sync if user clicked Google login
      if (status === "authenticated" && session?.user && isGoogleSignIn) {
        const existingToken = Cookies.get("accessToken");

        if (!existingToken) {
          setIsStoringUser(true);
          try {
            const response = await storeUser({
              fullName: session.user.name,
              email: session.user.email,
              logInProcess: "GOOGLE",
            }).unwrap();

            if (response?.data?.accessToken) {
              Cookies.set("accessToken", response.data.accessToken);
              toast.success("Google login synced successfully!");
            }
            const meResponse = await fetchMeData(undefined).unwrap();
            const me = meResponse?.data;
            dispatch(
              setUser({
                role: me?.role ?? "",
                token: response?.data?.accessToken ?? "",
                email: me?.email ?? "",
                me,
              }),
            );
            router.push(meResponse?.data?.isProfileCompleted ? "/will" : "/profile-setup/get-started");
          } catch (error) {
            console.error("❌ Failed to sync token:", error);
            toast.error("Failed to sync Google account!");
          } finally {
            setIsStoringUser(false);
            // Clear flag to prevent auto-sync again
            localStorage.removeItem("googleSignIn");
          }
        }
      }
    };

    syncUserToken();
  }, [status, session, storeUser, router]);

  return (
    <>
      {isStoringUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-800 text-lg font-medium animate-pulse">
              Syncing your account...
            </p>
            <p className="text-gray-500 text-sm">
              Please wait a moment while we get things ready
            </p>
          </div>
        </div>
      )}
    </>
  );
};
