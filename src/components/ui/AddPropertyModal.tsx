'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface AddPropertyModalProps {
  open: boolean
  onClose: () => void
  title?: string
  onSave?: (data: any) => void
}

export default function AddPropertyModal({ open, onClose, title = 'Add property', onSave }: AddPropertyModalProps) {
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
    }
  }, [open])

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/45 p-3 pt-8 sm:p-5 sm:pt-14" onClick={onClose}>
      <div className="mx-auto flex min-h-full w-full items-start justify-center">
        <div
          className="w-full max-w-[680px] overflow-hidden rounded-[8px] bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <h2 className="text-[18px] font-semibold text-[#111f33]">{title}</h2>
              <button type="button" onClick={onClose} className="text-[#98a2b3]">✕</button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm text-[#4c525c]">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded border bg-white px-3 py-3 text-sm text-[#334155]"
                >
                  <option value="">Select country</option>
                  <option value="SG">Singapore</option>
                  <option value="MY">Malaysia</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#4c525c]">Street address</label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="For example: #01-02 Carpenter St"
                  className="w-full rounded border bg-[#fbfbfb] px-4 py-3 text-sm text-[#334155]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#4c525c]">Unit number / Floor</label>
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="For example: #01-02"
                  className="w-full rounded border bg-[#fbfbfb] px-4 py-3 text-sm text-[#334155]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#4c525c]">Postcode</label>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Example: 059911"
                  className="w-full rounded border bg-[#fbfbfb] px-4 py-3 text-sm text-[#334155]"
                />
              </div>

              <label className="inline-flex items-center gap-3">
                <input type="checkbox" checked={joint} onChange={(e) => setJoint(e.target.checked)} className="h-5 w-5" />
                <span className="text-sm text-[#334155]">Is this a joint property?</span>
              </label>

              <div>
                <p className="mb-3 text-sm font-medium text-[#4c525c]">Estimated value</p>
                <p className="mb-4 text-sm text-[#7d8899]">
                  Estimated values help you understand the size of your current estate, and helps with distribution of assets.
                </p>
                <input
                  value={estimated}
                  onChange={(e) => setEstimated(e.target.value)}
                  placeholder="$"
                  className="w-40 rounded border bg-[#fbfbfb] px-4 py-3 text-sm text-[#334155]"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="h-10 rounded border px-4 text-sm">Cancel</button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setSaving(true)
                  try {
                    const payload = { country, street, unit, postcode, joint, estimated }
                    onSave?.(payload)
                    toast.success('Property saved')
                    onClose()
                  } catch (err) {
                    toast.error('Unable to save property')
                  } finally {
                    setSaving(false)
                  }
                }}
                className="h-10 rounded bg-[#06a7c6] px-4 text-sm text-white"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
