"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"

export interface ProgressRingProps {
  value: number // 0 to 100
  size?: number
  strokeWidth?: number
  label?: string
  showValueText?: boolean
  className?: string
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  label,
  showValueText = true,
  className,
}: ProgressRingProps) {
  const ref = React.useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true })
  const reducedMotion = useReducedMotionPreference()

  const clampedValue = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Progress ring"}
      className={cn("relative inline-flex flex-col items-center justify-center", className)}
    >
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border"
        />

        {/* Progress Fill */}
        {reducedMotion ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="text-lime"
          />
        ) : (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
            transition={{
              duration: duration.slow,
              ease: easings.entrance,
            }}
            strokeLinecap="round"
            fill="none"
            className="text-lime"
          />
        )}
      </svg>

      {showValueText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-semibold text-white">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}

      {label && (
        <span className="mt-2 text-xs text-silver font-medium text-center">
          {label}
        </span>
      )}
    </div>
  )
}
