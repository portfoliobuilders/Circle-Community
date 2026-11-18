"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useReducedMotionPreference } from "@/lib/motion"

export interface SkeletonShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SkeletonShimmer({ className, ...props }: SkeletonShimmerProps) {
  const reducedMotion = useReducedMotionPreference()

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-xl bg-surface border border-border/60",
        className
      )}
      {...props}
    >
      {!reducedMotion && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-border/40 to-transparent pointer-events-none"
        />
      )}
    </div>
  )
}
