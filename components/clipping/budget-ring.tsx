"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

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

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, usedPct));
  const offset = circumference - (clampedPct / 100) * circumference;

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
          stroke="#C6FF00"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={inView ? offset : circumference}
          strokeLinecap="round"
          fill="none"
          className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
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
