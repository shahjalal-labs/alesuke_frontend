'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

import logo from '@/assets/logo.png'
import { useAddGiftMutation, useEditGiftMutation, useGetAllGiftsQuery } from '@/redux/api/giftApi'
import { useGetAllMemberListQuery } from '@/redux/api/profileApi'

type RecipientRecord = {
  id: string
  fullName?: string | null
  relationType?: string | null
}

type GiftRecipientRecord = {
  id: string
  peopleID?: string | null
  percentage?: number | null
  recipient?: {
    id?: string
    fullName?: string | null
  }
}

type GiftRecord = {
  id: string
  giftType: string
  amount?: number | null
  itemName?: string | null
  description?: string | null
  vehicleDetails?: string | null
  personalMessage?: string | null
  recipients?: GiftRecipientRecord[]
}

export type GiftFieldConfig = {
  key: string
  label: string
  placeholder: string
  help?: string
  type?: 'text' | 'number'
}

export type GiftFormPageProps = {
  title: string
  introLines?: string[]
  examples?: Array<{ tone: 'bad' | 'good'; text: string }>
  giftType: 'CASH' | 'ITEM' | 'COLLECTION' | 'VEHICLE'
  fields: GiftFieldConfig[]
  recipientTitle: string
  messageTitle?: string
  messageHelp?: string
  messagePlaceholder?: string
  saveLabel?: string
  previousHref?: string
  previousLabel?: string
  nextLabel?: string
  payloadBuilder: (args: { values: Record<string, string>; personalMessage: string; recipients: Array<{ peopleId: string }> }) => Record<string, unknown>
}

