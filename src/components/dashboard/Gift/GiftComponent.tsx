"use client"
import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useGetAllGiftsQuery } from '@/redux/api/giftApi'

type GiftRecipient = {
  id: string
  relation?: string | null
  percentage?: number | null
  peopleID?: string | null
  recipient?: {
    id?: string
    fullName?: string | null
    email?: string | null
    relationType?: string | null
  }
}

type GiftRecord = {
  id: string
  giftType: 'CASH' | 'ITEM' | 'COLLECTION' | 'PROPERTY' | 'VEHICLE'
  amount?: number | null
  itemName?: string | null
  description?: string | null
  vehicleDetails?: string | null
  propertyAddress?: string | null
  financialAccountDetails?: string | null
  personalMessage?: string | null
  recipients?: GiftRecipient[]
}

function formatGiftSummary(gift: GiftRecord) {
  if (gift.giftType === 'CASH') {
    return gift.amount != null ? `SGD ${gift.amount.toLocaleString()}` : 'Cash gift'
  }

  if (gift.giftType === 'ITEM') {
    return gift.itemName || gift.description || 'Item gift'
  }

  if (gift.giftType === 'COLLECTION') {
    return gift.itemName || gift.description || 'Collection gift'
  }

  if (gift.giftType === 'PROPERTY') {
    return gift.propertyAddress || 'Property gift'
  }

  if (gift.giftType === 'VEHICLE') {
    return gift.vehicleDetails || 'Vehicle gift'
  }

  return 'Gift'
}

function formatGiftTypeLabel(giftType: GiftRecord['giftType']) {
  return giftType.toLowerCase().replace(/_/g, ' ')
}

