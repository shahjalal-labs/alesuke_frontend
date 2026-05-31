"use client";

import ReduxProvider from "@/redux/ReduxProvider";
// import ReduxProvider from "@/redux/ReduxProvider";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ReduxProvider>
        {children}
        <Toaster />
      </ReduxProvider>
    </SessionProvider>
  );
}
