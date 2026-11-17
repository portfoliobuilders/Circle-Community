"use client";

import { useState } from "react";
import { formatInr } from "@/lib/format";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";

export function ClippingCalculator() {
  const [views, setViews] = useState<number>(50000);
  const [rate, setRate] = useState<number>(80);

  // Integer-only maths according to CLIPPING_PLAN.md Section 0
  const gross = Math.floor((views / 1000) * rate);
  const fee = Math.floor((gross * CLIPPING_CONFIG.clipperFeePct) / 100);
  const net = gross - fee;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-lime">
            Interactive Calculator
          </span>
          <h3 className="font-display mt-1 text-2xl font-bold tracking-tight text-white">
            Estimate Your Clip Earnings
          </h3>
        </div>
        <span className="inline-flex self-start md:self-auto rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-medium text-lime">
          Estimate, not a promise
        </span>
      </div>

      <p className="mt-2 text-sm text-silver max-w-xl">
        Calculations assume your clip meets the 7-day verification criteria and views fall within the campaign&apos;s per-clip view cap.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Sliders Input Column */}
        <div className="flex flex-col gap-6">
          {/* Views Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="calc-views-slider" className="text-sm font-medium text-white">
                Verified Views on Day 7
              </label>
              <span className="font-mono text-base font-semibold text-lime">
                {views.toLocaleString("en-IN")} views
              </span>
            </div>
            <input
              id="calc-views-slider"
              type="range"
              min={1000}
              max={250000}
              step={1000}
              value={views}
              onChange={(e) => setViews(Number(e.target.value))}
              className="min-h-11 w-full accent-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-silver font-mono">
              <span>1K min</span>
              <span>100K</span>
              <span>250K cap</span>
            </div>
          </div>

          {/* Rate Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="calc-rate-slider" className="text-sm font-medium text-white">
                Campaign Gross Rate
              </label>
              <span className="font-mono text-base font-semibold text-white">
                {formatInr(rate)} / 1K views
              </span>
            </div>
            <input
              id="calc-rate-slider"
              type="range"
              min={CLIPPING_CONFIG.clipRateMinInrPer1k}
              max={CLIPPING_CONFIG.clipRateMaxInrPer1k}
              step={5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="min-h-11 w-full accent-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-silver font-mono">
              <span>₹10 (min)</span>
              <span>₹100</span>
              <span>₹200 (max)</span>
            </div>
          </div>
        </div>

        {/* Breakdown Output Column */}
        <div
          aria-live="polite"
          className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <span className="text-sm text-silver">Gross clip earnings</span>
            <span className="font-mono text-base font-medium text-white">{formatInr(gross)}</span>
          </div>

          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex flex-col">
              <span className="text-sm text-silver">CIRCLE 10% platform fee</span>
              <span className="text-[11px] text-silver/70">Covers verification & UPI payouts</span>
            </div>
            <span className="font-mono text-base font-medium text-destructive">
              - {formatInr(fee)}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-wide uppercase text-white">
                Estimated Net Payout
              </span>
              <span className="text-xs text-silver">Paid directly to your UPI ID</span>
            </div>
            <span className="font-display text-3xl font-extrabold tracking-tight text-lime">
              {formatInr(net)}
            </span>
          </div>

          <p className="text-[11px] text-silver/80 mt-2 border-t border-border/60 pt-3">
            Payouts require a minimum net wallet balance of {formatInr(CLIPPING_CONFIG.minPayoutInr)}.
            Earnings lock once views are verified on day {CLIPPING_CONFIG.viewHoldDays}.
          </p>
        </div>
      </div>
    </div>
  );
}
