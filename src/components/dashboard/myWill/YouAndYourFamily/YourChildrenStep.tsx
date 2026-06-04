"use client";

import { useEffect, useState } from "react";
import AddPersonModal from "@/components/ui/AddPersonModal";
import FamilyFlowShell from "./FamilyFlowShell";
import { AddItemRow, DetailItem, MemberListSkeleton, OptionCard, OptionGrid } from "./shared";
import { useGetMemberQuery, useDeleteMemberMutation } from '@/redux/api/profileApi';
import { PencilLine, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setHaveChildren } from "@/redux/familySlice";

export default function YourChildrenStep() {
  const [hasChildren, setHasChildren] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [activeChild, setActiveChild] = useState<any>(null);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const { data: children, isLoading, isFetching } = useGetMemberQuery('CHILD');
  const [deleteMember] = useDeleteMemberMutation();

  const openEditChild = (child: any) => {
    setActiveChild(child);
    setIsAddChildOpen(true);
  };


   const dispatch = useDispatch();

useEffect(() => {
  if (hasChildren) {
    dispatch(setHaveChildren(true));
  } else {
    dispatch(setHaveChildren(false));
  }

}, [hasChildren, children, dispatch]);


  return (
    <>
      <FamilyFlowShell
        step={2}
        title="Your children"
        subtitle="Add the details of your children"
        description="You can name guardians for your minor children (under 21) in your will"
        optionsBlock={
          <OptionGrid className="md:px-6 md:py-6">
            <div className="grid grid-cols-1 gap-5 md:gap-5">
              <OptionCard
                label="I don't have children"
                selected={!hasChildren}
                onClick={() => setHasChildren(false)}
                icon="no"
                layout="row"
              />
              <OptionCard
                label="I have children"
                selected={hasChildren}
                onClick={() => setHasChildren(true)}
                icon="yes"
                layout="row"
              />
            </div>
          </OptionGrid>
        }
        detailsBlock={
          hasChildren ? (
            <>
              <p className="mb-3 text-[1.05rem] font-medium text-[#161616] md:text-[1.5rem]">Details of your children</p>
              <div className="space-y-3 rounded-[8px] bg-[#eee7de] p-4 md:p-6">
                {children && children.length ? (
                  children.map((c: any) => (
                    <div key={c.id} className={`${removingIds.includes(c.id) ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}`}>
                      <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f4f5f7] px-4 py-4 md:px-5 md:py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#525a67] md:h-14 md:w-14">
                            <UserRound className="h-4 w-4 md:h-5 md:w-5" />
                          </span>
                          <div>
                            <p className="text-[1.05rem] font-semibold text-[#616a79] md:text-[1.7rem]">
                              {c.fullName || c.displayName || 'Unnamed'}
                            </p>
                            <p className="text-[0.85rem] text-[#7d8899] md:text-[1rem]">Child</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openEditChild(c)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#223048] transition-transform hover:scale-105" aria-label="Edit child">
                            <PencilLine className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={async () => {
                            setRemovingIds((cur) => [...cur, c.id]);
                            try {
                              await deleteMember(c.id).unwrap();
                              toast.success('Child deleted successfully.');
                            } catch (e) {
                              setRemovingIds((cur) => cur.filter((id) => id !== c.id));
                              toast.error('Unable to delete child. Please try again.');
                              console.error(e);
                            }
                          }} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#ff2f2f] transition-transform hover:scale-105" aria-label="Delete child">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (isLoading || isFetching) ? (
                  <MemberListSkeleton rows={2} />
                ) : (
                  <DetailItem label="No children added yet" />
                )}

                <AddItemRow
                  label="Add Child"
                  subLabel="Your biological or adopted child"
                  onClick={() => setIsAddChildOpen(true)}
                />
              </div>
            </>
          ) : null
        }
        prevHref="/will/you-and-your-family/marital-status"
        nextHref="/will/you-and-your-family/your-pets"
      />

      <AddPersonModal
        open={isAddChildOpen}
        onClose={() => {
          setIsAddChildOpen(false);
          setActiveChild(null);
        }}
        title={activeChild ? 'Edit Child' : 'Add a new Child'}
        actionLabel={activeChild ? 'Save Changes' : 'Create a Child'}
        mode="child"
        memberId={activeChild?.id}
        initialValues={activeChild ? {
          fullName: activeChild.fullName,
          email: activeChild.email,
          dateOfBirth: activeChild.dateOfBirth,
          typeOfIdentifier: activeChild.typeOfIdentifier,
          identifierValue: activeChild.identifierValue,
          governmentIssuedId: activeChild.governmentIssuedId,
        } : undefined}
        onSuccess={() => {
          setIsAddChildOpen(false);
          setActiveChild(null);
        }}
      />
    </>
  );
}
