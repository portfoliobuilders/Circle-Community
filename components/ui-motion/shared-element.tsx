"use client"

import * as React from "react"
import { motion } from "motion/react"
import { springs, useReducedMotionPreference } from "@/lib/motion"

export interface SharedElementProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  layoutId: string
  children: React.ReactNode
  className?: string
}

export function SharedElement({
  layoutId,
  children,
  className,
  ...props
}: SharedElementProps) {
  const reducedMotion = useReducedMotionPreference()

  if (reducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      layoutId={layoutId}
      transition={springs.layout}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const SharedCardTransition = SharedElement

