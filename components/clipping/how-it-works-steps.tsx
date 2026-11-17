"use client";

import { useState } from "react";
import { cn } from "cn";

const clipperSteps = [
  {
    number: "01",
    title: "Join a funded campaign",
    description:
      "Browse live campaigns from verified brands and creators. Choose a campaign matching your editing strengths and target audience.",
  },
  {
    number: "02",
    title: "Clip, edit & post",
    description:
      "Craft engaging 15–60s vertical clips from source footage. Post to your verified YouTube Shorts or Instagram Reels with required hashtags and #ad disclosure.",
  },
  {
    number: "03",
    title: "Views verified on day 7",
    description:
      "Exactly 7 days post-submission, CIRCLE snapshots your verified view count. Single snapshot counting guarantees transparency with zero moving targets.",
  },
  {
    number: "04",
    title: "Direct UPI payout",
    description:
      "Locked net earnings accrue directly to your wallet (after CIRCLE's 10% platform fee). Withdraw to your UPI ID as soon as your balance reaches ₹500.",
  },
];

const ownerSteps = [
  {
    number: "01",
    title: "Define brief & budget",
    description:
      "Specify your target audience, clip hooks, and required tags. Choose any pay rate from ₹10 to ₹200 per 1,000 views and set your total budget cap.",
  },
  {
    number: "02",
    title: "Fund campaign upfront",
    description:
      "Pay your budget plus CIRCLE's 10% service fee via standard bank transfer. Every rupee of your core budget goes directly to paying clippers.",
  },
  {
    number: "03",
    title: "Review incoming clips",
    description:
      "Moderate submissions in your dashboard. Approve high-quality edits that follow your brief and reject off-brand or incomplete submissions.",
  },
  {
    number: "04",
    title: "Pay only for verified views",
    description:
      "Budget is deducted only when approved clips generate verified views on day 7. Any unspent budget upon campaign completion is fully refundable.",
  },
];

export function HowItWorksSteps() {
  const [activeAudience, setActiveAudience] = useState<"clippers" | "owners">("clippers");

  const steps = activeAudience === "clippers" ? clipperSteps : ownerSteps;

  return (
    <div className="flex flex-col gap-8">
      {/* Audience Toggle */}
      <div className="flex items-center justify-center">
        <div
          role="tablist"
          aria-label="Workflow audience selector"
          className="inline-flex rounded-full border border-border bg-card p-1 text-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeAudience === "clippers"}
            onClick={() => setActiveAudience("clippers")}
            className={cn(
              "min-h-10 rounded-full px-5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
              activeAudience === "clippers"
                ? "bg-lime text-bg shadow-sm"
                : "text-silver hover:text-white"
            )}
          >
            For Clippers
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeAudience === "owners"}
            onClick={() => setActiveAudience("owners")}
            className={cn(
              "min-h-10 rounded-full px-5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
              activeAudience === "owners"
                ? "bg-lime text-bg shadow-sm"
                : "text-silver hover:text-white"
            )}
          >
            For Campaign Owners
          </button>
        </div>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-silver/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-widest text-lime">
                  STEP {step.number}
                </span>
                <div className="size-2 rounded-full bg-border" aria-hidden="true" />
              </div>
              <h4 className="font-display mt-4 text-lg font-semibold tracking-tight text-white">
                {step.title}
              </h4>
              <p className="mt-2 text-sm text-silver leading-relaxed">
                {step.description}
              </p>
            </div>
            <div className="mt-6 h-0.5 w-8 bg-lime/40" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
