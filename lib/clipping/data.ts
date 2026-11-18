import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAnonClient, createSessionClient } from "@/lib/supabase/server";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { sampleCampaigns, sampleTopClips } from "./sample-data";
import type {
  Campaign,
  CampaignFilters,
  CampaignSort,
  CampaignStatus,
  ClipSubmission,
  CreatorPlatform,
  PayoutRequest,
  PlatformType,
  PrApplication,
  PrDeliverable,
  SourceLink,
  SubmissionStatus,
  TopClip,
  WalletSummary,
} from "./types";

export interface CampaignDbRow {
  id: string;
  slug: string;
  owner_id: string;
  owner?: { display_name?: string | null } | null;
  campaign_type?: "clipping" | "social_pr" | null;
  title: string;
  summary: string;
  brief_md: string;
  rules_md?: string | null;
  category: string;
  language?: string | null;
  source_links?: SourceLink[] | null;
  asset_folder_url?: string | null;
  platforms?: PlatformType[] | null;
  rate_inr_per_1k?: number | null;
  budget_inr?: number | null;
  owner_fee_inr?: number | null;
  budget_reserved_inr?: number | null;
  budget_paid_inr?: number | null;
  per_clip_view_cap?: number | null;
  per_clipper_cap_inr?: number | null;
  min_views_to_qualify?: number | null;
  required_caption?: string | null;
  required_hashtags?: string[] | null;
  required_mention?: string | null;
  required_link?: string | null;
  disclosure_required?: boolean | null;
  rights_confirmed_at?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  status?: CampaignStatus | null;
  funded_at?: string | null;
  funded_ref?: string | null;
  cover_path?: string | null;
  created_at: string;
  deliverable_type?: "reel" | "post" | "carousel" | "story" | "short" | null;
  fee_per_post_inr?: number | null;
  slots?: number | null;
  pricing_mode?: "fixed" | "quote" | null;
  min_followers?: number | null;
  max_followers?: number | null;
  niches?: string[] | null;
  cities?: string[] | null;
  content_approval_required?: boolean | null;
  subject_type?: "brand" | "individual" | null;
  subject_consent_confirmed_at?: string | null;
}

export interface SubmissionDbRow {
  id: string;
  campaign_id: string;
  campaign?: { id: string; title: string } | null;
  clipper_id: string;
  clipper?: { display_name?: string | null } | null;
  platform: PlatformType;
  post_url: string;
  post_id_normalised: string;
  platform_account_id: string;
  posted_at?: string | null;
  status: SubmissionStatus;
  reject_reason?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  earnings?: ClipSubmission["earnings"];
}

export function isSampleData(): boolean {
  return !isSupabaseConfigured();
}

