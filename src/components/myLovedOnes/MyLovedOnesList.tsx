'use client';

import { useMemo } from 'react';

import { useGetAllMemberListQuery } from '@/redux/api/profileApi';

interface LovedOne {
  id: string;
  name: string;
  type: 'partner' | 'child' | 'pet';
}

const iconMap = {
  partner: '💍',
  child: '👶',
  pet: '🐾',
};

const typeLabels = {
  partner: 'Partner',
  child: 'Child',
  pet: 'Pet',
};

type MemberRecord = {
  id?: string;
  fullName?: string | null;
  relationType?: string | null;
};

const relationToType: Record<string, LovedOne['type'] | null> = {
  SPOUSE: 'partner',
  PARTNER: 'partner',
  CHILD: 'child',
  PET: 'pet',
};

export default function MyLovedOnesList({ lovedOnes }: { lovedOnes?: LovedOne[] }) {
  const { data: members = [], isLoading, isFetching } = useGetAllMemberListQuery(undefined);

  const liveLovedOnes = useMemo<LovedOne[]>(() => {
    const mapped = (members as MemberRecord[])
      .map((member, index) => {
        const type = member.relationType ? relationToType[member.relationType] ?? null : null;

        if (!type) {
          return null;
        }

        return {
          id: member.id ?? `${type}-${index}`,
          name: member.fullName?.trim() || `${typeLabels[type]} ${index + 1}`,
          type,
        };
      })
      .filter((item): item is LovedOne => Boolean(item));

    return lovedOnes ?? mapped;
  }, [lovedOnes, members]);

  const loading = isLoading || isFetching;

  return (
    <div>
      <h1 className="mb-6 text-[2.2rem] leading-[0.95] tracking-[-0.04em] text-[#161616] sm:text-[2.8rem] lg:text-[3.25rem]">
        My Loved Ones
      </h1>

      <section className="rounded-[3px] bg-[#F6ECE2] p-4 sm:p-5">
        <h3 className="mb-4 text-[0.95rem] font-medium text-[#2b221a]">
          You and your family
        </h3>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-[3px] bg-white px-5 py-4 text-[0.95rem] text-[#6b5e51]">
              Loading your loved ones...
            </div>
          ) : liveLovedOnes.length ? (
            liveLovedOnes.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between rounded-[3px] bg-white px-5 py-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8dfd3] text-lg">
                  {iconMap[person.type]}
                </div>
                <div>
                  <span className="block text-[0.95rem] text-[#6b5e51]">
                    {person.name}
                  </span>
                  <span className="mt-1 block text-[0.78rem] uppercase tracking-[0.18em] text-[#a18f7f]">
                    {typeLabels[person.type]}
                  </span>
                </div>
              </div>
              {/* Edit button removed per design */}
            </div>
            ))
          ) : (
            <div className="rounded-[3px] bg-white px-5 py-4 text-[0.95rem] text-[#6b5e51]">
              No loved ones added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
