'use client'

import Image from 'next/image'
import Link from 'next/link'

import logo from '@/assets/logo.png'
import { useGetWillDetailsQuery } from '@/redux/api/profileApi'

type WillDetailsResponse = {
  user?: {
    name?: string | null
  }
  family?: unknown[]
  executors?: unknown[]
  estateDistributions?: unknown[]
  gifts?: unknown[]
  petCaretakers?: unknown[]
  assets?: {
    financialAssets?: unknown[]
    properties?: unknown[]
    loans?: unknown[]
  }
  summary?: {
    totalFinancial?: number
    totalProperties?: number
    totalLoansGiven?: number
    totalOutstanding?: number
    netWorth?: number
  }
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#ece8e2] bg-white px-4 py-4">
      <p className="text-[0.78rem] uppercase tracking-[0.12em] text-[#8c8072]">{label}</p>
      <p className="mt-2 text-[1.1rem] font-medium text-[#2b221a]">{value}</p>
    </div>
  )
}

export default function WillPreviewPage() {
  const { data: response, isLoading } = useGetWillDetailsQuery(undefined)
  const dashboard = (response?.data ?? {}) as WillDetailsResponse

  const family = dashboard.family ?? []
  const executors = dashboard.executors ?? []
  const estateDistributions = dashboard.estateDistributions ?? []
  const gifts = dashboard.gifts ?? []
  const petCaretakers = dashboard.petCaretakers ?? []
  const financialAssets = dashboard.assets?.financialAssets ?? []
  const properties = dashboard.assets?.properties ?? []
  const loans = dashboard.assets?.loans ?? []

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#171612]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ece2d7] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4">
          <Link href="/will" className="inline-flex items-center">
            <Image src={logo} alt="Will & Way" className="h-auto w-[96px] md:w-[138px]" priority />
          </Link>

          <Link
            href="/will"
            className="rounded-[3px] border border-[#d9cec1] bg-transparent px-4 py-2 text-[0.9rem] text-[#1d1b18] transition-colors hover:bg-[#f2e7db]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-28 md:px-8 md:pt-32">
        <div className="max-w-[760px]">
          <p className="text-[0.82rem] text-[#45413c] md:text-[0.9rem]">Will preview</p>
          <h1 className="mt-3 text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#101010] md:text-[3.25rem]">
            {dashboard.user?.name ?? 'Your'} will overview
          </h1>
          <p className="mt-4 text-[1rem] leading-[1.55] text-[#6f7685] md:text-[1.08rem]">
            This is the combined summary of your will sections.
          </p>
        </div>

        <div className="mt-8 rounded-[10px] bg-[#f2e5d8] p-4 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryTile label="Family" value={`${family.length} people`} />
            <SummaryTile label="Executors" value={`${executors.length} appointed`} />
            <SummaryTile label="Estate Distribution" value={`${estateDistributions.length} entries`} />
            <SummaryTile label="Gifts" value={`${gifts.length} gifts`} />
            <SummaryTile label="Caretakers" value={`${petCaretakers.length} caretakers`} />
            <SummaryTile label="Assets" value={`${financialAssets.length + properties.length + loans.length} items`} />
          </div>

          <div className="mt-6 rounded-[8px] bg-white px-5 py-5">
            {isLoading ? (
              <p className="text-[0.95rem] text-[#6f7685]">Loading preview...</p>
            ) : (
              <div className="space-y-3 text-[0.98rem] text-[#4b5361]">
                <p>All sections are saved and ready for review.</p>
                <p>Total net worth: {dashboard.summary?.netWorth != null ? `S$ ${dashboard.summary.netWorth.toLocaleString()}` : 'S$ 0'}</p>
                <p>Outstanding loans: {dashboard.summary?.totalOutstanding != null ? `S$ ${dashboard.summary.totalOutstanding.toLocaleString()}` : 'S$ 0'}</p>
                <p>Loans given: {dashboard.summary?.totalLoansGiven != null ? `S$ ${dashboard.summary.totalLoansGiven.toLocaleString()}` : 'S$ 0'}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}