"use client";

import { useMemo, useState } from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { logOut } from "@/redux/ReduxFunction";
import { LogOut, FileText, Menu, X } from "lucide-react";

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

  const handleCloseMenus = () => {
    setAccountMenuOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex h-[68px] items-center justify-between border-b border-[#1e1912]/10 bg-[#FFF8F3CC]/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-4 sm:gap-12">
          <Link href="/" onClick={handleCloseMenus}>
            <Image
              src={logo}
              alt="Will & Way Logo"
              className="h-auto w-[160px]"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav relative flex items-center gap-8">
          <Link href="/pricing" className={navLink}>
            Pricing
          </Link>
          {isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-[#1e1912]/15 bg-white/70 px-3 py-1.5 transition-all duration-200 hover:bg-white"
              >
                <span className="text-[16px] font-medium tracking-[0.02em] text-[#0f172a]">
                  {fullName.split(" ")[0]}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#192233] to-[#2a3a5c] text-[13px] font-semibold text-white">
                  {initials.toUpperCase()}
                </span>
              </button>

              {accountMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[110]"
                    onClick={() => setAccountMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-[60px] z-[120] w-[320px] animate-in slide-in-from-top-2 rounded-2xl border border-[#e8e4df] bg-[#FFF8F3CC]/80 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#f0efed] px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#8b7d73]">Signed in as</p>
                        <p className="mt-1 text-base font-semibold text-[#192233]">{fullName}</p>
                        <p className="mt-0.5 text-sm text-[#8b7d73]">{email}</p>
                      </div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#192233] to-[#2a3a5c] text-lg font-semibold text-white shadow-md">
                        {initials.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-3">
                      <Link
                        href="/my-will"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-[#192233] transition-colors hover:bg-[#f5f3f0]"
                      >
                        <FileText className="h-5 w-5 text-[#8b7d73]" />
                        My Will
                      </Link>

                      <div className="my-2 h-px bg-[#f0efed]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <Link href="/login" className={navLink}>
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger hidden cursor-pointer border-0 bg-transparent p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-[#192233]" />
          ) : (
            <Menu className="h-6 w-6 text-[#192233]" />
          )}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 "
              onClick={() => setMenuOpen(false)}
            />
            <div className="mobile-menu fixed left-0 right-0 top-[68px] z-[100] max-h-[calc(100vh-68px)] overflow-y-auto border-t border-[#f0efed] bg-[#FFF8F3CC] backdrop-blur-md p-5 shadow-lg">
              <div className="flex flex-col p-5">
                {isLoggedIn ? (
                  <>
                    {/* User Profile Section */}
                    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f5f3f0] to-[#fafaf8] p-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#192233] to-[#2a3a5c] text-xl font-semibold text-white shadow-md">
                        {initials.toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-[#192233]">{fullName}</p>
                        <p className="mt-0.5 text-sm text-[#8b7d73]">{email}</p>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-1">
                      <Link
                        href="/pricing"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-[16px] font-medium text-[#192233] transition-colors hover:bg-[#f5f3f0] border bordersecon"
                      >
                        Pricing
                      </Link>

                      <Link
                        href="/my-will"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-[16px] font-medium text-[#192233] transition-colors hover:bg-[#f5f3f0]"
                      >
                        <FileText className="h-5 w-5 text-[#8b7d73]" />
                        My Will
                      </Link>
                    </div>

                    <div className="my-4 h-px bg-[#f0efed]" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[16px] font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/pricing"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-[16px] font-medium text-[#192233] transition-colors hover:bg-[#f5f3f0]"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-xl bg-[#192233] px-4 py-3 text-[16px] font-medium text-white transition-colors hover:bg-[#2a3a5c]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-xl border border-[#192233] px-4 py-3 text-[16px] font-medium text-[#192233] transition-colors hover:bg-[#f5f3f0]"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}

const navLink =
  "text-[16px] font-medium tracking-[0.02em] text-[#192233] no-underline transition-colors hover:text-[#8b7d73]";