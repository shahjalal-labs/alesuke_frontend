"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import GiftAddTemplate from './GiftAddTemplate'
import AddAccountModal, { type AccountType } from '@/components/ui/AddAccountModal'
import { useAddAssetsMutation, useDeleteAssetsMutation, useGetAllAssetsQuery } from '@/redux/api/assetsApi'
import { useAddGiftMutation, useEditGiftMutation, useGetGiftsTypeQuery } from '@/redux/api/giftApi'
import { useGetAllMemberListQuery } from '@/redux/api/profileApi'

type AssetType =
  | 'BANK_ACCOUNT'
  | 'INVESTMENT_ACCOUNT'
  | 'BUSINESS_INTEREST'
  | 'RETIREMENT_ACCOUNT'
  | 'INSURANCE_PLAN'
  | 'SAFE_DEPOSIT_BOX'
  | 'CRYPTO'

type AssetRecord = {
  id?: string | number
  type?: AssetType | string
  institutionName?: string | null
  companyName?: string | null
  description?: string | null
  accountNumber?: string | null
  policyNumber?: string | null
  coverType?: string | null
  maturityDate?: string | null
  approximateValue?: number | null
  faceValue?: number | null
  isJointlyOwned?: boolean | null
  isNominated?: boolean | null
}

type MemberRecord = {
  id: string
  fullName?: string | null
  relationType?: string | null
}

type FinancialAccountGiftRecord = {
  id?: string
  giftType?: 'FINANCIAL_ACCOUNT'
  assetId?: string | null
  asset?: AssetRecord | null
  recipients?: Array<{
    peopleID?: string | null
    recipient?: {
      id?: string
      fullName?: string | null
    }
  }>
  description?: string | null
}

const addOptions: Array<{ id: AccountType; label: string }> = [
  { id: 'bank', label: 'Add Bank Account' },
  { id: 'investment', label: 'Add Investment Account' },
  // { id: 'business', label: 'Add Business Interest' },
  // { id: 'retirement', label: 'Add Supplememtary Retirement Scheme (SRS)' },
  { id: 'insurance', label: 'Add Insurance Plan' },
  { id: 'safe', label: 'Add Safe deposit box' },
  { id: 'crypto', label: 'Add Crypto' },
]

const assetTypeMap: Record<AccountType, AssetType> = {
  bank: 'BANK_ACCOUNT',
  investment: 'INVESTMENT_ACCOUNT',
  business: 'BUSINESS_INTEREST',
  retirement: 'RETIREMENT_ACCOUNT',
  insurance: 'INSURANCE_PLAN',
  safe: 'SAFE_DEPOSIT_BOX',
  crypto: 'CRYPTO',
}

