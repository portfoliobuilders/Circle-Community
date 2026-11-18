"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { springs, useReducedMotionPreference } from "@/lib/motion"

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  label?: string
  successLabel?: string
  className?: string
}

export function CopyButton({
  value,
  label = "Copy",
  successLabel = "Copied",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)
  const reducedMotion = useReducedMotionPreference()
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? successLabel : label}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-3 py-2 min-h-[44px] min-w-[44px] rounded-lg border border-border bg-surface text-silver hover:text-white hover:border-silver/40 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        copied && "border-lime/40 text-lime hover:text-lime hover:border-lime",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={reducedMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
            transition={springs.micro}
            className="flex items-center gap-1.5 text-lime"
          >
            <Check className="size-4 stroke-[1.5]" />
            <span className="text-xs font-medium font-mono">{successLabel}</span>
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={reducedMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
            transition={springs.micro}
            className="flex items-center gap-1.5"
          >
            <Copy className="size-4 stroke-[1.5]" />
            {label && <span className="text-xs font-medium">{label}</span>}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? successLabel : ""}
      </span>
    </button>
  )
}
