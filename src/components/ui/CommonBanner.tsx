import Image from "next/image"
// import bannerImage from "@/assets/HomeImages/Rectangle 4 (1).png"
import type { StaticImageData } from "next/image"

interface CommonBannerProps {
  title: string
  backgroundImage?: string | StaticImageData
  height?: string
}

export function CommonBanner({
  title,
  backgroundImage,
  height = "h-48 sm:h-56 md:h-64",
}: CommonBannerProps) {
  return (
    <div className={`relative w-full mt-20 md:mt-36 ${height} overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={backgroundImage || "/placeholder.svg"}
        alt="Banner background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">{title}</h1>
      </div>
    </div>
  )
}
