import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/site/container";
import { noIndex } from "@/lib/seo";
import { getOwnProfile } from "@/lib/data/marketplace";
import { getOwnerCampaigns } from "@/lib/clipping/data";
import { formatInr, formatKolkata } from "@/lib/format";
import { BudgetRing } from "@/components/clipping/budget-ring";

export const metadata: Metadata = {
  title: "Brand Campaigns Hub",
  description: "Manage your video clipping and PR campaigns, review clip submissions, and monitor budget spend.",
  robots: noIndex,
};

export default function OwnerCampaignsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/clipping"
              className="text-xs uppercase tracking-widest text-silver hover:text-text transition"
            >
              ← Clipper Studio
            </Link>
            <span className="text-xs text-border-strong">/</span>
            <span className="text-xs uppercase tracking-widest text-lime">Campaigns Hub</span>
          </div>
          <h1 className="font-display mt-1 text-display-sm font-medium uppercase tracking-tight text-text sm:text-display">
            Campaigns Hub
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/clipping/campaigns/new"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90"
          >
            + Create Campaign
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-32 animate-pulse rounded-2xl border border-border bg-surface/50" />
              <div className="h-32 animate-pulse rounded-2xl border border-border bg-surface/50" />
            </div>
          }
        >
          <OwnerCampaignsList />
        </Suspense>
      </div>
    </Container>
  );
}

async function OwnerCampaignsList() {
  const { userId, error } = await getOwnProfile();

  if (!userId) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
        <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
          Sign In to Manage Brand Campaigns
        </h2>
        <p className="mx-auto mt-2 max-w-md text-small text-silver">
          Brands and creators can launch pay-per-view video clipping campaigns, review submissions, and fund escrow with zero commission fraud risk.
        </p>
        <div className="mt-6">
          <Link
            href="/login?next=/dashboard/clipping/campaigns"
            className="inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-silver">
        <p>{error}</p>
      </div>
    );
  }

  const campaigns = await getOwnerCampaigns(userId);

  if (campaigns.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-border text-2xl">
          🎬
        </div>
        <h3 className="font-display mt-4 text-lead font-medium uppercase tracking-tight text-text">
          No Campaigns Created Yet
        </h3>
        <p className="mx-auto mt-2 max-w-md text-small text-silver">
          Launch your first campaign to recruit talented video editors who will slice your long-form podcasts, webinars, or brand videos into viral vertical clips.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/clipping/campaigns/new"
            className="inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90"
          >
            Create Your First Campaign
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((camp) => {
        const statusColors: Record<string, string> = {
          draft: "bg-surface text-silver border-border",
          pending_review: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
          approved: "bg-blue-500/10 text-blue-400 border-blue-500/30",
          funded: "bg-lime/10 text-lime border-lime/30",
          live: "bg-lime/15 text-lime border-lime/40",
          paused: "bg-surface text-silver border-border",
          completed: "bg-surface text-silver border-border",
          rejected: "bg-red-500/10 text-red-400 border-red-500/30",
        };

        const statusBadges: Record<string, string> = {
          draft: "Draft",
          pending_review: "Pending Review",
          approved: "Approved · Awaiting Funding",
          funded: "Funded · Starting Soon",
          live: "Live & Active",
          paused: "Paused",
          completed: "Completed",
          rejected: "Rejected",
        };

        return (
          <div
            key={camp.id}
            className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong sm:p-7"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${
                      statusColors[camp.status] || statusColors.draft
                    }`}
                  >
                    {statusBadges[camp.status] || camp.status}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs font-mono uppercase text-silver">
                    {camp.campaign_type === "social_pr" ? "Social PR" : "Clipping"}
                  </span>
                  <span className="text-xs text-silver">
                    Created {formatKolkata(camp.created_at)}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight text-text">
                    <Link
                      href={`/dashboard/clipping/campaigns/${camp.id}`}
                      className="hover:text-lime transition"
                    >
                      {camp.title}
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 max-w-2xl text-small text-silver">
                    {camp.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-silver">
                  <span>
                    Rate: <strong className="text-text">{formatInr(camp.rate_inr_per_1k)}</strong> / 1K views
                  </span>
                  <span>•</span>
                  <span>
                    Platforms:{" "}
                    <strong className="text-text capitalize">
                      {camp.platforms.map((p) => p.replace("_", " ")).join(", ")}
                    </strong>
                  </span>
                  {camp.status === "approved" ? (
                    <span className="text-amber-400 font-medium">
                      ⚠️ Action required: Complete invoice payment to go live.
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Budget Progress & Actions */}
              <div className="flex flex-col items-start gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between lg:border-t-0 lg:pt-0">
                <div className="flex items-center gap-4">
                  <BudgetRing usedPct={camp.budgetUsedPct} size={56} strokeWidth={5} />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-silver">Budget Used</p>
                    <p className="font-display text-base font-semibold text-text">
                      {formatInr(camp.budget_reserved_inr + camp.budget_paid_inr)}{" "}
                      <span className="text-xs font-normal text-silver">/ {formatInr(camp.budget_inr)}</span>
                    </p>
                    <p className="text-xs text-silver">{camp.budgetUsedPct}% reserved/spent</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/clipping/campaigns/${camp.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-surface border border-border px-5 text-sm font-medium text-text transition hover:border-lime"
                  >
                    Review Clips
                  </Link>
                  <Link
                    href={`/clipping/campaigns/${camp.slug}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-bg px-4 text-xs font-medium text-silver transition hover:text-text"
                  >
                    Public Page ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
