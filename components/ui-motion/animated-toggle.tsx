"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { springs, useReducedMotionPreference } from "@/lib/motion"

export interface AnimatedToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  id?: string
  className?: string
}

export function AnimatedToggle({
  checked,
  onChange,
  disabled = false,
  label,
  id,
  className,
}: AnimatedToggleProps) {
  const reducedMotion = useReducedMotionPreference()
  const generatedId = React.useId()
  const toggleId = id || generatedId

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex items-center p-1 w-12 h-7 min-h-[44px] min-w-[48px] rounded-full transition-colors cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        {/* Track */}
        <div
          className={cn(
            "w-12 h-6 rounded-full border transition-colors",
            checked
              ? "bg-lime border-lime"
              : "bg-surface border-border"
          )}
        >
          {/* Thumb */}
          <motion.div
            animate={{
              x: checked ? 24 : 2,
            }}
            transition={reducedMotion ? { duration: 0 } : springs.micro}
            className={cn(
              "size-4 rounded-full mt-0.5",
              checked ? "bg-bg" : "bg-white"
            )}
          />
        </div>
      </button>

      {label && (
        <label
          htmlFor={toggleId}
          className={cn(
            "text-sm font-medium select-none cursor-pointer",
            checked ? "text-white" : "text-silver",
            disabled && "cursor-not-allowed opacity-40"
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}
