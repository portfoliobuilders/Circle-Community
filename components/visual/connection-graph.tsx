"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { duration, easings, useReducedMotionPreference } from "@/lib/motion"

export interface GraphNode {
  id: string
  step: string // "01", "02", "03"
  title: string
  subtitle: string
  badge?: string
  highlight?: boolean
}

export interface ConnectionGraphProps {
  nodes?: GraphNode[]
  className?: string
}

const defaultNodes: GraphNode[] = [
  {
    id: "step-1",
    step: "01",
    title: "Brand Brief",
    subtitle: "Fixed budget or open bid posted",
    badge: "Brief",
  },
  {
    id: "step-2",
    step: "02",
    title: "Verified Creator",
    subtitle: "Bio-code check & direct application",
    badge: "18+ Verified",
  },
  {
    id: "step-3",
    step: "03",
    title: "Direct Payout",
    subtitle: "100% direct peer payment (0% cut)",
    badge: "0% Commission",
    highlight: true,
  },
]

export function ConnectionGraph({
  nodes = defaultNodes,
  className,
}: ConnectionGraphProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "0px" })
  const reducedMotion = useReducedMotionPreference()

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full rounded-2xl bg-surface border border-border p-6 sm:p-8 overflow-hidden",
        className
      )}
    >
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {nodes.map((node, index) => {
          return (
            <div
              key={node.id}
              className={cn(
                "relative flex flex-col justify-between p-6 rounded-xl border bg-bg transition-colors",
                node.highlight
                  ? "border-lime/40"
                  : "border-border hover:border-silver/40"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      "font-mono text-xs font-semibold px-2 py-0.5 rounded-full border",
                      node.highlight
                        ? "bg-lime/10 border-lime/20 text-lime"
                        : "bg-surface border-border text-silver"
                    )}
                  >
                    STEP {node.step}
                  </span>
                  {node.badge && (
                    <span className="text-[11px] font-mono text-silver">
                      {node.badge}
                    </span>
                  )}
                </div>
                <h4 className="font-display font-semibold text-lg text-white">
                  {node.title}
                </h4>
                <p className="text-xs text-silver mt-1 leading-relaxed">
                  {node.subtitle}
                </p>
              </div>

              {/* Connecting indicator on mobile / separator */}
              {index < nodes.length - 1 && (
                <div className="mt-4 pt-4 border-t border-border flex justify-center md:hidden">
                  <span className="text-xs font-mono text-silver">↓</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* SVG Connecting Flow Lines across desktop */}
      <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 pointer-events-none px-12">
        <svg
          width="100%"
          height="4"
          viewBox="0 0 1000 4"
          preserveAspectRatio="none"
          className="w-full"
          aria-hidden="true"
        >
          {reducedMotion ? (
            <line
              x1="0"
              y1="2"
              x2="1000"
              y2="2"
              stroke="#242424"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ) : (
            <motion.line
              x1="0"
              y1="2"
              x2="1000"
              y2="2"
              stroke="#242424"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: duration.slow, ease: easings.entrance }}
            />
          )}
        </svg>
      </div>
    </div>
  )
}
