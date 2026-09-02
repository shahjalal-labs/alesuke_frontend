import icon1 from "@/assets/why/arrow-reload-horizontal.png";         
import icon2 from "@/assets/why/global.png";         
import icon3 from "@/assets/why/web-protection.png";         
import Image from "next/image";
import logo from "@/assets/logo.png";

const features = [
  {
    icon: (
      icon1
    ),
    title: "A Living Will",
    body: "Traditional wills are snapshots of the day they were signed, often left to gather dust. An online will is a LIVING DOCUMENT that evolves with your assets, family and milestones in real time.",
  },
  {
    icon: (
      icon2
    ),
    title: "One Will. Many Borders.",
    body: "If you have assets in Commonwealth countries (like UK, Australia, New Zealand or Malaysia). Our will provides legal clarity required in Commonwealth jurisdictions, turning your will effective across many borders.",
  },
  {
    icon: (
      icon3
    ),
    title: 'The "Absolute Privacy" Angle',
    body: "Your Legacy is for your eyes only. We provide the platform; you provide the privacy. Our zero-access architecture ensures that your will remains strictly confidential from everyone — including us.",
  },
];

export default function WhyWillWay() {
  return (
    <section className="bg-[#F6ECE2] px-8 py-24">
      <div className="mx-auto container px-4">
        <div className="flex items-center justify-center mb-10">
         
            <Image
              src={logo}
              alt="Will & Way Logo"
              className="h-auto w-[200px]"
            />

        </div>
        <p className="mx-auto mb-16 max-w-[738px] text-center text-[1.1rem] leading-[1.7] text-grey  italic">
          Your will is more than just a legal document—it's a final act of love and protection for your family. We believe that securing your legacy shouldn't be complicated or stressful.
        </p>

        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col gap-5">
             <div className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-white">
               <Image
                src={f.icon}
                alt={f.title}
                className="h-6 w-6"
              />
             </div>
              <h3 className="m-0 text-[20px] md:text-[24px] font-medium tracking-[-0.01em] text-default">
                {f.title}
              </h3>
              <p className="m-0 text-[1rem] leading-[1.75] text-grey">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
