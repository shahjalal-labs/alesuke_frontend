'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND' | 'OTHER'

interface AddPropertyModalProps {
  open: boolean
  propertyType: PropertyType | null
  onClose: () => void
  onSave?: (data: any) => void
}

const propertyTitles: Record<PropertyType, string> = {
  RESIDENTIAL: 'Add residential',
  COMMERCIAL: 'Add commercial',
  LAND: 'Add land',
  OTHER: 'Add other',
}

export default function AddPropertyModal({ open, propertyType, onClose, onSave }: AddPropertyModalProps) {
  const [mounted, setMounted] = useState(false)
  const [country, setCountry] = useState('')
  const [street, setStreet] = useState('')
  const [unit, setUnit] = useState('')
  const [postcode, setPostcode] = useState('')
  const [joint, setJoint] = useState(false)
  const [estimated, setEstimated] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) {
      setCountry('')
      setStreet('')
      setUnit('')
      setPostcode('')
      setJoint(false)
      setEstimated('')
      setSaving(false)
    }
  }, [open])

  if (!open || !mounted || !propertyType) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/45 p-3 pt-8 sm:p-5 sm:pt-14" onClick={onClose}>
      <div className="mx-auto flex min-h-full w-full items-start justify-center">
        <div
          className="w-full max-w-[680px] overflow-hidden rounded-[18px] bg-[#f3e5d7]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[1.65rem] font-medium tracking-[-0.03em] text-[#111827] sm:text-[2rem]">{propertyTitles[propertyType]}</h2>
              <button type="button" onClick={onClose} className="text-[#7c7c7c] transition-colors hover:text-[#111827]" aria-label="Close modal">
                ✕
              </button>
            </div>

            <p className="mt-5 max-w-[52rem] text-[1rem] leading-[1.45] text-[#5d6475] sm:text-[1.1rem]">
              {propertyType === 'RESIDENTIAL' ? 'A residential property can be gifted to an individual through your will.' : null}
              {propertyType === 'COMMERCIAL' ? 'Commercial property can be gifted through your will.' : null}
              {propertyType === 'LAND' ? 'Land property can be gifted through your will.' : null}
              {propertyType === 'OTHER' ? 'Other property can be gifted through your will.' : null}
            </p>

            <div className="mt-8 space-y-6 sm:space-y-7">
              <div>
                <label className="mb-3 block text-[0.9rem] uppercase tracking-[0.14em] text-[#404452]">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 py-3 text-[1rem] text-[#334155] outline-none sm:px-5 sm:py-4"
                >
                  <option value="">Select country</option>
                  <option value="SG">Singapore</option>
                  <option value="MY">Malaysia</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-[0.9rem] uppercase tracking-[0.14em] text-[#404452]">Street address</label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="For example: #01-02 Carpenter St"
                  className="w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 py-3 text-[1rem] text-[#334155] outline-none placeholder:text-[#a0a6b3] sm:px-5 sm:py-4"
                />
              </div>

              <div>
                <label className="mb-3 block text-[0.9rem] uppercase tracking-[0.14em] text-[#404452]">Unit number / Floor</label>
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="For example: #01-02"
                  className="w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 py-3 text-[1rem] text-[#334155] outline-none placeholder:text-[#a0a6b3] sm:px-5 sm:py-4"
                />
              </div>

              <div>
                <label className="mb-3 block text-[0.9rem] uppercase tracking-[0.14em] text-[#404452]">Postcode</label>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Example: 059911"
                  className="w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 py-3 text-[1rem] text-[#334155] outline-none placeholder:text-[#a0a6b3] sm:px-5 sm:py-4"
                />
              </div>

              <label className="inline-flex items-center gap-3 text-[1rem] text-[#4d5362]">
                <input type="checkbox" checked={joint} onChange={(e) => setJoint(e.target.checked)} className="h-6 w-6 rounded-[4px] border border-[#738095] accent-[#6f7482]" />
                <span>Joint tenancy</span>
              </label>

              {joint ? (
                <p className="text-[0.92rem] leading-[1.45] text-[#7f8695] sm:text-[0.98rem]">
                  Property held under joint tenancy carries a right of survivorship, therefore you cannot will it.
                </p>
              ) : null}

              <div>
                <p className="text-[1.35rem] font-medium tracking-[-0.03em] text-[#111827] sm:text-[1.55rem]">Estimated value</p>
                <p className="mb-4 mt-3 text-[0.95rem] leading-[1.45] text-[#7f8695] sm:text-[1rem]">
                  Estimated values help you understand the size of your current estate, and helps with distribution of assets.
                </p>
                <input
                  value={estimated}
                  onChange={(e) => setEstimated(e.target.value)}
                  placeholder="$"
                  className="w-full max-w-[420px] rounded-[3px] border border-[#dfd4c6] bg-white px-4 py-3 text-[1rem] text-[#334155] outline-none placeholder:text-[#5d6475] sm:px-5 sm:py-4"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-[#ece0d2] pt-5 sm:mt-10">
              <button type="button" onClick={onClose} className="h-[46px] rounded-[4px] border border-[#1b2434] bg-transparent px-5 text-[1rem] text-[#1b2434] transition-colors hover:bg-[#efe3d4]">
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || joint}
                onClick={async () => {
                  if (joint) {
                    toast.error('Joint tenancy property cannot be added to the will.');
                    return
                  }

                  setSaving(true)
                  try {
                    const payload = {
                      propertyType,
                      country,
                      streetAddress: street,
                      unitNumber: unit,
                      postalCode: postcode,
                      isJointProperty: joint,
                      estimatedValue: Number(estimated) || 0,
                    }
                    await onSave?.(payload)
                    toast.success('Property saved')
                    onClose()
                  } catch (err) {
                    toast.error('Unable to save property')
                  } finally {
                    setSaving(false)
                  }
                }}
                className="h-[46px] rounded-[4px] bg-[#111827] px-5 text-[1rem] text-white transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {saving ? 'Saving…' : joint ? 'Cannot save' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
