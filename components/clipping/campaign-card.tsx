import Link from "next/link";
import { formatInr } from "@/lib/format";
import { BudgetRing } from "./budget-ring";
import { CampaignAge } from "./campaign-age";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import type { Campaign } from "@/lib/clipping/types";
import { SharedCardTransition } from "@/components/ui-motion/shared-element";

interface CampaignCardProps {
  campaign: Campaign;
  showPromotedBadge?: boolean;
}

export function CampaignCard({ campaign, showPromotedBadge = true }: CampaignCardProps) {
  const isPr = campaign.campaign_type === "social_pr";
  const prGross = campaign.fee_per_post_inr || 0;
  const prNet = prGross - Math.floor((prGross * CLIPPING_CONFIG.pr.creatorFeePct) / 100);

  return (
    <SharedCardTransition layoutId={`campaign-${campaign.id}`}>
      <article className="group relative flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-colors duration-150 hover:border-silver/60">
        {/* Clickable Card Link Anchor */}
        <Link
          href={`/clipping/campaigns/${campaign.slug}`}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          aria-label={`View ${campaign.title} by ${campaign.owner_name}`}
        >
          <span className="sr-only">View campaign details</span>
        </Link>

      <div>
        {/* Top Header: Category, Campaign Type, Promoted & Age */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-border/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-silver">
              {campaign.category}
            </span>
            {isPr ? (
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-blue-400 uppercase border border-blue-500/30">
                Social PR · {campaign.deliverable_type || "Post"}
              </span>
            ) : null}
            {showPromotedBadge && campaign.isPromoted && (
              <span className="rounded-full bg-lime/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-lime uppercase border border-lime/30">
                Promoted
              </span>
            )}
          </div>
          <span className="text-[11px] text-silver font-mono" title={`Created ${campaign.created_at}`}>
            <CampaignAge isoDate={campaign.created_at} />
          </span>
        </div>

        {/* Title & Owner */}
        <h3 className="font-display mt-3 text-lg font-semibold tracking-tight text-white group-hover:text-lime transition-colors duration-150">
          {campaign.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-silver">
          <span className="font-medium text-white/90">{campaign.owner_name}</span>
          {campaign.ownerVerified && (
            <span
              className="inline-flex items-center text-lime"
              title="Verified Campaign Owner"
              aria-label="Verified account"
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </div>

        {/* Summary */}
        <p className="mt-3 line-clamp-2 text-sm text-silver/90 leading-relaxed">
          {campaign.summary}
        </p>

        {/* Rate Box: NET rate first */}
        <div className="mt-4 rounded-xl border border-border/80 bg-surface/80 p-3.5">
          {isPr ? (
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div>
                <p className="text-[11px] font-medium tracking-wide uppercase text-silver">
                  {campaign.pricing_mode === "quote" ? "Pricing Model" : "Net Fee per Post"}
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  {campaign.pricing_mode === "quote" ? (
                    <span className="font-display text-xl font-bold tracking-tight text-lime">
                      Quote Mode
                    </span>
                  ) : (
                    <>
                      <span className="font-display text-xl font-bold tracking-tight text-lime">
                        {formatInr(prNet)}
                      </span>
                      <span className="text-xs text-silver">/ approved post</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                {campaign.pricing_mode === "quote" ? (
                  <span className="text-[11px] text-silver font-mono">
                    Budget: {formatInr(campaign.budget_inr)}
                  </span>
                ) : (
                  <span className="text-[11px] text-silver font-mono">
                    Gross: {formatInr(prGross)}
                  </span>
                )}
                <p className="text-[10px] text-silver/70">
                  {campaign.pricing_mode === "quote"
                    ? "Creators pitch quote"
                    : "after CIRCLE 10% fee"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div>
                <p className="text-[11px] font-medium tracking-wide uppercase text-silver">
                  Net Pay Rate
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display text-xl font-bold tracking-tight text-lime">
                    {formatInr(campaign.netRateInrPer1k)}
                  </span>
                  <span className="text-xs text-silver">/ 1K views</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-silver font-mono">
                  Gross: {formatInr(campaign.rate_inr_per_1k)}
                </span>
                <p className="text-[10px] text-silver/70">after 10% platform fee</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Platforms, Budget Ring, Approved Clips & CTA */}
      <div className="mt-5 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between gap-3">
          {/* Budget ring and stats */}
          <div className="flex items-center gap-3">
            <BudgetRing usedPct={campaign.budgetUsedPct} size={42} strokeWidth={3.5} />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">
                {formatInr(campaign.budget_reserved_inr)} / {formatInr(campaign.budget_inr)}
              </span>
              <span className="text-[11px] text-silver">
                {campaign.budgetUsedPct}% budget reserved
              </span>
            </div>
          </div>

          {/* Platforms & Badges */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              {campaign.platforms.includes("youtube_shorts") && (
                <span
                  className="rounded-md bg-border/40 p-1 text-silver hover:text-white"
                  title="YouTube Shorts"
                  aria-label="YouTube Shorts supported"
                >
                  <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </span>
              )}
              {campaign.platforms.includes("instagram_reels") && (
                <span
                  className="rounded-md bg-border/40 p-1 text-silver hover:text-white"
                  title="Instagram Reels"
                  aria-label="Instagram Reels supported"
                >
                  <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </span>
              )}
            </div>
            {isPr ? (
              <span className="text-[11px] text-lime font-mono">
                {campaign.slots} {campaign.slots === 1 ? "slot" : "slots"} (≥10K flws)
              </span>
            ) : (
              <span className="text-[11px] text-silver font-mono">
                {campaign.approvedClipCount} {campaign.approvedClipCount === 1 ? "clip" : "clips"} approved
              </span>
            )}
          </div>
        </div>

        {/* View Campaign Button */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-silver">
            {campaign.budgetLeftInr > 0 ? (
              <span className="text-lime">● Open for {isPr ? "applications" : "submissions"}</span>
            ) : (
              <span className="text-silver/60">● Budget exhausted</span>
            )}
          </span>
          <span className="inline-flex min-h-9 items-center justify-center rounded-full border border-border px-4 text-xs font-medium text-white transition-colors group-hover:border-lime group-hover:bg-lime group-hover:text-bg">
            {isPr ? "View PR campaign" : "View campaign"}
          </span>
        </div>
      </div>
    </article>
  </SharedCardTransition>
  );
}
