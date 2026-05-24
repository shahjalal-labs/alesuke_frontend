'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, CircleAlert, X } from 'lucide-react'
import { toast } from 'sonner'

type AccountType = 'bank' | 'investment' | 'business' | 'retirement' | 'insurance' | 'safe' | 'crypto'

type CoverType = 'TERM_LIFE' | 'WHOLE_LIFE' | 'ENDOWMENT' | 'UNIVERSAL_LIFE' | 'INVESTMENT' | 'OTHER'

const coverOptions: Array<{ label: string; value: CoverType }> = [
  { label: 'Term Life', value: 'TERM_LIFE' },
  { label: 'Whole Life', value: 'WHOLE_LIFE' },
  { label: 'Endowment', value: 'ENDOWMENT' },
  { label: 'Universal Life', value: 'UNIVERSAL_LIFE' },
  { label: 'Investment', value: 'INVESTMENT' },
  { label: 'Other', value: 'OTHER' },
]

type FieldConfig = {
  label: string
  placeholder?: string
  helper?: string
}

type AccountModalConfig = {
  title: string
  intro: string
  primaryField: FieldConfig
  secondaryField?: FieldConfig
  showJoint?: boolean
  showNominated?: boolean
  jointDefault?: boolean
  nominatedDefault?: boolean
  infoJoint?: string
  infoNominated?: string
  valueLabel: string
  valueHelper: string
}

