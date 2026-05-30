'use client';

import { AtSign, ChevronDown, CircleUserRound, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useAddMemberMutation, useUpdateMemberMutation } from '@/redux/api/profileApi';

type IdentifierOption = 'NRIC / FIN' | 'Passport' | 'Foreign ID';
type GenericRelationshipOption = 'FRIEND' | 'SIBLING' | 'COUSIN' | 'OTHER_FAMILY' | 'OTHER';

const identifierOptions: IdentifierOption[] = [
  'NRIC / FIN',
  'Passport',
  'Foreign ID',
];

const genericRelationshipOptions: Array<{ label: string; value: GenericRelationshipOption }> = [
  { label: 'Friend', value: 'FRIEND' },
  { label: 'Sibling', value: 'SIBLING' },
  { label: 'Cousin', value: 'COUSIN' },
  { label: 'Other family member', value: 'OTHER_FAMILY' },
  { label: 'Other', value: 'OTHER' },
];

function toIdNumberLabel(value: IdentifierOption) {
  if (value === 'NRIC / FIN') return 'NRIC / FIN NUMBER';
  return `${value.toUpperCase()} NUMBER`;
}

function toApiIdentifierType(value: IdentifierOption) {
  if (value === 'NRIC / FIN') return 'NRIC_OR_FIN';
  if (value === 'Passport') return 'PASSPORT';
  return 'FOREIGN_ID';
}

function parseDateOfBirth(value?: string | null) {
  if (!value) return { year: '', month: '', day: '' };

  const normalizedDate = value.includes('T') ? value.split('T')[0] : value;
  const [year = '', month = '', day = ''] = normalizedDate.split('-');

  return { year, month, day };
}

interface AddPersonModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  actionLabel?: string;
  mode?: 'person' | 'child' | 'pet';
  relationType?: 'SPOUSE' | 'PARTNER' | 'CHILD' | 'PET';
  allowGenericPerson?: boolean;
  genericRelationshipType?: GenericRelationshipOption;
  memberId?: string;
  initialValues?: {
    fullName?: string;
    email?: string;
    dateOfBirth?: string | null;
    typeOfIdentifier?: 'NRIC_OR_FIN' | 'PASSPORT' | 'FOREIGN_ID' | null;
    identifierValue?: string | null;
    governmentIssuedId?: boolean | null;
  };
  onSuccess?: (result?: any) => void | Promise<void>;
}

