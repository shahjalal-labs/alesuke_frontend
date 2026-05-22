"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import step1Image from "@/assets/process-step/Step-01.png";
import step2Image from "@/assets/process-step/Step-2.png";
import step3Image from "@/assets/process-step/Step-3.png";
import step4Image from "@/assets/process-step/Step-4.png";
import step5Image from "@/assets/process-step/Step-5.png";
import step6Image from "@/assets/process-step/Step-6.png";
import step7Image from "@/assets/process-step/Step-7.png";
import Image from "next/image";

export default function Process() {
  const images = [
    step1Image,
    step2Image,
    step3Image,
    step4Image,
    step5Image,
    step6Image,
    step7Image,
  ];
  const swiperRef = useRef(null);

  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto container px-4">
        <h2 className="mb-4 text-center text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-[-0.02em] text-[#1e1912]">
          Process to create a Will
        </h2>
        <p className="mx-auto mb-12 max-w-[600px] text-center text-[1.1rem] leading-[1.7] text-[#6b6456] font-serif italic">
          There are some steps to complete filling up the Will form. It contains very important personal details to secure the things.
        </p>

        <div className="relative">
          <div className="mx-auto container px-4">
            <Swiper
              modules={[FreeMode, Navigation]}
              freeMode={true}
              navigation={false}
              spaceBetween={24}
              slidesPerView={"auto"}
              centeredSlides={true}
              loop={true}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="relative"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx} className="!w-[280px] md:!w-[320px] lg:!w-[380px]">
                  <div className="bg-white rounded-[14px] overflow-hidden shadow-sm w-full h-[220px] md:h-[300px] lg:h-[380px] border-1 border-[#1D2736]">
                    <Image src={img.src} alt={`step-${idx + 1}`} fill className="w-full h-full object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="absolute right-6 -bottom-16 flex items-center gap-3 z-20">
              <button
                onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
                aria-label="Previous"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e1912" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => swiperRef.current && swiperRef.current.slideNext()}
                aria-label="Next"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e1912" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
