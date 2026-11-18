"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"

export interface StepItem {
  id: string
  stepNumber: string // "01 //", "02 //", etc.
  title: string
  description: string
  visualSlot?: React.ReactNode
}

export interface StickyScrollStepsProps {
  steps: StepItem[]
  className?: string
}

export function StickyScrollSteps({ steps, className }: StickyScrollStepsProps) {
  const [activeStep, setActiveStep] = React.useState(0)
  const reducedMotion = useReducedMotionPreference()
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([])

  React.useEffect(() => {
    if (reducedMotion) return

    const observers = stepRefs.current.map((el, idx) => {
      if (!el) return null
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(idx)
            }
          })
        },
        { threshold: 0.6 }
      )
      observer.observe(el)
      return observer
    })

    return () => {
      observers.forEach((obs) => obs?.disconnect())
    }
  }, [reducedMotion, steps.length])

  if (reducedMotion) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 w-full", className)}>
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col rounded-2xl bg-surface border border-border p-6"
          >
            <span className="font-mono text-xs font-semibold text-lime mb-2">
              {step.stepNumber}
            </span>
            <h3 className="font-display font-semibold text-xl text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-silver leading-relaxed mb-4">
              {step.description}
            </p>
            {step.visualSlot && (
              <div className="mt-auto pt-4 border-t border-border">
                {step.visualSlot}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("relative grid grid-cols-1 lg:grid-cols-2 gap-12 w-full", className)}>
      {/* Scrollable Steps Column */}
      <div className="flex flex-col gap-24 py-12">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep
          return (
            <div
              key={step.id}
              ref={(el) => {
                stepRefs.current[idx] = el
              }}
              className={cn(
                "p-8 rounded-2xl border transition-all duration-300",
                isActive
                  ? "bg-surface border-silver/40 shadow-xl"
                  : "bg-surface/40 border-border/60 opacity-60"
              )}
            >
              <span
                className={cn(
                  "font-mono text-sm font-semibold tracking-wider transition-colors",
                  isActive ? "text-lime" : "text-silver"
                )}
              >
                {step.stepNumber}
              </span>
              <h3 className="font-display font-semibold text-2xl text-white mt-2 mb-3">
                {step.title}
              </h3>
              <p className="text-base text-silver leading-relaxed">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Sticky Visual Showcase Column */}
      <div className="hidden lg:block sticky top-28 h-[420px] self-start rounded-2xl bg-surface border border-border p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={steps[activeStep]?.id || "empty"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: duration.base, ease: easings.entrance }}
            className="w-full h-full flex flex-col justify-center items-center"
          >
            {steps[activeStep]?.visualSlot ? (
              steps[activeStep].visualSlot
            ) : (
              <div className="text-center p-6 border border-dashed border-border rounded-xl">
                <span className="font-mono text-xs text-lime">
                  {steps[activeStep]?.stepNumber}
                </span>
                <h4 className="font-display font-semibold text-lg text-white mt-2">
                  {steps[activeStep]?.title}
                </h4>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
