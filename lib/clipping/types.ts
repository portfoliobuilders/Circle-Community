export type PlatformType = "youtube_shorts" | "instagram_reels";

export type CampaignType = "clipping" | "social_pr";

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
  campaign_type?: CampaignType;
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
  required_link?: string | null;
  disclosure_required: boolean;
  rights_confirmed_at?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  status: CampaignStatus;
  funded_at?: string | null;
  funded_ref?: string | null;
  cover_path?: string | null;
  created_at: string;

  // PR specific fields (optional / nullable on clipping)
  deliverable_type?: "reel" | "post" | "carousel" | "story" | "short" | null;
  fee_per_post_inr?: number | null;
  slots?: number | null;
  pricing_mode?: "fixed" | "quote" | null;
  min_followers?: number | null;
  max_followers?: number | null;
  niches?: string[];
  cities?: string[];
  content_approval_required?: boolean;
  subject_type?: "brand" | "individual" | null;
  subject_consent_confirmed_at?: string | null;

  // Derived fields
  budgetLeftInr: number;
  budgetUsedPct: number;
  approvedClipCount: number;
  netRateInrPer1k: number;
  isPromoted: boolean;
  ownerVerified: boolean;
}

export interface CreatorPlatform {
  id: string;
  profile_id: string;
  platform: PlatformType;
  handle: string;
  platform_account_id?: string | null;
  verification_code: string;
  code_expires_at: string;
  verified: boolean;
  verified_at?: string | null;
  admin_verified_followers?: number | null;
  followers_verified_at?: string | null;
  followers_verified_by?: string | null;
  created_at: string;
}

export type SubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "removed"
  | "disqualified";

export interface ClipSubmission {
  id: string;
  campaign_id: string;
  campaign_title?: string;
  clipper_id: string;
  clipper_name?: string;
  clipper_handle?: string;
  platform: PlatformType;
  post_url: string;
  post_id_normalised: string;
  platform_account_id: string;
  posted_at: string;
  status: SubmissionStatus;
  reject_reason?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;

  // Associated earnings / views if present
  earnings?: ClipEarning | null;
  latest_snapshot?: ClipViewSnapshot | null;
}

export type SnapshotSource = "youtube_api" | "admin_verified" | "clipper_reported";

export interface ClipViewSnapshot {
  id: string;
  submission_id: string;
  views: number;
  likes?: number | null;
  comments?: number | null;
  source: SnapshotSource;
  is_live: boolean;
  evidence_path?: string | null;
  captured_by?: string | null;
  captured_at: string;
}

export type EarningStatus = "accruing" | "payable" | "paid" | "void";

export interface ClipEarning {
  submission_id: string;
  verified_views: number;
  payable_views: number;
  gross_amount_inr: number;
  fee_amount_inr: number;
  net_amount_inr: number;
  status: EarningStatus;
  locked_at?: string | null;
  updated_at: string;
}

export type LedgerEntryType =
  | "earning"
  | "fee"
  | "payout"
  | "adjustment"
  | "reversal"
  | "fee_reversal";

export type LedgerRefType =
  | "clip_submission"
  | "pr_deliverable"
  | "payout_request"
  | "admin_adjustment";

export interface WalletLedgerEntry {
  id: string;
  profile_id: string;
  type: LedgerEntryType;
  amount_inr: number;
  ref_type: LedgerRefType;
  ref_id: string;
  note?: string | null;
  created_by?: string | null;
  created_at: string;
}

export type PayoutStatus =
  | "requested"
  | "processing"
  | "paid"
  | "failed"
  | "rejected";

export interface PayoutRequest {
  id: string;
  profile_id: string;
  amount_inr: number;
  upi_id_encrypted: string;
  upi_id?: string;
  status: PayoutStatus;
  paid_ref?: string | null;
  paid_at?: string | null;
  processed_by?: string | null;
  created_at: string;
}

export interface WalletSummary {
  netBalanceInr: number;
  totalGrossEarnedInr: number;
  totalFeesPaidInr: number;
  totalNetPaidOutInr: number;
  pendingPayoutInr: number;
}

export interface ClipFraudFlag {
  id: string;
  submission_id?: string | null;
  deliverable_id?: string | null;
  rule: string;
  detail: Record<string, unknown>;
  status: "open" | "cleared" | "confirmed";
  created_at: string;
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
  campaign_type?: "all" | CampaignType;
  category?: string;
  language?: string;
  platform?: "all" | PlatformType;
  minRate?: number;
  maxRate?: number;
  hasBudgetLeft?: boolean;
  q?: string;
}

// -------------------------------------------------------------
// Social Media PR Entities
// -------------------------------------------------------------

export type PrApplicationStatus = "applied" | "accepted" | "rejected" | "withdrawn" | "cancelled";
export type PrDraftStatus = "none" | "submitted" | "approved" | "changes_requested";
export type PrDeliverableStatus = "pending" | "live_verified" | "payable" | "paid" | "failed";

export interface PrDeliverableLiveCheck {
  checked_at: string;
  is_live: boolean;
  has_disclosure: boolean;
  notes?: string;
}

export interface PrDeliverable {
  id: string;
  application_id: string;
  draft_path?: string | null;
  draft_status: PrDraftStatus;
  revision_count: number;
  post_url?: string | null;
  post_id_normalised?: string | null;
  posted_at_submitted?: string | null;
  live_checks: PrDeliverableLiveCheck[];
  status: PrDeliverableStatus;
  fail_reason?: string | null;
  created_at: string;
}

export interface PrApplication {
  id: string;
  campaign_id: string;
  creator_id: string;
  platform_account_id: string;
  pitch: string;
  quote_inr?: number | null;
  status: PrApplicationStatus;
  created_at: string;
  campaign?: { id: string; title: string; fee_per_post_inr?: number | null; pricing_mode?: string | null };
  creator?: { display_name?: string | null };
  platform_account?: CreatorPlatform;
  deliverable?: PrDeliverable | null;
}

export type CampaignSort = "newest" | "highest_rate" | "most_budget_left";
