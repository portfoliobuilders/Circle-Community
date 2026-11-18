"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"

export interface StepItemData {
  number: string // "01 //", "02 //", "03 //"
  title: string
  description: string
  iconSlot?: React.ReactNode
}

export interface StepSequenceProps {
  steps: StepItemData[]
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function StepSequence({
  steps,
  className,
  orientation = "horizontal",
}: StepSequenceProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const reducedMotion = useReducedMotionPreference()

  if (orientation === "vertical") {
    return (
      <div ref={ref} className={cn("relative flex flex-col gap-8 w-full", className)}>
        {steps.map((step, idx) => (
          <div key={step.number} className="relative flex items-start gap-6">
            {/* Step Number Circle */}
            <div className="relative z-10 flex items-center justify-center size-10 rounded-full bg-surface border border-border shrink-0 font-mono text-xs font-semibold text-lime">
              {idx + 1}
            </div>

            {/* Connecting Vertical Line */}
            {idx < steps.length - 1 && (
              <div
                className="absolute left-5 top-10 bottom-0 w-px bg-border -translate-x-1/2"
                style={{ height: "calc(100% + 2rem)" }}
              />
            )}

            <div className="flex-1 pb-6">
              <span className="font-mono text-xs text-silver">{step.number}</span>
              <h4 className="font-display font-semibold text-xl text-white mt-1">
                {step.title}
              </h4>
              <p className="text-sm text-silver mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative grid grid-cols-1 md:grid-cols-3 gap-6 w-full",
        className
      )}
    >
      {steps.map((step, idx) => (
        <motion.div
          key={step.number}
          initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: duration.slow,
            delay: idx * 0.08,
            ease: easings.entrance,
          }}
          className="relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-surface border border-border"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold text-lime tracking-wider">
                {step.number}
              </span>
              {step.iconSlot && (
                <div className="size-8 rounded-lg bg-bg border border-border flex items-center justify-center text-silver">
                  {step.iconSlot}
                </div>
              )}
            </div>
            <h4 className="font-display font-semibold text-xl text-white">
              {step.title}
            </h4>
            <p className="text-sm text-silver mt-2.5 leading-relaxed">
              {step.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-xs font-mono text-silver/60">
            <span>PHASE {idx + 1} OF {steps.length}</span>
            <span>VERIFIED</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
