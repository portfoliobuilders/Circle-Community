"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { springs, useReducedMotionPreference } from "@/lib/motion"

export interface TabItem {
  id: string
  label: string
  count?: number
  disabled?: boolean
}

export interface SlidingTabsProps {
  tabs: TabItem[]
  activeId: string
  onChange: (id: string) => void
  layoutId?: string
  className?: string
  tabClassName?: string
}

export function SlidingTabs({
  tabs,
  activeId,
  onChange,
  layoutId = "active-tab-indicator",
  className,
  tabClassName,
}: SlidingTabsProps) {
  const reducedMotion = useReducedMotionPreference()
  const tabListRef = React.useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = -1
    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % tabs.length
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + tabs.length) % tabs.length
    } else if (e.key === "Home") {
      newIndex = 0
    } else if (e.key === "End") {
      newIndex = tabs.length - 1
    }

    if (newIndex !== -1) {
      e.preventDefault()
      const nextTab = tabs[newIndex]
      if (nextTab && !nextTab.disabled) {
        onChange(nextTab.id)
        const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        buttons?.[newIndex]?.focus()
      }
    }
  }

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-xl bg-surface border border-border overflow-x-auto max-w-full scrollbar-none",
        className
      )}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeId

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              isActive ? "text-bg font-semibold" : "text-silver hover:text-white",
              tab.disabled && "opacity-40 cursor-not-allowed hover:text-silver",
              tabClassName
            )}
          >
            {/* Sliding Active Indicator */}
            {isActive && (
              reducedMotion ? (
                <div className="absolute inset-0 z-[-1] rounded-lg bg-lime" />
              ) : (
                <motion.div
                  layoutId={layoutId}
                  transition={springs.micro}
                  className="absolute inset-0 z-[-1] rounded-lg bg-lime"
                />
              )
            )}

            <span className="relative z-10">{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "relative z-10 px-1.5 py-0.5 text-xs rounded-full font-mono transition-colors",
                  isActive
                    ? "bg-bg/20 text-bg"
                    : "bg-border text-silver"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
