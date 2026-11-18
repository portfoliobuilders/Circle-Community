"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"

export interface StatementLineProps {
  indexLabel?: string // e.g. "01 //"
  statement: string
  highlightWord?: string
  subline?: string
  className?: string
}

export function StatementLine({
  indexLabel,
  statement,
  highlightWord,
  subline,
  className,
}: StatementLineProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const reducedMotion = useReducedMotionPreference()

  const words = statement.split(" ")

  return (
    <div ref={ref} className={cn("relative py-8 sm:py-12 w-full", className)}>
      {indexLabel && (
        <span className="font-mono text-xs sm:text-sm font-semibold text-lime block mb-3">
          {indexLabel}
        </span>
      )}

      <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
        {words.map((word, i) => {
          const isHighlight =
            highlightWord &&
            word.toLowerCase().includes(highlightWord.toLowerCase())

          return (
            <React.Fragment key={i}>
              <span className={isHighlight ? "text-lime" : undefined}>
                {word}
              </span>
              {i < words.length - 1 && " "}
            </React.Fragment>
          )
        })}
      </h2>

      {subline && (
        <p className="text-base sm:text-lg text-silver mt-4 max-w-2xl leading-relaxed">
          {subline}
        </p>
      )}

      {/* Decorative 1.5px baseline divider */}
      {reducedMotion ? (
        <div className="mt-8 sm:mt-10 h-px w-full bg-border" aria-hidden="true" />
      ) : (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: duration.slow, ease: easings.entrance }}
          style={{ originX: 0 }}
          className="mt-8 sm:mt-10 h-px w-full bg-border"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
