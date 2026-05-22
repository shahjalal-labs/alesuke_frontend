import { cn } from "@/lib/utils"

interface BeautifulSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "gradient" | "rainbow" | "pulse" | "glow" | "dots"
  className?: string
  text?: string
  textClassName?: string
}

export function BeautifulSpinner({
  size = "md",
  variant = "gradient",
  className,
  text,
  textClassName,
}: BeautifulSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  const dotOffsetClasses = {
    sm: "-translate-y-[12px]",
    md: "-translate-y-[20px]",
    lg: "-translate-y-[32px]",
    xl: "-translate-y-[48px]",
  }

  const dotDelayClasses = [
    "[animation-delay:0s]",
    "[animation-delay:0.125s]",
    "[animation-delay:0.25s]",
    "[animation-delay:0.375s]",
    "[animation-delay:0.5s]",
    "[animation-delay:0.625s]",
    "[animation-delay:0.75s]",
    "[animation-delay:0.875s]",
  ]

  const renderGradientSpinner = () => (
    <div className="relative">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1",
          sizeClasses[size],
          className,
        )}
      >
        <div className="h-full w-full rounded-full bg-white" />
      </div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-md animate-pulse" />
    </div>
  )

  const renderRainbowSpinner = () => (
    <div className="relative">
      <div
        className={cn(
          "animate-spin rounded-full bg-[conic-gradient(from_0deg,#ff0000,#ff8000,#ffff00,#80ff00,#00ff00,#00ff80,#00ffff,#0080ff,#0000ff,#8000ff,#ff00ff,#ff0080,#ff0000)] p-[3px]",
          sizeClasses[size],
          className,
        )}
      >
        <div className="h-full w-full rounded-full bg-white" />
      </div>
      <div className="absolute inset-0 animate-pulse rounded-full bg-[conic-gradient(from_0deg,#ff0000,#ff8000,#ffff00,#80ff00,#00ff00,#00ff80,#00ffff,#0080ff,#0000ff,#8000ff,#ff00ff,#ff0080,#ff0000)] opacity-30 blur-lg" />
    </div>
  )

  const renderPulseSpinner = () => (
    <div className="relative">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-blue-200 border-t-[#3b82f6] border-r-[#8b5cf6] border-b-[#ec4899] border-l-[#10b981]",
          sizeClasses[size],
          className,
        )}
      />
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse" />
    </div>
  )

  const renderGlowSpinner = () => (
    <div className="relative">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 shadow-lg [filter:drop-shadow(0_0_10px_rgba(59,130,246,0.5))]",
          sizeClasses[size],
          className,
        )}
      >
        <div className="h-full w-full rounded-full bg-white" />
      </div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-20 blur-xl animate-ping" />
    </div>
  )

  const renderDotsSpinner = () => (
    <div className="relative flex items-center justify-center">
      <div className={cn("relative", sizeClasses[size])}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className={cn(
              "absolute left-1/2 top-1/2 h-2 w-2 origin-center -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse",
              dotOffsetClasses[size],
              i === 0 && "rotate-0",
              i === 1 && "rotate-45",
              i === 2 && "rotate-90",
              i === 3 && "rotate-[135deg]",
              i === 4 && "rotate-180",
              i === 5 && "rotate-[225deg]",
              i === 6 && "rotate-[270deg]",
              i === 7 && "rotate-[315deg]",
              dotDelayClasses[i],
            )}
          />
        ))}
      </div>
    </div>
  )

  const renderSpinner = () => {
    switch (variant) {
      case "rainbow":
        return renderRainbowSpinner()
      case "pulse":
        return renderPulseSpinner()
      case "glow":
        return renderGlowSpinner()
      case "dots":
        return renderDotsSpinner()
      default:
        return renderGradientSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderSpinner()}
      {text && (
        <p
          className={cn(
            "font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse",
            textSizeClasses[size],
            textClassName,
          )}
        >
          {text}
        </p>
      )}
    </div>
  )
}

// Full page beautiful loading
export function BeautifulPageLoading({
  text = "Loading...",
  variant = "gradient",
  size = "lg",
}: Omit<BeautifulSpinnerProps, "className">) {
  return (
    <div className="min-h-[400px] flex items-center justify-center ">
      <div className="text-center space-y-6 p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/20">
        <BeautifulSpinner variant={variant} size={size} />
        <p className="text-lg font-medium bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
          {text}
        </p>
      </div>
    </div>
  )
}

// Loading overlay with beautiful spinner
export function BeautifulLoadingOverlay({
  text = "Loading...",
  variant = "glow",
  size = "xl",
}: Omit<BeautifulSpinnerProps, "className">) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-white/30 text-center space-y-6">
        <BeautifulSpinner variant={variant} size={size} />
        <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {text}
        </p>
      </div>
    </div>
  )
}

// Button loading with beautiful spinner
export function BeautifulButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  return <BeautifulSpinner variant="gradient" size={size} className="border-white border-opacity-30" />
}
