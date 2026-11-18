"use client"

import * as React from "react"
import { motion, useScroll, useMotionValueEvent } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"

export interface CompactingHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  children: React.ReactNode
  threshold?: number
}

export function CompactingHeader({
  children,
  threshold = 40,
  className,
  ...props
}: CompactingHeaderProps) {
  const [isCompact, setIsCompact] = React.useState(false)
  const reducedMotion = useReducedMotionPreference()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (reducedMotion) return
    const shouldBeCompact = latest > threshold
    if (shouldBeCompact !== isCompact) {
      setIsCompact(shouldBeCompact)
    }
  })

  return (
    <motion.header
      {...props}
      animate={{
        height: reducedMotion ? "64px" : isCompact ? "56px" : "72px",
        backgroundColor: "rgba(8, 8, 8, 0.96)",
      }}
      transition={{
        duration: reducedMotion ? 0 : duration.base,
        ease: easings.entrance,
      }}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border transition-colors flex items-center",
        className
      )}
    >
      <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </div>
    </motion.header>
  )
}
