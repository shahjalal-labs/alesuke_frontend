'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import GiftAddTemplate from '@/components/dashboard/Gift/Add/GiftAddTemplate'
import AddPropertyModal from '@/components/ui/AddPropertyModal'
import {
  giftApi,
  useAddGiftMutation,
  useAddPropertyMutation,
  useDeletePropertyMutation,
  useGetGiftsTypeQuery,
} from '@/redux/api/giftApi'
import { useGetAllMemberListQuery } from '@/redux/api/profileApi'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/redux/store'

type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND' | 'OTHER'

type MemberRecord = {
  id: string
  fullName?: string | null
  relationType?: string | null
}

type PropertyRecord = {
  id: string
  type?: PropertyType
  country?: string | null
  streetAddress?: string | null
  unitNumber?: string | null
  postcode?: string | null
  estimatedValue?: number | null
}

type PropertyGiftRecord = {
  id?: string
  giftType?: 'PROPERTY'
  propertyId?: string | null
  recipients?: Array<{
    peopleID?: string | null
    recipient?: {
      id?: string
      fullName?: string | null
      relationType?: string | null
    }
  }>
  property?: {
    id?: string
  }
}

type PropertyGiftPayload = {
  giftType: 'PROPERTY'
  recipients: Array<{ peopleId: string }>
  propertyId: string
}

const propertyOptions: Array<{ id: PropertyType; label: string }> = [
  { id: 'RESIDENTIAL', label: 'Add Residential' },
  { id: 'COMMERCIAL', label: 'Add Commercial' },
  { id: 'LAND', label: 'Add Land' },
  { id: 'OTHER', label: 'Add other' },
]

