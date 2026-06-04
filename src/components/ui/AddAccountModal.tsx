'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, X } from 'lucide-react'
import { toast } from 'sonner'

export type AccountType = 'bank' | 'investment' | 'business' | 'retirement' | 'insurance' | 'safe' | 'crypto'

export type CoverType = 'TERM_LIFE' | 'WHOLE_LIFE' | 'ENDOWMENT' | 'UNIVERSAL_LIFE' | 'INVESTMENT' | 'OTHER'

const coverOptions: Array<{ label: string; value: CoverType }> = [
  { label: 'Term Life', value: 'TERM_LIFE' },
  { label: 'Whole Life', value: 'WHOLE_LIFE' },
  { label: 'Endowment', value: 'ENDOWMENT' },
  { label: 'Universal Life', value: 'UNIVERSAL_LIFE' },
  { label: 'Investment', value: 'INVESTMENT' },
  { label: 'Other', value: 'OTHER' },
]

type FieldConfig = {
  key: string
  label: string
  placeholder?: string
  helper?: string
  kind?: 'text' | 'number' | 'date' | 'select'
  options?: Array<{ label: string; value: string }>
}

type AccountModalConfig = {
  title: string
  intro: string
  fields: FieldConfig[]
  valueLabel: string
  valueHelper: string
}

