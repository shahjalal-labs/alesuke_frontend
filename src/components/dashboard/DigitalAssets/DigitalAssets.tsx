"use client"
import React, { useState } from 'react'

interface ServiceItem {
  id: string
  name: string
  checked: boolean
}

interface ServiceCategory {
  id: string
  title: string
  items: ServiceItem[]
}

const initialCategories: ServiceCategory[] = [
  {
    id: 'video-streaming',
    title: 'Video Streaming',
    items: [
      { id: 'netflix', name: 'Netflix', checked: true },
      { id: 'disney', name: 'Disney+', checked: false },
      { id: 'prime', name: 'Prime Video', checked: true },
      { id: 'viu-video', name: 'Viu', checked: false },
      { id: 'appletv', name: 'Apple TV+', checked: false },
    ],
  },
  {
    id: 'music-video',
    title: 'Music & Video',
    items: [
      { id: 'spotify', name: 'Spotify', checked: true },
      { id: 'youtube', name: 'YouTube Premium', checked: false },
      { id: 'audible', name: 'Audible', checked: false },
      { id: 'viu-music', name: 'Viu', checked: false },
    ],
  },
  {
    id: 'cloud-drive',
    title: 'Cloud/Drive',
    items: [
      { id: 'icloud', name: 'iCloud', checked: false },
      { id: 'gdrive', name: 'Google Drive', checked: false },
      { id: 'onedrive', name: 'One Drive', checked: false },
      { id: 'viu-cloud', name: 'Viu', checked: false },
    ],
  },
  {
    id: 'logistics-food',
    title: 'Logistics/Food',
    items: [
      { id: 'grab', name: 'Grab', checked: false },
      { id: 'foodpanda', name: 'Foodpanda', checked: false },
    ],
  },
  {
    id: 'investment-trade',
    title: 'Investment/Trade',
    items: [
      { id: 'brokerage', name: 'Brokerage/ETF Platforms', checked: false },
    ],
  },
]

const IconCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

const IconPerson = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const IconBriefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const icons = [IconCamera, IconPerson, IconBriefcase, IconClock, IconHeart]

function getIcon(index: number) {
  const Icon = icons[index % icons.length]
  return <Icon />
}

function CheckCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#6B7280" stroke="#6B7280"/>
      <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function EmptyCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke="#D1D5DB" strokeWidth="1.5" fill="white"/>
    </svg>
  )
}

interface ServiceRowProps {
  item: ServiceItem
  iconIndex: number
  onToggle: () => void
}

function ServiceRow({ item, iconIndex, onToggle }: ServiceRowProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center w-full px-5 py-[18px] bg-white border border-transparent rounded-2xl cursor-pointer text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-150 gap-3.5 mb-2.5 last:mb-0"
    >
      {/* Icon circle */}
      <span className="w-10 h-10 rounded-full bg-[#F1EDEA] flex items-center justify-center text-[#5C5756] shrink-0">
        {getIcon(iconIndex)}
      </span>

      {/* Label */}
      <span
        className="flex-1 text-[15px] font-medium text-[#3D3533] tracking-[0.01em]"
        style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
      >
        {item.name}
      </span>

      {/* Checkbox */}
      <span className="shrink-0">
        {item.checked ? <CheckCircle /> : <EmptyCircle />}
      </span>
    </button>
  )
}

interface CategorySectionProps {
  category: ServiceCategory
  onToggle: (categoryId: string, itemId: string) => void
}

function CategorySection({ category, onToggle }: CategorySectionProps) {
  return (
    <div className="mb-9">
      <h2
        className="text-[18px] font-bold text-[#1C1917] mb-3.5 ml-0.5 tracking-[0.01em]"
        style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
      >
        {category.title}
      </h2>

      <div className="bg-[#F5EDE6] rounded-[18px] p-3.5">
        {category.items.map((item, idx) => (
          <ServiceRow
            key={item.id}
            item={item}
            iconIndex={idx}
            onToggle={() => onToggle(category.id, item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function DigitalAssets() {
  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories)

  const handleToggle = (categoryId: string, itemId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : cat
      )
    )
  }

  const handleCancel = () => {
    setCategories(initialCategories)
  }

  const handleSave = () => {
    // Save logic here
    alert('Saved!')
  }

  return (
    <div
      className="min-h-screen "
      style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
    >
      <div className=" container mx-auto px-4 py-6">

        {categories.map(category => (
          <CategorySection
            key={category.id}
            category={category}
            onToggle={handleToggle}
          />
        ))}

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-2 pb-10">
          <button
            onClick={handleCancel}
            className="px-7 py-[11px] border border-[#D1CBC7] rounded-xl bg-white text-[#3D3533] text-[15px] font-medium cursor-pointer transition-colors duration-150 hover:bg-[#F5EDE6] hover:border-[#B9B0AA] tracking-[0.01em]"
            style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-7 py-[11px] rounded-xl bg-[#1C1917] text-white text-[15px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#3D3533] tracking-[0.01em]"
            style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default DigitalAssets
