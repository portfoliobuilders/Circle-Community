"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { springs, useReducedMotionPreference } from "@/lib/motion"

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface BentoCardProps {
  children: React.ReactNode
  className?: string
  spanCol?: string // e.g. "md:col-span-2", "lg:col-span-2"
  spanRow?: string // e.g. "row-span-2"
  onClick?: () => void
}

export function BentoCard({
  children,
  className,
  spanCol = "col-span-1",
  spanRow = "row-span-1",
  onClick,
}: BentoCardProps) {
  const reducedMotion = useReducedMotionPreference()

  return (
    <motion.div
      whileHover={reducedMotion ? {} : { y: -2 }}
      transition={springs.micro}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface border border-border p-6",
        "focus-within:border-silver/40 transition-colors",
        spanCol,
        spanRow,
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
