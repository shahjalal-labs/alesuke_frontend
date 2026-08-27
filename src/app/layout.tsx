import type { Metadata } from "next";
import "./globals.css";
import logo from "@/assets/favicon.svg";

// import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "sonner";
import { Providers } from "./providers/providers";
import { AuthSync } from "@/components/auth/AuthSync";
// import logo from "@/assets/home/kkk-logo.png";

export const metadata: Metadata = {
  title: "Will & Way",
  description: "Will & Way is a platform for creating and sharing wills.",
  icons: {
    icon: logo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <NavBar /> */}
        <Providers>
          {" "}
          <AuthSync /> 
          {children}
        </Providers>
        <Toaster />

        {/* <Footer /> */}
      </body>
    </html>
  );
}
