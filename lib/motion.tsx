import { useReducedMotion } from "motion/react"
import React, { createContext, useContext } from "react"

/**
 * CIRCLE Motion Language & Animation Physics Tokens
 * Conforms to docs/MOTION_SPEC.md.
 * 
 * Rules:
 * - Animate transform and opacity only.
 * - Single-run entrances: viewport: { once: true }.
 * - Honor prefers-reduced-motion everywhere.
 */

// 1. Duration Tokens (in seconds for Motion)
export const duration = {
  instant: 0,
  fast: 0.15,   // 150ms: micro-interactions, toggles, button presses
  base: 0.25,   // 250ms: UI state changes, tabs, dropdowns, accordions
  slow: 0.45,   // 450ms: viewport entrances, line draws, progress rings
  story: 0.8,   // 800ms: complex hero orchestration, orbital rotation
} as const

// 2. Easing Curves (Cubic Bézier)
export const easings = {
  // Snappy arrival: fast deceleration with a crisp stop. Never overshoots.
  entrance: [0.16, 1, 0.3, 1] as const, // cubic-bezier(0.16, 1, 0.3, 1)

  // Accelerating departure: quick, unobtrusive exit from the screen.
  exit: [0.7, 0, 0.84, 0] as const,     // cubic-bezier(0.7, 0, 0.84, 0)
} as const

// 3. Spring Configurations
export const springs = {
  // UI Micro-interactions: high stiffness, critically damped. Snappy and tactile, zero wobble.
  micro: {
    type: "spring" as const,
    stiffness: 400,
    damping: 28,
    mass: 1,
  },

  // Layout & Shared Elements (layoutId): smooth spatial transitions between cards and detail containers.
  layout: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },

  // Magnetic Pull (Desktop primary buttons only): elastic resistance that returns immediately to center.
  magnetic: {
    type: "spring" as const,
    stiffness: 250,
    damping: 18,
    mass: 0.5,
  },
} as const

// 4. Stagger & Spatial Limits
export const motionLimits = {
  staggerDelay: 0.06,      // 60ms between consecutive list/grid items
  maxEnterY: 12,           // 12px max vertical displacement on entrance
  maxPull: 4,              // 4px max magnetic displacement
  buttonPressScale: 0.98,  // Tactile press response
} as const

// 5. Standard Entrance Variants
export const revealVariants = {
  hidden: { opacity: 0, y: motionLimits.maxEnterY },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easings.entrance,
    },
  },
} as const

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionLimits.staggerDelay,
      delayChildren: 0.05,
    },
  },
} as const

// 6. Reduced Motion Context & Hook
// Allows both OS-level preference and the in-app dev-switch to toggle reduced motion.
interface MotionConfigContextValue {
  reducedMotion: boolean
  setReducedMotion?: (value: boolean) => void
}

export const MotionConfigContext = createContext<MotionConfigContextValue>({
  reducedMotion: false,
})

export function MotionConfigProvider({
  children,
  forcedReducedMotion,
  setForcedReducedMotion,
}: {
  children: React.ReactNode
  forcedReducedMotion?: boolean
  setForcedReducedMotion?: (value: boolean) => void
}) {
  const osReducedMotion = useReducedMotion() ?? false
  const activeReducedMotion = forcedReducedMotion !== undefined ? forcedReducedMotion : osReducedMotion

  return (
    <MotionConfigContext.Provider
      value={{
        reducedMotion: activeReducedMotion,
        setReducedMotion: setForcedReducedMotion,
      }}
    >
      {children}
    </MotionConfigContext.Provider>
  )
}

export function useReducedMotionPreference(): boolean {
  const context = useContext(MotionConfigContext)
  const osReducedMotion = useReducedMotion() ?? false
  return context.reducedMotion || osReducedMotion
}
