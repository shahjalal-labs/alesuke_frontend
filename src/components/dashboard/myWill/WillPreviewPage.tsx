'use client'

import type { ComponentType, ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChevronDown, CheckCircle2, Lock, PenLine, Shield, Users2, Wallet, Wrench } from 'lucide-react'

import logo from '@/assets/logo.png'
import { useGetWillDetailsQuery } from '@/redux/api/profileApi'
import DigitalAssetPdfPreview from './DigitalAssetPdfPreview'

type FamilyMember = {
  id: string
  fullName?: string | null
  relationType?: string | null
}

type ExecutorRecord = {
  person?: FamilyMember | null
  backupPerson?: FamilyMember | null
}

type EstateDistributionRecord = {
  id: string
  percentage?: number | null
  distributionType?: string | null
  person?: FamilyMember | null
  backupDistributors?: Array<{ person?: FamilyMember | null }>
}

type GiftRecord = {
  id: string
  recipientName?: string | null
  giftType?: string | null
  amount?: number | null
  description?: string | null
  itemName?: string | null
  asset?: {
    id?: string
    type?: string
    institutionName?: string | null
    accountNumber?: string | null
    policyNumber?: string | null
    approximateValue?: number | null
    faceValue?: number | null
    description?: string | null
  } | null
  property?: {
    id?: string
    type?: string
    streetAddress?: string | null
    estimatedValue?: number | null
  } | null
}

type PetCaretakerRecord = {
  id: string
  pet?: FamilyMember | null
  caretaker?: FamilyMember | null
}

type WillDetailsResponse = {
  user?: {
    name?: string | null
  }
  family?: FamilyMember[]
  executors?: ExecutorRecord[]
  estateDistributions?: EstateDistributionRecord[]
  gifts?: GiftRecord[]
  petCaretakers?: PetCaretakerRecord[]
  assets?: {
    financialAssets?: Array<{ id: string }>
    properties?: Array<{ id: string }>
    loans?: Array<{ id: string }>
  }
  summary?: {
    totalFinancial?: number
    totalProperties?: number
    totalLoansGiven?: number
    totalOutstanding?: number
    netWorth?: number
  }
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#ece8e2] bg-white px-4 py-4">
      <p className="text-[0.78rem] uppercase tracking-[0.12em] text-[#8c8072]">{label}</p>
      <p className="mt-2 text-[1.1rem] font-medium text-[#2b221a]">{value}</p>
    </div>
  )
}

function Highlight({ children }: { children: ReactNode }) {
  return <span className="text-inherit font-semibold text-[#c35b43]">{children}</span>
}

function formatMoney(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return 'S$ 0'
  }
  return `S$ ${Number(value).toLocaleString()}`
}

function formatPercent(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return '0%'
  }
  return `${Math.round(Number(value) / 5) * 5}%`
}