export default function AddProperty() {
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined)
  const { data: propertyGiftResponse } = useGetGiftsTypeQuery('PROPERTY')
  const [addProperty] = useAddPropertyMutation()
  const [addGift] = useAddGiftMutation()
  const [activePropertyType, setActivePropertyType] = useState<PropertyType | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<Array<string | number>>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [submittingGift, setSubmittingGift] = useState(false)
  const [hydratedFromGift, setHydratedFromGift] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const promise = dispatch(giftApi.endpoints.getAllProperties.initiate(undefined))

    return () => {
      promise.unsubscribe()
    }
  }, [dispatch])

  const recipientRows = useMemo(() => {
    return (members as MemberRecord[]).map((member, index) => ({
      id: member.id,
      name: member.fullName ?? `Person ${index + 1}`,
      icon: (member.fullName ?? 'P').charAt(0).toUpperCase(),
      helper: member.relationType || undefined,
    }))
  }, [members])

  const toggleRecipient = (recipientId: string | number) => {
    setSelectedRecipientIds((current) =>
      current.includes(recipientId) ? current.filter((item) => item !== recipientId) : [...current, recipientId]
    )
  }

  useEffect(() => {
    if (hydratedFromGift) {
      return
    }

    const gifts = ((propertyGiftResponse as { data?: PropertyGiftRecord[] } | undefined)?.data ?? []) as PropertyGiftRecord[]
    const existingGift = gifts.find((gift) => gift.giftType === 'PROPERTY')

    if (!existingGift) {
      return
    }

    setSelectedPropertyId(existingGift.propertyId ?? existingGift.property?.id ?? null)
    setSelectedRecipientIds(
      (existingGift.recipients ?? [])
        .map((recipient) => recipient.peopleID ?? recipient.recipient?.id ?? '')
        .filter((recipientId): recipientId is string => Boolean(recipientId))
    )
    setHydratedFromGift(true)
  }, [hydratedFromGift, propertyGiftResponse])

  const savedProperties = useSelector((state: RootState) => {
    return ((giftApi.endpoints.getAllProperties.select(undefined)(state) as { data?: { success?: boolean; statusCode?: number; message?: string; data?: PropertyRecord[] } } | undefined)?.data?.data ?? []) as PropertyRecord[]
  })

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteProperty] = useDeletePropertyMutation()

  const handleDeleteProperty = async (id: string) => {
    if (!id) return
    setDeletingId(id)
    try {
      await deleteProperty(id).unwrap()
      setSelectedPropertyId((current) => (current === id ? null : current))
      toast.success('Property deleted')
    } catch (error) {
      toast.error('Unable to delete property')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSelectProperty = (id: string) => {
    setHydratedFromGift(true)
    setSelectedPropertyId(id)
  }

  const handleSaveGift = async () => {
    // Deprecated: saving via API is disabled for this flow.
    // This function is retained for backward-compatibility but does nothing.
    return
  }

  const handleNextRedirect = () => {
    // Direct the user to the next assets page without requiring property selection
    router.push('/will/assets/add-other-assets')
  }

  const handleSaveProperty = async (payload: {
    propertyType: PropertyType
    country: string
    streetAddress: string
    unitNumber: string
    postalCode: string
    isJointProperty: boolean
    estimatedValue: number
  }) => {
    await addProperty(payload).unwrap()
  }

  return (
    <>
      <GiftAddTemplate
        title="Your property"
        introLines={[
          'Add your residential, commercial, land and other real estate',
          'All the property you list here will be added into a Schedule of Assets, which is kept alongside your will.',
        ]}
        fieldLabel=""
        fieldPlaceholder=""
        showRecipients={false}
        showMessage={false}
        messageHelp="This is where you can tell them more about the gift, why you're leaving it to them or what you want them to do with it. Please note, they will not be legally obliged to carry out your wishes."
        messagePlaceholder=""
          nextLabel={submittingGift ? 'Saving...' : 'Save & continue'}
          onNext={handleNextRedirect}
          nextDisabled={submittingGift}
        customMiddle={
          <>
            <h3 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem] mb-4">Your properties</h3>
            {savedProperties.length ? (
              <div className="mb-6 overflow-hidden rounded-[4px] border border-[#d7d7d7] bg-secondary shadow-[0_1px_0_rgba(17,24,39,0.02)] p-4 space-y-4">
                {savedProperties.map((property, index) => {
                  const isLast = index === savedProperties.length - 1
                  const isSelected = selectedPropertyId === property.id

                  return (
                    <div
                      key={property.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectProperty(property.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          handleSelectProperty(property.id)
                        }
                      }}
                      className={`flex items-center gap-4 px-4 py-4 md:px-5 bg-white rounded-lg cursor-pointer transition-shadow ${
                        isSelected ? 'ring-2 ring-[#152035] shadow-[0_8px_24px_rgba(17,24,39,0.08)]' : ''
                      } ${!isLast ? 'border-b border-[#e5e5e5]' : ''}`}
                    >
                      <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[#e0e0e0] text-[#29b1df]">
                        <span className="text-[1.35rem] leading-none">⌂</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[0.78rem] text-[#919191] md:text-[0.82rem]">{property.type ? property.type.charAt(0) + property.type.slice(1).toLowerCase() : 'Property'}</p>
                        <h3 className="truncate text-[1rem] font-semibold leading-[1.15] text-[#083b3a] md:text-[1.08rem]">
                          {[property.streetAddress, property.unitNumber].filter(Boolean).join(' • ') || property.streetAddress || 'Property'}
                        </h3>
                        <p className="text-[0.95rem] font-semibold leading-[1.2] text-[#083b3a] md:text-[1rem]">
                          {property.country ? `${property.country} ` : ''}
                          {property.postcode ? `S$ ${property.estimatedValue?.toLocaleString() ?? ''}` : `S$ ${property.estimatedValue?.toLocaleString() ?? ''}`}
                        </p>
                        {isSelected ? (
                          <span className="mt-2 inline-flex rounded-full bg-[#152035] px-3 py-1 text-[0.75rem] font-medium text-white">
                            Selected
                          </span>
                        ) : null}
                      </div>
                      <div className="flex-none">
                        <button
                          type="button"
                          aria-label="Delete property"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteProperty(property.id)
                          }}
                          disabled={deletingId === property.id}
                          className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#c34141] hover:bg-[#feecec] disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}

            <h3 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Add a new property</h3>
            <div className="mt-4 overflow-hidden rounded-[4px] border border-[#d7d7d7] bg-secondary shadow-[0_1px_0_rgba(17,24,39,0.02)] p-4 ">
              <div className="space-y-3 md:space-y-4">
                {propertyOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActivePropertyType(option.id)}
                    className="flex w-full items-center gap-4 border-b border-[#e5e5e5] bg-white px-4 py-4 md:px-6 md:py-6 text-left transition-shadow last:border-b-0 hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)] rounded-lg"
                  >
                    <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[#e0e0e0] text-[#29b1df]">
                      <span className="text-[1.35rem] leading-none">⌂</span>
                    </span>
                    <span className="block text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        }
      />

      <AddPropertyModal
        open={activePropertyType !== null}
        propertyType={activePropertyType}
        onClose={() => setActivePropertyType(null)}
        onSave={handleSaveProperty}
      />
    </>
  )
}
