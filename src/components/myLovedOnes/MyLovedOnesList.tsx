'use client';

import { Edit2 } from 'lucide-react';

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

export default function MyLovedOnesList({
  lovedOnes = [
    { id: '1', name: 'Child 01', type: 'child' as const },
    { id: '2', name: 'Jane Cooper', type: 'partner' as const },
    { id: '3', name: 'Pet 01', type: 'pet' as const },
    { id: '4', name: 'Leslie Alexander', type: 'child' as const },
  ],
}: {
  lovedOnes?: LovedOne[];
}) {
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
          {lovedOnes.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between rounded-[3px] bg-white px-5 py-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8dfd3] text-lg">
                  {iconMap[person.type]}
                </div>
                <span className="text-[0.95rem] text-[#6b5e51]">
                  {person.name}
                </span>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-[#2b221a] transition-colors hover:bg-[#f5f3f0]"
                aria-label={`Edit ${person.name}`}
              >
                <Edit2 size={20} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
