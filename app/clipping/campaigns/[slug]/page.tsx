import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { noIndex, pageMetadata } from "@/lib/seo";
import { formatInr, formatKolkata } from "@/lib/format";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { getCampaignBySlug, getTopClips } from "@/lib/clipping/data";
import { BudgetRing } from "@/components/clipping/budget-ring";
import { JoinDialog } from "@/components/clipping/join-dialog";
import { SampleBanner } from "@/components/clipping/sample-banner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    return {
      title: "Campaign Not Found",
      robots: noIndex,
    };
  }

  const meta = pageMetadata(
    campaign.title,
    campaign.summary,
    `/clipping/campaigns/${campaign.slug}`
  );

  // Sample campaign pages must be noindex and never in sitemap
  return {
    ...meta,
    robots: noIndex,
  };
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  const topClips = await getTopClips(campaign.id);

  return (
    <>
      <SampleBanner />

      <main className="min-h-screen pb-20">
        <Breadcrumbs />

        <Container className="pt-8">
          {/* Top Header Card */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Left Column: Metadata & Title */}
              <div className="flex-1 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-border/60 px-3 py-1 font-medium tracking-wide text-silver">
                    {campaign.category}
                  </span>
                  <span className="rounded-full bg-border/60 px-3 py-1 font-mono uppercase text-silver">
                    Lang: {campaign.language.toUpperCase()}
                  </span>
                  {campaign.isPromoted && (
                    <span className="rounded-full bg-lime/10 px-3 py-1 font-semibold tracking-wider text-lime uppercase border border-lime/30">
                      Promoted
                    </span>
                  )}
                  <span className="rounded-full bg-lime/10 px-3 py-1 text-xs font-medium text-lime">
                    ● {campaign.status === "live" ? "Open for Submissions" : campaign.status}
                  </span>
                </div>

                <h1 className="font-display mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {campaign.title}
                </h1>

                {/* Owner info */}
                <div className="mt-3 flex items-center gap-2 text-sm text-silver">
                  <span>Commissioned by</span>
                  <span className="font-semibold text-white">{campaign.owner_name}</span>
                  {campaign.ownerVerified && (
                    <span
                      className="inline-flex items-center text-lime"
                      title="Verified Campaign Owner"
                      aria-label="Verified account"
                    >
                      <svg className="size-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </div>

                <p className="mt-4 text-base text-silver leading-relaxed">
                  {campaign.summary}
                </p>

                {/* Target Platforms */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-xs font-medium text-silver">Target Platforms:</span>
                  <div className="flex items-center gap-2">
                    {campaign.platforms.includes("youtube_shorts") && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-silver">
                        <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        YouTube Shorts
                      </span>
                    )}
                    {campaign.platforms.includes("instagram_reels") && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-silver">
                        <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                        </svg>
                        Instagram Reels
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Rate Card & Join CTA */}
              <div className="w-full lg:w-80 shrink-0 rounded-2xl border border-border bg-surface p-6 flex flex-col gap-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-silver">
                    Clipper Net Rate
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-3xl font-extrabold tracking-tight text-lime">
                      {formatInr(campaign.netRateInrPer1k)}
                    </span>
                    <span className="text-sm text-silver font-medium">/ 1,000 views</span>
                  </div>
                  <p className="mt-1 text-xs text-silver">
                    Gross rate: {formatInr(campaign.rate_inr_per_1k)} · CIRCLE 10% fee deducted on lock
                  </p>
                </div>

                {/* Budget Gauge */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <BudgetRing usedPct={campaign.budgetUsedPct} size={48} strokeWidth={4} />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {formatInr(campaign.budget_reserved_inr)} / {formatInr(campaign.budget_inr)}
                      </span>
                      <span className="text-xs text-silver">
                        {formatInr(campaign.budgetLeftInr)} remaining budget
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-2">
                  <JoinDialog campaignTitle={campaign.title} />
                </div>
              </div>
            </div>
          </div>

          {/* Key Parameters Row */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-silver font-mono uppercase">Per-Clip View Cap</span>
              <p className="font-display mt-1 text-lg font-bold text-white">
                {campaign.per_clip_view_cap.toLocaleString("en-IN")} views
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-silver font-mono uppercase">Clipper Cap</span>
              <p className="font-display mt-1 text-lg font-bold text-white">
                {campaign.per_clipper_cap_inr
                  ? formatInr(campaign.per_clipper_cap_inr)
                  : "No individual cap"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-silver font-mono uppercase">Min Views to Qualify</span>
              <p className="font-display mt-1 text-lg font-bold text-white">
                {campaign.min_views_to_qualify.toLocaleString("en-IN")} views
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-silver font-mono uppercase">Timeline</span>
              <p className="font-display mt-1 text-sm font-semibold text-white">
                {campaign.ends_at ? `Ends ${formatKolkata(campaign.ends_at)}` : "Ongoing"}
              </p>
            </div>
          </div>

          {/* Two-Column Detail Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Brief, Rules, Disclosures */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Campaign Brief */}
              <section aria-labelledby="brief-heading" className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 id="brief-heading" className="font-display text-xl font-bold tracking-tight text-white uppercase">
                  Campaign Brief
                </h2>
                <div className="mt-4 prose prose-invert max-w-none text-sm text-silver leading-relaxed whitespace-pre-line">
                  {campaign.brief_md}
                </div>
              </section>

              {/* Editing Rules */}
              <section aria-labelledby="rules-heading" className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 id="rules-heading" className="font-display text-xl font-bold tracking-tight text-white uppercase">
                  Editorial & Submission Rules
                </h2>
                <div className="mt-4 prose prose-invert max-w-none text-sm text-silver leading-relaxed whitespace-pre-line">
                  {campaign.rules_md}
                </div>
              </section>

              {/* Tags, Mentions, Disclosures */}
              <section aria-labelledby="tags-heading" className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 id="tags-heading" className="font-display text-xl font-bold tracking-tight text-white uppercase">
                  Required Captions & Mentions
                </h2>
                <div className="mt-4 space-y-4 text-sm">
                  {campaign.required_caption && (
                    <div>
                      <span className="text-xs font-medium text-silver">Suggested Caption:</span>
                      <p className="mt-1 rounded-xl border border-border bg-surface p-3 font-mono text-xs text-white">
                        {campaign.required_caption}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-medium text-silver">Required Hashtags:</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {campaign.required_hashtags.map((tag) => (
                        <span key={tag} className="rounded-full bg-surface border border-border px-3 py-1 font-mono text-xs text-lime">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {campaign.required_mention && (
                    <div>
                      <span className="text-xs font-medium text-silver">Required Account Tag / Mention:</span>
                      <p className="mt-1 font-mono text-xs text-white">
                        {campaign.required_mention}
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-lime/20 bg-lime/5 p-4 text-xs text-silver">
                    <strong className="text-white block font-medium mb-1">
                      ASCI Compliance Notice:
                    </strong>
                    Under India&apos;s ASCI guidelines, every submitted clip must prominently display the #ad or #collab disclosure tag in its primary caption.
                  </div>
                </div>
              </section>

              {/* Rights Affirmation Notice */}
              <section className="rounded-2xl border border-border bg-surface/50 p-6">
                <div className="flex items-start gap-3">
                  <span className="size-2 rounded-full bg-lime shrink-0 mt-1.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Intellectual Property & Rights Certification
                    </h3>
                    <p className="mt-1 text-xs text-silver leading-relaxed">
                      The campaign owner has legally affirmed ownership or distribution rights for all source materials provided in accordance with CIRCLE terms. Clippers are granted a non-exclusive license to edit and publish vertical video exclusively for this campaign.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: How You Get Paid & Top Clips */}
            <div className="flex flex-col gap-8">
              {/* How You Get Paid Box */}
              <section aria-labelledby="paid-heading" className="rounded-2xl border border-border bg-card p-6">
                <h3 id="paid-heading" className="font-display text-lg font-bold tracking-tight text-white uppercase">
                  How You Get Paid
                </h3>
                <ul className="mt-4 space-y-4 text-xs text-silver">
                  <li className="flex items-start gap-3">
                    <span className="font-mono font-bold text-lime">01</span>
                    <div>
                      <strong className="text-white block">Day 7 Single Snapshot:</strong>
                      Views are snapshotted exactly 7 days after submission. Views after day 7 do not accrue additional earnings.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono font-bold text-lime">02</span>
                    <div>
                      <strong className="text-white block">10% Platform Fee:</strong>
                      CIRCLE retains 10% from gross earnings upon lock. Net rate is ₹{campaign.netRateInrPer1k} per 1K views.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono font-bold text-lime">03</span>
                    <div>
                      <strong className="text-white block">Weekly UPI Disbursements:</strong>
                      Withdraw to your UPI ID once your wallet reaches the ₹{CLIPPING_CONFIG.minPayoutInr} minimum threshold.
                    </div>
                  </li>
                </ul>
              </section>

              {/* Top Clips Grid (Hidden when empty) */}
              {topClips.length > 0 && (
                <section aria-labelledby="topclips-heading" className="rounded-2xl border border-border bg-card p-6">
                  <h3 id="topclips-heading" className="font-display text-lg font-bold tracking-tight text-white uppercase">
                    Top Approved Clips
                  </h3>
                  <div className="mt-4 flex flex-col divide-y divide-border">
                    {topClips.map((clip) => (
                      <div key={clip.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                        <div>
                          <p className="font-mono font-medium text-white">{clip.clipper_handle}</p>
                          <span className="text-[11px] text-silver">
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
  );
}
