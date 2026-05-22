import type { Metadata } from "next";
import "./globals.css";
// import logo from "@/assets/logo.svg"
// import logo from "@/assets/Logo.png";

import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "sonner";
// import logo from "@/assets/home/kkk-logo.png";

export const metadata: Metadata = {
  title: "Will & Way",
  description: "Will & Way is a platform for creating and sharing wills.",
  icons: {
    // icon: logo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* <NavBar /> */}
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster />

        {/* <Footer /> */}
      </body>
    </html>
  );
}
