import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function ProfileSetupLayout({ children }: LayoutProps) {
  return <div className="min-h-screen bg-[#FFF8F3] pt-20">{children}</div>;
}