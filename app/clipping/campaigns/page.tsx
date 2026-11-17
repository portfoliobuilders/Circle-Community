import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { listCampaigns, listTrending, listNew } from "@/lib/clipping/data";
import type { CampaignFilters, CampaignSort, PlatformType } from "@/lib/clipping/types";
import { CampaignCard } from "@/components/clipping/campaign-card";
import { CampaignTabs } from "@/components/clipping/campaign-tabs";
import { CampaignSearch } from "@/components/clipping/campaign-search";
import { DesktopFilterRail, MobileFilterSheet } from "@/components/clipping/campaign-filters";
import { SampleBanner } from "@/components/clipping/sample-banner";
import { CampaignGridSkeleton } from "@/components/clipping/campaign-skeletons";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export const metadata: Metadata = pageMetadata(
  "Clipping Campaigns",
  "Browse active video clipping campaigns for YouTube Shorts and Instagram Reels. Earn per 1,000 verified views with transparent net rates.",
  "/clipping/campaigns"
);

interface PageProps {
  searchParams: Promise<{
    platform?: string;
    category?: string;
    language?: string;
    minRate?: string;
    maxRate?: string;
    budgetLeft?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function CampaignsDiscoverPage({ searchParams }: PageProps) {
  return (
    <>
      <SampleBanner />

      <main className="min-h-screen py-12 md:py-16">
        <Container>
          {/* 1. Header & Server Explainer (Static HTML) */}
          <header className="flex flex-col gap-6 border-b border-border pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-small tracking-[0.18em] text-silver uppercase font-mono">
                  Marketplace Directory
                </p>
                <h1 className="font-display mt-2 text-display-sm sm:text-display font-medium tracking-tight uppercase text-white">
                  Clipping campaigns
                </h1>
                <p className="mt-3 max-w-2xl text-lead text-silver leading-relaxed">
                  Browse funded short-form video campaigns, create approved vertical clips, and get paid per 1,000 verified views.
                </p>
              </div>

              {/* Search Box */}
              <div className="w-full md:w-auto">
                <CampaignSearch />
              </div>
            </div>

            {/* Platform Tabs Suspense Shell */}
            <Suspense fallback={<div className="h-11 w-48 rounded-full bg-card border border-border" />}>
              <CampaignTabsWrapper searchParams={searchParams} />
            </Suspense>
          </header>

          {/* 2. Main Dynamic Content Layout */}
          <Suspense
            fallback={
              <div className="mt-8 flex flex-col lg:flex-row gap-8 items-start">
                <div className="hidden lg:block w-72 h-96 rounded-2xl bg-card border border-border animate-pulse" />
                <div className="flex-1 w-full">
                  <CampaignGridSkeleton count={6} />
                </div>
              </div>
            }
          >
            <CampaignsContent searchParams={searchParams} />
          </Suspense>
        </Container>
      </main>
    </>
  );
}

async function CampaignTabsWrapper({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <CampaignTabs currentPlatform={params.platform || "all"} />
    </div>
  );
}

async function CampaignsContent({ searchParams }: PageProps) {
  const params = await searchParams;

  const currentPlatform = params.platform || "all";
  const currentCategory = params.category;
  const currentLanguage = params.language;
  const minRate = params.minRate ? Number(params.minRate) : undefined;
  const maxRate = params.maxRate ? Number(params.maxRate) : undefined;
  const hasBudgetLeft = params.budgetLeft === "true";
  const sort = (params.sort as CampaignSort) || "newest";
  const q = params.q;

  const filters: CampaignFilters = {
    platform: currentPlatform === "all" ? "all" : (currentPlatform as PlatformType),
    category: currentCategory,
    language: currentLanguage,
    minRate,
    maxRate,
    hasBudgetLeft,
    q,
  };

  const { campaigns, total } = await listCampaigns(filters, sort);
  const trending = await listTrending();
  const recent = await listNew();

  const isFiltered = Boolean(
    q ||
      currentCategory ||
      currentLanguage ||
      minRate !== undefined ||
      maxRate !== undefined ||
      hasBudgetLeft ||
      currentPlatform !== "all" ||
      sort !== "newest"
  );

  const promotedCampaigns = CLIPPING_CONFIG.promotedSlots.enabled
    ? campaigns.filter((c) => c.isPromoted)
    : [];

  if (campaigns.length === 0) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto flex flex-col items-center">
        <div className="size-16 rounded-full border border-border bg-card flex items-center justify-center text-silver mb-4">
          <span className="font-mono text-xl text-silver">0</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">
          No live campaigns yet
        </h2>
        <p className="mt-2 text-sm text-silver leading-relaxed max-w-md">
          New verified campaigns are approved and funded on an ongoing basis. Subscribe to receive an alert when new campaigns launch.
        </p>

        {/* Newsletter subscribe */}
        <div className="mt-6 w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-lime font-mono">
            Get Notified
          </span>
          <p className="mt-1 text-xs text-silver mb-4">
            Receive email alerts when high-budget campaigns open for submissions.
          </p>
          <NewsletterForm source="clipping" tone="lime" />
        </div>

        {/* Launch link */}
        <div className="mt-8 flex items-center gap-2 text-sm text-silver">
          <span>Want to commission short clips for your brand?</span>
          <Link
            href="/brands"
            className="font-medium text-lime hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Launch a campaign
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8 items-start">
      {/* Desktop Filter Rail */}
      <DesktopFilterRail />

      {/* Mobile Filter Trigger Sheet */}
      <MobileFilterSheet />

      {/* Right Content Area */}
      <div className="flex-1 w-full flex flex-col gap-12" id="campaign-list">
        {/* Section A: Promoted Campaigns (Only if enabled in config) */}
        {CLIPPING_CONFIG.promotedSlots.enabled && promotedCampaigns.length > 0 && (
          <section aria-labelledby="promoted-heading" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-lime animate-pulse" />
              <h2
                id="promoted-heading"
                className="font-display text-xl font-bold tracking-tight text-white uppercase"
              >
                Promoted Campaigns
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {promotedCampaigns.map((c) => (
                <CampaignCard key={`promo-${c.id}`} campaign={c} showPromotedBadge={true} />
              ))}
            </div>
          </section>
        )}

        {/* If filtered or searched, display filtered section */}
        {isFiltered ? (
          <section aria-labelledby="filtered-heading" className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2
                id="filtered-heading"
                className="font-display text-xl font-bold tracking-tight text-white uppercase"
              >
                Filtered Results ({total})
              </h2>
              <span className="text-xs text-silver">
                Showing matches for selected filters
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {campaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Section B: Trending this week */}
            {trending.length > 0 && (
              <section aria-labelledby="trending-heading" className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2
                    id="trending-heading"
                    className="font-display text-xl font-bold tracking-tight text-white uppercase"
                  >
                    Trending this week
                  </h2>
                  <span className="text-xs text-silver font-mono">
                    Highest activity
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {trending.map((c) => (
                    <CampaignCard key={`trending-${c.id}`} campaign={c} />
                  ))}
                </div>
              </section>
            )}

            {/* Section C: New campaigns */}
            {recent.length > 0 && (
              <section aria-labelledby="new-heading" className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2
                    id="new-heading"
                    className="font-display text-xl font-bold tracking-tight text-white uppercase"
                  >
                    New campaigns
                  </h2>
                  <span className="text-xs text-silver font-mono">
                    Recently funded
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recent.map((c) => (
                    <CampaignCard key={`new-${c.id}`} campaign={c} />
                  ))}
                </div>
              </section>
            )}

            {/* Section D: All campaigns */}
            <section aria-labelledby="all-heading" className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2
                  id="all-heading"
                  className="font-display text-xl font-bold tracking-tight text-white uppercase"
                >
                  All campaigns ({total})
                </h2>
                <span className="text-xs text-silver font-mono">
                  Directory index
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {campaigns.map((c) => (
                  <CampaignCard key={`all-${c.id}`} campaign={c} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
