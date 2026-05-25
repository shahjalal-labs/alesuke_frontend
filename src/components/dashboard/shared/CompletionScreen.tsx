'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

import logo from '@/assets/logo.png'

type CompletionScreenProps = {
  title?: string
  message?: string
  redirectTo?: string
  timeoutMs?: number
}

export default function CompletionScreen({
  title = 'Great work!',
  message = 'You have successfully completed this section!',
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

      <main className="mx-auto flex min-h-screen w-full max-w-[760px] items-center justify-center px-5 pt-24 md:px-8 md:pt-28">
        <div className="w-full rounded-[24px] bg-white px-6 py-14 text-center shadow-[0_20px_50px_rgba(27,32,48,0.04)] md:px-10 md:py-16">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#dde0e4] text-[#172031]">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <h1 className="mt-10 text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-[#141010] md:text-[3.2rem]">
            {title}
          </h1>
          <p className="mt-4 text-[0.95rem] text-[#a0a7b3] md:text-[1.2rem]">{message}</p>
        </div>
      </main>
    </div>
  )
}