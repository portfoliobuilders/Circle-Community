import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { sampleCampaigns, sampleTopClips } from "./sample-data";
import type { Campaign, CampaignFilters, CampaignSort, PlatformType, TopClip } from "./types";

export function isSampleData(): boolean {
  return process.env.NODE_ENV !== "production";
}

export async function listCampaigns(
  filters?: CampaignFilters,
  sort: CampaignSort = "newest"
): Promise<{ campaigns: Campaign[]; total: number }> {
  if (process.env.NODE_ENV === "production") {
    return { campaigns: [], total: 0 };
  }

  let results = [...sampleCampaigns];

  // Apply promoted flag if enabled
  if (CLIPPING_CONFIG.promotedSlots.enabled) {
    // Only mark promoted if config enables it
    results = results.map((c, i) => ({
      ...c,
      isPromoted: i < CLIPPING_CONFIG.promotedSlots.slotCount,
    }));
  } else {
    results = results.map((c) => ({
      ...c,
      isPromoted: false,
    }));
  }

  // Filters
  if (filters?.q) {
    const qLower = filters.q.toLowerCase().trim();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(qLower) ||
        c.summary.toLowerCase().includes(qLower) ||
        c.owner_name.toLowerCase().includes(qLower) ||
        c.category.toLowerCase().includes(qLower)
    );
  }

  if (filters?.category && filters.category !== "all") {
    results = results.filter(
      (c) => c.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters?.language && filters.language !== "all") {
    results = results.filter(
      (c) => c.language.toLowerCase() === filters.language!.toLowerCase()
    );
  }

  if (filters?.platform && filters.platform !== "all") {
    const targetPlatform = filters.platform as PlatformType;
    results = results.filter((c) => c.platforms.includes(targetPlatform));
  }

  if (filters?.minRate !== undefined) {
    results = results.filter((c) => c.rate_inr_per_1k >= filters.minRate!);
  }

  if (filters?.maxRate !== undefined) {
    results = results.filter((c) => c.rate_inr_per_1k <= filters.maxRate!);
  }

  if (filters?.hasBudgetLeft) {
    results = results.filter((c) => c.budgetLeftInr > 0);
  }

  // Sort
  if (sort === "highest_rate") {
    results.sort((a, b) => b.rate_inr_per_1k - a.rate_inr_per_1k);
  } else if (sort === "most_budget_left") {
    results.sort((a, b) => b.budgetLeftInr - a.budgetLeftInr);
  } else {
    // Default: newest
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return { campaigns: results, total: results.length };
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const campaign = sampleCampaigns.find((c) => c.slug === slug);
  if (!campaign) return null;

  return {
    ...campaign,
    isPromoted: CLIPPING_CONFIG.promotedSlots.enabled ? campaign.isPromoted : false,
  };
}

export async function listTrending(): Promise<Campaign[]> {
  if (process.env.NODE_ENV === "production") {
    return [];
  }

  const trending = [...sampleCampaigns]
    .filter((c) => c.status === "live")
    .sort((a, b) => b.approvedClipCount - a.approvedClipCount)
    .slice(0, 3);

  return trending.map((c) => ({
    ...c,
    isPromoted: CLIPPING_CONFIG.promotedSlots.enabled ? c.isPromoted : false,
  }));
}

export async function listNew(): Promise<Campaign[]> {
  if (process.env.NODE_ENV === "production") {
    return [];
  }

  const recent = [...sampleCampaigns]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return recent.map((c) => ({
    ...c,
    isPromoted: CLIPPING_CONFIG.promotedSlots.enabled ? c.isPromoted : false,
  }));
}

export async function getTopClips(campaignId: string): Promise<TopClip[]> {
  if (process.env.NODE_ENV === "production") {
    return [];
  }

  return sampleTopClips[campaignId] || [];
}