function mapCampaignRow(row: CampaignDbRow, isPromoted = false): Campaign {
  const budgetInr = row.budget_inr || 0;
  const budgetReserved = row.budget_reserved_inr || 0;
  const budgetPaid = row.budget_paid_inr || 0;
  const budgetLeft = Math.max(0, budgetInr - budgetReserved);
  const budgetUsedPct = budgetInr > 0 ? Math.min(100, Math.round(((budgetReserved + budgetPaid) / budgetInr) * 100)) : 0;
  const rateInr = row.rate_inr_per_1k || 10;
  const netRate = rateInr - Math.floor((rateInr * CLIPPING_CONFIG.clipperFeePct) / 100);

  return {
    id: row.id,
    slug: row.slug,
    owner_id: row.owner_id,
    owner_name: row.owner?.display_name || "Verified Brand",
    owner_avatar_url: null,
    campaign_type: row.campaign_type || "clipping",
    title: row.title,
    summary: row.summary,
    brief_md: row.brief_md,
    rules_md: row.rules_md || "",
    category: row.category,
    language: row.language || "en",
    source_links: row.source_links || [],
    asset_folder_url: row.asset_folder_url || null,
    platforms: row.platforms || ["youtube_shorts"],
    rate_inr_per_1k: rateInr,
    budget_inr: budgetInr,
    owner_fee_inr: row.owner_fee_inr || 0,
    budget_reserved_inr: budgetReserved,
    budget_paid_inr: budgetPaid,
    per_clip_view_cap: row.per_clip_view_cap || 100000,
    per_clipper_cap_inr: row.per_clipper_cap_inr || null,
    min_views_to_qualify: row.min_views_to_qualify || 1000,
    required_caption: row.required_caption || null,
    required_hashtags: row.required_hashtags || [],
    required_mention: row.required_mention || null,
    required_link: row.required_link || null,
    disclosure_required: row.disclosure_required ?? true,
    rights_confirmed_at: row.rights_confirmed_at || null,
    starts_at: row.starts_at || null,
    ends_at: row.ends_at || null,
    status: row.status || "live",
    funded_at: row.funded_at || null,
    funded_ref: row.funded_ref || null,
    cover_path: row.cover_path || null,
    created_at: row.created_at,

    deliverable_type: row.deliverable_type || null,
    fee_per_post_inr: row.fee_per_post_inr || null,
    slots: row.slots || null,
    pricing_mode: row.pricing_mode || null,
    min_followers: row.min_followers || null,
    max_followers: row.max_followers || null,
    niches: row.niches || [],
    cities: row.cities || [],
    content_approval_required: row.content_approval_required || false,
    subject_type: row.subject_type || null,
    subject_consent_confirmed_at: row.subject_consent_confirmed_at || null,

    budgetLeftInr: budgetLeft,
    budgetUsedPct,
    approvedClipCount: 0,
    netRateInrPer1k: netRate,
    isPromoted: CLIPPING_CONFIG.promotedSlots.enabled ? isPromoted : false,
    ownerVerified: true,
  };
}