function AccordionItem({
  icon: Icon,
  title,
  description,
  open,
  onToggle,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full rounded-[10px] border border-transparent px-4 py-3 text-left transition-colors hover:bg-white/60"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#efe7de] text-[#404757]">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.98rem] font-medium text-[#323038]">{title}</p>
            <ChevronDown className={`h-4 w-4 text-[#838996] transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
          {open ? <p className="mt-2 text-[0.92rem] leading-[1.45] text-[#6e7480]">{description}</p> : null}
        </div>
      </div>
    </button>
  )
}

function PdfPageFrame({
  pageNumber,
  totalPages,
  title,
  blurred,
  children,
}: {
  pageNumber: number
  totalPages: number
  title: string
  blurred?: boolean
  children: ReactNode
}) {
  return (
    <article className={`relative mx-auto w-full max-w-[720px] rounded-[2px] bg-white px-6 py-8 shadow-[0_18px_40px_rgba(17,24,39,0.08)] ring-1 ring-[#ebdfd2] lg:px-10 lg:py-10 ${blurred ? 'overflow-hidden' : ''}`}>
      {blurred ? <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[6px]" aria-hidden="true" /> : null}
      <div className="pl-4">
        <p className="text-[1.45rem] font-semibold uppercase tracking-[0.04em] text-[#23262e] lg:text-[25px]">{title}</p>
        <div className="mt-3 h-[2px] bg-[#c35b43]" />
      </div>

      <div className={`mt-6 space-y-4 text-[0.94rem] leading-[1.75] text-[#3f4550] ${blurred ? 'blur-sm' : ''}`}>{children}</div>

      <div className="mt-10 border-t border-dashed border-[#ddd5cb] pt-4 text-[0.82rem] text-[#716c65]">
        <div className="flex items-center justify-between gap-4">
          <span>Testator Initials: ______  Witness 1: ______  Witness 2: ______</span>
          <span>Page {pageNumber} of {totalPages}</span>
        </div>
      </div>
    </article>
  )
}

// Helper function to format gift display text
function formatGiftDisplay(gift: GiftRecord): string {
  switch (gift.giftType) {
    case 'CASH':
      return formatMoney(gift.amount)
    case 'ITEM':
      return gift.itemName || gift.description || 'Item'
    case 'COLLECTION':
      return gift.itemName || gift.description || 'Collection'
    case 'PROPERTY':
      if (gift.property) {
        return `${gift.property.type || 'Property'} at ${gift.property.streetAddress || 'address'}`
      }
      return gift.description || 'Property'
    case 'FINANCIAL_ACCOUNT':
      if (gift.asset) {
        const assetType = gift.asset.type?.replace(/_/g, ' ').toLowerCase()
        return `${assetType || 'Financial account'}`
      }
      return gift.description || 'Financial account'
    default:
      return gift.description || 'Gift'
  }
}

// Helper to get gift type display name
function getGiftTypeDisplay(giftType?: string | null): string {
  switch (giftType) {
    case 'CASH': return 'Cash'
    case 'ITEM': return 'Item'
    case 'COLLECTION': return 'Collection'
    case 'PROPERTY': return 'Property'
    case 'FINANCIAL_ACCOUNT': return 'Financial Account'
    default: return 'Gift'
  }
}

// Helper to get ID/NRIC display (placeholder for now)
function getBeneficiaryId(recipientName?: string | null): string {
  // In a real implementation, this would come from the member's ID data
  // For now, return a placeholder
  return `(${recipientName?.replace(/\s/g, '').substring(0, 8) || 'ID'})`
}

export default function WillPreviewPage() {
  const { data: response, isLoading } = useGetWillDetailsQuery(undefined)
  const dashboard = (response?.data ?? {}) as WillDetailsResponse

  const [activeStep, setActiveStep] = useState<string>('children')

  const family = dashboard.family ?? []
  const executors = dashboard.executors ?? []
  const estateDistributions = dashboard.estateDistributions ?? []
  const gifts = dashboard.gifts ?? []
  const petCaretakers = dashboard.petCaretakers ?? []
  const financialAssets = dashboard.assets?.financialAssets ?? []
  const properties = dashboard.assets?.properties ?? []
  const loans = dashboard.assets?.loans ?? []

  // Separate gifts by type for better display on page 6
  const cashGifts = gifts.filter(g => g.giftType === 'CASH')
  const itemGifts = gifts.filter(g => g.giftType === 'ITEM')
  const collectionGifts = gifts.filter(g => g.giftType === 'COLLECTION')
  const propertyGifts = gifts.filter(g => g.giftType === 'PROPERTY')
  const financialGifts = gifts.filter(g => g.giftType === 'FINANCIAL_ACCOUNT')

  // Get personal messages from gifts with descriptions
  const personalMessages = gifts.filter(g => g.description && g.description.trim().length > 0)

  const userName = dashboard.user?.name ?? 'Your will'
  const primaryExecutor = executors[0]?.person?.fullName ?? 'Not selected'
  const backupExecutor = executors[0]?.backupPerson?.fullName ?? 'Not selected'
  const familyNames = family.map((member) => member.fullName).filter(Boolean) as string[]
  const firstDistributions = estateDistributions.slice(0, 3)
  const firstPetCaretaker = petCaretakers[0]?.caretaker?.fullName ?? backupExecutor
  const firstPetName = petCaretakers[0]?.pet?.fullName ?? familyNames[0] ?? 'Companion animal'
  const totalPages = 9
  
  const documentPages = useMemo(
    () => [
      {
        pageTitle: 'The Last Will and Testament',
        pageNumber: 1,
        body: (
          <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
            <p className="text-[0.82rem] uppercase tracking-[0.28em] text-[#8d918d]">OF</p>
            <h3 className="mt-4 max-w-[560px] text-[2.2rem] font-semibold uppercase leading-[1.06] tracking-[0.04em] text-[#23262e] lg:text-[3rem]">
              <Highlight>{userName}</Highlight>
            </h3>
            <p className="mt-6 text-[0.92rem] uppercase tracking-[0.22em] text-[#b06248]">Created on 8th May 2026</p>
            <p className="mt-4 max-w-[430px] text-[0.84rem] leading-[1.55] text-[#8b8a85]">
              Document framework created using Will&amp;Way. This document does not constitute formal legal advice.
            </p>
            <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
              <SummaryTile label="Family members" value={`${family.length}`} />
              <SummaryTile label="Executors" value={`${executors.length}`} />
              <SummaryTile label="Net worth" value={formatMoney(dashboard.summary?.netWorth)} />
              <SummaryTile label="Gift entries" value={`${gifts.length}`} />
            </div>
          </div>
        ),
      },
      {
        pageTitle: 'Step-by-Step Execution Protocol',
        pageNumber: 2,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <div className="rounded-[4px] border-l-[4px] border-[#c35b43] bg-[#f9f8f5] px-4 py-3">
              <p>
                <strong>Action Required:</strong> Follow these precise compliance measures to guarantee the legal enforceability of this portfolio under Singapore jurisdiction.
              </p>
            </div>
            <p>
              1.1 Document Verification &amp; Physical Binding: Prior to signature, thoroughly review all clauses. Any updated highlight should match the live response from the dashboard.
            </p>
            <p>
              1.2 The Attestation Ceremony: You must execute this document in the simultaneous presence of two independent adult witnesses.
            </p>
            <p>
              1.3 Affixing Signatures: The testator <Highlight>{userName}</Highlight> will sign beside the witness sections when the final PDF is issued.
            </p>
          </div>
        ),
      },
      {
        pageTitle: 'Essential Singapore Statutory Principles',
        pageNumber: 3,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <div className="rounded-[4px] border-l-[4px] border-[#c35b43] bg-[#f9f8f5] px-4 py-3">
              <p>
                <strong>Legal Parameters:</strong> Understanding the operation of non-estate assets and life events under the Wills Act (Cap. 352).
              </p>
            </div>
            <p>
              2.1 Impact of Subsequent Marriage: If your civil status changes, the highlighted testator reference remains <Highlight>{userName}</Highlight>.
            </p>
            <p>
              2.2 The Principle of Joint Survivorship: Real property or bank holdings registered under a joint framework are handled separately from the yellow-marked family response.
            </p>
            <p>
              2.3 Separation of Central Provident Fund (CPF): Your CPF savings are strictly isolated from estate distribution under this will.
            </p>
          </div>
        ),
      },
      {
        pageTitle: 'Testamentary Declarations & Family Structure',
        pageNumber: 4,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <div className="rounded-[4px] border-l-[4px] border-[#c35b43] bg-[#f9f8f5] px-4 py-3">
              <p>
                <strong>Purpose:</strong> Explicitly establishes the identity of the testator, status of immediate kin, and revokes prior legal instruments.
              </p>
            </div>
            <p>
              3.1 I, <Highlight>{userName}</Highlight>, bearing Singapore NRIC/FIN, declare this instrument to be my definitive Last Will and Testament.
            </p>
            <p>
              3.2 I formally declare that my immediate family structure comprises the following individuals:
            </p>
            <ul className="space-y-3 pl-5">
              {family.length ? (
                family.map((member, index) => (
                  <li key={member.id ?? `${member.fullName ?? 'member'}-${index}`} className="list-disc">
                    My family member is <Highlight>{member.fullName ?? 'Unnamed family member'}</Highlight>
                    {member.relationType ? ` (${member.relationType})` : ''}.
                  </li>
                ))
              ) : (
                <li className="list-disc">No family members added yet.</li>
              )}
            </ul>
            <p>
              Primary executor: <Highlight>{primaryExecutor}</Highlight>. Backup executor: <Highlight>{backupExecutor}</Highlight>.
            </p>
          </div>
        ),
      },
      {
        pageTitle: 'Administrative Appointments & Minority Guardianship',
        pageNumber: 5,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <div className="rounded-[4px] border-l-[4px] border-[#c35b43] bg-[#f9f8f5] px-4 py-3">
              <p>
                <strong>Purpose:</strong> Designates fiduciary representatives to manage the estate liquidation and care for minor dependents.
              </p>
            </div>
            <p>
              4.1 Fiduciary Appointment: I nominate <Highlight>{primaryExecutor}</Highlight> to act as the sole Executor and Trustee of this my Will.
            </p>
            <p>
              4.2 Minority Guardianship Mandate: In the event that my children are below the age of twenty-one, I appoint <Highlight>{backupExecutor}</Highlight> as the backup guardian.
            </p>
            <p>
              4.3 Financial Indemnification of Caregivers: It is my explicit directive that estate resources may support my dependents as needed.
            </p>
          </div>
        ),
      },
      {
        pageTitle: 'Special Bequests & Asset Distribution',
        pageNumber: 6,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <div className="rounded-[4px] border-l-[4px] border-[#c35b43] bg-[#f9f8f5] px-4 py-3">
              <p>
                <strong>Purpose:</strong> Specific gifts and asset allocations to named beneficiaries.
              </p>
            </div>
            
            {/* Cash Gifts */}
            {cashGifts.length > 0 && (
              <div>
                <p className="font-semibold text-[#2b221a]">5.1 Cash Gifts:</p>
                <ul className="mt-2 space-y-2 pl-5">
                  {cashGifts.map((gift) => (
                    <li key={gift.id} className="list-disc">
                      I bequeath <Highlight>{formatMoney(gift.amount)}</Highlight> in cash to <Highlight>{gift.recipientName}</Highlight>.
                      {gift.description && <span className="italic text-[#6f7685]"> ({gift.description})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Item Gifts */}
            {itemGifts.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-[#2b221a]">5.2 Specific Items:</p>
                <ul className="mt-2 space-y-2 pl-5">
                  {itemGifts.map((gift) => (
                    <li key={gift.id} className="list-disc">
                      I bequeath my <Highlight>{gift.itemName || gift.description || 'item'}</Highlight> to <Highlight>{gift.recipientName}</Highlight>.
                      {gift.description && gift.description !== gift.itemName && <span className="italic text-[#6f7685]"> ({gift.description})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Collection Gifts */}
            {collectionGifts.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-[#2b221a]">5.3 Collections:</p>
                <ul className="mt-2 space-y-2 pl-5">
                  {collectionGifts.map((gift) => (
                    <li key={gift.id} className="list-disc">
                      I bequeath my <Highlight>{gift.itemName || 'collection'}</Highlight> collection to <Highlight>{gift.recipientName}</Highlight>.
                      {gift.description && <span className="italic text-[#6f7685]"> ({gift.description})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Property Gifts */}
            {propertyGifts.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-[#2b221a]">5.4 Property Gifts:</p>
                <ul className="mt-2 space-y-2 pl-5">
                  {propertyGifts.map((gift) => (
                    <li key={gift.id} className="list-disc">
                      I bequeath my property at <Highlight>{gift.property?.streetAddress || 'address'}</Highlight> 
                      (valued at {formatMoney(gift.property?.estimatedValue)}) to <Highlight>{gift.recipientName}</Highlight>.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Financial Account Gifts */}
            {financialGifts.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-[#2b221a]">5.5 Financial Accounts:</p>
                <ul className="mt-2 space-y-2 pl-5">
                  {financialGifts.map((gift) => {
                    const accountValue = gift.asset?.approximateValue || gift.asset?.faceValue
                    const accountType = gift.asset?.type?.replace(/_/g, ' ').toLowerCase() || 'financial account'
                    return (
                      <li key={gift.id} className="list-disc">
                        I bequeath my <Highlight>{accountType}</Highlight> 
                        {gift.asset?.institutionName ? ` from ${gift.asset.institutionName}` : ''}
                        {accountValue ? ` (valued at ${formatMoney(accountValue)})` : ''}
                        {' '}to <Highlight>{gift.recipientName}</Highlight>.
                        {gift.description && <span className="italic text-[#6f7685]"> "{gift.description}"</span>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* No gifts message */}
            {gifts.length === 0 && (
              <p className="italic text-[#6f7685]">No specific gifts have been added to this will.</p>
            )}

            {/* Companion Animal Legacy */}
            {petCaretakers.length > 0 && (
              <div className="mt-4 pt-2 border-t border-[#ece8e2]">
                <p className="font-semibold text-[#2b221a]">5.6 Companion Animal Legacy:</p>
                <p className="mt-2">
                  I entrust my companion animal <Highlight>{firstPetName}</Highlight> to <Highlight>{firstPetCaretaker}</Highlight>.
                </p>
              </div>
            )}
          </div>
        ),
      },
      {
        pageTitle: 'Apportionment of Residuary Estate & Legal Defenses',
        pageNumber: 7,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <div className="rounded-[4px] border-l-[4px] border-[#c35b43] bg-[#f9f8f5] px-4 py-3">
              <p>
                <strong>Purpose:</strong> Dictates the definitive split of all remaining assets and introduces structural legal protection clauses.
              </p>
            </div>
            <p>
              6.1 Residuary Allocations: All remaining capital, real estate interests, and investments not specifically named elsewhere shall be settled and distributed among the following survivors:
            </p>
            <ul className="space-y-3 pl-5">
              {estateDistributions.length ? (
                estateDistributions.map((distribution) => (
                  <li key={distribution.id} className="list-disc">
                    Allocation to <Highlight>{distribution.person?.fullName ?? 'Not selected'}</Highlight> with a <Highlight>{formatPercent(distribution.percentage)}</Highlight> share.
                  </li>
                ))
              ) : (
                <li className="list-disc">No residue allocation has been added yet.</li>
              )}
            </ul>
            <p>
              6.2 Severability Clause: If any clause is found invalid, the remaining instrument and highlighted beneficiary data will remain intact.
            </p>
            <p>
              6.3 Final Binding Declaration: I sign this document openly in the presence of my witnesses.
            </p>
          </div>
        ),
      },
      {
        pageTitle: 'Final Execution Interface',
        pageNumber: 8,
        body: (
          <div className="space-y-4 text-[0.92rem] leading-[1.75] text-[#4a515d]">
            <div className="rounded-[4px] border-l-[4px] border-[#c35b43] bg-[#f9f8f5] px-4 py-3">
              <p>
                <strong>Action:</strong> To be signed only when both witnesses are physically looking at your hand affixing the mark.
              </p>
            </div>
            <p>
              In witness whereof, I have set my hand to this my Last Will on this <Highlight>________</Highlight> day of <Highlight>________</Highlight>, 2026.
            </p>
            <p>
              <Highlight>{userName}</Highlight>
            </p>
            <p className="italic text-[#5f5b55]">
              Acknowledged and signed by the Testator as his final wishes in our joint simultaneous presence, whereupon, we, at his request, subscribe our names as witnesses:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[6px] border border-[#ece6dc] bg-[#fbfaf7] px-4 py-4 text-[0.88rem] leading-[1.7] text-[#59616e]">
                <p className="font-semibold text-[#3b4048]">WITNESS ONE:</p>
                <p>Signature: ____________________</p>
                <p>Full Name: ____________________</p>
                <p>NRIC/ID: ____________________</p>
                <p>Address: ____________________</p>
              </div>
              <div className="rounded-[6px] border border-[#ece6dc] bg-[#fbfaf7] px-4 py-4 text-[0.88rem] leading-[1.7] text-[#59616e]">
                <p className="font-semibold text-[#3b4048]">WITNESS TWO:</p>
                <p>Signature: ____________________</p>
                <p>Full Name: ____________________</p>
                <p>NRIC/ID: ____________________</p>
                <p>Address: ____________________</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        pageTitle: 'Personal Memos & Confidential Appendix',
        pageNumber: 9,
        body: (
          <div className="space-y-5 text-[0.94rem] leading-[1.75] text-[#3f4550]">
            <div className="rounded-[4px] border-l-[4px] border-[#c35b43] bg-[#f9f8f5] px-4 py-3">
              <p>
                <strong>Directives:</strong> I instruct my executor to deliver these messages to my intended beneficiaries, either electronically or in hard copy. They should not be shared with anyone other than the recipient, and should be excluded from public availability.
              </p>
            </div>
            
            {/* Personal Messages from Gifts */}
            {personalMessages.length > 0 ? (
              personalMessages.map((gift) => (
                <div key={gift.id} className="space-y-2">
                  <p>
                    <strong>Private Memorandum to <Highlight>{gift.recipientName}</Highlight> {getBeneficiaryId(gift.itemName || "N/A")}:</strong>
                  </p>
                  <p className="font-medium text-[#2f2d24] italic pl-4 border-l-2 border-[#c35b43]/30">
                    "{gift.description}"
                  </p>
                </div>
              ))
            ) : (
              // Default fallback messages if no personal messages exist
              <>
                <div className="space-y-2">
                  <p>
                    <strong>Private Memorandum to <Highlight>{familyNames[0] || primaryExecutor}</Highlight> {getBeneficiaryId(familyNames[0] || primaryExecutor)}:</strong>
                  </p>
                  <p className="font-medium text-[#2f2d24] italic pl-4 border-l-2 border-[#c35b43]/30">
                    "Dear recipient, please find an appropriate buyer for my business, should you be able to liquidate. My wish is to leave 20% of its nett sale proceeds to you and remaining 80% divided equally between my children. I kindly entrust you to do this for me."
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Private Memorandum to <Highlight>{familyNames[1] || backupExecutor}</Highlight> {getBeneficiaryId(familyNames[1] || backupExecutor)}:</strong>
                  </p>
                  <p className="font-medium text-[#2f2d24] italic pl-4 border-l-2 border-[#c35b43]/30">
                    "Dear recipient, This plan is able to be transferred. I hope for this plan to be transferred to you so that you can enjoy the monthly dividends forward."
                  </p>
                </div>
              </>
            )}

            {/* Informal Portfolio Audit Table */}
            <div className="pt-3">
              <p className="font-semibold uppercase tracking-[0.08em] text-[#2d2f35] mb-3">Informal Portfolio Audit</p>
              <div className="overflow-x-auto">
                <div className="min-w-full overflow-hidden rounded-[2px] border border-[#e1d7cb]">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-[#1f2937]">
                        <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-white">ASSET DESCRIPTION</th>
                        <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-white">ASSET CLASS</th>
                        <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-white">BENEFICIARY ID LINK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Financial Gifts */}
                      {financialGifts.slice(0, 3).map((gift, idx) => (
                        <tr key={gift.id} className={idx > 0 ? 'border-t border-[#e1d7cb]' : ''}>
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957]">{formatGiftDisplay(gift)}</td>
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957]">{getGiftTypeDisplay(gift.giftType)}</td>
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957] text-center">
                            <Highlight>{gift.recipientName}</Highlight> 
                          </td>
                        </tr>
                      ))}
                      
                      {/* Property Gifts */}
                      {propertyGifts.slice(0, 2).map((gift, idx) => (
                        <tr key={gift.id} className="border-t border-[#e1d7cb]">
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957]">{formatGiftDisplay(gift)}</td>
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957]">{getGiftTypeDisplay(gift.giftType)}</td>
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957] text-center">
                            <Highlight>{gift.recipientName}</Highlight>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Fallback if no gifts */}
                      {gifts.length === 0 && (
                        <tr>
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957]">No assets added</td>
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957]">-</td>
                          <td className="px-4 py-3 text-[0.82rem] text-[#414957]">-</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="pt-3 text-center text-[0.78rem] uppercase tracking-[0.08em] text-[#8c8072]">
              MANAGED VIA THE WILL &amp; WAY PLATFORM — END OF PORTFOLIO DRAFT
            </p>
          </div>
        ),
      },
    ],
    [
      backupExecutor,
      cashGifts,
      collectionGifts,
      dashboard.summary?.netWorth,
      estateDistributions,
      executors.length,
      family,
      familyNames,
      financialGifts,
      firstPetCaretaker,
      firstPetName,
      gifts,
      itemGifts,
      personalMessages,
      petCaretakers.length,
      primaryExecutor,
      properties.length,
      propertyGifts,
      userName,
    ]
  )

  const allComplete = [
    family.length > 0,
    executors.length > 0,
    estateDistributions.length > 0,
    gifts.length > 0,
    Boolean(dashboard.petCaretakers?.length),
    financialAssets.length > 0 || properties.length > 0 || loans.length > 0,
  ].every(Boolean)

  const nextSteps = [
    {
      id: 'children',
      title: 'Name guardians for your children',
      icon: Users2,
      description:
        'If you have young children, name a guardian and a backup guardian you trust to care for them and their inheritance until they reach 21 years of age.',
    },
    {
      id: 'update',
      title: 'Easily update anytime',
      icon: PenLine,
      description: 'You can return later to update family, executor, gifts, distribution, caretakers, and asset details whenever life changes.',
    },
    {
      id: 'gifts',
      title: 'Leave gifts to your loved ones',
      icon: Wallet,
      description: 'Assign specific cash, items, collections, or property gifts to the people who matter most.',
    },
    {
      id: 'legal',
      title: 'Legally valid in Singapore',
      icon: Shield,
      description: 'Your will can be used as part of a valid estate planning process in Singapore when properly executed.',
    },
    {
      id: 'support',
      title: 'Continued support after purchase',
      icon: CheckCircle2,
      description: 'Review and revise your plan as your family and assets change over time.',
    },
    // {
    //   id: 'money-back',
    //   title: '30-day money-back guarantee',
    //   icon: Wrench,
    //   description: 'If you are not satisfied, the service provides a simple satisfaction window for your purchase.',
    // },
    {
      id: 'pets',
      title: 'Caretakers for your pets',
      icon: Users2,
      description: 'Name a caretaker so your pets are looked after according to your wishes.',
    },
    {
      id: 'finances',
      title: 'Organised finances for loved ones',
      icon: Wallet,
      description: 'Keep loans, financial accounts, properties, and other assets clearly organised in one place.',
    },
    {
      id: 'coverage',
      title: 'Global coverage',
      icon: Lock,
      description: 'Keep your estate planning data centralised and accessible for the people who need it most.',
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbf4ed] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#c35b43] border-t-transparent"></div>
          <p className="mt-4 text-[#6f7685]">Loading your will preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbf4ed] text-[#171612]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ece2d7] bg-[#fbf4ed]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4">
          <Link href="/will" className="inline-flex items-center">
            <Image src={logo} alt="Will & Way" className="h-auto w-[96px] md:w-[138px]" priority />
          </Link>

          <Link
            href="/will"
            className="rounded-[3px] border border-[#d9cec1] bg-transparent px-4 py-2 text-[0.9rem] text-[#1d1b18] transition-colors hover:bg-[#f2e7db]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-28 md:px-8 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-4">
            <div className="rounded-[28px] border border-[#e4d8cb] bg-[#efe7db] p-4 shadow-[0_20px_50px_rgba(17,24,39,0.06)]">
              <div className="flex items-center justify-between gap-4 px-2 pb-4">
                <div>
                  <p className="text-[0.76rem] uppercase tracking-[0.22em] text-[#8a8378]">PDF Preview</p>
                  <h2 className="mt-2 text-[1.25rem] font-semibold text-[#241f1a]">Will pages from your live dashboard</h2>
                </div>
              </div>
              <div className="max-h-[calc(100vh-220px)] space-y-5 overflow-auto pr-2">
                {documentPages.map((page) => (
                  <PdfPageFrame
                    key={page.pageNumber}
                    pageNumber={page.pageNumber}
                    totalPages={totalPages}
                    title={page.pageTitle}
                  >
                    {page.body}
                  </PdfPageFrame>
                ))}
              </div>
            </div>
            <div className='mt-10'>
              <DigitalAssetPdfPreview />
            </div>
          </section>

          <aside className="space-y-6">
            <div>
              <h1 className="text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#101010] md:text-[3.25rem]">
                Next Steps
              </h1>
              <p className="mt-4 max-w-[560px] text-[1rem] leading-[1.55] text-[#6f7685] md:text-[1.08rem]">
                The left preview keeps the PDF wording static while the yellow-marked fields are driven by your dashboard response.
              </p>
              <p className="mt-4 max-w-[560px] text-[1rem] leading-[1.55] text-[#6f7685] md:text-[1.08rem]">
                From the date of purchase, you will have 30 days to make any changes and download for free.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryTile label="Family" value={`${family.length} members`} />
                <SummaryTile label="Executors" value={`${executors.length} selected`} />
                <SummaryTile label="Assets" value={`${financialAssets.length + properties.length + loans.length}`} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/will" className="inline-flex items-center rounded-[3px] border border-[#cbbdaa] bg-white px-5 py-3 text-[0.95rem] text-[#2b221a] shadow-[0_8px_18px_rgba(18,28,44,0.08)]">
                  Make edits to your will
                </Link>
                <Link href="/will/checkout" className="inline-flex items-center rounded-[3px] bg-[#192233] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]">
                  Pay and download
                </Link>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#ece2d7] bg-[#f7efe6] p-2">
              <div className="space-y-1">
                {nextSteps.map((step) => (
                  <AccordionItem
                    key={step.id}
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    open={activeStep === step.id}
                    onToggle={() => setActiveStep((current) => (current === step.id ? '' : step.id))}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              {allComplete ? (
                <Link href="/will" className="inline-flex items-center gap-2 rounded-[3px] bg-[#192233] px-6 py-3 text-[0.98rem] text-white shadow-[0_8px_18px_rgba(18,28,44,0.16)]">
                  Continue
                </Link>
              ) : (
                <span className="text-[0.95rem] text-[#6f7685]">Complete all sections to continue.</span>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}