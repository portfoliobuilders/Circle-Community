"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react"
import { cn } from "@/lib/utils"
import { springs, motionLimits, useReducedMotionPreference } from "@/lib/motion"

export interface MagneticButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
  className?: string
  href?: string
}

const emptySubscribe = () => () => {}

function subscribeTouch(cb: () => void) {
  if (typeof window === "undefined") return emptySubscribe()
  const mql = window.matchMedia("(hover: none)")
  mql.addEventListener("change", cb)
  return () => mql.removeEventListener("change", cb)
}

function getTouchSnapshot() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(hover: none)").matches
}

export function MagneticButton({
  children,
  variant = "primary",
  className,
  href,
  onClick,
  type = "button",
  ...props
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const reducedMotion = useReducedMotionPreference()
  const isTouch = React.useSyncExternalStore(subscribeTouch, getTouchSnapshot, () => false)

  // Mouse displacement physics
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, springs.magnetic)
  const springY = useSpring(y, springs.magnetic)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || isTouch || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    // Cap magnetic displacement strictly to 4px
    const clampedX = Math.max(-motionLimits.maxPull, Math.min(motionLimits.maxPull, distanceX * 0.15))
    const clampedY = Math.max(-motionLimits.maxPull, Math.min(motionLimits.maxPull, distanceY * 0.15))

    x.set(clampedX)
    y.set(clampedY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const variantStyles = {
    primary:
      "bg-lime text-bg font-display font-semibold hover:bg-lime/90 active:bg-lime/80",
    secondary:
      "bg-surface text-white border border-border hover:border-silver/40 active:bg-surface/80",
    outline:
      "bg-transparent text-silver border border-border hover:border-silver hover:text-white",
  }

  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] rounded-full text-base tracking-tight transition-colors select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    variantStyles[variant],
    className
  )

  const motionProps = reducedMotion || isTouch
    ? {}
    : {
        style: { x: springX, y: springY },
        whileTap: { scale: motionLimits.buttonPressScale },
      }

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        {...motionProps}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={baseClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  )
}
