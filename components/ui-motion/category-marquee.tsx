"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { useReducedMotionPreference } from "@/lib/motion"

export interface CategoryItem {
  id: string
  label: string
  count?: number
  href?: string
}

export interface CategoryMarqueeProps {
  items: CategoryItem[]
  speed?: number // Seconds per cycle
  direction?: "left" | "right"
  className?: string
}

export function CategoryMarquee({
  items,
  speed = 35,
  direction = "left",
  className,
}: CategoryMarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: "0px" })
  const reducedMotion = useReducedMotionPreference()
  const [isPaused, setIsPaused] = React.useState(false)

  // Under reduced motion, display a static wrapped grid/flex
  if (reducedMotion) {
    return (
      <div
        className={cn(
          "flex flex-wrap gap-2.5 justify-center py-4 w-full",
          className
        )}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full bg-surface border border-border text-sm text-silver font-medium"
          >
            <span>{item.label}</span>
            {item.count && (
              <span className="text-xs font-mono text-silver/60">
                ({item.count})
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Duplicate items for continuous seamless loop
  const duplicatedItems = [...items, ...items, ...items]

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "relative overflow-hidden w-full py-4 select-none group",
        className
      )}
    >
      <motion.div
        animate={
          isInView && !isPaused
            ? {
                x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
              }
            : undefined
        }
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
        className="flex w-max gap-3 items-center will-change-transform"
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-surface border border-border text-sm font-medium text-silver whitespace-nowrap transition-colors",
              "hover:border-silver/40 hover:text-white focus-within:ring-2 focus-within:ring-lime focus-within:ring-offset-2 focus-within:ring-offset-bg"
            )}
          >
            {item.href ? (
              <a
                href={item.href}
                className="focus-visible:outline-none flex items-center gap-2"
              >
                <span>{item.label}</span>
                {item.count && (
                  <span className="text-xs font-mono text-silver/60">
                    ({item.count})
                  </span>
                )}
              </a>
            ) : (
              <>
                <span>{item.label}</span>
                {item.count && (
                  <span className="text-xs font-mono text-silver/60">
                    ({item.count})
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