const accountConfigs: Record<AccountType, AccountModalConfig> = {
  bank: {
    title: 'Add bank account',
    intro: 'Bank accounts include all bank accounts, such as current and savings accounts.',
    fields: [
      { key: 'institutionName', label: 'Bank name', placeholder: 'Enter your bank name' },
      { key: 'accountNumber', label: 'Account number', placeholder: 'I.e. DBS Savings 023-6-353610' },
      { key: 'approximateValue', label: 'Approximate balance', placeholder: '1000', kind: 'number' },
    ],
    valueLabel: 'Approximate Balance',
    valueHelper: 'It is not reflected in the Will itself, but only in the Schedule of Assets.',
  },
  investment: {
    title: 'Add investment account',
    intro: 'This is for Bonds, Stocks, UTs etc.',
    fields: [
      { key: 'companyName', label: 'Company name', placeholder: 'NVIDIA stocks' },
      { key: 'institutionName', label: 'Institution name', placeholder: 'SCB' },
      { key: 'approximateValue', label: 'Approximate market value', placeholder: '1000', kind: 'number' },
    ],
    valueLabel: 'Approximate Current Market Value',
    valueHelper: 'It is not reflected in the Will itself, but only in the Schedule of Assets.',
  },
  business: {
    title: 'Add business interest',
    intro:
      'This is for Corporate, Partnership, Limited Liability Company or Sole Proprietorship',
    fields: [
      { key: 'companyName', label: 'Company name', placeholder: 'i.e. Acme Innovation Pte. Ltd.' },
      { key: 'approximateValue', label: 'Approximate market value', placeholder: '1000', kind: 'number' },
    ],
    valueLabel: 'Approximate Current Market Value',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
  retirement: {
    title: 'Add Supplememtary Retirement Scheme (SRS)',
    intro:
      'Your retirement account might be distributed directly through a beneficiary nomination process. It\'s still good practice to list it here so the executor can be aware of the account and ensure it is distributed properly.',
    fields: [
      { key: 'institutionName', label: 'Institution name', placeholder: 'i.e. SRS' },
      { key: 'accountNumber', label: 'Account number', placeholder: 'i.e. 1234-567' },
      { key: 'approximateValue', label: 'Approximate value', placeholder: '1000', kind: 'number' },
    ],
    valueLabel: 'Approximate Value',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
  insurance: {
    title: 'Add insurance plan',
    intro: '',
    fields: [
      { key: 'institutionName', label: 'Institution name', placeholder: 'Enter institution name' },
      { key: 'policyNumber', label: 'Policy number', placeholder: 'Enter policy number' },
      {
        key: 'coverType',
        label: 'Type of cover',
        placeholder: 'Term Life',
        helper: 'What kind of cover do you have? (i.e. Whole life, Term life, Endowment policy, Investment-linked)',
        kind: 'select',
        options: coverOptions,
      },
      { key: 'maturityDate', label: 'Maturity date', placeholder: '2030-12-31', kind: 'date' },
      { key: 'faceValue', label: 'Face value', placeholder: '11', kind: 'number' },
    ],
    valueLabel: 'Face value',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
  safe: {
    title: 'Add safe deposit box',
    intro: '',
    fields: [
      { key: 'description', label: 'Description', placeholder: 'i.e. 100g gold bullion in SBI Safe Deposit Box' },
      { key: 'approximateValue', label: 'Approximate value', placeholder: '1000', kind: 'number' },
    ],
    valueLabel: 'Approximate Value',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
  crypto: {
    title: 'Add crypto',
    intro: '',
    fields: [
      { key: 'description', label: 'Description of exchange/wallet', placeholder: 'i.e. Luno Crypto Wallet' },
      { key: 'institutionName', label: 'Institution name', placeholder: 'Enter exchange or institution name' },
      { key: 'approximateValue', label: 'Approximate balance', placeholder: '1000', kind: 'number' },
    ],
    valueLabel: 'Approximate Balance',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
}

interface AddAccountModalProps {
  open: boolean
  type: AccountType | null
  onClose: () => void
  mode?: 'create' | 'edit'
  initialValues?: Record<string, string>
  onSave?: (data: {
    type: AccountType
    fields: Record<string, string>
    joint: boolean
    nominated: boolean
  }) => void
}

export default function AddAccountModal({ open, type, onClose, mode = 'create', initialValues, onSave }: AddAccountModalProps) {
  const [mounted, setMounted] = useState(false)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [openSelectKey, setOpenSelectKey] = useState<string | null>(null)

  const selectMenuRef = useRef<HTMLDivElement | null>(null)

  const config = useMemo(() => (type ? accountConfigs[type] : null), [type])
  const title = useMemo(() => {
    if (!config) return ''

    if (mode === 'edit') {
      return config.title.replace(/^Add /, 'Edit ')
    }

    return config.title
  }, [config, mode])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open || !config) return

    const nextValues: Record<string, string> = {}

    config.fields.forEach((field) => {
      if (initialValues?.[field.key] != null && initialValues[field.key] !== '') {
        nextValues[field.key] = initialValues[field.key]
      } else if (field.kind === 'select' && field.options?.length) {
        nextValues[field.key] = field.options[0].value
      } else {
        nextValues[field.key] = ''
      }
    })

    setFieldValues(nextValues)
    setOpenSelectKey(null)
  }, [open, config, initialValues])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!selectMenuRef.current) return
      if (!selectMenuRef.current.contains(event.target as Node)) {
        setOpenSelectKey(null)
      }
    }

    if (openSelectKey) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openSelectKey])

  if (!open || !mounted || !config || !type) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 p-3 pt-6 sm:p-5 sm:pt-10" onClick={onClose}>
      <div className="mx-auto flex min-h-full w-full items-start justify-center">
        <div
          className="w-full max-w-[620px] overflow-hidden rounded-[22px] bg-[#f3e5d7] text-[#1a202f] shadow-[0_28px_80px_rgba(17,24,39,0.28)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="max-h-[92vh] overflow-y-auto px-5 py-5 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[1.6rem] font-medium tracking-[-0.03em] text-[#111827] sm:text-[2rem]">
                {title}
              </h2>
              <button type="button" onClick={onClose} className="text-[#7c7c7c] transition-colors hover:text-[#111827]" aria-label="Close modal">
              <X className="h-5 w-5" />
              </button>
            </div>

            {config.intro ? <p className="mt-5 max-w-[52rem] text-[1rem] leading-[1.45] text-[#5d6475] sm:text-[1.1rem]">{config.intro}</p> : null}

            <div className="mt-8 space-y-6 sm:space-y-7">
              {config.fields.map((field) => {
                const commonLabelClass = 'mb-3 block text-[0.9rem] uppercase tracking-[0.14em] text-[#404452]'
                const commonInputClass = 'h-[58px] w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 text-[1rem] text-[#5d6475] outline-none placeholder:text-[#a0a6b3] sm:h-[64px] sm:px-5 sm:text-[1.05rem]'
                const value = fieldValues[field.key] ?? ''

                return (
                  <div key={field.key}>
                    <label className={commonLabelClass}>{field.label}</label>
                    {field.helper ? (
                      <p className="mb-3 text-[0.95rem] leading-[1.45] text-[#7b8290] sm:text-[1rem]">{field.helper}</p>
                    ) : null}
                    {field.kind === 'select' && field.options?.length ? (
                      (() => {
                        const options = field.options ?? []

                        return (
                      <div ref={openSelectKey === field.key ? selectMenuRef : null} className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenSelectKey((current) => (current === field.key ? null : field.key))}
                          className="flex h-[58px] w-full items-center justify-between rounded-[3px] border border-[#dfd4c6] bg-white px-4 text-left text-[1rem] text-[#5d6475] outline-none sm:h-[64px] sm:px-5 sm:text-[1.05rem]"
                        >
                          <span>{options.find((option) => option.value === value)?.label ?? field.placeholder}</span>
                          <ChevronDown className={`h-4 w-4 text-[#b0b7c3] transition-transform ${openSelectKey === field.key ? 'rotate-180' : ''}`} />
                        </button>

                        {openSelectKey === field.key ? (
                          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[8px] border border-[#dfd4c6] bg-white shadow-[0_18px_40px_rgba(17,24,39,0.16)]">
                            {options.map((option, index) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFieldValues((current) => ({ ...current, [field.key]: option.value }))
                                  setOpenSelectKey(null)
                                }}
                                className={`block w-full px-4 py-3 text-left text-[0.96rem] text-[#4d5362] transition-colors hover:bg-[#f6f1ea] ${index !== options.length - 1 ? 'border-b border-[#f1e7da]' : ''}`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                        )
                      })()
                    ) : (
                      <input
                        type={field.kind === 'number' ? 'number' : field.kind === 'date' ? 'date' : 'text'}
                        value={value}
                        onChange={(event) => setFieldValues((current) => ({ ...current, [field.key]: event.target.value }))}
                        placeholder={field.placeholder}
                        className={commonInputClass}
                      />
                    )}
                  </div>
                )
              })}

            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-[#ece0d2] pt-5 sm:mt-10">
              <button
                type="button"
                onClick={onClose}
                className="h-[46px] rounded-[4px] border border-[#1b2434] bg-transparent px-5 text-[1rem] text-[#1b2434] transition-colors hover:bg-[#efe3d4]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  setSaving(true)
                  try {
                    await Promise.resolve(onSave?.({ type, fields: fieldValues, joint: false, nominated: false }))
                    toast.success(mode === 'edit' ? 'Account updated' : 'Account saved')
                    onClose()
                  } catch (error) {
                    toast.error(mode === 'edit' ? 'Unable to update account' : 'Unable to save account')
                  } finally {
                    setSaving(false)
                  }
                }}
                className="h-[46px] rounded-[4px] bg-[#111827] px-5 text-[1rem] text-white transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {saving ? 'Saving…' : mode === 'edit' ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
