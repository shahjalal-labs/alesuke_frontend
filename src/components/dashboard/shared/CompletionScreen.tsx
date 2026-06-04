'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import logo from '@/assets/logo.png'
import thumbsUp from '@/assets/thumbs-up.gif'

type CompletionScreenProps = {
  title?: string
  message?: string
  redirectTo?: string
  timeoutMs?: number
}

export default function CompletionScreen({
  title = 'Well Done!',
  message = "Let's proceed to the next section",
  redirectTo = '/will',
  timeoutMs = 4500,
}: CompletionScreenProps) {
  const router = useRouter()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push(redirectTo)
    }, timeoutMs)

    return () => window.clearTimeout(timer)
  }, [redirectTo, router, timeoutMs])

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#111827]">
      <header className="border-b border-[#f0e6dd] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
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

      <main className="mx-auto w-full max-w-[1320px] px-4 py-10 md:px-8 md:py-12">
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-center py-6 md:py-10">
          <div className="w-full rounded-[16px] border border-white/80 bg-[#f5f0ea] px-5 py-10 text-center shadow-[0_12px_30px_rgba(17,24,39,0.05)] md:px-10 md:py-14">
            <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full border border-[#d9cec1] bg-white">
              <Image src={thumbsUp} alt="Thumbs up" className="h-[86px] w-[86px] object-contain" priority />
            </div>

            <h1 className="mt-6 text-[2.15rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#141010] md:text-[3.15rem]">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-[30rem] text-[0.98rem] leading-[1.6] text-[#6f7685] md:text-[1.12rem]">
              {message}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}