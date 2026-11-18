"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotionPreference, duration, easings, stepSequenceVariants } from "@/lib/motion";

export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
}

interface SteppedWorkflowProps {
  steps: WorkflowStep[];
  badge?: string;
  className?: string;
}

export function SteppedWorkflow({ steps, badge, className }: SteppedWorkflowProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const reducedMotion = useReducedMotionPreference();

  return (
    <div ref={containerRef} className={cn("relative space-y-8", className)}>
      {/* Desktop/Tablet Horizontal Connector (hidden on small mobile) */}
      <div className="relative hidden lg:block">
        {/* Background Track Line */}
        <div
          className="absolute top-5 left-10 right-10 h-0.5 bg-border pointer-events-none"
          aria-hidden="true"
        />
        {/* Animated Progress Line */}
        <motion.div
          className="absolute top-5 left-10 right-10 h-0.5 bg-lime origin-left pointer-events-none"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={isInView && !reducedMotion ? { scaleX: 1 } : { scaleX: reducedMotion ? 1 : 0 }}
          transition={{ duration: 0.8, ease: easings.entrance }}
        />
      </div>

      {/* Grid of Steps */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-6",
          steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5"
        )}
      >
        {steps.map((st, idx) => (
          <motion.div
            key={st.step}
            variants={stepSequenceVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{
              duration: reducedMotion ? 0 : duration.slow,
              delay: reducedMotion ? 0 : idx * 0.1,
              ease: easings.entrance,
            }}
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-lime/40 hover:bg-card/90"
          >
            <div>
              {/* Step Badge & Number */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "size-8 rounded-full border border-border bg-surface flex items-center justify-center font-mono text-xs font-bold transition-colors group-hover:border-lime group-hover:bg-lime/10 group-hover:text-lime",
                      idx === 0 ? "border-lime/50 text-lime" : "text-silver"
                    )}
                  >
                    {st.step}
                  </div>
                  {badge && idx === 0 && (
                    <span className="font-mono text-[10px] uppercase text-lime bg-lime/10 px-2 py-0.5 rounded-full border border-lime/30">
                      {badge}
                    </span>
                  )}
                </div>
                <div
                  className="size-1.5 rounded-full bg-border group-hover:bg-lime transition-colors"
                  aria-hidden="true"
                />
              </div>

              <h3 className="font-display mt-5 text-lg font-bold text-white uppercase group-hover:text-lime transition-colors">
                {st.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-silver leading-relaxed">
                {st.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-silver">
              <span>Phase {idx + 1} of {steps.length}</span>
              <div className="h-1 w-6 rounded-full bg-border group-hover:bg-lime transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
