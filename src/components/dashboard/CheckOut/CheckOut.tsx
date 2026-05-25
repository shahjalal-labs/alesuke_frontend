"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, Circle, CircleDot, HelpCircle, ShieldCheck, BadgeCheck, CalendarDays, Package, Users, FileText, Home, LucideIcon } from 'lucide-react'

import logo from '@/assets/logo.png'
import { useCheckoutEssentialWillMutation, useCheckoutUnlimitedWillMutation } from '@/redux/api/checkoutApi'

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-white/80 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(17,24,39,0.05)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef0f5] text-[#202734]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[0.92rem] font-semibold text-[#1a1f27]">{title}</p>
        <p className="text-[0.82rem] text-[#6e7480]">{subtitle}</p>
      </div>
    </div>
  )
}

function DocumentRow({ title, icon: Icon, description }: { title: string; icon: LucideIcon; description?: string }) {
  return (
    <div className="border-b border-[#ece7df] px-4 py-4 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0f5] text-[#2b3140]">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[0.92rem] font-semibold text-[#171b22]">{title}</p>
            {description ? <p className="mt-1 text-[0.8rem] leading-[1.4] text-[#7a8190]">{description}</p> : null}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-[#6f7784]" />
      </div>
    </div>
  )
}

function CheckOut() {
  const router = useRouter()
  const [activePlan, setActivePlan] = useState<'direct' | 'subscription'>('direct')
  const [checkoutEssentialWill, { isLoading: isEssentialLoading }] = useCheckoutEssentialWillMutation()
  const [checkoutUnlimitedWill, { isLoading: isUnlimitedLoading }] = useCheckoutUnlimitedWillMutation()

  const isLoading = activePlan === 'direct' ? isEssentialLoading : isUnlimitedLoading
  const checkoutPayload = {
    successUrl: 'http://localhost:3000/will/checkout/success',
    cancelUrl: 'http://localhost:3000/will/checkout/cancel',
  }

  const handleCheckout = async () => {
    try {
      const response =
        activePlan === 'direct'
          ? await checkoutEssentialWill(checkoutPayload).unwrap()
          : await checkoutUnlimitedWill(checkoutPayload).unwrap()

      const checkoutUrl = response?.data?.checkoutUrl ?? response?.checkoutUrl

      if (checkoutUrl) {
        window.location.href = checkoutUrl
        return
      }

      router.push('/will/preview')
    } catch {
      router.push('/will/preview')
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#111827]">
      <header className="border-b border-[#f0e6dd] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <Image src={logo} alt="Will & Way" className="h-auto w-[96px] md:w-[138px]" priority />
          </Link>

          <Link
            href="/will/preview"
            className="rounded-[3px] border border-[#d8cec1] bg-transparent px-4 py-2 text-[0.9rem] font-medium text-[#1d1b18] transition-colors hover:bg-[#f3e9de]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-4 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section className="space-y-6">
            <Link href="/will/preview" className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-[#1f2733] hover:opacity-80">
              <span className="text-[1.1rem]">←</span>
              Back to will review
            </Link>

            <SectionHeader
              icon={CalendarDays}
              title="Rahman’s Estate Plan"
              subtitle="Everything you need for the future"
            />

            <div className="rounded-[16px] border border-white/80 bg-white shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
              <div className="border-b border-[#ece7df] px-4 py-4">
                <p className="text-[1.05rem] font-semibold text-[#1a1f27]">Documents included</p>
              </div>

              <DocumentRow title="Easy to follow instructions" icon={FileText} description="Step by step document to help you make your will legally valid." />
              <DocumentRow title="Last will & testament" icon={ShieldCheck} />
              <DocumentRow title="Guardianship arrangements" icon={Users} />
              <DocumentRow title="Schedule of assets" icon={Package} />

              <div className="px-4 py-5">
                <p className="text-[1rem] font-semibold text-[#1d222c]">We verify your documents for free</p>
                <p className="mt-2 max-w-[520px] text-[0.8rem] leading-[1.45] text-[#7a8190]">
                  Upload your signature page and our friendly team will verify you&apos;ve done everything correctly.
                </p>
              </div>
            </div>

            <div className="rounded-[16px] border border-white/80 bg-white shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
              <div className="border-b border-[#ece7df] px-4 py-4">
                <DocumentRow title="Easily update anytime" icon={HelpCircle} description="Make secure changes online, print, and sign with neutral witnesses to legalise your will anytime." />
              </div>
              <div className="border-b border-[#ece7df] px-4 py-4">
                <DocumentRow title="Legally valid in Singapore" icon={BadgeCheck} description="Fully valid after signing with two neutral witnesses. Professional will review included with every purchase." />
              </div>
              <div className="border-b border-[#ece7df] px-4 py-4">
                <DocumentRow title="30-day money-back guarantee" icon={ShieldCheck} description="Every will comes with a 30-day money-back guarantee in case you&apos;re not satisfied. No strings attached." />
              </div>
              <div className="px-4 py-4">
                <DocumentRow title="Global coverage" icon={Home} description="Made in Singapore, to cover assets locally and abroad, especially for common law countries." />
              </div>
            </div>
          </section>

          <aside className="rounded-[16px] border border-white/80 bg-[#f8efe5] p-4 shadow-[0_12px_30px_rgba(17,24,39,0.06)]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#20242d]">Order Summary</p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setActivePlan('direct')}
                className={`flex flex-1 items-center justify-between rounded-[6px] px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.08em] transition-colors ${activePlan === 'direct' ? 'bg-[#2ea0ff] text-white' : 'bg-[#cfe0ed] text-[#1d2430]'}`}
              >
                Direct Payment
                {activePlan === 'direct' ? <CircleDot className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setActivePlan('subscription')}
                className={`flex flex-1 items-center justify-between rounded-[6px] px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.08em] transition-colors ${activePlan === 'subscription' ? 'bg-[#2ea0ff] text-white' : 'bg-[#cfe0ed] text-[#1d2430]'}`}
              >
                Subscription Plan
                {activePlan === 'subscription' ? <CircleDot className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-5 rounded-[12px] border border-[#e6ddd2] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
              {activePlan === 'direct' ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-[#e9e1d7] pb-3">
                    <p className="text-[0.95rem] font-semibold text-[#1d1f26]">Last will and testament</p>
                    <p className="text-[0.95rem] font-semibold text-[#1d1f26]">SGD 88.00</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[0.92rem] text-[#1d1f26]">
                    <span className="font-medium">Pay today</span>
                    <span className="font-semibold">SGD 88.00</span>
                  </div>
                  <p className="mt-1 text-[0.78rem] text-[#7f8794]">include GST</p>

                  <p className="mt-5 text-[0.8rem] leading-[1.5] text-[#687080]">
                    After purchasing, you&apos;ll be able to download your will. All transactions are secured and encrypted by Stripe.
                  </p>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="mt-5 w-full rounded-[2px] bg-gradient-to-r from-[#151d2d] to-[#0d1320] px-6 py-3 text-[0.98rem] font-semibold text-white shadow-[0_10px_22px_rgba(18,24,38,0.18)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? 'Redirecting...' : 'Checkout'}
                  </button>
                </>
              ) : (
                <div className="min-h-[344px] rounded-[10px] border border-[#ddd3c8] bg-[#f5f0ea] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[#a2a3a7]">The living document</p>
                    <span className="rounded-full bg-[#141826] px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-white">Optional</span>
                  </div>

                  <h3 className="mt-4 text-[2rem] leading-[1.05] text-[#23262e]">Unlimited Legacy</h3>
                  <p className="mt-3 max-w-[250px] text-[0.9rem] leading-[1.55] text-[#8a8f9d]">
                    A future-proof plan for those whose lives, assets, and families are in a state of growth.
                  </p>

                  <div className="mt-6 flex items-end gap-2">
                    <p className="text-[2.4rem] leading-none text-[#191c23]">SGD 12</p>
                    <p className="pb-1 text-[0.78rem] text-[#80848f]">/ billed annually</p>
                  </div>

                  <div className="mt-6 space-y-3 text-[0.84rem] leading-[1.45] text-[#2a2f36]">
                    <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 flex-none" /> Comprehensive last will and final intentions.</p>
                    <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 flex-none" /> Time &amp; value. Get your will in 15 mins that traditional firms provide in 15 days.</p>
                    <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 flex-none" /> Final intentions - you last words of love.</p>
                    <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 flex-none" /> Zero-access legacy vault to revise your will. (Strictly confidential including us).</p>
                    <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 flex-none" /> Digital Asset Memorandum digital life doesn't end after you pass on.</p>
                    <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 flex-none" /> Unlimited lifetime revisions to revise will.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="mt-6 w-full rounded-[2px] bg-gradient-to-r from-[#151d2d] to-[#0d1320] px-6 py-3 text-[0.98rem] font-semibold text-white shadow-[0_10px_22px_rgba(18,24,38,0.18)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? 'Redirecting...' : 'Begin Unlimited Journey'}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default CheckOut