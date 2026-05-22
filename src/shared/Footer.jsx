import whiteLogo from '@/assets/logWhite.png';
export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 bg-[#1D2736] px-8 py-12">
      <div className="flex items-center gap-2">
        <img src={whiteLogo.src} alt="Will & Way logo" className="h-auto w-[160px]" />
      </div>

      <nav className="flex flex-wrap justify-center gap-8">
        {["Privacy policy", "Terms of use", "Pricing"].map((link, i) => (
          <a key={i} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="text-[0.9rem] tracking-[0.04em] text-gray-200 no-underline transition-colors duration-200 hover:text-white/80 ">{link}</a>
        ))}
      </nav>

      <p className="m-0 text-[0.85rem] tracking-[0.04em] text-[#6B7280] ">
        © 2024 Will &amp; Way . All rights reserved.
      </p>
    </footer>
  );
}
