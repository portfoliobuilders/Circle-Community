import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { notFound } from "next/navigation"

import { ReportForm } from "@/components/reports/report-form"
import { Container } from "@/components/site/container"
import { SharedCardTransition } from "@/components/ui-motion/shared-element"
import { MagneticButton } from "@/components/ui-motion/magnetic-button"
import { categoryLabel } from "@/lib/content/categories"
import { getProfileCard } from "@/lib/data/marketplace"
import { followerLabel, formatInr } from "@/lib/format"
import { pageMetadata } from "@/lib/seo"
import { ArrowLeft, CheckCircle2, Globe, MapPin, ShieldCheck, Tag } from "lucide-react"
import { InstagramIcon, YouTubeIcon } from "@/components/site/social-icons"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { row } = await getProfileCard(id)
  if (!row) return pageMetadata("Profile", "A CIRCLE profile.", "/directory")
  return pageMetadata(row.display_name, row.bio ?? "A CIRCLE profile.", `/directory/${id}`)
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <p className="text-silver">Loading profile.</p>
        </Container>
      }
    >
      <ProfileDetail params={params} />
    </Suspense>
  )
}

async function ProfileDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { row, error } = await getProfileCard(id)
  if (!row && !error) notFound()
  if (!row) {
    return (
      <Container className="py-16">
        <p className="text-silver">{error}</p>
      </Container>
    )
  }

  const isVerified = row.follower_status === "verified" || row.follower_status === "audited"
  const isPromoter = row.role === "creator" && (row.follower_count ?? 0) >= 1000

  const initials = row.display_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const openFits = [
    row.open_to_collab ? "Collabs" : null,
    row.open_to_ads ? "Sponsored Ads" : null,
    row.open_to_giveaway ? "Giveaways" : null,
    row.open_to_affiliate ? "Affiliate Offers" : null,
  ].filter(Boolean)

  return (
    <Container className="py-12 sm:py-20">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-xs font-mono text-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to directory</span>
        </Link>
      </div>

      <SharedCardTransition layoutId={`creator-${row.id}`}>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          {/* Top Profile Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-border">
            <div className="flex items-center gap-5">
              <div className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-xl sm:text-2xl font-mono font-medium text-white">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono tracking-wider uppercase text-silver">
                    {row.role === "brand" ? "Brand Partner" : "Creator"}
                  </span>
                  {isPromoter && (
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium ${
                      isVerified ? "border-lime/30 bg-lime/10 text-lime" : "border-border bg-surface text-silver"
                    }`}>
                      {isVerified ? "Promoter · Verified" : "Promoter"}
                    </span>
                  )}
                </div>
                <h1 className="font-display mt-2 text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white uppercase">
                  {row.display_name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-silver">
                  <span>{categoryLabel(row.category) ?? "Creator"}</span>
                  {row.city && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-silver" />
                        {row.city}
                      </span>
                    </>
                  )}
                  {row.follower_count != null && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-white font-medium">
                        {row.follower_count.toLocaleString("en-IN")} followers
                      </span>
                      {isVerified && <CheckCircle2 className="size-3 text-lime" />}
                      <span className="text-[11px] text-silver">
                        ({followerLabel(row.follower_status).toLowerCase()})
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <MagneticButton href="/collabs/new" variant="primary">
                Send collab brief
              </MagneticButton>
            </div>
          </div>

          {/* Profile Specs Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Bio & Deliverables (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {row.content_summary && (
                <div>
                  <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
                    Content Focus & Niche
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-white leading-relaxed whitespace-pre-wrap">
                    {row.content_summary}
                  </p>
                </div>
              )}

              {row.bio && (
                <div>
                  <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-silver">
                    About
                  </h2>
                  <p className="mt-2 text-sm text-silver leading-relaxed whitespace-pre-wrap">
                    {row.bio}
                  </p>
                </div>
              )}

              {/* Social Channels */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-silver">
                  Verified Channels
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {row.instagram_url?.startsWith("https://") && (
                    <a
                      href={row.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-silver hover:border-silver hover:text-white transition-colors"
                    >
                      <InstagramIcon className="size-3.5 text-lime" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {row.youtube_url?.startsWith("https://") && (
                    <a
                      href={row.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-silver hover:border-silver hover:text-white transition-colors"
                    >
                      <YouTubeIcon className="size-3.5 text-lime" />
                      <span>YouTube</span>
                    </a>
                  )}
                  {row.other_url?.startsWith("https://") && (
                    <a
                      href={row.other_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-silver hover:border-silver hover:text-white transition-colors"
                    >
                      <Globe className="size-3.5 text-lime" />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Work Formats */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-silver">
                  Open to Opportunities
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {openFits.length > 0 ? (
                    openFits.map((fit) => (
                      <span
                        key={fit}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-silver"
                      >
                        {fit}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-silver">No preferences specified.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Rate Card & Escrow Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-xl border border-border bg-surface p-6">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
                  Commercial Rate Card
                </span>

                <div className="mt-4">
                  {row.offers_services && row.service_title ? (
                    <div>
                      <p className="text-sm font-medium text-white">{row.service_title}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-xs text-silver">Starting from</span>
                        <span className="font-mono text-2xl font-bold text-white">
                          {row.price_from_inr != null ? formatInr(row.price_from_inr) : "Price on enquiry"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-silver">Starting rate</span>
                        <span className="font-mono text-2xl font-bold text-white">
                          {row.price_from_inr != null ? formatInr(row.price_from_inr) : "On enquiry"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-silver">
                        Commercial rates vary by deliverable requirements and licensing terms.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border space-y-2 text-xs text-silver">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="size-4 text-lime" />
                    <span className="font-medium">10% Platform Fee Model</span>
                  </div>
                  <p className="leading-relaxed">
                    Collab agreements disburse through CIRCLE milestone escrow. Payouts carry a transparent 10% platform fee upon approved delivery.
                  </p>
                </div>

                <div className="mt-6">
                  <MagneticButton href="/collabs/new" variant="primary" className="w-full justify-center">
                    Send collab brief
                  </MagneticButton>
                </div>
              </div>

              {/* Moderation */}
              <div className="rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex items-center gap-2 text-xs font-mono text-silver uppercase">
                  <Tag className="size-3.5 text-silver" />
                  <span>Verified Profile</span>
                </div>
                <p className="mt-2 text-xs text-silver leading-relaxed">
                  Notice inaccurate follower claims or suspicious activity? File a report for manual team review.
                </p>
                <div className="mt-3">
                  <ReportForm targetType="profile" targetId={row.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SharedCardTransition>
    </Container>
  )
}
