import icon1 from '@/assets/secure/legal-hammer.png';
import icon2 from '@/assets/why/web-protection.png';
import icon3 from '@/assets/secure/global.png';
import Image from 'next/image';
const steps = [
  {
    icon: (
      icon1
    ),
    title: "Everything a lawyer would ask, simplified",
    body: "Navigate and answer a few questions through a structured framework designed to help you organize your intentions. Our intuitive interface covers the essential details for your complete legal will.",
  },
  {
    icon: (
      icon2
    ),
    title: "Review & Sign",
    body: "Once generated, simply print and sign your document according to the provided instructions to ensure it meets formal requirements. Your will is legally ready in minutes.",
  },
  {
    icon: (
     icon3
    ),
    title: "Revise Your Legacy Anytime In Your Vault Forever (Optional)",
    body: "Your will could evolve with you. Why pay additional fees to redo/revise one clause of section in your will through traditional law firms? Update anytime, from anywhere.",
  },
];

export default function HowItWorks() {
  return (
    <section className=" py-24">
      <div className="mx-auto container px-4">
        <h2 className="mb-4 text-center text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.02em] text-[#1e1912]">
          Secure your legacy in 15 quiet minutes.
        </h2>
        <p className="mx-auto mb-16 max-w-[480px] text-center text-[1.1rem] leading-[1.7] text-grey italic">
          A self-guided framework to document your wishes, hosted in a secure digital vault.
        </p>

        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col gap-5">
             <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-white">
               <Image className="h-6 w-6 object-contain" 
              src={s.icon} alt={s.title} 
              />
             </div>
              <h3 className="m-0 text-[1.2rem] font-bold leading-[1.3] text-default">
                {s.title}
              </h3>
              <p className="m-0 text-[1rem] leading-[1.75] text-grey">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
