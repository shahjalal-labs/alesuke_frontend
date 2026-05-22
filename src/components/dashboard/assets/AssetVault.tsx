'use client';

import Link from 'next/link';

function AssetCard({ title, subtitle, amount }: { title: string; subtitle?: string; amount?: string }) {
  return (
    <div className="rounded-[6px] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0efed]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <div>
            <div className="text-xs text-[#8b7d73]">{subtitle}</div>
            <div className="mt-1 text-sm text-[#333]">{title}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-[4px] bg-[#192233] px-4 py-2 text-sm text-white">Edit</button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-[4px] bg-[#eef6f9] px-3 py-1 text-xs text-[#5b6b72]">This account is joint owned</span>
        <span className="rounded-[4px] bg-[#eef6f9] px-3 py-1 text-xs text-[#5b6b72]">This account is nominated</span>
      </div>

      {amount ? <div className="mt-4 text-xl font-semibold">{amount}</div> : null}
    </div>
  );
}

export default function AssetVault() {
  return (
    <section className="space-y-6">
      <div>
        <div className='mt-20'>
            <h1 className="font-semibold italic text-default text-[48px]">Asset Vault</h1>
            <h2 className="mb-4 text-default text-[48px] font-semibold italic">All your assets, in one place.</h2>

        </div>
        <div className="rounded-[8px] bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Finances</h3>
          <p className="mb-6 text-sm text-[#8b7d73]">These are your cash accounts, savings and investments. You can also add in your Insurance Plans and Retirement accounts in here as well</p>

          <div className="mb-4">
            <AssetCard title="Bank Account 1245 4578 9125 4578..." subtitle="Bank Account" amount="SGD 500" />
          </div>

          <div className="mt-4 border-t border-[#ece8e2] pt-4 text-right">
            <Link href="/user-dashboard/add-asset" className="inline-block rounded-[6px] bg-[#192233] px-4 py-2 text-sm text-white">Add another finance item</Link>
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-[8px] bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Properties</h3>
          <p className="mb-6 text-sm text-[#8b7d73]">These are your cash accounts, savings and investments- You can also add in your Insurance Plans and Retirement accounts in here as well</p>

          <div className="mb-4">
            <AssetCard title="Bank Account 1245 4578 9125 4578..." subtitle="Bank Account" amount="SGD 500" />
          </div>

          <div className="mt-4 border-t border-[#ece8e2] pt-4 text-right">
            <Link href="/user-dashboard/add-asset" className="inline-block rounded-[6px] bg-[#192233] px-4 py-2 text-sm text-white">Add another properties</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
