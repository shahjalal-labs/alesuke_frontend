import { ReactNode } from "react";
import Header from "@/shared/Header";
// import Footer from "@/shared/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      <Header />

      <main className="min-h-[calc(100vh-360px)]">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