export default function GiftFormPage({
  title,
  introLines = [],
  examples = [],
  giftType,
  fields,
  recipientTitle,
  messageTitle = 'Leave a personal message (optional)',
  messageHelp,
  messagePlaceholder = '',
  saveLabel = 'Save & continue',
  previousHref = '/will/gifts',
  previousLabel = 'Previous Step',
  nextLabel,
  payloadBuilder,
}: GiftFormPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editingGiftId = searchParams.get('giftId')
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined)
  const { data: giftsResponse } = useGetAllGiftsQuery(undefined, {
    skip: !editingGiftId,
  })
  const [addGift] = useAddGiftMutation()
  const [editGift] = useEditGiftMutation()
  const [values, setValues] = useState<Record<string, string>>(() =>
    fields.reduce((accumulator, field) => {
      accumulator[field.key] = ''
      return accumulator
    }, {} as Record<string, string>)
  )
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const currentGift = useMemo(() => {
    const gifts = ((giftsResponse as { data?: GiftRecord[] } | undefined)?.data ?? []) as GiftRecord[]

    if (!editingGiftId) {
      return null
    }

    return gifts.find((gift) => gift.id === editingGiftId) ?? null
  }, [editingGiftId, giftsResponse])

  const isEditing = Boolean(currentGift)

  const memberRows = useMemo(() => {
    return (members as RecipientRecord[]).map((member, index) => ({
      id: member.id,
      title: member.fullName ?? `Person ${index + 1}`,
      helper: member.relationType ? member.relationType.toLowerCase() : undefined,
    }))
  }, [members])

  useEffect(() => {
    if (!currentGift) {
      return
    }

    const nextValues = fields.reduce((accumulator, field) => {
      if (field.key === 'amount') {
        accumulator[field.key] = currentGift.amount != null ? String(currentGift.amount) : ''
      } else if (field.key === 'itemName') {
        accumulator[field.key] = currentGift.itemName ?? ''
      } else if (field.key === 'description') {
        accumulator[field.key] = currentGift.description ?? ''
      } else if (field.key === 'vehicleDetails') {
        accumulator[field.key] = currentGift.vehicleDetails ?? ''
      } else {
        accumulator[field.key] = ''
      }

      return accumulator
    }, {} as Record<string, string>)

    setValues(nextValues)
    setSelectedRecipientIds(
      (currentGift.recipients ?? [])
        .map((recipient) => recipient.peopleID ?? recipient.recipient?.id ?? '')
        .filter((recipientId): recipientId is string => Boolean(recipientId))
    )
    setMessage(currentGift.personalMessage ?? '')
  }, [currentGift, fields])

  const toggleRecipient = (id: string) => {
    setSelectedRecipientIds((current) => (current.includes(id) ? current.filter((currentId) => currentId !== id) : [...current, id]))
  }

  const handleSave = async () => {
    const recipientPayload = selectedRecipientIds.map((peopleId) => ({ peopleId }))

    if (!recipientPayload.length) {
      toast.error('Select at least one recipient.')
      return
    }

    setSubmitting(true)
    try {
      const payload = payloadBuilder({
        values,
        personalMessage: message,
        recipients: recipientPayload,
      })

      if (currentGift) {
        await editGift({ id: currentGift.id, data: payload }).unwrap()
        toast.success(`${giftType} gift updated.`)
      } else {
        await addGift(payload).unwrap()
        toast.success(`${giftType} gift saved.`)
      }

      router.push('/will/gifts')
    } catch (error) {
      console.error(error)
      toast.error(`Unable to ${currentGift ? 'update' : 'save'} gift. Please try again.`)
    } finally {
      setSubmitting(false)
    }
  }

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
          <h1 className="mt-4 text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-[#12100e] md:text-[3.45rem]">{title}</h1>

          {examples.length ? (
            <div className="mt-5 space-y-2">
              {examples.map((example) => (
                <p key={example.text} className="flex items-start gap-3 text-[0.9rem] leading-[1.5] text-[#6f7685] md:text-[0.98rem]">
                  <span
                    className={`mt-1 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full text-[0.65rem] font-bold text-white ${
                      example.tone === 'bad' ? 'bg-[#ef3a33]' : 'bg-[#27a5f7]'
                    }`}
                  >
                    {example.tone === 'bad' ? '×' : '✓'}
                  </span>
                  <span>{example.text}</span>
                </p>
              ))}
            </div>
          ) : null}

          {introLines.length ? (
            <div className="mt-4 space-y-3 text-[1rem] leading-[1.55] text-[#6f7685] md:text-[1.08rem]">
              {introLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-8 space-y-8">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-[0.82rem] uppercase tracking-[0.06em] text-[#707783] md:text-[0.85rem]">{field.label}</label>
              {field.help ? <p className="mt-2 text-[0.9rem] leading-[1.5] text-[#6f7685] md:text-[0.96rem]">{field.help}</p> : null}
              <input
                type={field.type ?? 'text'}
                value={values[field.key]}
                onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                className="mt-2 w-full rounded-[4px] border border-[#e7e1d9] bg-white px-4 py-3 text-[0.95rem] text-[#12100e] outline-none placeholder:text-[#aab0bb]"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </section>

        <section className="mt-8">
          <p className="text-[1rem] leading-[1.55] text-[#12100e] md:text-[1.08rem]">{recipientTitle}</p>
          <div className="mt-4 rounded-[6px] bg-[#f2e5d8] p-4 md:p-6">
            {isLoading ? (
              <div className="py-6 text-center text-sm text-[#6f7685]">Loading members...</div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {memberRows.map((member) => {
                  const isSelected = selectedRecipientIds.includes(member.id)

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleRecipient(member.id)}
                      className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">
                          {member.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">{member.title}</div>
                          {member.helper ? <div className="text-[0.86rem] text-[#a0a8b6] md:text-[0.92rem]">{member.helper}</div> : null}
                        </div>
                      </div>

                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#a5adba]">
                        {isSelected ? <span className="h-2.5 w-2.5 rounded-full bg-[#a5adba]" /> : null}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">{messageTitle}</h2>
          {messageHelp ? <p className="mt-3 text-[0.9rem] leading-[1.5] text-[#5d6778] md:text-[0.95rem]">{messageHelp}</p> : null}

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-4 min-h-[148px] w-full rounded-[4px] border border-[#e7e1d9] bg-white px-4 py-3 text-[0.95rem] text-[#12100e] outline-none placeholder:text-[#aab0bb]"
            placeholder={messagePlaceholder}
          />
        </section>

        <footer className="mt-10 border-t border-[#e6ddd3] pt-5">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href={previousHref} className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]">
              ← {previousLabel}
            </Link>

            <button
              type="button"
              disabled={submitting}
              onClick={handleSave}
              className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)] disabled:opacity-70"
            >
              {submitting ? 'Saving...' : currentGift ? 'Update gift' : nextLabel ?? saveLabel}
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
