"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { duration, springs, useReducedMotionPreference } from "@/lib/motion"

export interface ExpandableCardProps {
  id: string
  title: string
  subtitle?: string
  badge?: string
  triggerContent: React.ReactNode
  expandedContent: React.ReactNode
  className?: string
}

export function ExpandableCard({
  id,
  title,
  subtitle,
  badge,
  triggerContent,
  expandedContent,
  className,
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const reducedMotion = useReducedMotionPreference()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Trigger Card */}
      <motion.div
        layoutId={reducedMotion ? undefined : `expandable-card-${id}`}
        transition={springs.layout}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
        className={cn(
          "group relative flex flex-col rounded-2xl bg-surface border border-border p-6 cursor-pointer text-left transition-colors",
          "hover:border-silver/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-silver mt-0.5">{subtitle}</p>
            )}
          </div>
          {badge && (
            <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-border text-silver border border-border">
              {badge}
            </span>
          )}
        </div>
        {triggerContent}
      </motion.div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : duration.fast }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-bg/80"
              aria-hidden="true"
            />

            {/* Expanded Container */}
            <motion.div
              layoutId={reducedMotion ? undefined : `expandable-card-${id}`}
              transition={springs.layout}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <div>
                  <h3 className="font-display font-semibold text-2xl text-white">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-sm text-silver mt-1">{subtitle}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close details"
                  className={cn(
                    "flex items-center justify-center size-11 rounded-full border border-border bg-bg text-silver hover:text-white transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  )}
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 text-silver leading-relaxed space-y-4">
                {expandedContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
