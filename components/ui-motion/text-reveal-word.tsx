"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"

export interface TextRevealWordProps {
  text: string
  as?: "h1" | "h2" | "h3" | "p"
  className?: string
  highlightWords?: string[]
  highlightClassName?: string
}

export function TextRevealWord({
  text,
  as: Component = "h1",
  className,
  highlightWords = [],
  highlightClassName = "text-lime",
}: TextRevealWordProps) {
  const ref = React.useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const reducedMotion = useReducedMotionPreference()

  const words = text.split(" ")

  if (reducedMotion) {
    return (
      <Component ref={ref as React.Ref<HTMLHeadingElement>} className={cn("font-display tracking-tight", className)}>
        {words.map((word, i) => {
          const isHighlighted = highlightWords.some((hw) =>
            word.toLowerCase().includes(hw.toLowerCase())
          )
          return (
            <React.Fragment key={i}>
              <span className={isHighlighted ? highlightClassName : undefined}>
                {word}
              </span>
              {i < words.length - 1 && " "}
            </React.Fragment>
          )
        })}
      </Component>
    )
  }

  return (
    <Component
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={cn("font-display tracking-tight flex flex-wrap gap-x-2", className)}
    >
      {words.map((word, i) => {
        const isHighlighted = highlightWords.some((hw) =>
          word.toLowerCase().includes(hw.toLowerCase())
        )

        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{
              duration: duration.base,
              delay: i * 0.04,
              ease: easings.entrance,
            }}
            className={cn("inline-block", isHighlighted && highlightClassName)}
          >
            {word}
          </motion.span>
        )
      })}
    </Component>
  )
}
