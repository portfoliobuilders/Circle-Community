"use client"

import * as React from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"
import { cn } from "@/lib/utils"
import { useReducedMotionPreference } from "@/lib/motion"

export interface NumberTickerProps {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  className,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const reducedMotion = useReducedMotionPreference()

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  })

  const [displayValue, setDisplayValue] = React.useState("0")

  // Formatter for Indian numbering (e.g. 1,00,000)
  const formatNumber = React.useCallback(
    (num: number) => {
      return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: decimalPlaces,
        minimumFractionDigits: decimalPlaces,
      }).format(num)
    },
    [decimalPlaces]
  )

  React.useEffect(() => {
    if (reducedMotion) return

    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue, reducedMotion])

  React.useEffect(() => {
    if (reducedMotion) return

    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(formatNumber(latest))
    })
    return () => unsubscribe()
  }, [springValue, reducedMotion, formatNumber])

  const renderedValue = reducedMotion ? formatNumber(value) : displayValue

  return (
    <span
      ref={ref}
      className={cn("inline-flex items-baseline font-mono tracking-tight", className)}
    >
      {prefix && <span>{prefix}</span>}
      <span>{renderedValue}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
