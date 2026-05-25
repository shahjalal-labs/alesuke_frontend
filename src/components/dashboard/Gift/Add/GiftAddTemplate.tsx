"use client"

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import logo from '@/assets/logo.png'

type Recipient = {
  id: number | string
  name: string
  icon: string
  helper?: string
}

type GiftAddTemplateProps = {
  eyebrow?: string
  title: string
  intro?: string
  introLines?: string[]
  examples?: Array<{ tone: 'bad' | 'good'; text: string }>
  fieldLabel: string
  fieldHelp?: string
  fieldPlaceholder: string
  recipientsTitle: string
  recipients: Recipient[]
  selectedRecipientIds?: Array<number | string>
  onRecipientToggle?: (recipientId: number | string) => void
  messageTitle?: string
  messageHelp?: string
  messagePlaceholder?: string
  secondaryField?: {
    label: string
    placeholder: string
  }
  previousHref?: string
  previousLabel?: string
  nextLabel?: string
  customMiddle?: React.ReactNode
}

export default function GiftAddTemplate({
  eyebrow = 'Gifts',
  title,
  intro,
  introLines,
  examples = [],
  customMiddle,
  fieldLabel,
  fieldHelp,
  fieldPlaceholder,
  recipientsTitle,
  recipients,
  selectedRecipientIds = [],
  onRecipientToggle,
  messageTitle = 'Leave a personal message (optional)',
  messageHelp,
  messagePlaceholder,
  secondaryField,
  previousHref = '/will/gifts',
  previousLabel = 'Previous Step',
  nextLabel = 'Save & continue',
}: GiftAddTemplateProps) {
  const selectedSet = new Set(selectedRecipientIds)

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
          <p className="text-[0.82rem] text-[#45413c] md:text-[0.9rem]">{eyebrow}</p>
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

          {intro ? <p className="mt-4 text-[1rem] leading-[1.55] text-[#6f7685] md:text-[1.08rem]">{intro}</p> : null}
          {introLines?.length ? (
            <div className="mt-4 space-y-3 text-[1rem] leading-[1.55] text-[#6f7685] md:text-[1.08rem]">
              {introLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : null}
        </section>

        {/* allow pages to inject a custom middle section (e.g., add property list) */}
        {customMiddle ? (
          <div className="mt-8">{customMiddle}</div>
        ) : (
          <>
            <section className="mt-8">
              <label className="block text-[1rem] font-medium text-[#12100e] md:text-[1.08rem]">{fieldLabel}</label>
              {fieldHelp ? <p className="mt-2 text-[0.86rem] text-[#8e94a1] md:text-[0.92rem]">{fieldHelp}</p> : null}
              <input
                className="mt-2 w-full rounded-[4px] border border-[#e7e1d9] bg-white px-4 py-3 text-[0.95rem] text-[#12100e] outline-none placeholder:text-[#aab0bb]"
                placeholder={fieldPlaceholder}
              />
            </section>

            {secondaryField ? (
              <section className="mt-10">
                <label className="block text-[1rem] font-medium text-[#12100e] md:text-[1.08rem]">{secondaryField.label}</label>
                <input
                  className="mt-2 w-full rounded-[4px] border border-[#e7e1d9] bg-white px-4 py-3 text-[0.95rem] text-[#12100e] outline-none placeholder:text-[#aab0bb]"
                  placeholder={secondaryField.placeholder}
                />
              </section>
            ) : null}
          </>
        )}

        <section className="mt-10">
          <p className="text-[1rem] leading-[1.55] text-[#12100e] md:text-[1.08rem]">{recipientsTitle}</p>
          <div className="mt-4 rounded-[6px] bg-[#f2e5d8] p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {recipients.map((recipient) => {
                const isSelected = selectedSet.has(recipient.id)

                return (
                  <button
                    key={recipient.id}
                    type="button"
                    onClick={() => onRecipientToggle?.(recipient.id)}
                    className={`flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)] ${
                      recipient.helper ? 'py-3' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">
                        {recipient.icon}
                      </div>
                      <div>
                        <div className="text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">{recipient.name}</div>
                        {recipient.helper ? <div className="text-[0.86rem] text-[#a0a8b6] md:text-[0.92rem]">{recipient.helper}</div> : null}
                      </div>
                    </div>

                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#a5adba]">
                      {isSelected ? <span className="h-2.5 w-2.5 rounded-full bg-[#a5adba]" /> : null}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">{messageTitle}</h2>
          {messageHelp ? <p className="mt-3 text-[0.9rem] leading-[1.5] text-[#5d6778] md:text-[0.95rem]">{messageHelp}</p> : null}

          <textarea
            className="mt-4 min-h-[148px] w-full rounded-[4px] border border-[#e7e1d9] bg-white px-4 py-3 text-[0.95rem] text-[#12100e] outline-none placeholder:text-[#aab0bb]"
            placeholder={messagePlaceholder}
          />
        </section>

        <footer className="mt-10 border-t border-[#e6ddd3] pt-5">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href={previousHref} className="inline-flex items-center gap-2 text-[0.95rem] text-[#5d6778] hover:text-[#1c2535]">
              ← {previousLabel}
            </Link>

            <button className="inline-flex min-w-[160px] items-center justify-center rounded-[4px] bg-[#152035] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(21,32,53,0.2)]">
              {nextLabel}
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