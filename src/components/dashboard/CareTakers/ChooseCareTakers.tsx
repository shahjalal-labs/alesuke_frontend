"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import CaretakersFlowShell, { CaretakerAddRow, CaretakerMemberRow } from "./CareTakersFlowShell";
import AddPersonModal from "@/components/ui/AddPersonModal";
import { useGetAllMemberListQuery } from "@/redux/api/profileApi";
import { useAddCaretakerMutation, useGetCaretakerQuery } from "@/redux/api/assetsApi";

type MemberRecord = {
  id: string;
  fullName?: string | null;
  relationType?: string | null;
};

type PetCaretakerRecord = {
  caretakerId?: string | null;
  caretaker?: {
    id?: string;
    fullName?: string | null;
    relationType?: string | null;
  };
  pet?: {
    id?: string;
    fullName?: string | null;
  };
};

type PetCaretakersResponse = {
  petCaretakers?: PetCaretakerRecord[];
  summary?: Array<{
    caretaker?: {
      id?: string;
      fullName?: string | null;
      relationType?: string | null;
    };
    pets?: Array<{
      id?: string;
      fullName?: string | null;
    }>;
  }>;
  totalPets?: number;
};

export default function ChooseCareTakers() {
  const router = useRouter();
  const { data: members = [], isLoading, isFetching } = useGetAllMemberListQuery(undefined);
  const { data: caretakerResponse, isLoading: isCaretakerLoading } = useGetCaretakerQuery(undefined);
  const [addCaretaker] = useAddCaretakerMutation();
  const [selectedCaretakerId, setSelectedCaretakerId] = useState<string | null>(null);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const caretakerRows = useMemo(() => {
    return (members as MemberRecord[]).map((member, index) => ({
      id: member.id,
      name: member.fullName ?? `Person ${index + 1}`,
      helper: member.relationType ? member.relationType.toLowerCase() : undefined,
    }));
  }, [members]);

  const selectedCaretakerSummary = useMemo(() => {
    const response = caretakerResponse as PetCaretakersResponse | undefined;
    const petCaretaker = response?.petCaretakers?.[0];
    const summaryCaretaker = response?.summary?.[0]?.caretaker;

    return petCaretaker ?? (summaryCaretaker ? { caretaker: summaryCaretaker } : null);
  }, [caretakerResponse]);

  useEffect(() => {
    const savedCaretakerId = selectedCaretakerSummary?.caretakerId ?? selectedCaretakerSummary?.caretaker?.id ?? null;

    if (savedCaretakerId) {
      setSelectedCaretakerId(savedCaretakerId);
    }
  }, [selectedCaretakerSummary]);

  const selectedCaretakerName = useMemo(() => {
    if (!selectedCaretakerId) return null;

    return caretakerRows.find((caretaker) => caretaker.id === selectedCaretakerId)?.name ?? null;
  }, [caretakerRows, selectedCaretakerId]);

  const handleContinue = async () => {
    if (!selectedCaretakerId) {
      toast.error("Select a caretaker before continuing.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addCaretaker({ caretakerId: selectedCaretakerId }).unwrap();
      toast.success("Caretaker saved.");
      router.push("/will/caretakers-of-pets/complete");
    } catch (error) {
      toast.error("Unable to save caretaker.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CaretakersFlowShell
      title="Choose a caretaker for pets"
      subtitle="Who would you like your pet's caretaker to be?"
      description="Pick someone you trust to look after your pet if you are no longer able to do so."
      hint="Choose someone you know and trust for this responsibility"
      previousHref="/will/caretakers-of-pets/intro"
      nextLabel="Save & continue"
      onNext={handleContinue}
      nextDisabled={!selectedCaretakerId || isSubmitting}
    >
      <div className="space-y-4">
        <p className="text-[1rem] font-medium text-[#161616] md:text-[1.05rem]">Who would you like your pet's caretaker to be?</p>

        {(isCaretakerLoading || selectedCaretakerSummary) ? (
          <div className="rounded-[8px] border border-[#e8dfd2] bg-white px-4 py-4 text-[0.95rem] text-[#52606f] shadow-[0_1px_0_rgba(17,24,39,0.02)]">
            <div className="font-semibold text-[#1d2430]">Current caretaker</div>
            <div className="mt-1 text-[#7b8594]">{selectedCaretakerName ?? selectedCaretakerSummary?.caretaker?.fullName ?? "Not selected"}</div>
            {selectedCaretakerSummary?.pet?.fullName ? (
              <div className="mt-1 text-[0.84rem] text-[#7b8594]">For pet: {selectedCaretakerSummary.pet.fullName}</div>
            ) : null}
          </div>
        ) : null}

        <div className="rounded-[8px] bg-[#eee7de] p-4 md:p-6">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-10 text-[#6e7886]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : caretakerRows.length ? (
            <div className="space-y-3">
              {caretakerRows.map((caretaker) => (
                <CaretakerMemberRow
                  key={caretaker.id}
                  name={caretaker.name}
                  helper={caretaker.helper}
                  selected={selectedCaretakerId === caretaker.id}
                  onClick={() => setSelectedCaretakerId(caretaker.id)}
                  icon="caretaker"
                />
              ))}

              <CaretakerAddRow label="Add Person" subLabel="A family member or friend" onClick={() => setIsAddPersonOpen(true)} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-[8px] bg-[#f4f5f7] px-4 py-4 text-[0.95rem] text-[#7b8594]">No people available yet.</div>
              <CaretakerAddRow label="Add Person" subLabel="A family member or friend" onClick={() => setIsAddPersonOpen(true)} />
            </div>
          )}
        </div>
      </div>

      <AddPersonModal
        open={isAddPersonOpen}
        onClose={() => setIsAddPersonOpen(false)}
        title="Add a new person"
        actionLabel="Create a person"
        onSuccess={() => setIsAddPersonOpen(false)}
      />
    </CaretakersFlowShell>
  )
}
