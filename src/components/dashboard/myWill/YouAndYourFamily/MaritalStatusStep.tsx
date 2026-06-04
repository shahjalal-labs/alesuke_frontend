"use client";

import { useEffect, useMemo, useState } from "react";
import AddPersonModal from "@/components/ui/AddPersonModal";
import FamilyFlowShell from "./FamilyFlowShell";
import { AddItemRow, DetailItem, MemberListSkeleton, OptionCard, OptionGrid } from "./shared";
import { useDeleteMemberMutation, useGetMemberQuery } from '@/redux/api/profileApi';
import { PencilLine, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setMaritalData } from "@/redux/familySlice";

type MaritalStatus = "single" | "married" | "relationship";

export default function MaritalStatusStep() {
  const [status, setStatus] = useState<MaritalStatus>("single");
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<any>(null);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const detailTitle = useMemo(() => {
    if (status === "married") return "Details of your spouse";
    if (status === "relationship") return "Details of your relationship partner";
    return "";
  }, [status]);

  const addActionLabel = status === "married" ? "Add Spouse" : "Add Partner";
  const modalTitle = status === "married" ? "Add a new spouse" : "Add a new relationship partner";
  const modalActionLabel = status === "married" ? "Create a spouse" : "Create a partner";

  const relationType = status === 'married' ? 'SPOUSE' : status === 'relationship' ? 'PARTNER' : undefined;
  const { data: members, isLoading, isFetching } = useGetMemberQuery(relationType ? relationType : '', { skip: !relationType });
  const [deleteMember] = useDeleteMemberMutation();

  const openEditMember = (member: any) => {
    setActiveMember(member);
    setIsAddPersonOpen(true);
  };


  const dispatch = useDispatch();

useEffect(() => {
  if (status !== 'single') {
    dispatch(setMaritalData({ maritalStatus: status, data: members || [] }));
  } else {
    dispatch(setMaritalData({ maritalStatus: 'single', data: [] }));
  }
}, [status, members, dispatch]);


  return (
    <>
      <FamilyFlowShell
        step={1}
        title="Your marital status"
        hintLines={[
          "You must revise your will once your marital status changes. i.e. Married to Single",
          "Your account includes lifetime access",
        ]}
        optionsBlock={
          <>
            <p className="text-[1.05rem] font-semibold text-[#161616] md:text-[1.95rem]">
              Select The option below *haf best represents your situation
            </p>
            <p className="mt-2 text-[1rem] text-[#6f7786] md:text-[1.2rem]">Choose an option that represents your current status</p>

            <div className="mt-4">
              <OptionGrid >
                <OptionCard label="Single" selected={status === "single"} onClick={() => setStatus("single")} icon="single" />
                <OptionCard label="Married" selected={status === "married"} onClick={() => setStatus("married")} icon="married" />
                <OptionCard
                  label="In a relationship"
                  selected={status === "relationship"}
                  onClick={() => setStatus("relationship")}
                  icon="relationship"
                />
              </OptionGrid>
            </div>
          </>
        }
        detailsBlock={
          status !== "single" ? (
            <>
              <p className="mb-3 text-[1.05rem] font-medium text-[#161616] md:text-[1.5rem]">{detailTitle}</p>
              <div className="space-y-3 rounded-[8px] bg-[#eee7de] p-4 md:p-6">
                {(isLoading || isFetching) && !members?.length ? (
                  <MemberListSkeleton rows={2} />
                ) : members && members.length ? (
                  members.map((m: any) => (
                    <div
                      key={m.id}
                      className={`${removingIds.includes(m.id) ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}`}
                    >
                      <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f4f5f7] px-4 py-4 md:px-5 md:py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#525a67] md:h-14 md:w-14">
                            <UserRound className="h-4 w-4 md:h-5 md:w-5" />
                          </span>
                          <div>
                            <p className="text-[1.05rem] font-semibold text-[#616a79] md:text-[1.7rem]">
                              {m.fullName || m.displayName || 'Unnamed'}
                            </p>
                            <p className="text-[0.85rem] text-[#7d8899] md:text-[1rem]">
                              {m.relationType === 'SPOUSE' ? 'Spouse' : 'Partner'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditMember(m)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#223048] transition-transform hover:scale-105"
                            aria-label="Edit member"
                          >
                            <PencilLine className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              setRemovingIds((cur) => [...cur, m.id]);
                              try {
                                await deleteMember(m.id).unwrap();
                                toast.success('Member deleted successfully.');
                              } catch (e) {
                                setRemovingIds((cur) => cur.filter((id) => id !== m.id));
                                toast.error('Unable to delete member. Please try again.');
                                console.error(e);
                              }
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#ff2f2f] transition-transform hover:scale-105"
                            aria-label="Delete member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <DetailItem label="No person added yet" />
                )}

                <div onClick={() => setIsAddPersonOpen(true)}>
                  <AddItemRow label={addActionLabel} />
                </div>
              </div>
            </>
          ) : null
        }
        prevHref="/will"
        nextHref="/will/you-and-your-family/your-children"
      />

      <AddPersonModal
        open={isAddPersonOpen}
        onClose={() => {
          setIsAddPersonOpen(false);
          setActiveMember(null);
          setRemovingIds((current) => current.filter((id) => id !== activeMember?.id));
        }}
        title={activeMember ? `Edit ${modalTitle.replace('Add a new ', '')}` : modalTitle}
        actionLabel={activeMember ? 'Save Changes' : modalActionLabel}
        relationType={relationType as any}
        memberId={activeMember?.id}
        initialValues={activeMember ? {
          fullName: activeMember.fullName,
          email: activeMember.email,
          dateOfBirth: activeMember.dateOfBirth,
          typeOfIdentifier: activeMember.typeOfIdentifier,
          identifierValue: activeMember.identifierValue,
          governmentIssuedId: activeMember.governmentIssuedId,
        } : undefined}
        onSuccess={() => {
          setIsAddPersonOpen(false);
          setActiveMember(null);
        }}
      />
    </>
  );
}
