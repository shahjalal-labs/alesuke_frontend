import icon1 from '@/assets/will/will-3.png';
import icon2 from '@/assets/will/will-4.png';
import icon3 from '@/assets/will/will-5.png';
import icon4 from '@/assets/will/will-6.png';
import icon5 from '@/assets/will/will-7.png';
import icon6 from '@/assets/will/will-8.png';
import icon7 from '@/assets/will/will-9.png';
import Image from 'next/image';
const steps = [
  {
    icon: (
      icon1
    ),
    title: "Legal in Singapore",
    body: "Your will is made with the best legal knowledge in Singapore",
  },
  {
    icon: (
      icon2
    ),
    title: "Lifetime access",
    body: "Update your will at any time to reflect your current wishes.",
  },
  {
    icon: (
     icon3
    ),
    title: "Your pets are safe",
    body: "Your fluffy friends won't be forgotten about, and their future owner will be included in your will.",
  },
  {
    icon: (
      icon4
    ),
    title: "Guardians for your children",
    body: "Your children will be protected no matter what.",
  },
  {
    icon: (
      icon5
    ),
    title: "Highest level of security",
    body: "Your personal information is securely encrypted and never shared with anyone.",
  },
  {
    icon: (
     icon6
    ),
    title: "Give anything you like",
    body: "Got something special in mind for someone? You can include personal items, vehicles or even cash as a gift.",
  },
  {
    icon: (
     icon7
    ),
    title: "All your assets in one place",
    body: "Un-nominated life insurance policies, and non-joint ownership properties",
  },
];

export default function WillInclude() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto container px-4">
        <h2 className="mb-10 md:mb-20 text-center text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.02em] text-[#1e1912]">
        Your will includes
        </h2>

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
