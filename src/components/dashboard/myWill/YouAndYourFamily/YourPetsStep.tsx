"use client";

import { useEffect, useState } from "react";
import FamilyFlowShell from "./FamilyFlowShell";
import AddPersonModal from "@/components/ui/AddPersonModal";
import { AddItemRow, DetailItem, MemberListSkeleton, OptionCard, OptionGrid } from "./shared";
import { useGetMemberQuery, useDeleteMemberMutation } from '@/redux/api/profileApi';
import { PawPrint, PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setHavePets } from "@/redux/familySlice";

export default function YourPetsStep() {
  const [hasPet, setHasPet] = useState(false);
  const [hasSavedPets, setHasSavedPets] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePet, setActivePet] = useState<any>(null);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const { data: pets, isLoading, isFetching } = useGetMemberQuery('PET');
  const [deleteMember] = useDeleteMemberMutation();

  const openEditPet = (pet: any) => {
    setActivePet(pet);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    if (Array.isArray(pets)) {
      setHasSavedPets(pets.length > 0);
    }
  }, [pets]);

   const dispatch = useDispatch();

useEffect(() => {
  if (!isLoading && Array.isArray(pets) && pets.length > 0) {
    // console.log("yes");
    dispatch(setHavePets(true));
  } else {
    // console.log("no");
    dispatch(setHavePets(false));
  }
}, [hasPet, pets, dispatch]);


  const showPetsDetails = hasSavedPets || hasPet;
  const isHavePetSelected = hasSavedPets || hasPet;

  return (
    <>
      <FamilyFlowShell
        step={3}
        title="Your pets"
        subtitle="you are able to nominate a caretaker for your pet(s) in your absence"
        description="By adding your pets, you can choose the right caretaker for them."
        optionsBlock={
          <OptionGrid>
            <OptionCard label="I don't have a pet" selected={!showPetsDetails} disabled={hasSavedPets} onClick={() => setHasPet(false)} icon="no" />
            <OptionCard label="I have a pet" selected={isHavePetSelected} onClick={() => setHasPet(true)} icon="yes" />
          </OptionGrid>
        }
        detailsBlock={
          showPetsDetails ? (
            <>
              <p className="mb-3 text-[1.05rem] font-medium text-[#161616] md:text-[1.5rem]">Details of your pet</p>
              <div className="space-y-3 rounded-[8px] bg-[#eee7de] p-4 md:p-6">
                {pets && pets.length ? (
                  pets.map((p: any) => (
                    <div key={p.id} className={`${removingIds.includes(p.id) ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}`}>
                      <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f4f5f7] px-4 py-4 md:px-5 md:py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#525a67] md:h-14 md:w-14">
                            <PawPrint className="h-4 w-4 md:h-5 md:w-5" />
                          </span>
                          <div>
                            <p className="text-[1.05rem] font-semibold text-[#616a79] md:text-[1.7rem]">
                              {p.fullName || p.displayName || 'Unnamed Pet'}
                            </p>
                            <p className="text-[0.85rem] text-[#7d8899] md:text-[1rem]">Pet</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openEditPet(p)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#223048] transition-transform hover:scale-105" aria-label="Edit pet">
                            <PencilLine className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={async () => {
                            setRemovingIds((cur) => [...cur, p.id]);
                            try {
                              await deleteMember(p.id).unwrap();
                              toast.success('Pet deleted successfully.');
                            } catch (e) {
                              setRemovingIds((cur) => cur.filter((id) => id !== p.id));
                              toast.error('Unable to delete pet. Please try again.');
                              console.error(e);
                            }
                          }} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#dde0e4] text-[#ff2f2f] transition-transform hover:scale-105" aria-label="Delete pet">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  (isLoading || isFetching) ? <MemberListSkeleton rows={2} /> : <DetailItem label="No pet added yet" />
                )}

                <div onClick={() => setIsAddModalOpen(true)}>
                  <AddItemRow label="Add a Pet" pet />
                </div>
              </div>
            </>
          ) : null
        }
        prevHref="/will/you-and-your-family/your-children"
        nextHref="/will/you-and-your-family/your-residential"
      />

      <AddPersonModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setActivePet(null);
        }}
        title={activePet ? 'Edit pet' : 'Add a new pet'}
        actionLabel={activePet ? 'Save Changes' : 'Create a new pet'}
        mode="pet"
        relationType="PET"
        memberId={activePet?.id}
        initialValues={activePet ? {
          fullName: activePet.fullName,
        } : undefined}
        onSuccess={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
