'use client'

import { useEffect, useMemo, useState } from 'react'

import GiftAddTemplate from './GiftAddTemplate'
import AddPropertyModal from '@/components/ui/AddPropertyModal'
import { giftApi, useAddPropertyMutation } from '@/redux/api/giftApi'
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

const propertyOptions: Array<{ id: PropertyType; label: string }> = [
  { id: 'RESIDENTIAL', label: 'Add Residential' },
  { id: 'COMMERCIAL', label: 'Add Commercial' },
  { id: 'LAND', label: 'Add Land' },
  { id: 'OTHER', label: 'Add other' },
]

export default function Property() {
  const { data: members = [], isLoading } = useGetAllMemberListQuery(undefined)
  const [addProperty] = useAddPropertyMutation()
  const [activePropertyType, setActivePropertyType] = useState<PropertyType | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const promise = dispatch(giftApi.endpoints.getAllProperties.initiate(undefined))

    return () => {
      promise.unsubscribe()
    }
  }, [dispatch])

  const recipientRows = useMemo(() => {
    return (members as MemberRecord[]).map((member, index) => ({
      id: index + 1,
      name: member.fullName ?? `Person ${index + 1}`,
      icon: (member.fullName ?? 'P').charAt(0).toUpperCase(),
      helper: member.relationType || undefined,
    }))
  }, [members])

  const savedProperties = useSelector((state: RootState) => {
    return ((giftApi.endpoints.getAllProperties.select(undefined)(state) as { data?: { success?: boolean; statusCode?: number; message?: string; data?: PropertyRecord[] } } | undefined)?.data?.data ?? []) as PropertyRecord[]
  })

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
        title="Gift a property"
        introLines={[
          'A real estate asset can be gifted to an individual through your will.',
          'If the property is held in joint ownership, it will pass directly to the surviving owner first. Only if you hold full ownership will your named beneficiary receive the property.',
        ]}
        fieldLabel=""
        fieldPlaceholder=""
        recipientsTitle="Who would you like to give the property to?"
        recipients={recipientRows}
        messageHelp="This is where you can tell them more about the gift, why you're leaving it to them or what you want them to do with it. Please note, they will not be legally obliged to carry out your wishes."
        messagePlaceholder=""
        customMiddle={
          <>
           <h3 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem] mb-4">Choose a property</h3>
            {savedProperties.length ? (
              <div className="mb-6 overflow-hidden rounded-[4px] border border-[#d7d7d7] bg-secondary shadow-[0_1px_0_rgba(17,24,39,0.02)]">
                {savedProperties.map((property, index) => {
                  const isLast = index === savedProperties.length - 1

                  return (
                    <div
                      key={property.id}
                      className={`flex items-center gap-4 px-4 py-4 md:px-5 bg-white m-4 rounded-lg ${!isLast ? 'border-b border-[#e5e5e5]' : ''}`}
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
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}

            <h3 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Add a new property</h3>
            <div className="mt-4 overflow-hidden rounded-[4px] border border-[#d7d7d7] bg-secondary shadow-[0_1px_0_rgba(17,24,39,0.02)]">
              <div className="space-y-3 md:space-y-4">
                {propertyOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActivePropertyType(option.id)}
                    className="flex w-full items-center gap-4 border-b border-[#e5e5e5] bg-white px-4 py-4 md:m-6 text-left transition-shadow last:border-b-0 hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)]"
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
