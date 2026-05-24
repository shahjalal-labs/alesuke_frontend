import ctaBg from "@/assets/ctaBg.png";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="px-8 pb-20 pt-12">
      <div className="relative mx-auto container flex min-h-[600px] items-center justify-center overflow-hidden rounded-[20px]">
        {/* Background image */}
        <img
          src={ctaBg.src}
          alt="cta background"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ left: 0, top: 0 }}
        />

        {/* Dark overlay to match design */}
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 px-8 py-12 text-center w-full">
          <h2 className="mb-6 text-[clamp(2.25rem,6vw,3.5rem)]  font-bold tracking-[-0.02em] text-white">
            Make a Will Online
          </h2>
          <p className="mx-auto mb-8 max-w-[720px] text-[1.05rem] leading-[1.8] text-white/80  italic">
            Secure your family's future in just 15 minutes. No lawyers, no stress — just a legally valid will you can trust.
          </p>

          <div className="flex items-center justify-center">
           <Link href="/login"> <button className="rounded-lg bg-white px-10 py-4 text-[1rem] font-bold tracking-[0.04em] text-[#1e1912] transition-colors duration-200 hover:bg-[#f5f0e8] shadow-lg">
              Start For Free
            </button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
