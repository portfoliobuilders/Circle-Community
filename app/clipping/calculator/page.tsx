"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { formatInr } from "@/lib/format";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { Calculator } from "lucide-react";
import { NumberTicker } from "@/components/ui-motion/number-ticker";
import { BudgetRing } from "@/components/clipping/budget-ring";

export default function StandaloneCalculatorPage() {
  const [model, setModel] = useState<"clipping" | "social_pr">("clipping");

  // Clipping Inputs
  const [views, setViews] = useState<number>(50000);
  const [ratePer1k, setRatePer1k] = useState<number>(80);

  // Social PR Inputs
  const [feePerPost, setFeePerPost] = useState<number>(5000);
  const [slots, setSlots] = useState<number>(3);

  // Math: Clipping (Integer arithmetic)
  const clippingGross = Math.floor((views / 1000) * ratePer1k);
  const clippingFee = Math.floor((clippingGross * CLIPPING_CONFIG.clipperFeePct) / 100);
  const clippingNet = clippingGross - clippingFee;

  // Math: PR (Integer arithmetic)
  const prGrossPerPost = feePerPost;
  const prFeePerPost = Math.floor((prGrossPerPost * CLIPPING_CONFIG.pr.creatorFeePct) / 100);
  const prNetPerPost = prGrossPerPost - prFeePerPost;

  const prTotalBudget = feePerPost * slots;
  const prOwnerFee = Math.floor((prTotalBudget * CLIPPING_CONFIG.pr.ownerFeePct) / 100);
  const prTotalInvoice = prTotalBudget + prOwnerFee;

  return (
    <main className="py-16 sm:py-24 space-y-16">
      <Container>
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-lime font-semibold">
            Interactive Payout Estimator
          </span>
          <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
            Earnings & Budget Calculator
          </h1>
          <p className="mt-4 text-lead text-silver leading-relaxed max-w-2xl">
            Simulate creator net earnings and brand invoice totals across Video Clipping and Social Media PR models.
          </p>

          {/* Model Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 text-xs">
            <button
              type="button"
              onClick={() => setModel("clipping")}
              className={`min-h-10 rounded-full px-5 font-medium transition ${
                model === "clipping"
                  ? "bg-lime text-bg font-semibold shadow-sm"
                  : "text-silver hover:text-white"
              }`}
            >
              Video Clipping (Pay-per-view)
            </button>
            <button
              type="button"
              onClick={() => setModel("social_pr")}
              className={`min-h-10 rounded-full px-5 font-medium transition ${
                model === "social_pr"
                  ? "bg-lime text-bg font-semibold shadow-sm"
                  : "text-silver hover:text-white"
              }`}
            >
              Social Media PR (Pay-per-post)
            </button>
          </div>
        </div>

        {/* Dynamic Calculator Workspace */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-10">
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
                <Calculator className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-white uppercase">
                  {model === "clipping" ? "Clipping Earnings Calculator" : "Social PR Rate & Budget Simulator"}
                </h2>
                <p className="text-xs text-silver">
                  Transparent integer INR calculations reflecting CIRCLE&apos;s dual 10% fee model.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-mono font-medium text-lime">
              Estimate · Not a Guarantee
            </span>
          </div>

          {model === "clipping" ? (
            /* CLIPPING CALCULATOR */
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Sliders Column */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-sm">
                    <label htmlFor="views-slider" className="font-medium text-white">
                      Verified Views on Day 7
                    </label>
                    <span className="font-mono text-base font-semibold text-lime">
                      {views.toLocaleString("en-IN")} views
                    </span>
                  </div>
                  <input
                    id="views-slider"
                    type="range"
                    min={1000}
                    max={250000}
                    step={1000}
                    value={views}
                    onChange={(e) => setViews(Number(e.target.value))}
                    className="mt-3 w-full accent-lime min-h-11 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-silver">
                    <span>1,000 min</span>
                    <span>250,000 max</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-sm">
                    <label htmlFor="rate-slider" className="font-medium text-white">
                      Campaign Gross Rate per 1,000 Views
                    </label>
                    <span className="font-mono text-base font-semibold text-lime">
                      {formatInr(ratePer1k)} / 1K
                    </span>
                  </div>
                  <input
                    id="rate-slider"
                    type="range"
                    min={CLIPPING_CONFIG.clipRateMinInrPer1k}
                    max={CLIPPING_CONFIG.clipRateMaxInrPer1k}
                    step={5}
                    value={ratePer1k}
                    onChange={(e) => setRatePer1k(Number(e.target.value))}
                    className="mt-3 w-full accent-lime min-h-11 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-silver">
                    <span>₹{CLIPPING_CONFIG.clipRateMinInrPer1k} min</span>
                    <span>₹{CLIPPING_CONFIG.clipRateMaxInrPer1k} max</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-surface/50 p-4 text-xs text-silver space-y-1">
                  <p>• Payout is calculated exactly once on Day 7 post-submission.</p>
                  <p>• Per-clip view caps protect campaign budgets if a clip goes viral.</p>
                  <p>• Minimum withdrawal threshold to UPI is ₹500.</p>
                </div>
              </div>

              {/* Earnings Breakdown Output */}
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-wider text-silver">Estimated Payout Output</p>
                    <BudgetRing usedPct={90} size={36} strokeWidth={3} />
                  </div>
                  <div aria-live="polite" role="status" className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-silver">Gross Earnings:</span>
                      <span className="font-mono text-white font-medium">
                        <NumberTicker value={clippingGross} prefix="₹" />
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-silver">CIRCLE Platform Fee (10%):</span>
                      <span className="font-mono text-white font-medium">
                        <NumberTicker value={clippingFee} prefix="- ₹" />
                      </span>
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between items-baseline">
                      <span className="text-sm font-medium text-white">Net Payout to Clipper:</span>
                      <span className="font-display text-3xl font-bold text-lime">
                        <NumberTicker value={clippingNet} prefix="₹" />
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-mono text-silver">
                    Net rate: <strong>{formatInr(ratePer1k - Math.floor((ratePer1k * 10) / 100))}</strong> per 1,000 views.
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
                  <PillLink href="/clipping/campaigns?campaign_type=clipping">Browse active briefs</PillLink>
                  <Link
                    href="/clipping/how-it-works"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-xs text-silver hover:text-white"
                  >
                    How verification works
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* SOCIAL PR CALCULATOR */
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Inputs Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="pr-fee-input" className="block text-sm font-medium text-white">
                    Agreed Fee per Post (INR)
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-3 text-silver">₹</span>
                    <input
                      id="pr-fee-input"
                      type="number"
                      min={500}
                      step={250}
                      value={feePerPost}
                      onChange={(e) => setFeePerPost(Math.max(500, Number(e.target.value)))}
                      className="w-full rounded-xl border border-border bg-bg pl-8 pr-4 py-3 text-text focus:border-lime focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-silver">Minimum PR fee per post is ₹500.</p>
                </div>

                <div>
                  <label htmlFor="pr-slots-input" className="block text-sm font-medium text-white">
                    Target Creator Slots / Pages
                  </label>
                  <input
                    id="pr-slots-input"
                    type="number"
                    min={1}
                    max={50}
                    value={slots}
                    onChange={(e) => setSlots(Math.max(1, Number(e.target.value)))}
                    className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-silver">Number of verified 10K+ pages you intend to book.</p>
                </div>

                <div className="rounded-xl border border-border bg-surface/50 p-4 text-xs text-silver space-y-1">
                  <p>• Creator must have ≥ 10,000 admin-verified followers.</p>
                  <p>• Post must remain live, public, and unedited for 7 days.</p>
                  <p>• 100% upfront escrow prevents brand non-payment.</p>
                </div>
              </div>

              {/* Dual Breakdown: Creator Net vs Brand Total */}
              <div className="space-y-6">
                {/* For Creator */}
                <div className="rounded-2xl border border-border bg-surface p-6 space-y-3" aria-live="polite" role="status">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-wider text-lime font-semibold">
                      Creator Perspective (Per Post)
                    </p>
                    <BudgetRing usedPct={90} size={32} strokeWidth={3} />
                  </div>
                  <div className="flex justify-between text-xs text-silver">
                    <span>Gross Fee:</span>
                    <span className="font-mono text-white">
                      <NumberTicker value={prGrossPerPost} prefix="₹" />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-silver">
                    <span>CIRCLE Platform Fee (10%):</span>
                    <span className="font-mono text-white">
                      <NumberTicker value={prFeePerPost} prefix="- ₹" />
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between items-baseline">
                    <span className="text-xs font-medium text-white">Creator Net Payout:</span>
                    <span className="font-display text-2xl font-bold text-lime">
                      <NumberTicker value={prNetPerPost} prefix="₹" />
                    </span>
                  </div>
                </div>

                {/* For Brand */}
                <div className="rounded-2xl border border-border bg-surface p-6 space-y-3" aria-live="polite" role="status">
                  <p className="font-mono text-xs uppercase tracking-wider text-silver font-semibold">
                    Brand Campaign Invoice ({slots} Posts)
                  </p>
                  <div className="flex justify-between text-xs text-silver">
                    <span>Escrow Pool Budget ({slots} × {formatInr(feePerPost)}):</span>
                    <span className="font-mono text-white">
                      <NumberTicker value={prTotalBudget} prefix="₹" />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-silver">
                    <span>CIRCLE Service Fee (10% on top):</span>
                    <span className="font-mono text-white">
                      <NumberTicker value={prOwnerFee} prefix="₹" />
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-white">Total Upfront Invoice:</span>
                    <span className="font-display text-2xl font-bold text-white">
                      <NumberTicker value={prTotalInvoice} prefix="₹" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
