"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What happens when you pass away?",
    a: `When someone passes away, the process of settling their estate depends entirely on whether a legal roadmap—a will—was left behind.

Scenario A: With a Valid Will — If the deceased left a will, the process is guided by their specific instructions:
• Executive Action: The individual named as the "executor" takes charge, locates the original document, and petitions the court for a Grant of Probate.
• Asset Management: This legal authority allows the executor to contact banks and financial firms to close accounts and consolidate funds.
• Honoring Intentions: Finally, the executor oversees the transfer of property and money to the specific beneficiaries named in the will.

Scenario B: Without a Will (Intestacy) — When no will exists, the process becomes more complex and is governed strictly by law rather than personal preference:
• Appointing a Representative: Amidst the family's mourning, someone must volunteer to manage the estate.
• Legal Hurdles: The representative must compile a comprehensive Schedule of Assets and petition the court for a Letter of Administration.
• Fixed Distribution: Once the court grants authority, the administrator settles the accounts. The remaining assets are distributed based on state-mandated formulas.`,
  },
  { q: "Why should I use you?", a: "Will & Way simplifies the will-writing process, making it accessible, affordable, and legally valid in Singapore. Skip the expensive lawyer fees and weeks of waiting — get your will done in 15 minutes." },
  { q: "How do I make your will legally valid upon purchase?", a: "After generating your will, print it out and sign in front of two witnesses (who are not beneficiaries). Both witnesses must also sign in your presence. Follow the detailed instructions provided with your document." },
  { q: "How do I make revisions to my will?", a: "With the Unlimited Legacy plan, simply log into your secure vault anytime and make revisions. Your updated will can be downloaded, printed, and re-signed. No additional fees, no lawyers required." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className=" py-24">
      <div className="mx-auto container px-4">
        <div className="mb-6 inline-flex rounded-full bg-[#1e1912]/8 px-4 py-1.5">
          <span className="text-lg tracking-[0.08em] text-[#1e1912]  bg-[#E7E8E9] border-[1px] border-[#B4B7BC] rounded-full px-6 py-3">FaQ</span>
        </div>
        <h2 className="mb-12 text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-[-0.02em] text-[#1e1912]">
          Commonly asked questions
        </h2>

        <div className="flex flex-col gap-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-t border-[#1e1912]/12">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 bg-transparent py-6 text-left"
              >
                <span className="text-[1.1rem] font-bold text-[#1e1912]">{faq.q}</span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[1.4rem] leading-none text-[#6b6456]">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="pb-6 text-[1rem] leading-[1.75] whitespace-pre-line text-[#3d3628] ">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
          <div className="border-t border-[#1e1912]/12" />
        </div>
      </div>
    </section>
  );
}
