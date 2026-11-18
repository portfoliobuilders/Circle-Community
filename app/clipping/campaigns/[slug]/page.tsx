import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@/components/site/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { noIndex, pageMetadata } from "@/lib/seo"
import { formatInr, formatKolkata } from "@/lib/format"
import { CLIPPING_CONFIG } from "@/lib/config/clipping"
import { getCampaignBySlug, getTopClips, getClipperPlatforms } from "@/lib/clipping/data"
import { getOwnProfile } from "@/lib/data/marketplace"
import { BudgetRing } from "@/components/clipping/budget-ring"
import { JoinDialog } from "@/components/clipping/join-dialog"
import { PrApplyDialog } from "@/components/clipping/pr-apply-dialog"
import { SampleBanner } from "@/components/clipping/sample-banner"
import { SharedCardTransition } from "@/components/ui-motion/shared-element"
import { AnimatedAccordion, type AccordionItemData } from "@/components/ui-motion/animated-accordion"
import { CopyButton } from "@/components/ui-motion/copy-button"
import { ExternalLink, FolderOpen, ShieldCheck } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const campaign = await getCampaignBySlug(slug)

  if (!campaign) {
    return {
      title: "Campaign Not Found",
      robots: noIndex,
    }
  }

  const meta = pageMetadata(
    campaign.title,
    campaign.summary,
    `/clipping/campaigns/${campaign.slug}`
  )

  return {
    ...meta,
    robots: noIndex,
  }
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { slug } = await params
  const campaign = await getCampaignBySlug(slug)

  if (!campaign) {
    notFound()
  }

  const { userId } = await getOwnProfile()
  const userPlatforms = userId ? await getClipperPlatforms(userId) : []
  const topClips = await getTopClips(campaign.id)

  const isPr = campaign.campaign_type === "social_pr"
  const prGross = campaign.fee_per_post_inr || 0
  const prNet = prGross - Math.floor((prGross * CLIPPING_CONFIG.pr.creatorFeePct) / 100)

  // Construct accordion items
  const accordionItems: AccordionItemData[] = [
    {
      id: "acc-brief",
      title: "Creative Angles & Campaign Brief",
      content: (
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-silver leading-relaxed whitespace-pre-line">
          {campaign.brief_md}
        </div>
      ),
    },
    {
      id: "acc-rules",
      title: "Editorial Guidelines & Do's / Don'ts",
      content: (
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-silver leading-relaxed whitespace-pre-line">
          {campaign.rules_md}
        </div>
      ),
    },
    {
      id: "acc-captions",
      title: "Required Captions, Mentions & ASCI Tags",
      content: (
        <div className="space-y-4 text-xs">
          {campaign.required_caption && (
            <div>
              <span className="font-mono text-silver">Suggested Caption:</span>
              <p className="mt-1 rounded-xl border border-border bg-surface p-3 font-mono text-white">
                {campaign.required_caption}
              </p>
            </div>
          )}

          <div>
            <span className="font-mono text-silver">Required Hashtags:</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {campaign.required_hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface border border-border px-3 py-1 font-mono text-lime"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {campaign.required_mention && (
            <div>
              <span className="font-mono text-silver">Required Tag / Mention:</span>
              <p className="mt-1 font-mono text-white">{campaign.required_mention}</p>
            </div>
          )}

          <div className="rounded-xl border border-lime/30 bg-lime/10 p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="size-4 text-lime shrink-0 mt-0.5" />
            <div className="text-silver">
              <span className="font-semibold text-white">ASCI Compliance Requirement: </span>
              Under ASCI influencer guidelines, every submitted clip must prominently display the #ad or #collab hashtag in its primary caption.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "acc-rights",
      title: "IP Rights & Authorization Certification",
      content: (
        <p className="text-xs text-silver leading-relaxed">
          The campaign owner has legally affirmed ownership or distribution rights for all source materials provided in accordance with CIRCLE terms. Clippers are granted a non-exclusive license to edit and publish vertical video exclusively for this campaign.
        </p>
      ),
    },
  ]

  return (
    <>
      <SampleBanner />

      <main className="min-h-screen pb-20">
        <Breadcrumbs />

        <Container className="pt-8">
          {/* Top Header Card with Shared Element Transition */}
          <SharedCardTransition layoutId={`campaign-${campaign.id}`}>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                {/* Left Column: Metadata & Title */}
                <div className="flex-1 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-silver">
                      {campaign.category}
                    </span>
                    <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono uppercase text-silver">
                      Lang: {campaign.language.toUpperCase()}
                    </span>
                    {campaign.isPromoted && (
                      <span className="rounded-full bg-lime/10 px-3 py-1 font-mono font-semibold tracking-wider text-lime uppercase border border-lime/30">
                        Promoted
                      </span>
                    )}
                    <span className="rounded-full bg-lime/10 px-3 py-1 font-mono text-xs font-medium text-lime border border-lime/20">
                      ● {campaign.status === "live" ? "Open for Submissions" : campaign.status}
                    </span>
                  </div>

                  <h1 className="font-display mt-4 text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white uppercase">
                    {campaign.title}
                  </h1>

                  {/* Owner info */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-mono text-silver">
                    <span>Commissioned by</span>
                    <span className="font-semibold text-white">{campaign.owner_name}</span>
                    {campaign.ownerVerified && (
                      <span className="text-lime" title="Verified Campaign Owner">
                        ● Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm sm:text-base text-silver leading-relaxed">
                    {campaign.summary}
                  </p>

                  {/* Target Platforms */}
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-xs font-mono text-silver">Target Platforms:</span>
                    <div className="flex items-center gap-2">
                      {campaign.platforms.includes("youtube_shorts") && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-silver">
                          YouTube Shorts
                        </span>
                      )}
                      {campaign.platforms.includes("instagram_reels") && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-silver">
                          Instagram Reels
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Rate Card & Join CTA */}
                <div className="w-full lg:w-80 shrink-0 rounded-2xl border border-border bg-surface p-6 flex flex-col gap-5">
                  {isPr ? (
                    <div>
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-silver">
                        {campaign.pricing_mode === "quote" ? "Compensation Model" : "Net Payout per Post"}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        {campaign.pricing_mode === "quote" ? (
                          <span className="font-display text-2xl font-bold tracking-tight text-lime uppercase">
                            Creator Quotes
                          </span>
                        ) : (
                          <>
                            <span className="font-mono text-3xl font-bold tracking-tight text-lime">
                              {formatInr(prNet)}
                            </span>
                            <span className="text-xs text-silver font-mono">/ post</span>
                          </>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-silver">
                        10% platform fee deducted upon Day 7 verification lock.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-silver">
                        Net Payout Rate
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-mono text-3xl font-bold tracking-tight text-lime">
                          {formatInr(campaign.netRateInrPer1k)}
                        </span>
                        <span className="text-xs text-silver font-mono">/ 1K views</span>
                      </div>
                      <p className="mt-1 text-xs text-silver">
                        Gross {formatInr(campaign.rate_inr_per_1k)} · 10% fee covers snapshot verification & UPI.
                      </p>
                    </div>
                  )}

                  {/* Budget Progress Meter */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-silver">Remaining Budget</span>
                      <span className="font-semibold text-white">
                        {formatInr(campaign.budgetLeftInr)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <BudgetRing usedPct={campaign.budgetUsedPct} size={44} strokeWidth={4} />
                      <div className="text-xs">
                        <span className="font-mono text-white font-medium">
                          {campaign.budgetUsedPct}% Allocated
                        </span>
                        <span className="block text-silver text-[11px]">
                          of {formatInr(campaign.budget_inr)} total pool
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <div className="pt-2">
                    {isPr ? (
                      <PrApplyDialog
                        campaign={campaign}
                        userPlatforms={userPlatforms}
                        isLoggedIn={!!userId}
                      />
                    ) : (
                      <JoinDialog campaignTitle={campaign.title} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SharedCardTransition>

          {/* Key Parameters Row */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-silver font-mono uppercase">Deliverable Format</span>
              <p className="font-display mt-1 text-base font-medium text-white uppercase">
                {isPr ? campaign.deliverable_type || "Post" : "Vertical Short (9:16)"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-silver font-mono uppercase">
                {isPr ? "Total Slots" : "Per-Clip View Cap"}
              </span>
              <p className="font-mono mt-1 text-base font-medium text-white">
                {isPr
                  ? `${campaign.slots} creator slots`
                  : `${campaign.per_clip_view_cap.toLocaleString("en-IN")} views`}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-silver font-mono uppercase">
                {isPr ? "Follower Floor" : "Min Views to Qualify"}
              </span>
              <p className="font-mono mt-1 text-base font-medium text-lime">
                {isPr
                  ? `≥ ${(campaign.min_followers || 10000).toLocaleString("en-IN")} verified`
                  : `${campaign.min_views_to_qualify.toLocaleString("en-IN")} views`}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-silver font-mono uppercase">Timeline</span>
              <p className="font-mono mt-1 text-xs font-medium text-white">
                {campaign.ends_at ? `Ends ${formatKolkata(campaign.ends_at).split(" at ")[0]}` : "Active"}
              </p>
            </div>
          </div>

          {/* Source Footage Assets Card */}
          {(campaign.asset_folder_url || campaign.source_links.length > 0) && (
            <div className="mt-8 rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime/10 border border-lime/30 text-lime">
                  <FolderOpen className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-medium text-white uppercase">
                    Official Source Footage & Asset Pack
                  </h3>
                  <p className="text-xs text-silver mt-0.5">
                    Download approved 4K source footage, audio stems, and brand logo packs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {campaign.asset_folder_url && (
                  <CopyButton value={campaign.asset_folder_url} label="Copy Asset Link" />
                )}
                {campaign.source_links[0]?.url && (
                  <a
                    href={campaign.source_links[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-mono text-white hover:border-lime transition-colors"
                  >
                    <span>Open Drive</span>
                    <ExternalLink className="size-3 text-silver" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Two-Column Detail Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Creative Brief Accordion (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 className="font-display text-xl font-medium tracking-tight text-white uppercase mb-6">
                  Campaign Specs & Editorial Guidelines
                </h2>
                <AnimatedAccordion items={accordionItems} defaultOpenIds={["acc-brief", "acc-rules"]} />
              </div>
            </div>

            {/* Right Column: Payout Mechanics & Top Clips (1 col) */}
            <div className="flex flex-col gap-6">
              {/* How You Get Paid Box */}
              <section aria-labelledby="paid-heading" className="rounded-2xl border border-border bg-card p-6">
                <h3 id="paid-heading" className="font-display text-lg font-medium tracking-tight text-white uppercase">
                  Payout Verification
                </h3>
                <ul className="mt-4 space-y-4 text-xs text-silver">
                  <li className="flex items-start gap-3">
                    <span className="font-mono font-bold text-lime">01</span>
                    <div>
                      <strong className="text-white block font-medium">Day 7 Single Snapshot:</strong>
                      Views are snapshotted exactly 7 days after submission. Views after day 7 do not accrue additional earnings.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono font-bold text-lime">02</span>
                    <div>
                      <strong className="text-white block font-medium">10% Platform Fee:</strong>
                      CIRCLE retains 10% from gross earnings upon lock. Net rate is {formatInr(campaign.netRateInrPer1k)} per 1K views.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono font-bold text-lime">03</span>
                    <div>
                      <strong className="text-white block font-medium">Weekly UPI Disbursements:</strong>
                      Withdraw to your UPI ID once your wallet reaches the ₹{CLIPPING_CONFIG.minPayoutInr} minimum threshold.
                    </div>
                  </li>
                </ul>
              </section>

              {/* Top Clips Grid */}
              {topClips.length > 0 && (
                <section aria-labelledby="topclips-heading" className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <h3 id="topclips-heading" className="font-display text-lg font-medium tracking-tight text-white uppercase">
                      Top Approved Clips
                    </h3>
                    <span className="text-xs font-mono text-silver">
                      {topClips.length} verified
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col divide-y divide-border">
                    {topClips.map((clip) => (
                      <div key={clip.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                        <div>
                          <p className="font-mono font-medium text-white">{clip.clipper_handle}</p>
                          <span className="text-[11px] text-silver font-mono">
                            {clip.verified_views.toLocaleString("en-IN")} views
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-semibold text-lime">
                            {formatInr(clip.net_amount_inr)}
                          </span>
                          <span className="block text-[10px] text-silver font-mono">net</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  )
}
