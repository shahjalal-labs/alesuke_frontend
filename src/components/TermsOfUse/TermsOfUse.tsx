import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Scale, ShieldAlert, Sparkles } from 'lucide-react'

type TermsSection = {
  id: string
  title: string
  content: React.ReactNode
}

const sections: TermsSection[] = [
  {
    id: 'platform-identity',
    title: '1. Platform Identity & User Eligibility',
    content: (
      <>
        <p>
          <strong>About the Operator</strong>
        </p>
        <p className="mt-3">
          The digital platform Willway.sg (hereafter referred to as the "Website") is owned and managed by Luminence Pte. Ltd. ("Luminence", "we", or "us"). The company is officially incorporated within the Republic of Singapore under Unique Entity Number 202638916E.
        </p>
        <p className="mt-5">
          <strong>Contractual Binding</strong>
        </p>
        <p className="mt-3">
          These Terms of Service ("Terms") dictate the legally binding agreement between you and Luminence regarding your use of our digital tools, information, software, and products (collectively, the "Services"). By navigating or utilizing this Website, you acknowledge that you have read, understood, and agreed to abide by these Terms.
        </p>
        <p className="mt-5">
          <strong>Age and Capacity Requirements</strong>
        </p>
        <p className="mt-3">
          By using this platform, you affirm that you are at least 21 years of age, or possess valid parental/guardian authorization, and are fully capable of entering into and executing the obligations and warranties outlined in this agreement.
        </p>
      </>
    ),
  },
  {
    id: 'usage-ip',
    title: '2. Platform Usage & Intellectual Property',
    content: (
      <>
        <p>
          <strong>Proper Conduct and Prohibitions</strong>
        </p>
        <p className="mt-3">
          As a condition of your access, you promise not to utilize the Website for any unlawful activities or actions forbidden by these Terms. Unauthorized attempts to extract data or materials not intentionally made public by the platform are forbidden.
        </p>
        <p className="mt-5">
          <strong>Intellectual Property Rights</strong>
        </p>
        <p className="mt-3">
          All proprietary material, text, software, and digital assets found on this platform ("Luminence Content") are meant for your personal reference only.
        </p>
        <ul className="mt-4 list-disc space-y-3 pl-5">
          <li><strong>No Commercialization:</strong> You may not resell, distribute, or commercially exploit any Luminence Content without explicit written authorization.</li>
          <li><strong>Breach Consequences:</strong> If you copy, download, or print any portion of the Website in violation of these rules, your right to use our Services will end instantly.</li>
          <li><strong>Branding:</strong> Access to the platform does not transfer ownership rights or grant permission to use our corporate logos, branding, or trademarks.</li>
        </ul>
        <p className="mt-5">
          <strong>Dynamic Content and Site Availability</strong>
        </p>
        <p className="mt-3">
          We frequently modify, update, or improve the Website's features and information. We reserve the right to temporarily halt operations or close the platform indefinitely without prior notice. Luminence bears no liability if the platform becomes unavailable at any time or for any duration. Continued usage of the platform following any modifications to these Terms serves as your explicit acceptance of the updated rules.
        </p>
        <p className="mt-5">
          <strong>External Links and Third-Party Resources</strong>
        </p>
        <p className="mt-3">
          Our Website may reference or link to external internet sources, platforms, or third-party businesses. These links are provided solely for your convenience. Luminence does not endorse, sponsor, or hold affiliations with these external entities, nor are we liable for any damage, loss, or inaccuracies encountered on third-party websites. You explore external links strictly at your own peril.
        </p>
        <p className="mt-5">
          <strong>Data Privacy</strong>
        </p>
        <p className="mt-3">
          We prioritize the protection of your personal information. Please consult our dedicated Privacy Policy to understand our protocols regarding data collection and privacy protection.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimers',
    title: '3. Disclaimers & Legal Relationships',
    content: (
      <>
        <p>
          <strong>Strict No Legal Advice Clause</strong>
        </p>
        <p className="mt-3">
          CRITICAL NOTICE: Luminence operates strictly as a self-help technology provider. We are not a law firm. None of our employees, executives, or subcontractors act as your legal counsel or solicitor.
        </p>
        <p className="mt-4">
          The documents, reference guides, automated tools, and articles on this platform do not constitute legal drafting or legal advice. Because laws are complex and dependent on highly specific personal situations, generalized digital tools are not universally applicable. If you require tailored legal protection, you must consult a certified lawyer. Utilizing this Website does not establish a solicitor-client relationship between you and Luminence.
        </p>
        <p className="mt-5 font-semibold">Interaction with Third-Party Lawyers</p>
      </>
    ),
  },
  {
    id: 'liability',
    title: '4. Indemnity & Limitations of Liability',
    content: (
      <>
        <p>
          <strong>"As-Is" Service and Disclaimer of Warranties</strong>
        </p>
        <p className="mt-3">
          All services and content on this Website are offered on an "as-is" and "as-available" basis, without any guarantees. Due to the rapid evolution of legal frameworks, we cannot promise that the information provided is entirely error-free, comprehensive, or completely up-to-date. To the furthest extent permitted under applicable law, Luminence disclaims all warranties—whether explicit or implied—including merchantability and fitness for a particular objective.
        </p>
        <p className="mt-5">
          <strong>General Liability Caps</strong>
        </p>
        <p className="mt-3">
          Luminence, along with its officers and employees, will not be held accountable for any damages (including direct, indirect, consequential, punitive, or incidental losses, loss of profits, data, or property damage) stemming from your use or inability to use the Website.
        </p>
        <ul className="mt-4 list-disc space-y-3 pl-5">
          <li><strong>Consumer Rights Protections:</strong> Nothing in these Terms intends to unlawfully bypass statutory consumer rights under Singapore law, nor do they exclude liability for personal injury or death resulting directly from our negligence.</li>
          <li><strong>Monetary Limit:</strong> Should the limitation of liability be deemed unenforceable by a court, Luminence's maximum financial obligation to you for any claims will be restricted to the total amount you paid us to use the specific service during the 12 months prior to the dispute.</li>
        </ul>
        <p className="mt-5">
          <strong>Third-Party Protections and Estate Indemnity</strong>
        </p>
        <p className="mt-3">
          The application of the Contracts (Rights of Third Parties) Act of Singapore is explicitly excluded from this agreement; individuals who are not a direct party to this contract have no right to enforce its terms. Furthermore, these conditions extend to your estate, executors, and heirs. You agree to indemnify and hold Luminence harmless against any third-party claims or legal costs arising from your activities on this platform.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    title: '5. Termination & Dispute Resolution',
    content: (
      <>
        <p>
          <strong>Right to Terminate Access</strong>
        </p>
        <p className="mt-3">
          Luminence reserves the absolute right, without prior warning and at its sole discretion, to revoke your usage license, block your IP address, and deny you access to the platform for any reason whatsoever.
        </p>
        <p className="mt-5">
          <strong>Statutory Time Limit on Claims</strong>
        </p>
        <p className="mt-3">
          You agree that any legal claim or cause of action arising out of or related to this platform must be officially initiated within one (1) year after the cause of action arises or becomes known to you. Failure to bring a claim within this timeframe permanently bars you from seeking legal recourse.
        </p>
      </>
    ),
  },
]

const highlights = [
  {
    icon: Scale,
    title: 'Binding terms',
    text: 'Clear rules for how the platform may be used and who may use it.',
  },
  {
    icon: ShieldAlert,
    title: 'Risk disclosure',
    text: 'Explicit warranty, liability, and third-party limitations are explained upfront.',
  },
  {
    icon: Sparkles,
    title: 'Plain structure',
    text: 'The policy is broken into readable sections with consistent legal-page styling.',
  },
]

export default function TermsOfUse() {
  return (
    <div className="bg-[#fff8f3] text-[#161616]">
      <section className="border-b border-[#e8ddd1] bg-[linear-gradient(180deg,#fffaf6_0%,#fff8f3_100%)]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:items-end lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#dfd2c1] bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-[#111827] shadow-[0_10px_24px_rgba(16,24,40,0.06)] transition-transform hover:-translate-y-0.5 hover:bg-[#fbf4ec]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f1e1cf] text-[#1f2937]">
                <ArrowUpRight className="h-3.5 w-3.5 rotate-180" />
              </span>
              Back to home
            </Link>

            <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#7d6d5d]">Terms of Service</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#111111] sm:text-5xl lg:text-6xl">
              Website and service rules for Willway.sg.
            </h1>
            <p className="mt-6 max-w-2xl text-[1.02rem] leading-8 text-[#4f5564] sm:text-[1.08rem]">
              These terms explain how the platform operates, what users may do, and the limits that apply when you use Willway.sg.
            </p>
          </div>

          <div className="grid gap-4 lg:w-[360px]">
            {highlights.map((item) => {
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
                Contact us at admin@willway.sg for terms-related questions or clarifications.
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

          
        </div>
      </section>
    </div>
  )
}
