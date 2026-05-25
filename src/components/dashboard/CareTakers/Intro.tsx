"use client";

import CaretakersFlowShell from "./CareTakersFlowShell";

export default function Intro() {
  return (
    <CaretakersFlowShell
      title="Caretaker for pets"
      subtitle="Who would you like to take care of your beloved pet, when you pass on?"
      description="In the event, if your designated caretaker is not able to carry out your wishes, your executor will be responsible to ensure a safe home for it."
      previousHref="/will"
      nextHref="/will/caretakers-of-pets/choose-caretakers"
      nextLabel="Get Started"
      hint="Choose someone you know and trust for this responsibility"
    />
  )
}