export default function AddPersonModal({
  open,
  onClose,
  title = 'Add a new person',
  actionLabel = 'Create a person',
  mode = 'person',
  relationType,
  allowGenericPerson = false,
  genericRelationshipType = 'FRIEND',
  memberId,
  initialValues,
  onSuccess,
}: AddPersonModalProps) {
  const isChildMode = mode === 'child';
  const isPetMode = mode === 'pet';
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [withAdditionalId, setWithAdditionalId] = useState(false);
  const [hasPersonId, setHasPersonId] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [identifierType, setIdentifierType] = useState<IdentifierOption>('NRIC / FIN');
  const [identifierNumber, setIdentifierNumber] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [genericRelationType, setGenericRelationType] = useState<GenericRelationshipOption>(genericRelationshipType);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [addMember] = useAddMemberMutation();
  const [updateMember] = useUpdateMemberMutation();

  const idNumberLabel = useMemo(() => toIdNumberLabel(identifierType), [identifierType]);
  const dateOfBirth = useMemo(() => {
    if (!dobYear || !dobMonth || !dobDay) return '';
    return `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
  }, [dobDay, dobMonth, dobYear]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setWithAdditionalId(false);
    setHasPersonId(true);
    setIsDropdownOpen(false);
    setIdentifierType('NRIC / FIN');
    setIdentifierNumber('');
    setDobDay('');
    setDobMonth('');
    setDobYear('');
    setGenericRelationType(genericRelationshipType);
    setIsEditing(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
      setIsEditing(false);
      return;
    }

    resetForm();

    if (initialValues) {
      setName(initialValues.fullName ?? '');
      setEmail(initialValues.email ?? '');
      setWithAdditionalId(Boolean(initialValues.governmentIssuedId || initialValues.typeOfIdentifier || initialValues.identifierValue));
      setIsEditing(Boolean(memberId));

      if (initialValues.dateOfBirth) {
        const { year, month, day } = parseDateOfBirth(initialValues.dateOfBirth);
        setDobYear(year ?? '');
        setDobMonth(month ?? '');
        setDobDay(day ?? '');
        setHasPersonId(false);
      }

      if (initialValues.typeOfIdentifier) {
        const mappedType = initialValues.typeOfIdentifier === 'NRIC_OR_FIN' ? 'NRIC / FIN' : initialValues.typeOfIdentifier === 'PASSPORT' ? 'Passport' : 'Foreign ID';
        setIdentifierType(mappedType);
        setIdentifierNumber(initialValues.identifierValue ?? '');
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/45 p-3 pt-8 sm:p-5 sm:pt-14" onClick={onClose}>
      <div className="mx-auto flex min-h-full w-full items-start justify-center">
      <div
        className="w-full max-w-[860px] overflow-hidden rounded-[18px] bg-[#f1e8de]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="max-h-[95vh] overflow-y-auto p-5 sm:p-8">
          <h2 className="text-[30px]  text-[#152034]">{title}</h2>

          <div className="mt-8 space-y-7">
          <div>
            <label className="mb-3 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
              Their full legal name
            </label>
            <div className="flex items-center gap-3 rounded-[12px] bg-[#f8f8f8] px-4 py-4 sm:h-[70px] sm:px-6">
              <CircleUserRound className="h-6 w-6 text-[#8f98a6]" />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full Name"
                className="h-full w-full bg-transparent text-base tracking-[-0.02em] text-[#7b8593] outline-none placeholder:text-[#8a93a3] "
              />
            </div>
          </div>

          {!isChildMode && !isPetMode ? (
            <div>
              <label className="mb-3 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                Their email
              </label>
              <div className="flex items-center gap-3 rounded-[12px] bg-[#f8f8f8] px-4 py-4 sm:h-[70px] sm:px-6">
                <AtSign className="h-7 w-7 text-[#8f98a6]" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@legacy.com"
                  className="h-full w-full bg-transparent text-base tracking-[-0.01em] text-[#7b8593] outline-none placeholder:text-[#8a93a3] "
                />
              </div>
            </div>
          ) : null}

          {isChildMode ? (
            <div>
              <p className="text-[1.5rem] font-medium text-[#4c525c] sm:text-[1.9rem]">Their Date of birth</p>
              {/* <p className="mt-4 text-[1rem] leading-[1.4] text-[#8f98a6] sm:text-[1.1rem]">
                The age of your child is used to customise your will,
              </p> */}

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <div>
                  <label className="mb-2 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                    Day
                  </label>
                  <input
                    value={dobDay}
                    onChange={(event) => setDobDay(event.target.value)}
                    className="h-[84px] w-full rounded-[12px] bg-[#f8f8f8] px-4 text-[1.15rem] text-[#5a616d] outline-none sm:h-[70px] sm:text-[1.7rem]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                    Month
                  </label>
                  <input
                    value={dobMonth}
                    onChange={(event) => setDobMonth(event.target.value)}
                    className="h-[84px] w-full rounded-[12px] bg-[#f8f8f8] px-4 text-[1.15rem] text-[#5a616d] outline-none sm:h-[70px] sm:text-[1.7rem]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                    Year
                  </label>
                  <input
                    value={dobYear}
                    onChange={(event) => setDobYear(event.target.value)}
                    className="h-[84px] w-full rounded-[12px] bg-[#f8f8f8] px-4 text-[1.15rem] text-[#5a616d] outline-none sm:h-[70px] sm:text-[1.7rem]"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {!isPetMode ? (
            <div className="space-y-3 text-base leading-[1.4] text-[#7d8899]">
            <p>
              It is recommended that you include ID information for everyone in your will so
              that they can be identified properly.
            </p>
            <p>You can add this information later if you like</p>
            </div>
          ) : null}

          {!isPetMode ? (
            <label className="inline-flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={withAdditionalId}
              onChange={(event) => setWithAdditionalId(event.target.checked)}
              className="h-7 w-7 rounded-[6px] border border-[#778091] accent-[#6e7685]"
            />
            <span className="text-base font-bold text-[#677286] ">
              Add additional ID Information
            </span>
            </label>
          ) : null}

          {!isPetMode && withAdditionalId ? (
            <div className="space-y-6">
              {allowGenericPerson ? (
                <div>
                  <label className="mb-3 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                    Relationship to you
                  </label>
                  <select
                    value={genericRelationType}
                    onChange={(event) => setGenericRelationType(event.target.value as GenericRelationshipOption)}
                    className="h-[58px] w-full rounded-[12px] bg-[#f8f8f8] px-4 text-base text-[#5a616d] outline-none sm:h-[70px]"
                  >
                    {genericRelationshipOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {isChildMode ? (
                <>
                  <div>
                    <p className=" text-[#7d8899] text-base mt-12">Type of identifier</p>
                    <p className="mt-2  leading-[1.4] text-[#8f98a6] text-base">
                      This is the type of identity information displayed next to the name of
                      this person in your will.
                    </p>

                    <div className="relative mt-5">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen((current) => !current)}
                        className="flex h-[84px] w-full items-center justify-between rounded-[12px] bg-[#f8f8f8] px-5 text-left text-base text-[#8a93a3] sm:h-[70px] "
                      >
                        <span>{identifierType}</span>
                        <ChevronDown
                          className={cn(
                            'h-6 w-6 text-[#8a93a3] transition-transform',
                            isDropdownOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {isDropdownOpen ? (
                        <div className="absolute left-0 right-0 top-[92px] z-10 overflow-hidden rounded-[12px] bg-[#f8f8f8] shadow-[0_22px_40px_rgba(0,0,0,0.2)] sm:top-[102px]">
                          {identifierOptions.map((option, index) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setIdentifierType(option);
                                setIsDropdownOpen(false);
                              }}
                              className={cn(
                                'block w-full px-6 py-5 text-left text-base text-[#4a4f58] transition-colors ',
                                index === 0 ? 'bg-[#f1e8de]' : 'bg-[#f8f8f8]',
                                option === identifierType && 'text-[#3f444d]'
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                      {idNumberLabel}
                    </label>
                    <input
                      value={identifierNumber}
                      onChange={(event) => setIdentifierNumber(event.target.value)}
                      className="h-[84px] w-full rounded-[12px] bg-[#f8f8f8] px-5 text-[1.2rem] text-[#5a616d] outline-none sm:h-[70px] sm:text-[1.85rem]"
                    />
                  </div>
                </>
              ) : hasPersonId ? (
                <>
                  <div>
                    <p className=" text-[#7d8899] text-base mt-12">Type of identifier</p>
                    <p className="mt-2  leading-[1.4] text-[#8f98a6] text-base">
                      This is the type of identity information displayed next to the name of
                      this person in your will.
                    </p>

                    <div className="relative mt-5">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen((current) => !current)}
                        className="flex h-[84px] w-full items-center justify-between rounded-[12px] bg-[#f8f8f8] px-5 text-left text-base text-[#8a93a3] sm:h-[70px] "
                      >
                        <span>{identifierType}</span>
                        <ChevronDown
                          className={cn(
                            'h-6 w-6 text-[#8a93a3] transition-transform',
                            isDropdownOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {isDropdownOpen ? (
                        <div className="absolute left-0 right-0 top-[92px] z-10 overflow-hidden rounded-[12px] bg-[#f8f8f8] shadow-[0_22px_40px_rgba(0,0,0,0.2)] sm:top-[102px]">
                          {identifierOptions.map((option, index) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setIdentifierType(option);
                                setIsDropdownOpen(false);
                              }}
                              className={cn(
                                'block w-full px-6 py-5 text-left text-base text-[#4a4f58] transition-colors ',
                                index === 0 ? 'bg-[#f1e8de]' : 'bg-[#f8f8f8]',
                                option === identifierType && 'text-[#3f444d]'
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                      {idNumberLabel}
                    </label>
                    <input
                      value={identifierNumber}
                      onChange={(event) => setIdentifierNumber(event.target.value)}
                      className="h-[84px] w-full rounded-[12px] bg-[#f8f8f8] px-5 text-[1.2rem] text-[#5a616d] outline-none sm:h-[70px] sm:text-[1.85rem]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setHasPersonId(false);
                      setIsDropdownOpen(false);
                    }}
                    className="text-[18px] text-[#46a7f0] underline underline-offset-4 transition-opacity hover:opacity-80 "
                  >
                    I don't have the person's ID
                  </button>
                </>
              ) : (
                <>
                  <div className="rounded-[12px] bg-[#f8f8f8] p-5 sm:p-7">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#58afe7] text-white">
                        <Info className="h-4 w-4" />
                      </span>
                      <div className="space-y-3 text-[1rem] md:text-lg leading-[1.35] text-[#1d1d1d] ">
                        <p>
                          If you do not have the person's ID, it is important you provide their
                          date of birth
                        </p>
                        <ul className="list-disc space-y-1 pl-6 font-medium">
                          <li>How you know them</li>
                          <li>Their date of birth</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-4  text-[#4c525c] text-2xl mt-5">Their Date of birth</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                      <div>
                        <label className="mb-2 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                          Day
                        </label>
                        <input
                          value={dobDay}
                          onChange={(event) => setDobDay(event.target.value)}
                          className="h-[84px] w-full rounded-[12px] bg-[#f8f8f8] px-4 text-[1.15rem] text-[#5a616d] outline-none sm:h-[70px] sm:text-[1.7rem]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                          Month
                        </label>
                        <input
                          value={dobMonth}
                          onChange={(event) => setDobMonth(event.target.value)}
                          className="h-[84px] w-full rounded-[12px] bg-[#f8f8f8] px-4 text-[1.15rem] text-[#5a616d] outline-none sm:h-[70px] sm:text-[1.7rem]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[0.78rem] uppercase tracking-[0.12em] text-[#4c525c]">
                          Year
                        </label>
                        <input
                          value={dobYear}
                          onChange={(event) => setDobYear(event.target.value)}
                          className="h-[84px] w-full rounded-[12px] bg-[#f8f8f8] px-4 text-[1.15rem] text-[#5a616d] outline-none sm:h-[70px] sm:text-[1.7rem]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className='mt-12'>
                    <button
                      type="button"
                      onClick={() => setHasPersonId(true)}
                      className="text-base text-[#46a7f0] underline underline-offset-4 transition-opacity hover:opacity-80 "
                    >
                      I have the person's ID
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>

            <div className="mt-10 flex flex-col-reverse justify-end gap-3 sm:mt-12 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="h-[52px] rounded-[6px] border border-[#1f2b3c] px-8 text-[1rem] text-[#1f2b3c] sm:h-[58px] sm:min-w-[130px] sm:text-[1.6rem]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={async () => {
                setSubmitting(true);
                try {
                  // Build payload depending on relationType/mode
                  const payload: any = {};
                  const hasIdentifierDetails = withAdditionalId && identifierNumber.trim();
                  const shouldSendDateOfBirth = isChildMode || !hasPersonId;

                  if (isPetMode) {
                    payload.fullName = name || 'Pet';
                    payload.relationType = 'PET';
                  } else {
                    payload.fullName = name;
                    if (email) payload.email = email;

                    if (shouldSendDateOfBirth && dateOfBirth) {
                      payload.dateOfBirth = dateOfBirth;
                    }

                    if (isChildMode) {
                      payload.relationType = relationType || 'CHILD';
                      if (hasIdentifierDetails) {
                        payload.typeOfIdentifier = toApiIdentifierType(identifierType);
                        payload.identifierValue = identifierNumber;
                        payload.governmentIssuedId = true;
                      }
                    } else if (!allowGenericPerson) {
                      payload.relationType = relationType || 'SPOUSE';
                      if (hasIdentifierDetails) {
                        payload.typeOfIdentifier = toApiIdentifierType(identifierType);
                        payload.identifierValue = identifierNumber;
                        payload.governmentIssuedId = true;
                      }
                    } else {
                      payload.relationType = genericRelationType;
                      if (hasIdentifierDetails) {
                        payload.typeOfIdentifier = toApiIdentifierType(identifierType);
                        payload.identifierValue = identifierNumber;
                        payload.governmentIssuedId = true;
                      }
                    }

                    if (allowGenericPerson && !payload.relationType) {
                      payload.relationType = genericRelationType;
                    }

                    if (allowGenericPerson && genericRelationType === 'OTHER' && !payload.relationType) {
                      payload.relationType = 'OTHER';
                    }

                    if (allowGenericPerson && genericRelationType === 'OTHER_FAMILY' && !payload.relationType) {
                      payload.relationType = 'OTHER_FAMILY';
                    }

                    if (allowGenericPerson && genericRelationType === 'OTHER' && hasIdentifierDetails) {
                      payload.typeOfIdentifier = toApiIdentifierType(identifierType);
                      payload.identifierValue = identifierNumber;
                      payload.governmentIssuedId = true;
                    }
                  }

                  if (isEditing && memberId) {
                    await updateMember({ id: memberId, data: payload }).unwrap();
                    toast.success('Member updated successfully.');
                  } else {
                    const result = await addMember(payload).unwrap();
                    toast.success('Member added successfully.');
                    await onSuccess?.(result);
                    onClose();
                    return;
                  }
                  onClose();
                  await onSuccess?.();
                } catch (err) {
                  toast.error(isEditing ? 'Unable to update member. Please try again.' : 'Unable to add member. Please try again.');
                  console.error('Add member failed', err);
                } finally {
                  setSubmitting(false);
                }
              }}
              className="h-[52px] rounded-[6px] bg-[#111f33] px-8 text-[1rem] text-white sm:h-[58px] sm:min-w-[220px] sm:text-[1.55rem]"
            >
              {submitting ? (isEditing ? 'Saving…' : 'Creating…') : actionLabel}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
    ,
    document.body
  );
}
