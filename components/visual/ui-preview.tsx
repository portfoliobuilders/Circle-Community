"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { springs, useReducedMotionPreference } from "@/lib/motion"

export interface UIPreviewProps {
  title?: string
  badge?: string
  children: React.ReactNode
  className?: string
  interactive?: boolean
}

export function UIPreview({
  title = "Component Preview",
  badge = "Live Product",
  children,
  className,
  interactive = true,
}: UIPreviewProps) {
  const reducedMotion = useReducedMotionPreference()

  return (
    <motion.div
      whileHover={interactive && !reducedMotion ? { y: -2 } : undefined}
      transition={springs.micro}
      className={cn(
        "relative flex flex-col rounded-2xl bg-surface border border-border overflow-hidden shadow-xl w-full",
        className
      )}
    >
      {/* Mock Window / Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg/80 select-none">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-border" />
          <div className="size-2.5 rounded-full bg-border" />
          <div className="size-2.5 rounded-full bg-border" />
          <span className="ml-2 font-mono text-xs text-silver truncate max-w-[200px]">
            {title}
          </span>
        </div>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime/10 border border-lime/20 text-lime font-medium">
            {badge}
          </span>
        )}
      </div>

      {/* Component Slot */}
      <div className="p-4 sm:p-6 bg-bg/40 flex-1 flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  )
}
