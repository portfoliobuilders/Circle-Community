import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { notFound } from "next/navigation"

import { ApplicationActions } from "@/components/collabs/application-actions"
import { ApplyForm } from "@/components/collabs/apply-form"
import { ReportForm } from "@/components/reports/report-form"
import { Container } from "@/components/site/container"
import { SharedCardTransition } from "@/components/ui-motion/shared-element"
import { getCollab, getOwnProfile, listApplications } from "@/lib/data/marketplace"
import { formatInr, formatKolkata } from "@/lib/format"
import { pageMetadata } from "@/lib/seo"
import { ArrowLeft, ShieldCheck, Tag, Clock } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { row } = await getCollab(id)
  if (!row) return pageMetadata("Collab", "A CIRCLE collab brief.", "/collabs")
  return pageMetadata(row.title, row.summary, `/collabs/${id}`)
}

export default function CollabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <p className="text-silver">Loading collab brief.</p>
        </Container>
      }
    >
      <CollabDetail params={params} />
    </Suspense>
  )
}

const kindBadges: Record<string, { label: string; class: string }> = {
  fixed: { label: "Fixed Rate", class: "border-border text-silver bg-surface" },
  open_bid: { label: "Open Bid", class: "border-lime/30 text-lime bg-lime/10" },
  barter: { label: "Barter Offer", class: "border-border text-white bg-surface" },
}

async function CollabDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { row, error } = await getCollab(id)
  if (!row && !error) notFound()
  if (!row) {
    return (
      <Container className="py-16">
        <p className="text-silver">{error}</p>
      </Container>
    )
  }

  const { userId, profile } = await getOwnProfile()
  const isBrand = profile?.id === row.brand_id
  const { rows: applications } =
    isBrand || profile?.role === "creator" ? await listApplications(id) : { rows: [] }

  const badge = kindBadges[row.kind] || {
    label: row.kind.replace("_", " "),
    class: "border-border text-silver bg-surface",
  }

  const grossBudget = row.budget_inr
  const feeInr = grossBudget != null ? Math.round(grossBudget * 0.1) : null
  const netInr = grossBudget != null && feeInr != null ? grossBudget - feeInr : null

  return (
    <Container className="py-12 sm:py-20">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/collabs"
          className="inline-flex items-center gap-2 text-xs font-mono text-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to all collabs</span>
        </Link>
      </div>

      <SharedCardTransition layoutId={`collab-${row.id}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Scope & Application (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${badge.class}`}>
                  {badge.label}
                </span>
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-mono text-silver uppercase">
                  {row.status}
                </span>
              </div>

              <h1 className="font-display mt-4 text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white uppercase">
                {row.title}
              </h1>

              <div className="mt-6 pt-6 border-t border-border">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
                  Deliverable Summary
                </h2>
                <p className="mt-3 text-silver whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {row.summary}
                </p>
              </div>

              {row.ad_disclosure && (
                <div className="mt-6 rounded-xl border border-border bg-surface p-4 flex items-start gap-3">
                  <ShieldCheck className="size-4 text-lime shrink-0 mt-0.5" />
                  <div className="text-xs text-silver">
                    <span className="font-semibold text-white">ASCI Disclosure Required: </span>
                    All deliverables published under this collab must feature prominent #ad or #collab disclosures in compliance with ASCI influencer guidelines.
                  </div>
                </div>
              )}
            </div>

            {/* Creator Application Section */}
            {profile?.role === "creator" && row.status === "open" ? (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-xl font-medium text-white uppercase">
                  Submit Collab Pitch
                </h2>
                <p className="mt-2 text-xs text-silver">
                  Propose your timeline and content angle. Your pitch is shared only with the brand owner.
                </p>
                <div className="mt-6">
                  <ApplyForm collabId={row.id} kind={row.kind} />
                </div>
              </div>
            ) : null}

            {!userId ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-silver">
                  <Link className="text-white underline font-medium hover:text-lime" href="/login">
                    Sign in to your creator account
                  </Link>{" "}
                  to apply for this brief.
                </p>
              </div>
            ) : null}

            {/* Brand Owner Applications Section */}
            {isBrand ? (
              <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-medium text-white uppercase">
                    Received Pitches
                  </h2>
                  <span className="text-xs font-mono text-silver">
                    {applications.length} total
                  </span>
                </div>

                {applications.length === 0 ? (
                  <p className="mt-4 text-sm text-silver">
                    No creator pitches received yet. We will notify you when proposals arrive.
                  </p>
                ) : null}

                <ul className="mt-6 space-y-4">
                  {applications.map((application) => (
                    <li key={application.id} className="rounded-xl border border-border bg-surface p-5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="rounded-full border border-border px-2 py-0.5 uppercase text-silver">
                          {application.status}
                        </span>
                        {application.bid_inr != null ? (
                          <span className="font-semibold text-white">
                            Proposed: {formatInr(application.bid_inr)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm text-silver whitespace-pre-wrap leading-relaxed">
                        {application.pitch}
                      </p>
                      {application.status === "pending" ? (
                        <div className="mt-4 pt-3 border-t border-border">
                          <ApplicationActions applicationId={application.id} collabId={row.id} />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          {/* Right Column: Compensation & Escrow Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
                Compensation Breakdown
              </span>

              {grossBudget != null ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <span className="text-xs text-silver">Gross Campaign Budget</span>
                    <p className="font-mono text-3xl font-bold text-white mt-1">
                      {formatInr(grossBudget)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-silver">
                      <span>CIRCLE Platform Fee (10%)</span>
                      <span className="font-mono">{formatInr(feeInr ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-white font-medium pt-2 border-t border-border">
                      <span>Net Creator Payout</span>
                      <span className="font-mono text-lime">{formatInr(netInr ?? 0)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-silver leading-relaxed">
                    100% of approved milestone funds are held in escrow. Payouts disburse directly via bank transfer upon deliverable verification.
                  </p>
                </div>
              ) : row.barter_offer ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-silver text-xs">
                    <Tag className="size-4 text-lime" />
                    <span>Barter Deliverable Exchange</span>
                  </div>
                  <p className="text-lg font-medium text-white">
                    {row.barter_offer}
                  </p>
                  <p className="text-xs text-silver">
                    Brand will provide product samples and shipment tracking details upon agreement.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-silver">
                    Open bid collab. Propose your rate in the pitch form.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-silver font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-silver" />
                  <span>Posted</span>
                </span>
                <span>{formatKolkata(row.created_at)}</span>
              </div>
            </div>

            {/* Moderation & Report */}
            <div className="rounded-2xl border border-border bg-surface/50 p-6">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-silver">
                Trust & Moderation
              </h3>
              <p className="mt-2 text-xs text-silver leading-relaxed">
                Brand identities and deliverables are moderated by CIRCLE. Suspicious briefs or fee evasion attempts should be reported immediately.
              </p>
              <div className="mt-4">
                <ReportForm targetType="collab" targetId={row.id} />
              </div>
            </div>
          </div>
        </div>
      </SharedCardTransition>
    </Container>
  )
}
