"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotionPreference } from "@/lib/motion";

interface BudgetRingProps {
  usedPct: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercent?: boolean;
}

export function BudgetRing({
  usedPct,
  size = 48,
  strokeWidth = 4,
  className,
  showPercent = false,
}: BudgetRingProps) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, usedPct));
  const offset = circumference - (clampedPct / 100) * circumference;

  // Visual status indicator color
  const strokeColor =
    clampedPct >= 95
      ? "#EF4444" // red / nearly full or capped
      : clampedPct >= 75
      ? "#C7CBD1" // ice silver / high allocation
      : "#C6FF00"; // lime / healthy open capacity

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
      aria-label={`${clampedPct}% budget allocated`}
      role="progressbar"
      aria-valuenow={clampedPct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#242424"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={inView || reducedMotion ? offset : circumference}
          strokeLinecap="round"
          fill="none"
          className={cn(
            "transition-[stroke-dashoffset,stroke] duration-700 ease-out",
            reducedMotion && "transition-none"
          )}
        />
      </svg>
      {showPercent && (
        <span className="absolute font-mono text-[10px] font-semibold text-white">
          {clampedPct}%
        </span>
      )}
    </div>
  );
}
