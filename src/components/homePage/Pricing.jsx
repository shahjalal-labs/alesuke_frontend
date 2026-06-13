"use client";
import checkIcon from '@/assets/check.png'
import centerCImage from '@/assets/CloseUPenPaper.png';
import bookIcon from "@/assets/book.png";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const essentialFeatures = [
  "Comprehensive last will and final intentions",
  "Time & Value. Get your will in 15 mins that traditional firms provide in 15 days",
  "Final intentions – you last words of love",
  "Zero-access Legacy vault to revise your will. (Strictly confidential including us)",
  "1st 30 days unlimited revisions",
   "Digital Asset Memorandum — your digital life doesn't end after you pass on. Netflix, Grabunlimited, iCloud etc. Our will authorizes your executor/administrator to act and close your accounts.",
];

const unlimitedFeatures = [
  "Comprehensive last will and final intentions",
  "Time & Value. Get your will in 15 mins that traditional firms provide in 15 days",
  "Final intentions – you last words of love",
  "Unlimited changes for life",
  "Digital Asset Memorandum — your digital life doesn't end after you pass on. Netflix, Grabunlimited, iCloud etc. Our will authorizes your executor/administrator to act and close your accounts.",
];

function CheckIcon({ filled = true }) {
  return (
    <Image src={checkIcon} alt="Check" className="h-5 w-5" />
  );
}

export default function Pricing() {
  const pathname = usePathname();
  const isPricingPage = pathname === "/pricing";
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto container px-4">
        <h2 className="mb-14 text-center text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-[-0.02em] text-[#1e1912]">
        {isPricingPage ? "" : " Our Pricing For Peace Of Mind"}
        </h2>

        <div className="grid items-stretch gap-6 md:[grid-template-columns:minmax(0,1fr)_96px_minmax(0,1fr)]">
          <div className="flex flex-col gap-6 rounded-2xl border border-[#1e1912]/10 bg-secondary p-10 shadow-sm relative min-h-[520px]">
            <div>
              <p className="mb-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-[#6b6456]">The Singular Act</p>
              <h3 className="mb-2 text-[1.8rem] font-bold text-[#1e1912]">Essential Will</h3>
              <p className="m-0 text-[0.95rem] leading-[1.5] text-[#6b6456]">A meticulously crafted self-customed will for your estate and final intentions</p>
            </div>
            <div>
              <span className="text-[3rem] font-bold text-[#1e1912]">$88</span>
              <span className="ml-2 text-[0.9rem] text-[#6b6456]">one-time</span>
            </div>
            <ul className="m-0 flex flex-1 list-none flex-col gap-3 p-0">
              {essentialFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0"><CheckIcon/></span>
                  <span className="text-[0.95rem] leading-[1.5] text-[#3d3628]">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2" />
            <Link
              href="/will"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#1e1912]/10 px-4 py-4 text-[1rem] font-semibold tracking-[0.04em] text-[#1e1912] transition-colors duration-200 hover:bg-[#1e1912] hover:text-white"
            >
              Secure Essential Will
            </Link>
            
          </div>

          {/* Center image column */}
          <div className="flex items-center justify-center h-full">
            <div className="relative h-full w-44 overflow-hidden rounded-xl bg-white/10 shadow-inner">
              <Image src={centerCImage} alt="Pen on paper" fill className="object-cover object-center grayscale opacity-95" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
                <Image src={bookIcon} alt="Book Icon" className="mb-2 h-8 w-8" />
                <p className="text-sm text-grey">Every word carries the weight of a lifetime.</p>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl p-10 text-default shadow-sm min-h-[520px]">
            <div className="absolute right-4 top-4 rounded-full px-4 py-1.5 text-[0.78rem] uppercase tracking-[0.18em] ">
              <span className="inline-block rounded-full bg-gradient-to-r from-[#081220] to-[#1D2736] px-5 py-2 text-white font-semibold">OPTIONAL</span>
            </div>
            <div>
              <p className="mb-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-grey">The Living Document</p>
              <h3 className="mb-2 text-[1.8rem] font-bold text-default">Unlimited Legacy</h3>
              <p className="m-0 text-[0.95rem] leading-[1.5] text-grey">For those whose lives, assets, and families are in beautiful state of growth</p>
            </div>
            <div>
              <span className="text-[3rem] font-bold text-default">$88 one time fee + $2/mth</span>
              <span className="ml-2 text-[0.9rem] text-grey">/ mth (billed annually)</span>
            </div>
            <ul className="m-0 flex flex-1 list-none flex-col gap-3 p-0">
              {unlimitedFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0"><CheckIcon filled={i < 3}/></span>
                  <span className="text-[0.95rem] leading-[1.5] text-grey">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/will"
              className="inline-flex items-center justify-center rounded-lg bgrad bg-gradient-to-l from-[#1D2736] to-[#081220] px-4 py-4 text-[1rem] font-bold tracking-[0.04em] text-white transition-colors duration-200 hover:bg-white"
            >
              Begin Unlimited Journey
            </Link>
           
          </div>
        </div>
      </div>
    </section>
  );
}
