"use client"
"use client"

import { useState } from 'react'
import GiftAddTemplate from './GiftAddTemplate'
import AddPropertyModal from '@/components/ui/AddPropertyModal'

export default function Property() {
  const addOptions = [
    { id: 'residential', label: 'Add Residential' },
    { id: 'commercial', label: 'Add Commercial' },
    { id: 'land', label: 'Add Land' },
    { id: 'other', label: 'Add other' },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('Add residential')

  return (
    <>
      <GiftAddTemplate
      title="Gift a property"
      introLines={[
        'A real estate asset can be gifted to an individual through your will.',
        'If the property is held in joint ownership, it will pass directly to the surviving owner first. Only if you hold full ownership will your named beneficiary receive the property.',
      ]}
      fieldLabel="What is the property?"
      fieldHelp="Description of the property"
      fieldPlaceholder="Description of the property"
      secondaryField={{
        label: 'Amount',
        placeholder: 'Enter the amount',
      }}
      recipientsTitle="Who would you like to give the property to?"
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
          <h3 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Add a new property</h3>
          <div className="mt-4 rounded-[6px] bg-[#f2e5d8] p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {addOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setModalTitle(opt.label)
                    setIsModalOpen(true)
                  }}
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

      <AddPropertyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        onSave={(data) => {
          console.log('property saved', data)
        }}
      />
    </>
  )
}
