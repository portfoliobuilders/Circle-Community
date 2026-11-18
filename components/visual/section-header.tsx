import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  eyebrow?: string // e.g. "02 // MARKETPLACE"
  title: string // Max 6 words
  subline?: string // Max 20 words
  actionSlot?: React.ReactNode
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subline,
  actionSlot,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12 w-full",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="font-mono text-xs font-semibold text-lime uppercase tracking-wider block mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-tight">
          {title}
        </h2>
        {subline && (
          <p className="text-sm sm:text-base text-silver mt-2.5 leading-relaxed max-w-xl">
            {subline}
          </p>
        )}
      </div>

      {actionSlot && (
        <div className="shrink-0 sm:self-end">
          {actionSlot}
        </div>
      )}
    </div>
  )
}
