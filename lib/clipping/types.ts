export type PlatformType = "youtube_shorts" | "instagram_reels";

export type CampaignStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "funded"
  | "live"
  | "paused"
  | "ended"
  | "removed";

export interface SourceLink {
  title: string;
  url: string;
  platform?: string;
}

export interface Campaign {
  id: string;
  slug: string;
  owner_id: string;
  owner_name: string;
  owner_avatar_url?: string | null;
  title: string;
  summary: string;
  brief_md: string;
  rules_md: string;
  category: string;
  language: string;
  source_links: SourceLink[];
  asset_folder_url?: string | null;
  platforms: PlatformType[];
  rate_inr_per_1k: number;
  budget_inr: number;
  owner_fee_inr: number;
  budget_reserved_inr: number;
  budget_paid_inr: number;
  per_clip_view_cap: number;
  per_clipper_cap_inr?: number | null;
  min_views_to_qualify: number;
  required_caption?: string | null;
  required_hashtags: string[];
  required_mention?: string | null;
  disclosure_required: boolean;
  rights_confirmed_at?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  status: CampaignStatus;
  funded_at?: string | null;
  funded_ref?: string | null;
  cover_path?: string | null;
  created_at: string;

  // Derived fields
  budgetLeftInr: number;
  budgetUsedPct: number;
  approvedClipCount: number;
  netRateInrPer1k: number;
  isPromoted: boolean;
  ownerVerified: boolean;
}

export interface TopClip {
  id: string;
  campaign_id: string;
  platform: PlatformType;
  post_url: string;
  verified_views: number;
  gross_amount_inr: number;
  net_amount_inr: number;
  clipper_handle: string;
  submitted_at: string;
}

export interface CampaignFilters {
  category?: string;
  language?: string;
  platform?: "all" | PlatformType;
  minRate?: number;
  maxRate?: number;
  hasBudgetLeft?: boolean;
  q?: string;
}

export type CampaignSort = "newest" | "highest_rate" | "most_budget_left";