function toNumber(value: string) {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function normalizeAssets(response: unknown): AssetRecord[] {
  if (Array.isArray(response)) {
    return response as AssetRecord[]
  }

  if (!response || typeof response !== 'object') {
    return []
  }

  const candidate = response as {
    data?: unknown
    assets?: unknown
    items?: unknown
    results?: unknown
  }

  const direct = candidate.data ?? candidate.assets ?? candidate.items ?? candidate.results

  if (Array.isArray(direct)) {
    return direct as AssetRecord[]
  }

  if (direct && typeof direct === 'object') {
    const nested = direct as { data?: unknown; assets?: unknown; items?: unknown; results?: unknown }
    const nestedList = nested.data ?? nested.assets ?? nested.items ?? nested.results

    if (Array.isArray(nestedList)) {
      return nestedList as AssetRecord[]
    }
  }

  return []
}

function formatAssetType(type?: string) {
  if (!type) return 'Asset'

  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function getAssetTitle(asset: AssetRecord) {
  return asset.institutionName || asset.companyName || asset.description || asset.accountNumber || asset.policyNumber || 'Asset'
}

function getAssetSubtitle(asset: AssetRecord) {
  if (asset.accountNumber && asset.institutionName) {
    return `${asset.institutionName} • ${asset.accountNumber}`
  }

  if (asset.policyNumber && asset.institutionName) {
    return `${asset.institutionName} • ${asset.policyNumber}`
  }

  return asset.institutionName || asset.companyName || asset.description || 'Financial item'
}

function getAssetValue(asset: AssetRecord) {
  const value = asset.faceValue ?? asset.approximateValue

  if (typeof value === 'number') {
    return `S$ ${value.toLocaleString()}`
  }

  return 'S$ 0'
}

export default function Account() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editingGiftId = searchParams.get('giftId')
  const { data: members = [] } = useGetAllMemberListQuery(undefined)
  const { data: assetsResponse, isLoading, isFetching } = useGetAllAssetsQuery(undefined)
  const { data: financialAccountGiftResponse } = useGetGiftsTypeQuery('FINANCIAL_ACCOUNT')
  const [addAssets] = useAddAssetsMutation()
  const [deleteAssets] = useDeleteAssetsMutation()
  const [addGift] = useAddGiftMutation()
  const [editGift] = useEditGiftMutation()
  const [activeType, setActiveType] = useState<AccountType | null>(null)
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<Array<string | number>>([])
  const [selectedAssetId, setSelectedAssetId] = useState<string | number | null>(null)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [submittingGift, setSubmittingGift] = useState(false)
  const [personalMessage, setPersonalMessage] = useState('') // State for personal message

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

  const savedAssets = useMemo(() => normalizeAssets(assetsResponse), [assetsResponse])

  const selectedFinancialAccountGift = useMemo(() => {
    const gifts = ((financialAccountGiftResponse as { data?: FinancialAccountGiftRecord[] } | undefined)?.data ?? []) as FinancialAccountGiftRecord[]

    if (editingGiftId) {
      return gifts.find((gift) => gift.id === editingGiftId) ?? null
    }

    return gifts[0] ?? null
  }, [editingGiftId, financialAccountGiftResponse])

  const selectedAsset = useMemo(() => {
    if (selectedAssetId == null) return null

    return savedAssets.find((asset) => String(asset.id) === String(selectedAssetId)) ?? null
  }, [savedAssets, selectedAssetId])

  useEffect(() => {
    const savedAssetId = selectedFinancialAccountGift?.assetId ?? selectedFinancialAccountGift?.asset?.id ?? null
    setSelectedAssetId(savedAssetId)

    const savedRecipientIds = (selectedFinancialAccountGift?.recipients ?? [])
      .map((recipient) => recipient.peopleID ?? recipient.recipient?.id ?? '')
      .filter((recipientId): recipientId is string => Boolean(recipientId))

    setSelectedRecipientIds(savedRecipientIds)
    
    // Load saved personal message if it exists
    if (selectedFinancialAccountGift?.description) {
      setPersonalMessage(selectedFinancialAccountGift.description)
    } else {
      setPersonalMessage('')
    }
  }, [selectedFinancialAccountGift])

  const handleDeleteAsset = async (id?: string | number) => {
    if (id == null) return

    setDeletingId(id)

    try {
      await deleteAssets(String(id)).unwrap()
      setSelectedAssetId((current) => (current === id ? null : current))
      toast.success('Account deleted')
    } catch (error) {
      toast.error('Unable to delete account')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSelectAsset = (assetId?: string | number) => {
    if (assetId == null) return

    setSelectedAssetId(assetId)
  }

  const openModal = (type: AccountType) => {
    setActiveType(type)
  }

  const handleSaveAsset = async ({
    type,
    fields,
    joint,
    nominated,
  }: {
    type: AccountType
    fields: Record<string, string>
    joint: boolean
    nominated: boolean
  }) => {
    const assetType = assetTypeMap[type]

    const payload = (() => {
      switch (type) {
        case 'bank':
          return {
            type: assetType,
            institutionName: fields.institutionName ?? '',
            accountNumber: fields.accountNumber ?? '',
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ''),
          }
        case 'investment':
          return {
            type: assetType,
            companyName: fields.companyName ?? '',
            institutionName: fields.institutionName ?? '',
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ''),
          }
        case 'business':
          return {
            type: assetType,
            companyName: fields.companyName ?? '',
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ''),
          }
        case 'retirement':
          return {
            type: assetType,
            institutionName: fields.institutionName ?? '',
            accountNumber: fields.accountNumber ?? '',
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ''),
          }
        case 'insurance':
          return {
            type: assetType,
            institutionName: fields.institutionName ?? '',
            policyNumber: fields.policyNumber ?? '',
            isNominated: nominated,
            coverType: (fields.coverType ?? 'TERM_LIFE') as 'TERM_LIFE' | 'WHOLE_LIFE' | 'ENDOWMENT' | 'UNIVERSAL_LIFE' | 'INVESTMENT' | 'OTHER',
            maturityDate: fields.maturityDate ? new Date(fields.maturityDate).toISOString() : '2030-12-31T00:00:00.000Z',
            faceValue: toNumber(fields.faceValue ?? ''),
          }
        case 'safe':
          return {
            type: assetType,
            description: fields.description ?? '',
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ''),
          }
        case 'crypto':
          return {
            type: assetType,
            description: fields.description ?? '',
            institutionName: fields.institutionName ?? '',
            isJointlyOwned: joint,
            isNominated: nominated,
            approximateValue: toNumber(fields.approximateValue ?? ''),
          }
      }
    })()

    await addAssets(payload).unwrap()
  }

  const handleSaveGift = async () => {
    if (!selectedRecipientIds.length) {
      toast.error('Select at least one recipient.')
      return
    }

    if (selectedAssetId == null) {
      toast.error('Select one account to continue.')
      return
    }

    setSubmittingGift(true)

    try {
      const payload = {
        giftType: 'FINANCIAL_ACCOUNT',
        recipients: selectedRecipientIds.map((peopleId) => ({ peopleId: String(peopleId) })),
        assetId: String(selectedAssetId),
        description: personalMessage || '', // Include the personal message
      }

      if (editingGiftId && selectedFinancialAccountGift?.id) {
        await editGift({ id: selectedFinancialAccountGift.id, data: payload }).unwrap()
        toast.success('Financial account gift updated')
      } else {
        await addGift(payload).unwrap()
        toast.success('Financial account gift saved')
      }

      router.push('/will/gifts')
    } catch (error) {
      toast.error(`Unable to ${editingGiftId ? 'update' : 'save'} financial account gift`)
      console.error('Error saving gift:', error)
    } finally {
      setSubmittingGift(false)
    }
  }

  return (
    <>
      <GiftAddTemplate
        title="Gift a financial account"
        fieldLabel=""
        fieldPlaceholder=""
        recipientsTitle="Who would you like to give the account to?"
        recipients={recipientRows.length ? recipientRows : [{ id: 1, name: 'Add Person', icon: '♥', helper: 'A family member or friend' }]}
        selectedRecipientIds={selectedRecipientIds}
        onRecipientToggle={toggleRecipient}
        messageHelp="This is where you can tell them more about the gift, why you're leaving it to them or what you want them to do with it. Please note, they will not be legally obliged to carry out your wishes."
        messagePlaceholder="Write your personal message here..."
        messageValue={personalMessage} // Pass personal message value
        onMessageChange={setPersonalMessage} // Handle message changes
        nextLabel={submittingGift ? 'Saving...' : editingGiftId ? 'Update gift' : 'Save & continue'}
        onNext={handleSaveGift}
        nextDisabled={submittingGift || !selectedRecipientIds.length || selectedAssetId == null}
        customMiddle={
          <>
            {selectedFinancialAccountGift ? (
              <div className="mb-4 rounded-[6px] border border-[#d7d7d7] bg-white px-4 py-4 text-[0.92rem] text-[#52606f] shadow-[0_1px_0_rgba(17,24,39,0.02)] md:px-5">
                <div className="font-semibold text-[#1d2430]">Selected financial account gift</div>
                {/* <div className="mt-1 text-[0.84rem] text-[#7b8594]">
                  Asset ID: {selectedFinancialAccountGift.assetId ?? selectedFinancialAccountGift.asset?.id ?? 'N/A'}
                </div> */}
                <div className="mt-1 text-[0.84rem] text-[#7b8594]">
                  Account:{' '}
                  {selectedAsset ? getAssetTitle(selectedAsset) : selectedFinancialAccountGift.asset ? getAssetTitle(selectedFinancialAccountGift.asset) : 'N/A'}
                </div>
                <div className="mt-1 text-[0.84rem] text-[#7b8594]">
                  Recipients:{' '}
                  {selectedRecipientIds.length
                    ? selectedRecipientIds
                        .map((recipientId) => recipientRows.find((recipient) => recipient.id === recipientId)?.name ?? String(recipientId))
                        .join(', ')
                    : 'N/A'}
                </div>
                {selectedFinancialAccountGift.description && (
                  <div className="mt-2 text-[0.84rem] text-[#7b8594]">
                    <span className="font-medium">Personal message:</span> {selectedFinancialAccountGift.description}
                  </div>
                )}
              </div>
            ) : null}

            <h3 className="text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Choose an account</h3>

            {savedAssets.length ? (
              <div className="mt-4 overflow-hidden rounded-[6px] border border-[#d7d7d7] bg-[#f7efe4] p-4 shadow-[0_1px_0_rgba(17,24,39,0.02)] md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {savedAssets.map((asset, index) => {
                    const isLast = index === savedAssets.length - 1
                    const isSelected = selectedAssetId === asset.id

                    return (
                      <div
                        key={asset.id ?? `${asset.type}-${index}`}
                        onClick={() => handleSelectAsset(asset.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            handleSelectAsset(asset.id)
                          }
                        }}
                        className={`flex w-full items-center gap-4 rounded-[6px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow cursor-pointer ${
                          isSelected ? 'ring-2 ring-[#152035] shadow-[0_8px_24px_rgba(17,24,39,0.08)]' : 'hover:shadow-[0_4px_12px_rgba(17,24,39,0.04)]'
                        } ${!isLast ? 'border-b border-[#ece3d6]' : ''}`}
                      >
                        <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[#d8d8d8] bg-[#f9fbfc] text-[#27a5f7]">
                          <span className="text-[1.2rem] leading-none">⌂</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[0.78rem] text-[#8c8f98] md:text-[0.82rem]">{formatAssetType(asset.type)}</p>
                          <h3 className="truncate text-[1rem] font-semibold leading-[1.15] text-[#0f3b3b] md:text-[1.06rem]">
                            {getAssetTitle(asset)}
                          </h3>
                          <p className="text-[0.92rem] font-semibold leading-[1.2] text-[#0f3b3b] md:text-[0.98rem]">
                            {getAssetSubtitle(asset)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {asset.isNominated ? (
                              <span className="inline-flex items-center rounded-[2px] border border-[#d8d8d8] bg-[#fcfbf8] px-2 py-1 text-[0.72rem] text-[#3b3b3b]">
                                This asset is nominated
                              </span>
                            ) : null}
                            {asset.isJointlyOwned ? (
                              <span className="inline-flex items-center rounded-[2px] border border-[#d8d8d8] bg-[#fcfbf8] px-2 py-1 text-[0.72rem] text-[#3b3b3b]">
                                Jointly owned
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-2 text-[0.95rem] font-semibold leading-[1.2] text-[#0f3b3b] md:text-[1rem]">
                            {getAssetValue(asset)}
                          </p>
                          {isSelected ? (
                            <span className="mt-2 inline-flex rounded-full bg-[#152035] px-3 py-1 text-[0.75rem] font-medium text-white">
                              Selected account
                            </span>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          aria-label="Delete account"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteAsset(asset.id)
                          }}
                          disabled={deletingId === asset.id}
                          className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-[#c34141] transition-colors hover:bg-[#feecec] disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}

            <h3 className="mt-6 text-[1.08rem] font-medium text-[#191715] md:text-[1.12rem]">Add a new financial item</h3>
            <div className="mt-4 overflow-hidden rounded-[6px] border border-[#d7d7d7] bg-[#f2e5d8] p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {addOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => openModal(opt.id)}
                    className="flex w-full items-center gap-4 rounded-[6px] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(17,24,39,0.08)]"
                  >
                    <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#e7eaee] text-[#2a3246]">◍</span>
                    <span className="block text-[1rem] font-medium text-[#191715] md:text-[1.08rem]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {(isLoading || isFetching) && !savedAssets.length ? (
              <p className="mt-4 text-[0.95rem] text-[#6f7685]">Loading saved assets...</p>
            ) : null}
          </>
        }
      />

      <AddAccountModal
        open={activeType !== null}
        type={activeType}
        onClose={() => setActiveType(null)}
        onSave={handleSaveAsset}
      />
    </>
  )
}