"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"
import { NumberTicker } from "@/components/ui-motion/number-ticker"

export interface DataRingItem {
  id: string
  label: string
  value: number // Raw number (e.g. 150000)
  percentage: number // 0 to 100
  prefix?: string
  suffix?: string
  color?: "lime" | "silver"
}

export interface DataRingGroupProps {
  title?: string
  subtitle?: string
  items: DataRingItem[]
  className?: string
}

export function DataRingGroup({
  title,
  subtitle,
  items,
  className,
}: DataRingGroupProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const reducedMotion = useReducedMotionPreference()

  // Filter out invalid items
  const validItems = items.filter((item) => item.value > 0 || item.percentage > 0)
  if (validItems.length === 0) return null

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-surface border border-border p-6 sm:p-8 w-full",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="font-display font-semibold text-lg sm:text-xl text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-silver mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {validItems.map((item) => {
          const size = 88
          const strokeWidth = 6
          const radius = (size - strokeWidth) / 2
          const circumference = 2 * Math.PI * radius
          const clampedPct = Math.max(0, Math.min(100, item.percentage))
          const strokeDashoffset = circumference - (clampedPct / 100) * circumference
          const isLime = item.color !== "silver"

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-bg border border-border/80"
            >
              {/* SVG Ring */}
              <div className="relative shrink-0">
                <svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  className="transform -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#242424"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {reducedMotion ? (
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke={isLime ? "#C6FF00" : "#C7CBD1"}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  ) : (
                    <motion.circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke={isLime ? "#C6FF00" : "#C7CBD1"}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={isInView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
                      transition={{ duration: duration.slow, ease: easings.entrance }}
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-white">
                    {Math.round(clampedPct)}%
                  </span>
                </div>
              </div>

              {/* Data Text */}
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-mono text-silver uppercase truncate">
                  {item.label}
                </span>
                <span className="font-display font-semibold text-lg text-white mt-0.5">
                  <NumberTicker
                    value={item.value}
                    prefix={item.prefix}
                    suffix={item.suffix}
                  />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
