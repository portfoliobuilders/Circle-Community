"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"

export interface DrawLineProps {
  d?: string // Custom SVG path d
  width?: number | string
  height?: number | string
  orientation?: "horizontal" | "vertical" | "custom"
  color?: "border" | "lime" | "silver"
  strokeWidth?: number
  className?: string
}

export function DrawLine({
  d,
  width = "100%",
  height = 2,
  orientation = "horizontal",
  color = "border",
  strokeWidth = 1.5,
  className,
}: DrawLineProps) {
  const ref = React.useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true })
  const reducedMotion = useReducedMotionPreference()

  const colorMap = {
    border: "#242424",
    lime: "#C6FF00",
    silver: "#C7CBD1",
  }

  const strokeColor = colorMap[color]

  // Default paths for horizontal/vertical
  const pathD =
    d ||
    (orientation === "horizontal"
      ? "M 0 1 L 1000 1"
      : "M 1 0 L 1 1000")

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={
        d
          ? undefined
          : orientation === "horizontal"
          ? "0 0 1000 2"
          : "0 0 2 1000"
      }
      preserveAspectRatio="none"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      {reducedMotion ? (
        <path
          d={pathD}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
      ) : (
        <motion.path
          d={pathD}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: duration.slow,
            ease: easings.entrance,
          }}
        />
      )}
    </svg>
  )
}