const accountConfigs: Record<AccountType, AccountModalConfig> = {
  bank: {
    title: 'Add bank account',
    intro: 'Bank accounts include all bank accounts, such as current and savings accounts.',
    primaryField: { label: 'Bank name', placeholder: 'Enter your bank name' },
    secondaryField: { label: 'Name of account type & number', placeholder: 'I.e. DBS Savings 023-6-353610' },
    showJoint: true,
    showNominated: true,
    jointDefault: false,
    nominatedDefault: false,
    infoJoint:
      'Be aware that jointly owned accounts will only be distributed to your beneficiaries if the co-owner of the account passes away before you do.',
    infoNominated:
      'Check this box if you have already made a nomination for this asset. It will go to those you have nominated with the institution by default.',
    valueLabel: 'Approximate Balance',
    valueHelper: 'It is not reflected in the Will itself, but only in the Schedule of Assets.',
  },
  investment: {
    title: 'Add investment account',
    intro: 'This is for Bonds, Stocks, UTs etc.',
    primaryField: { label: 'Institution/company name', placeholder: 'NVIDIA stocks in SCB 1234-4567-1234' },
    showJoint: true,
    showNominated: true,
    jointDefault: false,
    nominatedDefault: false,
    infoJoint:
      'Be aware that jointly owned accounts will only be distributed to your beneficiaries if the co-owner of the account passes away before you do.',
    infoNominated:
      'Check this box if you have already made a nomination for this asset. It will go to those you have nominated with the institution by default.',
    valueLabel: 'Approximate Current Market Value',
    valueHelper: 'It is not reflected in the Will itself, but only in the Schedule of Assets.',
  },
  business: {
    title: 'Add business interest',
    intro:
      'This is for Corporate, Partnership, Limited Liability Company or Sole Proprietorship',
    primaryField: { label: 'Company name', placeholder: 'i.e. 50% of Acme Innovation Pte. Ltd.' },
    showNominated: true,
    nominatedDefault: true,
    infoNominated:
      'Check this box if you have already made a nomination for this asset. It will go to those you have nominated with the institution by default.',
    valueLabel: 'Approximate Current Market Value',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
  retirement: {
    title: 'Add retirement account',
    intro:
      'Your retirement account might be distributed directly through a beneficiary nomination process. It\'s still good practice to list it here so the executor can be aware of the account and ensure it is distributed properly.',
    primaryField: { label: 'Institution name and account number', placeholder: 'i.e. SRS 1234-567' },
    showJoint: true,
    showNominated: true,
    jointDefault: true,
    nominatedDefault: true,
    infoJoint:
      'Be aware that jointly owned accounts will only be distributed to your beneficiaries if the co-owner of the account passes away before you do.',
    infoNominated:
      'Check this box if you have already made a nomination for this asset. It will go to those you have nominated with the institution by default.',
    valueLabel: 'Approximate Value',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
  insurance: {
    title: 'Add insurance plan',
    intro: '',
    primaryField: { label: 'Institution name and policy number', placeholder: '' },
    secondaryField: {
      label: 'Type of cover',
      placeholder: 'Term Life',
      helper: 'What kind of cover do you have? (i.e. Whole life, Term life, Endowment policy, Investment-linked)',
    },
    showNominated: true,
    nominatedDefault: true,
    infoNominated:
      'Check this box if you have already made a nomination for this asset. It will go to those you have nominated with the institution by default.',
    valueLabel: 'Face value',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
  safe: {
    title: 'Add safe deposit box',
    intro: '',
    primaryField: { label: 'Description', placeholder: 'i.e. 100g gold bullion in SBI Safe Deposit Box' },
    showJoint: true,
    showNominated: true,
    jointDefault: true,
    nominatedDefault: true,
    infoJoint:
      'Be aware that jointly owned accounts will only be distributed to your beneficiaries if the co-owner of the account passes away before you do.',
    infoNominated:
      'Check this box if you have already made a nomination for this asset. It will go to those you have nominated with the institution by default.',
    valueLabel: 'Approximate Value',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
  crypto: {
    title: 'Add crypto',
    intro: '',
    primaryField: { label: 'Description of Exchange/Wallet/Institution', placeholder: 'i.e. Luno Crypto Wallet' },
    showJoint: true,
    showNominated: true,
    jointDefault: true,
    nominatedDefault: true,
    infoJoint:
      'Be aware that jointly owned accounts will only be distributed to your beneficiaries if the co-owner of the account passes away before you do.',
    infoNominated:
      'Check this box if you have already made a nomination for this asset. It will go to those you have nominated with the institution by default.',
    valueLabel: 'Approximate Balance',
    valueHelper: 'Balances help you understand the size of your current estate, and helps with distribution of assets.',
  },
}

interface AddAccountModalProps {
  open: boolean
  type: AccountType | null
  onClose: () => void
  onSave?: (data: Record<string, unknown>) => void
}

export default function AddAccountModal({ open, type, onClose, onSave }: AddAccountModalProps) {
  const [mounted, setMounted] = useState(false)
  const [primaryValue, setPrimaryValue] = useState('')
  const [secondaryValue, setSecondaryValue] = useState('')
  const [value, setValue] = useState('')
  const [joint, setJoint] = useState(false)
  const [nominated, setNominated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [coverOpen, setCoverOpen] = useState(false)

  const coverMenuRef = useRef<HTMLDivElement | null>(null)

  const config = useMemo(() => (type ? accountConfigs[type] : null), [type])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open || !config) return

    setPrimaryValue('')
    setSecondaryValue('')
    setValue('')
    setCoverOpen(false)
    setJoint(Boolean(config.jointDefault))
    setNominated(Boolean(config.nominatedDefault))
  }, [open, config])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!coverMenuRef.current) return
      if (!coverMenuRef.current.contains(event.target as Node)) {
        setCoverOpen(false)
      }
    }

    if (coverOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [coverOpen])

  if (!open || !mounted || !config) return null

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
                {config.title}
              </h2>
              <button type="button" onClick={onClose} className="text-[#7c7c7c] transition-colors hover:text-[#111827]" aria-label="Close modal">
              <X className="h-5 w-5" />
              </button>
            </div>

            {config.intro ? <p className="mt-5 max-w-[52rem] text-[1rem] leading-[1.45] text-[#5d6475] sm:text-[1.1rem]">{config.intro}</p> : null}

            <div className="mt-8 space-y-6 sm:space-y-7">
              <div>
                <label className="mb-3 block text-[0.9rem] uppercase tracking-[0.14em] text-[#404452]">
                  {config.primaryField.label}
                </label>
                <input
                  value={primaryValue}
                  onChange={(event) => setPrimaryValue(event.target.value)}
                  placeholder={config.primaryField.placeholder}
                  className="h-[58px] w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 text-[1rem] text-[#5d6475] outline-none placeholder:text-[#a0a6b3] sm:h-[64px] sm:px-5 sm:text-[1.05rem]"
                />
              </div>

              {config.secondaryField ? (
                <div>
                  <label className="mb-3 block text-[0.9rem] uppercase tracking-[0.14em] text-[#404452]">
                    {config.secondaryField.label}
                  </label>
                  {config.secondaryField.helper ? (
                    <p className="mb-3 text-[0.95rem] leading-[1.45] text-[#7b8290] sm:text-[1rem]">{config.secondaryField.helper}</p>
                  ) : null}
                  {config.secondaryField.label === 'Type of cover' ? (
                    <div ref={coverMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setCoverOpen((current) => !current)}
                        className="flex h-[58px] w-full items-center justify-between rounded-[3px] border border-[#dfd4c6] bg-white px-4 text-left text-[1rem] text-[#5d6475] outline-none sm:h-[64px] sm:px-5 sm:text-[1.05rem]"
                      >
                        <span>{secondaryValue || config.secondaryField.placeholder}</span>
                        <ChevronDown className={`h-4 w-4 text-[#b0b7c3] transition-transform ${coverOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {coverOpen ? (
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[8px] border border-[#dfd4c6] bg-white shadow-[0_18px_40px_rgba(17,24,39,0.16)]">
                          {coverOptions.map((option, index) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setSecondaryValue(option.value)
                                setCoverOpen(false)
                              }}
                              className={`block w-full px-4 py-3 text-left text-[0.96rem] text-[#4d5362] transition-colors hover:bg-[#f6f1ea] ${index !== coverOptions.length - 1 ? 'border-b border-[#f1e7da]' : ''}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <input
                      value={secondaryValue}
                      onChange={(event) => setSecondaryValue(event.target.value)}
                      placeholder={config.secondaryField.placeholder}
                      className="h-[58px] w-full rounded-[3px] border border-[#dfd4c6] bg-white px-4 text-[1rem] text-[#5d6475] outline-none placeholder:text-[#a0a6b3] sm:h-[64px] sm:px-5 sm:text-[1.05rem]"
                    />
                  )}
                </div>
              ) : null}

              {config.showJoint ? (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[1rem] text-[#4d5362]">
                    <input
                      type="checkbox"
                      checked={joint}
                      onChange={(event) => setJoint(event.target.checked)}
                      className="h-6 w-6 rounded-[4px] border border-[#738095] accent-[#6f7482]"
                    />
                    <span>Is it jointly owned?</span>
                  </label>
                  {joint && config.infoJoint ? (
                    <div className="rounded-[10px] border border-[#62b6f2] bg-[#f0f3f5] px-4 py-4 text-[0.95rem] leading-[1.45] text-[#656f80] sm:px-5 sm:py-5 sm:text-[1rem]">
                      <div className="flex gap-3">
                        <CircleAlert className="mt-0.5 h-5 w-5 flex-none text-[#6e7b8d]" />
                        <p>{config.infoJoint}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {config.showNominated ? (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[1rem] text-[#4d5362]">
                    <input
                      type="checkbox"
                      checked={nominated}
                      onChange={(event) => setNominated(event.target.checked)}
                      className="h-6 w-6 rounded-[4px] border border-[#738095] accent-[#6f7482]"
                    />
                    <span>Is it nominated?</span>
                  </label>
                  {nominated && config.infoNominated ? (
                    <div className="rounded-[10px] border border-[#62b6f2] bg-[#f0f3f5] px-4 py-4 text-[0.95rem] leading-[1.45] text-[#656f80] sm:px-5 sm:py-5 sm:text-[1rem]">
                      <div className="flex gap-3">
                        <CircleAlert className="mt-0.5 h-5 w-5 flex-none text-[#6e7b8d]" />
                        <p>{config.infoNominated}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="pt-2 sm:pt-4">
                <h3 className="text-[1.35rem] font-medium tracking-[-0.03em] text-[#111827] sm:text-[1.55rem]">{config.valueLabel}</h3>
                <p className="mt-3 text-[0.95rem] leading-[1.45] text-[#7f8695] sm:text-[1rem]">{config.valueHelper}</p>
                <div className="mt-4">
                  <input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="$"
                    className="h-[58px] w-full max-w-[420px] rounded-[3px] border border-[#dfd4c6] bg-white px-4 text-[1rem] text-[#5d6475] outline-none placeholder:text-[#5d6475] sm:h-[64px] sm:px-5 sm:text-[1.05rem]"
                  />
                </div>
              </div>
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
                onClick={() => {
                  setSaving(true)
                  try {
                    onSave?.({ type, primaryValue, secondaryValue, value, joint, nominated })
                    toast.success('Account saved')
                    onClose()
                  } catch (error) {
                    toast.error('Unable to save account')
                  } finally {
                    setSaving(false)
                  }
                }}
                className="h-[46px] rounded-[4px] bg-[#111827] px-5 text-[1rem] text-white transition-opacity hover:opacity-95 disabled:opacity-60"
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
