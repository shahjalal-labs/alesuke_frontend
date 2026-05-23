import { CheckCircle2 } from "lucide-react";

import { DivideEstateShell } from "./DivideEstateShell";

function Complete() {
  return (
    <DivideEstateShell>
      <section className="flex min-h-[68vh] items-center justify-center py-12 md:py-16">
        <div className="w-full max-w-[520px] rounded-[18px] bg-white px-6 py-14 text-center shadow-[0_20px_40px_rgba(17,24,39,0.04)] md:px-10 md:py-16">
          <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-[#d8dce0]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0f1e35] text-white">
              <CheckCircle2 className="h-9 w-9" />
            </div>
          </div>
          <h2 className="text-[2.1rem] font-semibold tracking-[-0.03em] text-[#101010] md:text-[3.2rem]">Great work!</h2>
          <p className="mt-3 text-[0.95rem] text-[#8992a1] md:text-[1.2rem]">You have successfully completed this section!</p>
        </div>
      </section>
    </DivideEstateShell>
  );
}

export default Complete;
