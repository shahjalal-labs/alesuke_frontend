"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { ExecutorLayout } from "@/components/dashboard/executor/executor-flow";

export default function GreatWork() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/will");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <ExecutorLayout>
      <div className="flex min-h-[calc(100vh-190px)] items-center justify-center px-4">
        <div className="w-full max-w-[460px] rounded-[24px] bg-white px-8 py-16 text-center shadow-[0_20px_50px_rgba(27,32,48,0.04)]">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#dde0e4] text-[#172031]">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <h1 className="mt-10 text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-[#141010]">
            Great work!
          </h1>
          <p className="mt-4 text-[0.95rem] text-[#a0a7b3]">
            You have successfully completed this section!
          </p>
        </div>
      </div>
    </ExecutorLayout>
  );
}