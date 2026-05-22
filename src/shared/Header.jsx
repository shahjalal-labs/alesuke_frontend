"use client";

import { useMemo, useState } from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import messageMultiple from "@/assets/message-multiple.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { logOut } from "@/redux/ReduxFunction";
import { LogOut } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const accessToken = Cookies.get("accessToken");
  const isLoggedIn = Boolean(accessToken);
  const fullName = auth?.me?.fullName || "My Account";
  const email = auth?.me?.email || auth?.email || "";
  const initials = useMemo(() => {
    const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || "U") + (parts[1]?.[0] || "");
  }, [fullName]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("token");
    dispatch(logOut());
    setAccountMenuOpen(false);
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex h-[68px] items-center justify-between border-b border-[#1e1912]/10 bg-[#FFF8F3CC]/80 px-8 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-12">
          <Link href="/">
            {" "}
            <Image
              src={logo}
              alt="Will & Way Logo"
              className="h-auto w-[160px]"
            />
          </Link>
          {/* <span className="text-[1.2rem] font-bold tracking-[-0.01em] text-[#1e1912]">
          Will <span style={{ fontWeight: 400 }}>&amp;</span> Way
        </span> */}

          <button href="/contact" className={`${talkBtn} hidden md:flex`}>
            <span className="whitespace-nowrap">Talk to us</span>
            <Image
              src={messageMultiple}
              alt="Message Icon"
              className="h-6 w-6"
            />
          </button>
        </div>

        <nav className="desktop-nav relative flex items-center gap-8">
          <Link href="/pricing" className={navLink}>
            Pricing
          </Link>
          {isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-[#1e1912]/15 bg-white/70 px-3 py-1.5"
              >
                <span className="text-[16px] font-medium tracking-[0.02em] text-[#0f172a]">{fullName}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dbe5f5] text-[13px] font-semibold text-[#0f172a]">
                  {initials.toUpperCase()}
                </span>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-[60px] z-[120] w-[280px] rounded-[8px] border border-[#d8d8d8] bg-primary p-0 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                  <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
                    <span className="text-base font-normal leading-none text-[#1e1912]">{fullName}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbe5f5] text-[14px] font-semibold text-[#0f172a]">
                      {initials.toUpperCase()}
                    </span>
                  </div>

                  <div className="px-4 py-5">
                    <p className="mb-1 text-[16px] font-semibold leading-none text-[#1e1912]">Logged in as:</p>
                    <p className="break-all text-base font-semibold text-[#1e1912]">{email}</p>

                    <div className="my-5 h-px w-full bg-[#d6d6d6]" />

                    <Link
                      href="/profile-setup/get-started"
                      onClick={() => setAccountMenuOpen(false)}
                      className="mb-5 block text-base font-medium text-[#1e1912]"
                    >
                      Account settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex h-11 items-center gap-3 rounded-[6px] border border-[#cfcfcf] px-4 text-base font-medium text-[#1e1912]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link href="/login" className={navLink}>
              Sign In
            </Link>
          )}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger hidden cursor-pointer border-0 bg-transparent p-1"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e1912"
            strokeWidth="2"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {menuOpen && (
          <div className="mobile-menu absolute left-0 right-0 top-16 flex flex-col gap-4 border-b border-[#1e1912]/10 bg-[#FFF8F3CC]/80 px-8 py-4">
            <Link href="/pricing" className={`${navLink} text-[1rem]`}>
              Pricing
            </Link>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-fit text-left text-[1rem] font-medium tracking-[0.02em] text-[#1e1912]"
              >
                Sign Out ({fullName})
              </button>
            ) : (
              <Link href="/login" className={`${navLink} text-[1rem]`}>
                Sign In
              </Link>
            )}
            <button className={`${talkBtn} w-fit`}>
              <span>Talk to us</span>
              <Image
                src={messageMultiple}
                alt="Message Icon"
                className="h-6 w-6"
              />
            </button>
          </div>
        )}

        <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
      </div>
    </header>
  );
}

const navLink =
  "text-[18px] font-medium tracking-[0.02em] text-[#1e1912] no-underline font-inter";

const talkBtn =
  "flex items-center gap-2 rounded-[4px] border border-[#1e1912] bg-transparent px-3 sm:px-5 py-2 text-[14px] sm:text-[18px] tracking-[0.02em] text-[#1e1912] transition-colors duration-200 hover:bg-[#1e1912] hover:text-[#f5f0e8] whitespace-nowrap";
