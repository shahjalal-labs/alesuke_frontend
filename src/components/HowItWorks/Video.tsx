"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

// Component expects a video file at `public/videos/demo.mp4` and an optional poster at `public/videos/poster.jpg`
export default function Video() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
  <div className="bg-[#FAFAFA]">
      <div className="mx-auto container px-4 md:pt-[120px]">
      <a href="/" className="mb-4 inline-block text-sm text-[#6b7280]">&larr; Back to home</a>

      <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ paddingTop: '90%' }}>
        {/* video fills container via absolute positioning */}
        <video
          ref={videoRef}
          src="https://api.zenexcloud.com/emdadullah/uploads/1779691729631-1ea7o0tj6i6.mp4"
          poster="/posterImage.png"
          className="absolute left-0 top-0 h-full w-full object-cover z-0"
          onClick={togglePlay}
          playsInline
        />

        {/* overlay play button */}
        {!playing && (
          <button
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-24 w-24 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition hover:bg-black/50 sm:h-28 sm:w-28"
          >
            <svg viewBox="0 0 100 100" width="48" height="48" fill="white" className="ml-1">
              <path d="M30 22v56l48-28z" />
            </svg>
          </button>
        )}

        {/* small shadow circle in center while playing */}
        {playing && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full z-10 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-black/30 blur-sm" />
            <div className="absolute inset-4 rounded-full bg-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  </div>
  );
}