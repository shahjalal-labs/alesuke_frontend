import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, House, Mail, ShieldCheck, Sparkles } from 'lucide-react'

type PolicySection = {
  id: string
  title: string
  content: React.ReactNode
}

const sections: PolicySection[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: (
      <>
        <p>
          Luminence Pte. Ltd. (“Luminence”, “we” or “us”) is committed to safeguarding your personal data. This Privacy Policy governs the collection, processing, and handling of data gathered via the Willway.sg platform (the “Website”) in strict accordance with the Singapore Personal Data Protection Act 2012 (No. 26 of 2012) (“PDPA”).
        </p>
        <p className="mt-4">
          By accessing and utilizing this Website, you acknowledge and agree to the data collection and processing methodologies detailed in this policy. Unless otherwise specified, capitalized terms used herein share the meanings assigned to them in our Terms of Service.
        </p>
      </>
    ),
  },
  {
    id: 'collection-standard-visitors',
    title: '2. Data Collected from Standard Website Visitors',
    content: (
      <>
        <p>
          Whenever you interact with our Website, we automatically log certain digital footprints. We track user behavior through cookies and equivalent monitoring technologies to analyze metrics such as page visits and frequency of access.
        </p>
        <p className="mt-4">
          This data helps us construct generalized user profiles. Much of this tracking yields aggregated or statistical data, meaning it is completely anonymized and cannot be used to isolate your individual identity. This baseline tracking applies universally to every visitor on our Website.
        </p>
      </>
    ),
  },
  {
    id: 'additional-data',
    title: '3. Additional Personal Data We May Collect',
    content: (
      <ul className="list-disc space-y-3 pl-5">
        <li><strong>Identity & Communication Details:</strong> Your name and email address when you reach out to us directly.</li>
        <li><strong>Service-Specific Input:</strong> Information entered into our system while utilizing our tools. This encompasses your name, mobile number, email address, the nature of your inquiry, and specific details intended for your will (collectively referred to as “Personal Information”).</li>
        <li><strong>Technical Log Data:</strong> Automated technical information from your device, including your IP address, browser type, domain paths, access timestamps, and referring URL paths. Luminence utilizes this diagnostic data to manage the Website, preserve service quality, and generate broader user analytics.</li>
      </ul>
    ),
  },
  {
    id: 'usage',
    title: '4. How We Utilize Your Personal Information',
    content: (
      <>
        <p>We process your data to fulfill the following objectives:</p>
        <ul className="mt-4 list-disc space-y-3 pl-5">
          <li>To operate, maintain, and provide the core functions of the Website and Services;</li>
          <li>To evaluate and reply to your applications, questions, or specific service requests;</li>
          <li>To collect and analyze user feedback;</li>
          <li>To notify you regarding alternative services or products offered by us or our corporate affiliates, provided you have granted explicit consent to receive such marketing communications;</li>
          <li>To evaluate, test, and improve Website architecture, and to compile generalized visitor demographics;</li>
          <li>To communicate vital updates regarding changes to our Website or core services.</li>
        </ul>
        <p className="mt-4">
          <strong>Data Retention Note:</strong> We only retain personal data for so long as it is necessary. Data may be archived as long as the purpose for which the data required still exists.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: '5. Information Sharing and Non-Disclosure',
    content: (
      <>
        <p>Luminence enforces a strict policy against selling, leasing, or renting your Personal Information to external entities.</p>
        <p className="mt-4">
          From time to time, we may communicate with you on behalf of external commercial partners regarding specialized offers relevant to your interests. In these scenarios, your identifying Personal Information is never passed to the external partner without your explicit permission.
        </p>
        <p className="mt-4">
          We may, however, transfer data to contracted, reliable partners who assist us with statistical computing, email distributions, or customer care operations. All such service providers are contractually banned from using your information for any independent purpose and are strictly bound to preserve total confidentiality.
        </p>
      </>
    ),
  },
  {
    id: 'disclosures',
    title: '6. Statutory and Corporate Disclosures',
    content: (
      <>
        <p>Luminence will only disclose your Personal Information without prior warning if mandated by law, or under a good-faith belief that such disclosure is absolutely vital to:</p>
        <ul className="mt-4 list-disc space-y-3 pl-5">
          <li>Conform to legal mandates or comply with judicial proceedings served on us or the Website;</li>
          <li>Protect and uphold the proprietary rights or assets of Luminence;</li>
          <li>Act swiftly under critical conditions to protect the personal safety of Website users or the public.</li>
        </ul>
        <p className="mt-4">
          Furthermore, business transitions may require data transfers. We may share your data with prospective buyers or sellers if we divest or purchase business divisions or corporate assets. Similarly, if Luminence or substantially all of its corporate assets are acquired by a third party, user data will constitute one of the transferred business assets.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '7. Use of Cookie Tracking',
    content: (
      <>
        <p>
          To tailor and streamline your digital experience, our Website uses “cookies.” A cookie is a basic text file deployed onto your device’s storage drive by a web page server. Cookies are incapable of running applications or transferring malicious code to your computer. They are uniquely bound to your system and can only be interpreted by a web server belonging to the domain that issued the file.
        </p>
        <p className="mt-4">
          We employ cookies to facilitate seamless site navigation, gather performance analytics, and deliver targeted advertising. Third-party providers (such as analytical software firms) may also place cookies on our platform over which we have no direct oversight. These generally consist of performance-tracking or behavioral-targeting cookies.
        </p>
        <p className="mt-4">
          Specifically, this Website leverages Google Analytics. To understand how Google manages data during your visits and how to govern the information transmitted to them, please review their policy at Google Partner Privacy Terms.
        </p>
        <p className="mt-4">
          While most web browsers automatically accept cookies, you can adjust your local browser settings to block them. Rejecting cookies may prevent you from fully experiencing the interactive functionalities of our services or accessing certain areas of our Website.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: '8. Data Security Standards',
    content: (
      <>
        <p>We make every effort to preserve the integrity and safety of your Personal Information. For instance, any payment processing routes are locked using Secure Socket Layer (SSL) encryption protocols.</p>
        <p className="mt-4">
          However, no data transmission architecture over the internet can be certified as totally flawless. While we apply diligent efforts to defend your personal data, any transmission you make to our site is done at your own risk. Once received, we employ rigorous operational procedures and structural security measures to mitigate risks of unauthorized access.
        </p>
      </>
    ),
  },
  {
    id: 'access-rights',
    title: '9. Data Access, Rectification, and Right to Object',
    content: (
      <>
        <p className="font-semibold">Data Access Requests</p>
        <p className="mt-3">
          In accordance with the criteria and exemptions listed under Section 21(2) of the PDPA, you retain the right to request a formal copy of the personal records we hold about you. To initiate this, contact us via email at admin@willway.sg. Please note that a nominal administrative fee may be charged to cover processing costs.
        </p>
        <p className="mt-5 font-semibold">Withdrawing Consent</p>
        <p className="mt-3">
          You maintain the legal right to prohibit or halt the processing, use, collection, or sharing of your Personal Information as outlined in this policy. It is our standard practice to notify you beforehand if we plan to use your data for commercial purposes or share it with third parties for marketing. You can formally withdraw your consent and halt these data activities at any point by submitting a request to admin@willway.sg.
        </p>
      </>
    ),
  },
  {
    id: 'links',
    title: '10. External Third-Party Links',
    content: (
      <p>
        Our Website features hyperlinks to external digital platforms. This Privacy Policy is strictly limited to our own Website. When navigating away from our platform via these links, you are highly encouraged to read the respective privacy documentation of those external sites.
      </p>
    ),
  },
  {
    id: 'updates',
    title: '11. Amendments to this Policy',
    content: (
      <p>
        We will occasionally modify this Privacy Policy to align with operational updates and client feedback. We advise you to review this document periodically to stay informed about the exact measures Luminence takes to insulate your data.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '12. Contact Information',
    content: (
      <>
        <p>
          We welcome any feedback or questions regarding our data protection methods. Please reach out directly to our team at admin@willway.sg.
        </p>
        <p className="mt-4">
          Last updated: 25 August 2026
        </p>
      </>
    ),
  },
]

const quickFacts = [
  {
    icon: ShieldCheck,
    title: 'PDPA-aligned',
    text: 'Built around the Singapore Personal Data Protection Act with clear access and consent rights.',
  },
  {
    icon: Mail,
    title: 'Direct contact',
    text: 'Questions and data requests can be sent to admin@willway.sg.',
  },
  {
    icon: Sparkles,
    title: 'Cookie transparency',
    text: 'The policy explains analytics, performance, and marketing cookies in plain language.',
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#fff8f3] text-[#161616]">
      <section className="border-b border-[#e8ddd1] bg-[linear-gradient(180deg,#fffaf6_0%,#fff8f3_100%)]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:items-end lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#dfd2c1] bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-[#111827] shadow-[0_10px_24px_rgba(16,24,40,0.06)] transition-transform hover:-translate-y-0.5 hover:bg-[#fbf4ec]"
            >
              <House className="h-4 w-4" />
              Back to home
            </Link>

            <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#7d6d5d]">Privacy Policy</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#111111] sm:text-5xl lg:text-6xl">
              How we collect and process your personal data.
            </h1>
            <p className="mt-6 max-w-2xl text-[1.02rem] leading-8 text-[#4f5564] sm:text-[1.08rem]">
              This policy explains how Luminence Pte. Ltd. collects, uses, stores, and shares your information when you use Willway.sg.
            </p>
          </div>

          <div className="grid gap-4 lg:w-[360px]">
            {quickFacts.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-[22px] border border-[#eadfce] bg-white/90 p-5 shadow-[0_18px_45px_rgba(16,24,40,0.06)] backdrop-blur">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f1e1cf] text-[#1f2937] ring-1 ring-[#e2cfb8]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827]">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#5d6475]">{item.text}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-14">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_16px_40px_rgba(16,24,40,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7f6d5b]">On this page</p>
            <nav className="mt-4 space-y-2 text-[0.95rem] leading-6 text-[#465063]">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="block rounded-lg px-3 py-2 transition-colors hover:bg-[#f8f1e7] hover:text-[#111827]">
                  {section.title}
                </a>
              ))}
            </nav>

            <div className="mt-6 rounded-[18px] bg-[#111827] p-4 text-white">
              <p className="text-sm font-medium text-white/80">Need help?</p>
              <p className="mt-2 text-[0.95rem] leading-6 text-white/90">
                Contact us at admin@willway.sg for access, correction, or withdrawal requests.
              </p>
              <a href="mailto:admin@willway.sg" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#f5c99f]">
                Email support <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          {sections.map((section) => (
            <article key={section.id} id={section.id} className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_18px_45px_rgba(16,24,40,0.05)] sm:p-8">
              <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#111827] sm:text-[1.65rem]">{section.title}</h2>
              <div className="mt-4 space-y-1 text-[1rem] leading-7 text-[#4f5564] sm:text-[1.04rem]">
                {section.content}
              </div>
            </article>
          ))}

          <div className="rounded-[28px] border border-[#eadfce] bg-[#111827] p-6 text-white shadow-[0_18px_45px_rgba(16,24,40,0.08)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Contact us</p>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-lg font-semibold">Our will-writing team, every working day</p>
                <p className="mt-2 text-sm leading-6 text-white/75">Email or WhatsApp our will-writing team. We reply within 24 hours, every working day.</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Lifetime document access</p>
                <p className="mt-2 text-sm leading-6 text-white/75">Your will is securely stored and accessible whenever you need it. Update anytime.</p>
              </div>
              {/* <div>
                <p className="text-lg font-semibold">30-day money-back guarantee</p>
                <p className="mt-2 text-sm leading-6 text-white/75">If MakeGoodwill is not right for you, we will refund you in full within 30 days. No questions asked.</p>
              </div> */}
            </div>
            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
              <span>support@makegoodwill.com</span>
              <Link href="/" className="inline-flex items-center gap-2 font-semibold text-[#f5c99f] hover:underline">
                Back to home <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
