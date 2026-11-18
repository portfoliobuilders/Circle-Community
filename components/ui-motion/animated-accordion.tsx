"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { duration, easings, springs, useReducedMotionPreference } from "@/lib/motion"

export interface AccordionItemData {
  id: string
  title: string
  content: React.ReactNode
}

export interface AnimatedAccordionProps {
  items: AccordionItemData[]
  allowMultiple?: boolean
  defaultOpenIds?: string[]
  className?: string
}

export function AnimatedAccordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className,
}: AnimatedAccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>(defaultOpenIds)
  const reducedMotion = useReducedMotionPreference()

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return allowMultiple ? [...prev, id] : [id]
      }
    })
  }

  return (
    <div className={cn("divide-y divide-border border-y border-border w-full", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)

        return (
          <div key={item.id} className="transition-colors">
            <h3>
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${item.id}`}
                id={`accordion-header-${item.id}`}
                className={cn(
                  "flex w-full items-center justify-between py-4 sm:py-5 min-h-[48px] text-left font-display font-medium text-lg text-white transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  isOpen ? "text-lime" : "hover:text-silver"
                )}
              >
                <span>{item.title}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={reducedMotion ? { duration: 0 } : springs.micro}
                  className="ml-4 shrink-0 text-silver"
                >
                  <ChevronDown className="size-5 stroke-[1.5]" />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  role="region"
                  aria-labelledby={`accordion-header-${item.id}`}
                  initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{
                    duration: duration.base,
                    ease: easings.entrance,
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 text-sm sm:text-base text-silver leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
