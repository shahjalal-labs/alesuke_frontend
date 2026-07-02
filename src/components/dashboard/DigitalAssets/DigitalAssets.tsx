"use client"
import { useDigitalAssetsMutation, useGetDigitalAssetsQuery } from '@/redux/api/assetsApi'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/assets/logo.png'

interface ServiceItem {
  id: string
  name: string
  checked: boolean
  apiKey?: string
}

interface ServiceCategory {
  id: string
  title: string
  items: ServiceItem[]
}

const apiFieldMapping: Record<string, string> = {
  netflix: 'hasNetflix',
  disney: 'hasDisneyPlus',
  prime: 'hasPrimeVideo',
  'viu-video': 'hasViu',
  appletv: 'hasAppleTVPlus',
  spotify: 'hasSpotify',
  youtube: 'hasYouTubePremium',
  audible: 'hasAudible',
  'viu-music': 'hasViu',
  icloud: 'hasICloud', // Changed from hasiCloud to hasICloud
  gdrive: 'hasGoogleDrive',
  onedrive: 'hasOneDrive',
  'viu-cloud': 'hasViu',
  grab: 'hasGrab',
  foodpanda: 'hasFoodpanda',
  brokerage: 'hasBrokerageETF',
}

const initialCategories: ServiceCategory[] = [
  {
    id: 'video-streaming',
    title: 'Video Streaming',
    items: [
      { id: 'netflix', name: 'Netflix', checked: false, apiKey: 'hasNetflix' },
      { id: 'disney', name: 'Disney+', checked: false, apiKey: 'hasDisneyPlus' },
      { id: 'prime', name: 'Prime Video', checked: false, apiKey: 'hasPrimeVideo' },
      { id: 'viu-video', name: 'Viu', checked: false, apiKey: 'hasViu' },
      { id: 'appletv', name: 'Apple TV+', checked: false, apiKey: 'hasAppleTVPlus' },
    ],
  },
  {
    id: 'music-video',
    title: 'Music & Video',
    items: [
      { id: 'spotify', name: 'Spotify', checked: false, apiKey: 'hasSpotify' },
      { id: 'youtube', name: 'YouTube Premium', checked: false, apiKey: 'hasYouTubePremium' },
      { id: 'audible', name: 'Audible', checked: false, apiKey: 'hasAudible' },
      { id: 'viu-music', name: 'Viu', checked: false, apiKey: 'hasViu' },
    ],
  },
  {
    id: 'cloud-drive',
    title: 'Cloud/Drive',
    items: [
      { id: 'icloud', name: 'iCloud', checked: false, apiKey: 'hasICloud' }, // Changed
      { id: 'gdrive', name: 'Google Drive', checked: false, apiKey: 'hasGoogleDrive' },
      { id: 'onedrive', name: 'One Drive', checked: false, apiKey: 'hasOneDrive' },
      { id: 'viu-cloud', name: 'Dropbox', checked: false, apiKey: 'hasViu' },
    ],
  },
  {
    id: 'logistics-food',
    title: 'Logistics/Food',
    items: [
      { id: 'grab', name: 'Grab', checked: false, apiKey: 'hasGrab' },
      { id: 'foodpanda', name: 'Foodpanda', checked: false, apiKey: 'hasFoodpanda' },
    ],
  },
  {
    id: 'investment-trade',
    title: 'Investment/Trade',
    items: [
      { id: 'brokerage', name: 'Brokerage/ETF Platforms', checked: false, apiKey: 'hasBrokerageETF' },
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
      <span className="w-10 h-10 rounded-full bg-[#F1EDEA] flex items-center justify-center text-[#5C5756] shrink-0">
        {getIcon(iconIndex)}
      </span>

      <span
        className="flex-1 text-[15px] font-medium text-[#3D3533] tracking-[0.01em]"
        style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
      >
        {item.name}
      </span>

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
  const router = useRouter()
  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories)
  const [isLoading, setIsLoading] = useState(false)
  const [brokerageDetails, setBrokerageDetails] = useState('')
  const [showBrokerageModal, setShowBrokerageModal] = useState(false)
  const [pendingBrokerageItem, setPendingBrokerageItem] = useState<{ categoryId: string; itemId: string } | null>(null)
  
  const { data: digitalAssets, refetch } = useGetDigitalAssetsQuery({})
  const [digitalAssetsFn] = useDigitalAssetsMutation()

  // Load existing digital assets data
  useEffect(() => {
    if (digitalAssets?.data) {
      const assetsData = digitalAssets.data
      
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            checked: assetsData[apiFieldMapping[item.id]] === true,
          })),
        }))
      )
      
      // Load existing brokerage details if available
      if (assetsData.brokerageDetails) {
        setBrokerageDetails(assetsData.brokerageDetails)
      }
    }
  }, [digitalAssets])

  const handleToggle = (categoryId: string, itemId: string) => {
    // Check if this is a brokerage item and we're trying to check it
    if (itemId === 'brokerage') {
      const currentItem = categories
        .find(cat => cat.id === categoryId)
        ?.items.find(item => item.id === itemId)
      
      // If trying to check (enable) brokerage, show modal first
      if (!currentItem?.checked) {
        setPendingBrokerageItem({ categoryId, itemId })
        setShowBrokerageModal(true)
        return
      }
    }
    
    // Normal toggle for unchecked or non-brokerage items
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
  
  const handleBrokerageConfirm = () => {
    if (pendingBrokerageItem) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === pendingBrokerageItem.categoryId
            ? {
                ...cat,
                items: cat.items.map(item =>
                  item.id === pendingBrokerageItem.itemId 
                    ? { ...item, checked: true } 
                    : item
                ),
              }
            : cat
        )
      )
      setShowBrokerageModal(false)
      setPendingBrokerageItem(null)
    }
  }

  const handleCancel = () => {
    // Reset to the saved state from API
    if (digitalAssets?.data) {
      const assetsData = digitalAssets.data
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            checked: assetsData[apiFieldMapping[item.id]] === true,
          })),
        }))
      )
      if (assetsData.brokerageDetails) {
        setBrokerageDetails(assetsData.brokerageDetails)
      } else {
        setBrokerageDetails('')
      }
    } else {
      // If no saved data, reset to all unchecked
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            checked: false,
          })),
        }))
      )
      setBrokerageDetails('')
    }
    toast.info('Changes cancelled')
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Build the payload based on the exact format from the image
      const payload: Record<string, any> = {}
      
      // Map all checkbox states to the API format
      categories.forEach(category => {
        category.items.forEach(item => {
          const apiKey = apiFieldMapping[item.id]
          if (apiKey) {
            payload[apiKey] = item.checked
          }
        })
      })
      
      // Add brokerage details if brokerage is selected
      const brokerageItem = categories
        .find(cat => cat.id === 'investment-trade')
        ?.items.find(item => item.id === 'brokerage')
      
      if (brokerageItem?.checked && brokerageDetails.trim()) {
        payload.brokerageDetails = brokerageDetails.trim()
      }
      
      // Log the payload for debugging
      console.log('Saving payload:', JSON.stringify(payload, null, 2))
      
      // Try different payload structures based on the error
      let result
      
      // Attempt 1: Original structure
      try {
        result = await digitalAssetsFn(payload).unwrap()
      } catch (err1: any) {
        console.log('Attempt 1 failed:', err1?.data)
        
        // Attempt 2: Wrap in 'data' property
        try {
          result = await digitalAssetsFn({ data: payload }).unwrap()
        } catch (err2: any) {
          console.log('Attempt 2 failed:', err2?.data)
          
          // Attempt 3: Wrap in 'digitalAssets' property
          try {
            result = await digitalAssetsFn({ digitalAssets: payload }).unwrap()
          } catch (err3: any) {
            console.log('Attempt 3 failed:', err3?.data)
            
            // Attempt 4: Convert to array format (as suggested by error)
            const arrayPayload = Object.entries(payload).map(([key, value]) => ({
              field: key,
              value: value
            }))
            result = await digitalAssetsFn(arrayPayload).unwrap()
          }
        }
      }
      
      toast.success('Digital assets saved successfully!')
      router.push('/will') // Redirect to dashboard after saving
      
      // Refetch to get updated data
      await refetch()
      
    } catch (error: any) {
      console.error('Save error:', error)
      
      // Check if error has response data
      if (error?.data) {
        console.error('Error response:', error.data)
        toast.error(error.data.message || 'Failed to save digital assets')
      } else if (error?.message) {
        toast.error(error.message)
      } else {
        toast.error('Failed to save digital assets. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
   <div>
     <header className="sticky top-0 z-20 border-b border-[#ece6de] bg-[#f6f1eb]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between">
          <Link href="/will" className="inline-flex items-center">
            <Image src={logo} alt="Will & Way" className="h-auto w-[96px] md:w-[130px]" priority />
          </Link>
          <Link
            href="/will"
            className="rounded-[4px] border border-[#d8d1c8] px-4 py-2 text-[0.9rem] text-[#1b1b1b] transition-colors hover:bg-[#f0e8df]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>
     <div
      className="min-h-screen"
      style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
    >
      <div className="container mx-auto px-4 py-6">
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
            disabled={isLoading}
            className="px-7 py-[11px] border border-[#D1CBC7] rounded-xl bg-white text-[#3D3533] text-[15px] font-medium cursor-pointer transition-colors duration-150 hover:bg-[#F5EDE6] hover:border-[#B9B0AA] disabled:cursor-not-allowed disabled:opacity-50 tracking-[0.01em]"
            style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-7 py-[11px] rounded-xl bg-[#1C1917] text-white text-[15px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#3D3533] disabled:cursor-not-allowed disabled:opacity-50 tracking-[0.01em]"
            style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" }}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Brokerage Details Modal */}
      {showBrokerageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4 text-[#1C1917]">Brokerage Details</h3>
            <p className="text-gray-600 mb-4">
              Please provide details about your brokerage or ETF platforms:
            </p>
            <textarea
              value={brokerageDetails}
              onChange={(e) => setBrokerageDetails(e.target.value)}
              placeholder="e.g., Interactive Brokers, Vanguard, Charles Schwab, etc."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#1C1917] focus:border-transparent"
              rows={4}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBrokerageModal(false)
                  setPendingBrokerageItem(null)
                  setBrokerageDetails('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBrokerageConfirm}
                className="px-4 py-2 bg-[#1C1917] text-white rounded-lg hover:bg-[#3D3533] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
   </div>
  )
}

export default DigitalAssets