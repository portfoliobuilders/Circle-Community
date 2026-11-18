"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, RotateCcw, ArrowRight } from "lucide-react";
import { CampaignCard } from "@/components/clipping/campaign-card";
import type { Campaign, PlatformType } from "@/lib/clipping/types";
import { cn } from "cn";

interface HubCampaignsExplorerProps {
  initialCampaigns: Campaign[];
}

export function HubCampaignsExplorer({ initialCampaigns }: HubCampaignsExplorerProps) {
  const [platform, setPlatform] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialCampaigns.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["all", ...Array.from(set).sort()];
  }, [initialCampaigns]);

  // Counts per platform
  const counts = useMemo(() => {
    const ytCount = initialCampaigns.filter((c) =>
      c.platforms.includes("youtube_shorts" as PlatformType)
    ).length;
    const igCount = initialCampaigns.filter((c) =>
      c.platforms.includes("instagram_reels" as PlatformType)
    ).length;
    return {
      all: initialCampaigns.length,
      youtube_shorts: ytCount,
      instagram_reels: igCount,
    };
  }, [initialCampaigns]);

  // Filtered campaigns
  const filtered = useMemo(() => {
    return initialCampaigns.filter((c) => {
      // Platform filter
      if (platform !== "all" && !c.platforms.includes(platform as PlatformType)) {
        return false;
      }
      // Category filter
      if (
        selectedCategory !== "all" &&
        c.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesSummary = c.summary.toLowerCase().includes(q);
        const matchesOwner = c.owner_name.toLowerCase().includes(q);
        const matchesCat = c.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesOwner && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [initialCampaigns, platform, selectedCategory, searchQuery]);

  function handleReset() {
    setPlatform("all");
    setSelectedCategory("all");
    setSearchQuery("");
  }

  const isFiltered = platform !== "all" || selectedCategory !== "all" || searchQuery.trim() !== "";

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Filter & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        {/* Platform Selector Tabs */}
        <div
          role="tablist"
          aria-label="Filter campaigns by platform"
          className="inline-flex w-fit items-center gap-1 rounded-full border border-border bg-card p-1 text-xs"
        >
          <button
            role="tab"
            aria-selected={platform === "all"}
            onClick={() => setPlatform("all")}
            className={cn(
              "min-h-9 rounded-full px-4 font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
              platform === "all"
                ? "bg-lime text-bg shadow-sm font-semibold"
                : "text-silver hover:text-white hover:bg-surface/50"
            )}
          >
            All Platforms ({counts.all})
          </button>
          <button
            role="tab"
            aria-selected={platform === "youtube_shorts"}
            onClick={() => setPlatform("youtube_shorts")}
            className={cn(
              "min-h-9 rounded-full px-4 font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
              platform === "youtube_shorts"
                ? "bg-lime text-bg shadow-sm font-semibold"
                : "text-silver hover:text-white hover:bg-surface/50"
            )}
          >
            YouTube Shorts ({counts.youtube_shorts})
          </button>
          <button
            role="tab"
            aria-selected={platform === "instagram_reels"}
            onClick={() => setPlatform("instagram_reels")}
            className={cn(
              "min-h-9 rounded-full px-4 font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
              platform === "instagram_reels"
                ? "bg-lime text-bg shadow-sm font-semibold"
                : "text-silver hover:text-white hover:bg-surface/50"
            )}
          >
            Instagram Reels ({counts.instagram_reels})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <label htmlFor="hub-campaign-search" className="sr-only">
            Search active campaigns
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-silver"
          />
          <input
            id="hub-campaign-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, brands..."
            className="w-full min-h-10 rounded-full border border-border bg-card pl-9 pr-4 text-xs text-text placeholder:text-silver/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          />
        </div>
      </div>

      {/* 2. Category Filter Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="shrink-0 text-silver font-mono text-[11px] uppercase tracking-wider mr-1">
          Category:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          const label = cat === "all" ? "All Categories" : cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "shrink-0 min-h-8 rounded-full px-3.5 text-xs font-medium border transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
                isActive
                  ? "border-lime bg-lime/10 text-lime font-semibold"
                  : "border-border bg-surface text-silver hover:text-white hover:border-silver/40"
              )}
            >
              {label}
            </button>
          );
        })}
        {isFiltered && (
          <button
            onClick={handleReset}
            className="shrink-0 inline-flex items-center gap-1 min-h-8 rounded-full px-3 text-xs text-silver hover:text-white underline underline-offset-4 ml-2"
          >
            <RotateCcw className="size-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* 3. Campaign Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="font-display text-lg font-medium text-white">
            No campaigns match your selected filters
          </p>
          <p className="mt-2 text-sm text-silver max-w-md mx-auto">
            Try adjusting your platform, category, or search term to see more active briefs.
          </p>
          <button
            onClick={handleReset}
            className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full bg-surface border border-border px-5 text-xs font-medium text-white hover:bg-bg transition-colors"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* 4. Advanced Directory Footer Link */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border bg-surface/40 p-5">
        <div>
          <p className="text-sm font-medium text-white">
            Showing {filtered.length} of {initialCampaigns.length} verified campaigns
          </p>
          <p className="text-xs text-silver mt-0.5">
            Looking for specific payout rates, language requirements, or remaining budgets?
          </p>
        </div>
        <Link
          href="/clipping/campaigns"
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-5 text-xs font-semibold tracking-wide text-lime hover:bg-lime hover:text-bg transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <span>Open advanced filter board</span>
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