export default function GiftComponent() {
  const [hasGifts, setHasGifts] = useState(true)
  const { data: giftsResponse, isLoading } = useGetAllGiftsQuery(undefined)

  const allocated = useMemo(() => {
    const gifts = ((giftsResponse as { success?: boolean; message?: string; data?: GiftRecord[] } | undefined)?.data ?? []) as GiftRecord[]

    return gifts
  }, [giftsResponse])

  const createOptions = [
    { id: 'cash', label: 'Leave a cash gift', href: '/will/gifts/add/cash', hint: 'for example, S$10,000 to leave to a person or a charity' },
    { id: 'item', label: 'Leave an item', href: '/will/gifts/add/item' },
    { id: 'collection', label: 'Leave a collection of items', href: '/will/gifts/add/collection' },
    { id: 'property', label: 'Leave a property', href: '/will/gifts/add/property' },
    { id: 'account', label: 'Leave a financial account', href: '/will/gifts/add/account' },
  ]

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

      <main className="mx-auto w-full max-w-[760px] px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <section>
          <p className="text-[0.82rem] text-[#45413c] md:text-[0.9rem]">Estate Distribution</p>
          <h1 className="mt-4 text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-[#12100e] md:text-[3.45rem]">Gifts</h1>

          <p className="mt-4 text-[1rem] leading-[1.55] text-[#12100e] md:text-[1.08rem]">
            You can assign individual optional gifts, for instance; watches, real estate or cash to your loved ones. These designated gifts will not be included in your estate
          </p>
        </section>

        <section className="mt-10">
          <p className="text-[1rem] leading-[1.55] text-[#12100e] md:text-[1.08rem]">Would you like to leave a gift for anyone?</p>
          <div className="mt-4 rounded-[6px] bg-[#f2e5d8] p-4 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setHasGifts(false)}
                aria-pressed={!hasGifts}
                className={`flex min-h-[146px] flex-col items-center justify-center rounded-[4px] bg-white px-4 py-6 text-center transition-shadow ${
                  !hasGifts ? 'ring-1 ring-[#1b2232] shadow-[0_8px_24px_rgba(17,24,39,0.08)]' : 'shadow-[0_1px_0_rgba(17,24,39,0.02)]'
                }`}
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246] text-[1.1rem]">✕</span>
                <span className="text-[1.02rem] leading-[1.15] text-[#677182] md:text-[1.16rem]">No</span>
              </button>

              <button
                type="button"
                onClick={() => setHasGifts(true)}
                aria-pressed={hasGifts}
                className={`flex min-h-[146px] flex-col items-center justify-center rounded-[4px] bg-white px-4 py-6 text-center transition-shadow ${
                  hasGifts ? 'ring-1 ring-[#1b2232] shadow-[0_8px_24px_rgba(17,24,39,0.08)]' : 'shadow-[0_1px_0_rgba(17,24,39,0.02)]'
                }`}
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246] text-[1.1rem]">✓</span>
                <span className="text-[1.02rem] leading-[1.15] text-[#677182] md:text-[1.16rem]">Yes</span>
              </button>
            </div>
          </div>
        </section>

        {hasGifts && (
          <section className="mt-10 space-y-10">
            <div>
              <h2 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Gifts you've allocated</h2>
              <div className="mt-5 rounded-[10px] border border-[#eadfcc] bg-secondary p-4 shadow-[0_1px_0_rgba(17,24,39,0.02)] md:mt-6 md:p-6">
                {isLoading ? (
                  <div className="rounded-[6px] bg-white px-4 py-6 text-center text-[0.92rem] text-[#7d8594]">
                    Loading gifts...
                  </div>
                ) : allocated.length ? (
                  <div className="space-y-3 md:space-y-4">
                    {allocated.map((gift) => {
                      const recipients = gift.recipients ?? []
                      const firstRecipient = recipients[0]?.recipient?.fullName ?? 'Unassigned'

                      return (
                        <div key={gift.id} className="rounded-[6px] border border-[#eee3d5] bg-white px-4 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">
                                {formatGiftTypeLabel(gift.giftType).slice(0, 1).toUpperCase()}
                              </div>
                              <div className="space-y-1">
                                <div className="text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">
                                  {formatGiftTypeLabel(gift.giftType)}
                                </div>
                                <div className="text-[0.86rem] text-[#828a97] md:text-[0.92rem]">{formatGiftSummary(gift)}</div>
                                <div className="text-[0.86rem] text-[#828a97] md:text-[0.92rem]">
                                  gifted to <span className="text-[#616b7b]">{firstRecipient}</span>
                                </div>

                                {recipients.length ? (
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {recipients.map((recipient) => (
                                      <span
                                        key={recipient.id}
                                        className="inline-flex rounded-full bg-secondary px-3 py-1 text-[0.82rem] text-[#616b7b]"
                                      >
                                        {recipient.recipient?.fullName ?? recipient.peopleID ?? 'Recipient'}
                                        {recipient.percentage != null ? ` • ${recipient.percentage}%` : ''}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <button className="min-w-[58px] rounded-[3px] bg-[#152035] px-4 py-2 text-[0.92rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)]">
                              Edit
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-[6px] bg-[#fbf4ed] px-4 py-6 text-center text-[0.92rem] text-[#7d8594]">
                    No allocated gifts yet.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Create a new gift</h3>
              <div className="mt-4 rounded-[10px] border border-[#eadfcc] bg-secondary p-4 md:mt-5 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {createOptions.map((opt) => (
                    <Link
                      key={opt.id}
                      href={opt.href}
                      className="flex items-center gap-4 rounded-[6px] bg-white px-4 py-4 shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)]"
                    >
                      <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">◍</span>
                      <span>
                        <span className="block text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">{opt.label}</span>
                        {opt.hint ? <span className="block text-[0.86rem] text-[#a0a8b6] md:text-[0.92rem]">{opt.hint}</span> : null}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-10 border-t border-[#e6ddd3] pt-5">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/will" className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]">
              ← Back to dashboard
            </Link>
            <button className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)]">
              Save & continue
            </button>
          </div>
        </footer>
      </main>

      <button
        type="button"
        className="fixed bottom-5 right-5 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#162030] text-white shadow-[0_16px_30px_rgba(22,32,48,0.28)] transition-transform hover:scale-105"
        aria-label="Open chat"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  )
}