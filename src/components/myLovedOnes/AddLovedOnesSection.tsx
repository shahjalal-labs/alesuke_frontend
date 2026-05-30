'use client';

import { useState } from 'react';

import AddPersonModal from '@/components/ui/AddPersonModal';

interface AddOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const defaultOptions: AddOption[] = [
  {
    id: 'partner',
    title: 'Add Partner',
    description: 'Create a new person for your partner',
    icon: '❤️',
  },
  {
    id: 'child',
    title: 'Add Child',
    description: 'Your biological or adopted child',
    icon: '👶',
  },
  {
    id: 'pet',
    title: 'Add a Pet',
    description: 'Your beloved pets',
    icon: '🐾',
  },
];

export default function AddLovedOnesSection({
  options = defaultOptions,
}: {
  options?: AddOption[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add a new person');
  const [actionLabel, setActionLabel] = useState('Create a person');
  const [modalMode, setModalMode] = useState<'person' | 'child' | 'pet'>('person');
  const [modalRelationType, setModalRelationType] = useState<'SPOUSE' | 'PARTNER' | 'CHILD' | 'PET' | undefined>(undefined);

  const handleOpen = (title: string, id: string) => {
    if (id === 'partner') {
      setModalTitle('Add a new partner');
      setActionLabel('Create a Partner');
      setModalMode('person');
      setModalRelationType('PARTNER');
    } else if (id === 'child') {
      setModalTitle('Add a new person');
      setActionLabel('Create a Child');
      setModalMode('child');
      setModalRelationType('CHILD');
    } else if (id === 'pet') {
      setModalTitle('Add a new pet');
      setActionLabel('Create a Pet');
      setModalMode('pet');
      setModalRelationType('PET');
    } else {
      setModalTitle('Add a new person');
      setActionLabel('Create a person');
      setModalMode('person');
      setModalRelationType(undefined);
    }

    setIsModalOpen(true);
  };

  return (
    <section className="rounded-[3px] bg-[#F6ECE2] p-4 sm:p-5">
      <h2 className="mb-2 text-[1.1rem] font-medium text-[#2b221a]">
        Who do you want to receive your estate and valuables?
      </h2>
      <p className="mb-6 text-[0.9rem] text-[#6b5e51]">
        In case you forget someone, you will have the chance to add more people later.
      </p>

      <div className="rounded-[2px] bg-[#f9f8f6] p-4 sm:p-5">
        <h3 className="mb-4 text-[0.95rem] font-medium text-[#2b221a]">
          You and your family
        </h3>

        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOpen(option.title, option.id)}
              className="flex w-full items-center gap-4 rounded-[3px] bg-white px-5 py-4 text-left transition-all hover:shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#e8dfd3] text-lg">
                {option.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-[0.95rem] font-medium text-[#4b5f7f]">
                  {option.title}
                </h4>
                <p className="text-[0.85rem] text-[#8b7d73]">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AddPersonModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        actionLabel={actionLabel}
        mode={modalMode}
        relationType={modalRelationType}
      />
    </section>
  );
}
