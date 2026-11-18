"use client"

import * as React from "react"
import { motion, useInView, useMotionValue, useSpring } from "motion/react"
import { cn } from "@/lib/utils"
import { springs, useReducedMotionPreference } from "@/lib/motion"
import Image from "next/image"

export interface OrbitNode {
  id: string
  label: string
  role: string
  angle: number // in degrees (0 to 360)
  radius: number // distance from center in px
  highlight?: boolean
}

export interface OrbitSceneProps {
  nodes?: OrbitNode[]
  className?: string
  size?: number
}

const defaultNodes: OrbitNode[] = [
  { id: "node-creators", label: "Creators", role: "Content & Rates", angle: 45, radius: 140, highlight: true },
  { id: "node-brands", label: "Brands", role: "Briefs & Campaigns", angle: 165, radius: 140 },
  { id: "node-clippers", label: "Video Clippers", role: "10% Performance", angle: 285, radius: 140, highlight: true },
  { id: "node-studios", label: "Studios & Gear", role: "Floor Bookings", angle: 345, radius: 210 },
  { id: "node-freelancers", label: "Editors & Crew", role: "Production", angle: 120, radius: 210 },
  { id: "node-webinars", label: "Academy", role: "Free Learning", angle: 220, radius: 210 },
]

export function OrbitScene({
  nodes = defaultNodes,
  className,
  size = 520,
}: OrbitSceneProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: "0px" })
  const reducedMotion = useReducedMotionPreference()

  // Mouse tilt tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(mouseY, springs.magnetic)
  const rotateY = useSpring(mouseX, springs.magnetic)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInView || reducedMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    // Max 4 degrees tilt
    mouseX.set((x / (rect.width / 2)) * 4)
    mouseY.set(-(y / (rect.height / 2)) * 4)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center select-none overflow-hidden mx-auto",
        className
      )}
      style={{
        width: "100%",
        maxWidth: size,
        aspectRatio: "1 / 1",
        perspective: 1000,
        contain: "paint",
      }}
    >
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Ring 1 (Inner Orbit) */}
        <div
          className="absolute rounded-full border border-border pointer-events-none"
          style={{ width: 280, height: 280 }}
        />

        {/* Ring 2 (Outer Orbit) */}
        <div
          className="absolute rounded-full border border-border/60 border-dashed pointer-events-none"
          style={{ width: 420, height: 420 }}
        />

        {/* Center Platform Node */}
        <div className="relative z-20 flex flex-col items-center justify-center size-20 rounded-full bg-surface border-2 border-border shadow-2xl">
          <Image
            src="/brand/emblem-white.png"
            alt="CIRCLE Emblem"
            width={36}
            height={36}
            className="size-9 object-contain"
          />
        </div>

        {/* Orbiting / Positioned Nodes */}
        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180
          const x = Math.round(Math.cos(rad) * node.radius)
          const y = Math.round(Math.sin(rad) * node.radius)

          return (
            <motion.div
              key={node.id}
              style={{
                position: "absolute",
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
              whileHover={reducedMotion ? undefined : { scale: 1.05 }}
              transition={springs.micro}
              className={cn(
                "z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface border text-left shadow-lg whitespace-nowrap transition-colors",
                node.highlight
                  ? "border-lime/40 text-white"
                  : "border-border text-silver hover:border-silver/40 hover:text-white"
              )}
            >
              <div
                className={cn(
                  "size-2 rounded-full",
                  node.highlight ? "bg-lime" : "bg-border"
                )}
              />
              <div className="flex flex-col">
                <span className="font-display font-medium text-xs text-white leading-tight">
                  {node.label}
                </span>
                <span className="text-[10px] font-mono text-silver leading-tight">
                  {node.role}
                </span>
              </div>
            </motion.div>
          )
        })}

        {/* Center Architectural Hub */}
      </motion.div>
    </div>
  )
}