export async function listCampaigns(
  filters?: CampaignFilters,
  sort: CampaignSort = "newest"
): Promise<{ campaigns: Campaign[]; total: number }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAnonClient();
      let query = supabase
        .from("clip_campaigns")
        .select(`
          *,
          owner:profiles(display_name)
        `)
        .in("status", ["live", "ended", "paused"]);

      if (filters?.campaign_type && filters.campaign_type !== "all") {
        query = query.eq("campaign_type", filters.campaign_type);
      }
      if (filters?.category && filters.category !== "all") {
        query = query.ilike("category", `%${filters.category}%`);
      }
      if (filters?.language && filters.language !== "all") {
        query = query.eq("language", filters.language);
      }
      if (filters?.minRate !== undefined) {
        query = query.gte("rate_inr_per_1k", filters.minRate);
      }
      if (filters?.maxRate !== undefined) {
        query = query.lte("rate_inr_per_1k", filters.maxRate);
      }
      if (filters?.q) {
        query = query.or(`title.ilike.%${filters.q}%,summary.ilike.%${filters.q}%`);
      }

      if (sort === "highest_rate") {
        query = query.order("rate_inr_per_1k", { ascending: false });
      } else if (sort === "most_budget_left") {
        query = query.order("budget_reserved_inr", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const campaigns = data.map((row, idx) => mapCampaignRow(row, idx < 3));
        return { campaigns, total: campaigns.length };
      }
    } catch {
      // Fall through to sample data
    }
  }

  // Fallback to sample data in dev
  let results = [...sampleCampaigns];

  if (filters?.campaign_type && filters.campaign_type !== "all") {
    results = results.filter((c) => c.campaign_type === filters.campaign_type);
  }

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
    results = results.filter((c) => c.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters?.language && filters.language !== "all") {
    results = results.filter((c) => c.language.toLowerCase() === filters.language!.toLowerCase());
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

  if (sort === "highest_rate") {
    results.sort((a, b) => b.rate_inr_per_1k - a.rate_inr_per_1k);
  } else if (sort === "most_budget_left") {
    results.sort((a, b) => b.budgetLeftInr - a.budgetLeftInr);
  } else {
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const campaigns = results.map((c, i) => ({
    ...c,
    isPromoted: CLIPPING_CONFIG.promotedSlots.enabled && i < CLIPPING_CONFIG.promotedSlots.slotCount,
  }));

  return { campaigns, total: campaigns.length };
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAnonClient();
      const { data, error } = await supabase
        .from("clip_campaigns")
        .select(`
          *,
          owner:profiles(display_name)
        `)
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return mapCampaignRow(data);
      }
    } catch {
      // Fall through
    }
  }

  const campaign = sampleCampaigns.find((c) => c.slug === slug);
  if (!campaign) return null;

  return {
    ...campaign,
    isPromoted: CLIPPING_CONFIG.promotedSlots.enabled ? campaign.isPromoted : false,
  };
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAnonClient();
      const { data, error } = await supabase
        .from("clip_campaigns")
        .select(`
          *,
          owner:profiles(display_name)
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        return mapCampaignRow(data);
      }
    } catch {
      // Fall through
    }
  }

  const campaign = sampleCampaigns.find((c) => c.id === id);
  if (!campaign) return null;

  return {
    ...campaign,
    isPromoted: CLIPPING_CONFIG.promotedSlots.enabled ? campaign.isPromoted : false,
  };
}

export async function listTrending(): Promise<Campaign[]> {
  const { campaigns } = await listCampaigns();
  return campaigns.slice(0, 3);
}

export async function listNew(): Promise<Campaign[]> {
  const { campaigns } = await listCampaigns(undefined, "newest");
  return campaigns.slice(0, 3);
}

export async function getTopClips(campaignId: string): Promise<TopClip[]> {
  return sampleTopClips[campaignId] || [];
}

// -------------------------------------------------------------
// Dashboard Data Helpers
// -------------------------------------------------------------

export async function getClipperPlatforms(userId: string): Promise<CreatorPlatform[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("creator_platforms")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getClipperSubmissions(userId: string): Promise<ClipSubmission[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("clip_submissions")
    .select(`
      *,
      campaign:clip_campaigns(id, title),
      earnings:clip_earnings(*)
    `)
    .eq("clipper_id", userId)
    .order("created_at", { ascending: false });

  if (!data) return [];
  return (data as unknown as SubmissionDbRow[]).map((row) => ({
    id: row.id,
    campaign_id: row.campaign_id,
    campaign_title: row.campaign?.title || "Campaign",
    clipper_id: row.clipper_id,
    platform: row.platform,
    post_url: row.post_url,
    post_id_normalised: row.post_id_normalised,
    platform_account_id: row.platform_account_id,
    posted_at: row.posted_at || row.created_at,
    status: row.status,
    reject_reason: row.reject_reason,
    reviewed_by: row.reviewed_by,
    reviewed_at: row.reviewed_at,
    created_at: row.created_at,
    earnings: row.earnings || null,
  }));
}

export async function getClipperWalletSummary(userId: string): Promise<WalletSummary> {
  if (!isSupabaseConfigured()) {
    return {
      netBalanceInr: 0,
      totalGrossEarnedInr: 0,
      totalFeesPaidInr: 0,
      totalNetPaidOutInr: 0,
      pendingPayoutInr: 0,
    };
  }

  const supabase = await createSessionClient();
  const { data: ledger } = await supabase
    .from("clip_wallet_ledger")
    .select("type, amount_inr")
    .eq("profile_id", userId);

  let netBalance = 0;
  let grossEarned = 0;
  let feesPaid = 0;
  let paidOut = 0;

  for (const row of ledger || []) {
    netBalance += row.amount_inr || 0;
    if (row.type === "earning") {
      grossEarned += row.amount_inr;
    } else if (row.type === "fee") {
      feesPaid += Math.abs(row.amount_inr);
    } else if (row.type === "payout") {
      paidOut += Math.abs(row.amount_inr);
    }
  }

  // Check pending payouts
  const { data: pending } = await supabase
    .from("clip_payout_requests")
    .select("amount_inr")
    .eq("profile_id", userId)
    .in("status", ["requested", "processing"]);

  const pendingPayoutInr = (pending || []).reduce((acc, p) => acc + (p.amount_inr || 0), 0);

  return {
    netBalanceInr: Math.max(0, netBalance),
    totalGrossEarnedInr: grossEarned,
    totalFeesPaidInr: feesPaid,
    totalNetPaidOutInr: paidOut,
    pendingPayoutInr,
  };
}

export async function getOwnerCampaigns(userId: string): Promise<Campaign[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("clip_campaigns")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (!data) return [];
  return (data as unknown as CampaignDbRow[]).map((row) => mapCampaignRow(row));
}

export async function getCampaignSubmissions(campaignId: string): Promise<ClipSubmission[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("clip_submissions")
    .select(`
      *,
      clipper:profiles(display_name),
      earnings:clip_earnings(*)
    `)
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (!data) return [];
  return (data as unknown as SubmissionDbRow[]).map((row) => ({
    id: row.id,
    campaign_id: row.campaign_id,
    clipper_id: row.clipper_id,
    clipper_name: row.clipper?.display_name || "Clipper",
    platform: row.platform,
    post_url: row.post_url,
    post_id_normalised: row.post_id_normalised,
    platform_account_id: row.platform_account_id,
    posted_at: row.posted_at || row.created_at,
    status: row.status,
    reject_reason: row.reject_reason,
    reviewed_by: row.reviewed_by,
    reviewed_at: row.reviewed_at,
    created_at: row.created_at,
    earnings: row.earnings || null,
  }));
}

// -------------------------------------------------------------
// Social Media PR Data Helpers
// -------------------------------------------------------------

export async function getPrApplicationsForCreator(userId: string): Promise<PrApplication[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("pr_applications")
    .select(`
      *,
      campaign:clip_campaigns(id, title, fee_per_post_inr, pricing_mode),
      deliverable:pr_deliverables(*)
    `)
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });

  if (!data) return [];
  return data as unknown as PrApplication[];
}

export async function getPrApplicationsForCampaign(campaignId: string): Promise<PrApplication[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("pr_applications")
    .select(`
      *,
      creator:profiles(display_name),
      platform_account:creator_platforms(*),
      deliverable:pr_deliverables(*)
    `)
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (!data) return [];
  return data as unknown as PrApplication[];
}

export async function getPrDeliverable(deliverableId: string): Promise<PrDeliverable | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("pr_deliverables")
    .select("*")
    .eq("id", deliverableId)
    .single();

  if (error || !data) return null;
  return data as unknown as PrDeliverable;
}

// -------------------------------------------------------------
// Admin Hub Data Helpers
// -------------------------------------------------------------

export async function getAdminClippingOverview() {
  if (!isSupabaseConfigured()) {
    return {
      pendingCampaigns: [],
      pendingPlatforms: [],
      pendingPrDeliverables: [],
      pendingPayouts: [],
      recentActions: [],
    };
  }

  const supabase = await createSessionClient();

  const [campaignsRes, platformsRes, prDelivRes, payoutsRes, actionsRes] = await Promise.all([
    supabase
      .from("clip_campaigns")
      .select(`*, owner:profiles(display_name)`)
      .in("status", ["pending_review", "approved"])
      .order("created_at", { ascending: false }),
    supabase
      .from("creator_platforms")
      .select(`*, profile:profiles(display_name)`)
      .eq("verified", false)
      .order("created_at", { ascending: false }),
    supabase
      .from("pr_deliverables")
      .select(`
        *,
        application:pr_applications (
          creator:profiles(display_name),
          campaign:clip_campaigns(id, title)
        )
      `)
      .eq("status", "pending")
      .not("post_url", "is", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("clip_payout_requests")
      .select(`*, profile:profiles(display_name)`)
      .in("status", ["requested", "processing"])
      .order("created_at", { ascending: false }),
    supabase
      .from("admin_actions")
      .select(`*, admin:profiles(display_name)`)
      .order("created_at", { ascending: false })
      .limit(15),
  ]);

  return {
    pendingCampaigns: campaignsRes.data || [],
    pendingPlatforms: platformsRes.data || [],
    pendingPrDeliverables: prDelivRes.data || [],
    pendingPayouts: (payoutsRes.data || []) as (PayoutRequest & { profile?: { display_name: string } })[],
    recentActions: actionsRes.data || [],
  };
}
