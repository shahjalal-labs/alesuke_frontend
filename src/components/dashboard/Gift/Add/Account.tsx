"use client"

import { useState } from 'react'
import GiftAddTemplate from './GiftAddTemplate'
import AddAccountModal from '@/components/ui/AddAccountModal'

export default function Account() {
  const addOptions = [
    { id: 'bank', label: 'Add Bank Account' },
    { id: 'investment', label: 'Add Investment Account' },
    { id: 'business', label: 'Add Business Interest' },
    { id: 'retirement', label: 'Add Retirement Account' },
    { id: 'insurance', label: 'Add Insurance Plan' },
    { id: 'safe', label: 'Add Safe deposit box' },
    { id: 'crypto', label: 'Add Crypto' },
  ]

  const [activeType, setActiveType] = useState<'bank' | 'investment' | 'business' | 'retirement' | 'insurance' | 'safe' | 'crypto' | null>(null)

  const openModal = (type: 'bank' | 'investment' | 'business' | 'retirement' | 'insurance' | 'safe' | 'crypto') => {
    setActiveType(type)
  }

  return (
    <>
      <GiftAddTemplate
      title="Gift a financial account"
      
      fieldLabel=""
      fieldPlaceholder=""
      recipientsTitle="Who would you like to give the account to?"
      recipients={[
        { id: 1, name: 'Jane Cooper', icon: '♥' },
        { id: 2, name: 'Leslie Alexander', icon: '⚲' },
        { id: 3, name: 'Child 01', icon: '☻' },
        { id: 4, name: 'Add Person', icon: '♥', helper: 'A family member or friend' },
      ]}
      messageHelp="This is where you can tell them more about the gift, why you're leaving it to them or what you want them to do with it. Please note, they will not be legally obliged to carry out your wishes."
      messagePlaceholder=""
      customMiddle={
        <>
          <h3 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Add a new financial item</h3>
          <div className="mt-4 rounded-[6px] bg-[#f2e5d8] p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {addOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => openModal(opt.id as 'bank' | 'investment' | 'business' | 'retirement' | 'insurance' | 'safe' | 'crypto')}
                  className="flex w-full items-center gap-4 rounded-[6px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)]"
                >
                  <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">◍</span>
                  <span className="block text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      }
      />

      <AddAccountModal
        open={activeType !== null}
        type={activeType}
        onClose={() => setActiveType(null)}
        onSave={(data) => {
          console.log('account saved', data)
        }}
      />
    </>
  )
}
