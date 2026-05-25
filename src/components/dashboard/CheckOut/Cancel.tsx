import Link from 'next/link'

function Cancel() {
  return (
    <div className="min-h-screen bg-[#fbf4ed] px-4 py-10 text-[#111827] md:px-8 md:py-14">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center rounded-[20px] border border-white/80 bg-white px-6 py-12 text-center shadow-[0_18px_40px_rgba(17,24,39,0.06)] md:px-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f0] text-[#c63d3d]">
          <span className="text-[1.6rem] font-bold">×</span>
        </div>
        <p className="mt-6 text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#7b816f]">Payment cancelled</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.03em] text-[#1b1f27] md:text-[2.5rem]">No payment was taken</h1>
        <p className="mt-4 max-w-[520px] text-[0.95rem] leading-[1.7] text-[#66707f]">
          You can go back to the preview, review your document again, and restart checkout whenever you are ready.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/will/preview" className="rounded-[3px] border border-[#cbbdaa] bg-white px-5 py-3 text-[0.95rem] font-medium text-[#2b221a] shadow-[0_8px_18px_rgba(18,28,44,0.08)]">
            Back to preview
          </Link>
          <Link href="/will/checkout" className="rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]">
            Return to checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cancel