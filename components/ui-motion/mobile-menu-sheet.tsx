"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { duration, easings, motionLimits, useReducedMotionPreference } from "@/lib/motion"

export interface MobileMenuLink {
  href: string
  label: string
  badge?: string
}

export interface MobileMenuSheetProps {
  isOpen: boolean
  onClose: () => void
  links: MobileMenuLink[]
  actionSlot?: React.ReactNode
}

export function MobileMenuSheet({
  isOpen,
  onClose,
  links,
  actionSlot,
}: MobileMenuSheetProps) {
  const reducedMotion = useReducedMotionPreference()
  const sheetRef = React.useRef<HTMLDivElement>(null)

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : duration.base }}
          className="fixed inset-0 z-50 flex flex-col bg-bg text-text"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border min-h-[64px]">
            <span className="font-display font-semibold text-lg text-white tracking-tight">
              Navigation
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className={cn(
                "flex items-center justify-center size-11 rounded-full border border-border bg-surface text-silver hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              )}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Staggered Links */}
          <motion.nav
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: reducedMotion ? 0 : motionLimits.staggerDelay,
                  delayChildren: 0.05,
                },
              },
            }}
            className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-3"
          >
            {links.map((link) => (
              <motion.div
                key={link.href}
                variants={{
                  hidden: { opacity: 0, x: reducedMotion ? 0 : -12 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: reducedMotion ? 0 : duration.base,
                      ease: easings.entrance,
                    },
                  },
                }}
              >
                <a
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between min-h-[48px] px-4 py-3 rounded-xl border border-transparent hover:border-border hover:bg-surface text-xl font-display font-medium text-white transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  )}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-lime/10 text-lime font-mono border border-lime/20">
                      {link.badge}
                    </span>
                  )}
                </a>
              </motion.div>
            ))}

            {actionSlot && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: reducedMotion ? 0 : 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reducedMotion ? 0 : duration.base },
                  },
                }}
                className="mt-6 pt-6 border-t border-border flex flex-col gap-3"
              >
                {actionSlot}
              </motion.div>
            )}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
