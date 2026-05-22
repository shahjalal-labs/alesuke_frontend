import React from 'react'
import Image from 'next/image'
import leftImage from "@/assets/will/softMorning.png";

const docs = [
  {
    title: 'Complete instructions',
    body: "Easy to follow instructions on what to do with your will, and where to store it",
  },
  {
    title: 'Last will & testament',
    body: 'The actual will document, formatted according to Singapore court house recommendations',
  },
  {
    title: 'Signature page',
    body: 'Easy to understand signature page for you to sign',
  },
  {
    title: 'Schedule of Assets',
    body: 'Full list of assets that your executor can use to locate and distribute your wealth with',
  },
  {
    title: 'Personal messages to loved ones',
    body: 'Your personal messages, written exclusively to your loved ones.',
  },
];

export default function DocumentWill() {
  return (
    <section className="py-24">
      <div className="mx-auto container px-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="order-1 md:order-1">
            <div className="relative w-full h-[420px] md:h-[620px] rounded-[14px] overflow-hidden">
              <Image src={leftImage} alt="Documents of will" fill className="object-cover" />
            </div>
          </div>

          <div className="order-2 md:order-2">
            <h2 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-serif font-bold text-[#1e1912]">Documents of your will</h2>

            <div className="space-y-6">
              {docs.map((d, idx) => (
                <div key={idx} className="">
                  <h3 className="mb-2 text-[1.05rem] font-serif font-semibold text-[#111827]">{d.title}</h3>
                  <p className="text-[0.98rem] leading-[1.75] text-[#6b6b6b]">{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}