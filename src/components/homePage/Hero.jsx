"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    // Ensure video starts playing after load
    if (isVideoLoaded && !isVideoPlaying) {
      setIsVideoPlaying(true);
    }
  }, [isVideoLoaded, isVideoPlaying]);

  const token = Cookies.get("accessToken");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#1a3028]">
      {/* Loading Skeleton - Shows while video loads */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-0">
          {/* Animated gradient skeleton */}
          <div className="h-full w-full bg-gradient-to-r from-[#1a3028] via-[#243b32] to-[#1a3028] animate-pulse" />
          {/* Optional: Blurred placeholder image */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-md scale-105"
            style={{
              backgroundImage: `url('https://api.zenexcloud.com/emdadullah/uploads/1781314957442-gy0omz42b47.mp4?poster')`,
              backgroundSize: 'cover'
            }}
          />
        </div>
      )}

      {/* Video Element with Loading Handler */}
      <video
        className={`absolute inset-0 h-full w-full scale-105 object-cover object-center transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedData={() => setIsVideoLoaded(true)}
        onPlaying={() => setIsVideoPlaying(true)}
      >
        <source src="https://api.zenexcloud.com/emdadullah/uploads/1781314957442-gy0omz42b47.mp4" type="video/mp4" />
      </video>

      {/* Rest of your component remains the same */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_72%_50%,rgba(139,115,85,0.24)_0%,transparent_55%),radial-gradient(ellipse_at_25%_80%,rgba(26,48,40,0.55)_0%,transparent_60%),linear-gradient(to_right,rgba(10,18,14,0.84)_0%,rgba(10,18,14,0.62)_44%,rgba(10,18,14,0.16)_100%)]" />
      
      <div className="relative z-30 mx-auto w-full container pb-16 pt-28 lg:pt-36 px-4">
        {/* ... rest of your content ... */}
        <p className="mb-6 text-[0.7rem] uppercase tracking-[0.25em] text-white/70 font-sans">
          Establishing Peace of Mind
        </p>
        <h1 className="mb-8 max-w-[580px] text-[48px] leading-[56px] md:text-[88px] font-normal md:leading-[92px] tracking-[-0.03em] text-white">
          If There Is A Will, There Is A Way
        </h1>
        <p className="mb-10 max-w-[520px] text-[1.08rem] leading-[1.75] text-white/78 font-sans md:text-[1.12rem] text-[#B6BAC3]">
          Crafting a legacy shouldn't be a chore. Transform your assets into a digital heirloom in 15 minutes — because your 'way' deserves a will.
        </p>

        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href={`${token ? "/will" : "/login"}`}>
            <button className="rounded-md bg-gradient-to-l from-[#1D2736] to-[#081220] px-10 py-4 text-[1rem] font-medium tracking-[0.02em] text-[#f5f0e8] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-colors duration-200 hover:bg-[#22342d] font-sans">
              Write a will online
            </button>
          </Link>
          <Link href="/how-it-works" className="flex w-fit items-center gap-3 rounded-md border border-white/20 bg-white/10 px-6 py-4 text-[1rem] tracking-[0.02em] text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 font-sans">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
            </span>
            How it works →
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            "100% Legally Valid & Compliant in Singapore",
            "Digitally Delivered in Minutes",
            "Able to Update Your Will 24/7",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[#B6BAC3]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="text-[0.75rem] uppercase tracking-[0.12em] text-white/62 font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}