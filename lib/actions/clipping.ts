"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { clientIp } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";
import { normalizeClipUrl } from "@/lib/clipping/normalizer";
import {
  createCampaignSchema,
  linkPlatformSchema,
  payoutRequestSchema,
  reviewSubmissionSchema,
  submitClipSchema,
} from "@/lib/validation/clipping";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import type { FormState } from "@/lib/actions/support";

async function limited(scope: string) {
  const ip = await clientIp();
  return rateLimit(`${scope}:${ip}`);
}

function generateBioCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CC-";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// -------------------------------------------------------------
// Creator Platform Actions
// -------------------------------------------------------------

export async function linkCreatorPlatform(input: unknown): Promise<FormState & { code?: string }> {
  if (!(await limited("link-platform"))) {
    return { status: "error", message: "Too many requests. Please try again later." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Database is not configured." };
  }

  const parsed = linkPlatformSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Invalid platform or handle." };
  }

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { status: "error", message: "You must be signed in to connect social platforms." };
  }

  // Profile role and age check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, date_of_birth")
    .eq("id", authData.user.id)
    .single();

  if (!profile || profile.role !== "creator") {
    return { status: "error", message: "Only creator accounts can connect social accounts for clipping." };
  }

  const verificationCode = generateBioCode();

  const { error } = await supabase.from("creator_platforms").insert({
    profile_id: authData.user.id,
    platform: parsed.data.platform,
    handle: parsed.data.handle,
    verification_code: verificationCode,
    verified: false,
  });

  if (error) {
    return { status: "error", message: "Could not link handle. It may already be in your accounts or registered." };
  }

  revalidatePath("/dashboard/clipping");
  return {
    status: "success",
    message: `Account connected. Place code ${verificationCode} into your bio to complete verification.`,
    code: verificationCode,
  };
}

// -------------------------------------------------------------
// Campaign Joining & Clip Submission
// -------------------------------------------------------------

export async function joinCampaign(campaignId: string): Promise<FormState> {
  if (!(await limited("join-campaign"))) {
    return { status: "error", message: "Too many requests. Please try again later." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Database is not configured." };
  }

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { status: "error", message: "Sign in as a creator to join campaigns." };
  }

  // Ensure user is an adult creator
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, date_of_birth")
    .eq("id", authData.user.id)
    .single();

  if (!profile || profile.role !== "creator") {
    return { status: "error", message: "Only creators can join clipping campaigns." };
  }

  if (!profile.date_of_birth) {
    return { status: "error", message: "Please enter your date of birth in settings. You must be 18+ to join." };
  }

  const birthDate = new Date(profile.date_of_birth);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  if (birthDate > cutoff) {
    return { status: "error", message: "You must be 18 years or older to participate in clipping campaigns." };
  }

  const { error } = await supabase.from("clip_campaign_members").insert({
    campaign_id: campaignId,
    profile_id: authData.user.id,
    status: "active",
  });

  if (error && error.code !== "23505") {
    return { status: "error", message: "Could not join campaign. Make sure it is currently live." };
  }

  revalidatePath(`/clipping/campaigns`);
  revalidatePath("/dashboard/clipping");
  return { status: "success", message: "Joined campaign! You can now produce clips and submit your post URLs." };
}

export async function submitClip(input: unknown): Promise<FormState> {
  if (!(await limited("submit-clip"))) {
    return { status: "error", message: "Too many submissions. Please slow down." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Database is not configured." };
  }

  const parsed = submitClipSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Check the submission form." };
  }

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { status: "error", message: "Please sign in to submit clips." };
  }

  // Check verified platform ownership
  const { data: platformAccount } = await supabase
    .from("creator_platforms")
    .select("id, platform, handle, verified")
    .eq("id", parsed.data.platform_account_id)
    .eq("profile_id", authData.user.id)
    .single();

  if (!platformAccount || !platformAccount.verified) {
    return {
      status: "error",
      message: "You can only submit clips from a social account that has passed bio-code verification.",
    };
  }

  // Normalize URL
  const norm = normalizeClipUrl(parsed.data.post_url, platformAccount.platform);
  if (!norm.success || !norm.normalisedId || !norm.canonicalUrl) {
    return { status: "error", message: norm.error || "Invalid post URL." };
  }

  // Check campaign status and remaining budget
  const { data: campaign } = await supabase
    .from("clip_campaigns")
    .select("id, status, budget_inr, budget_reserved_inr")
    .eq("id", parsed.data.campaign_id)
    .single();

  if (!campaign || campaign.status !== "live") {
    return { status: "error", message: "This campaign is no longer accepting new submissions." };
  }

  const { error } = await supabase.from("clip_submissions").insert({
    campaign_id: campaign.id,
    clipper_id: authData.user.id,
    platform: platformAccount.platform,
    post_url: norm.canonicalUrl,
    post_id_normalised: norm.normalisedId,
    platform_account_id: platformAccount.id,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "This video has already been submitted to CIRCLE." };
    }
    return { status: "error", message: "Could not record submission. Ensure the campaign is live and try again." };
  }

  revalidatePath("/dashboard/clipping");
  return {
    status: "success",
    message: "Clip submitted! It is now pending moderation. Views mature 7 days after submission.",
  };
}

// -------------------------------------------------------------
// Campaign Owner Actions
// -------------------------------------------------------------

export async function createCampaign(input: unknown): Promise<FormState & { slug?: string }> {
  if (!(await limited("create-campaign"))) {
    return { status: "error", message: "Too many campaign creation attempts. Please try again later." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Database is not configured." };
  }

  const parsed = createCampaignSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Check the campaign brief." };
  }

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { status: "error", message: "Sign in with a brand account to create a campaign." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (!profile || profile.role !== "brand") {
    return { status: "error", message: "Only brand profiles can create clipping campaigns." };
  }

  const budgetInr = parsed.data.budget_inr;
  const ownerFeeInr = Math.floor((budgetInr * CLIPPING_CONFIG.ownerFeePct) / 100);
  const baseSlug = slugify(parsed.data.title);
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

  const { data: newCampaign, error } = await supabase
    .from("clip_campaigns")
    .insert({
      owner_id: authData.user.id,
      slug: uniqueSlug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      brief_md: parsed.data.brief_md,
      rules_md: parsed.data.rules_md,
      category: parsed.data.category,
      language: parsed.data.language,
      source_links: parsed.data.source_links,
      asset_folder_url: parsed.data.asset_folder_url || null,
      platforms: parsed.data.platforms,
      rate_inr_per_1k: parsed.data.rate_inr_per_1k,
      budget_inr: budgetInr,
      owner_fee_inr: ownerFeeInr,
      budget_reserved_inr: 0,
      budget_paid_inr: 0,
      per_clip_view_cap: parsed.data.per_clip_view_cap,
      per_clipper_cap_inr: parsed.data.per_clipper_cap_inr || null,
      min_views_to_qualify: parsed.data.min_views_to_qualify,
      required_caption: parsed.data.required_caption || null,
      required_hashtags: parsed.data.required_hashtags,
      required_mention: parsed.data.required_mention || null,
      disclosure_required: true,
      rights_confirmed_at: new Date().toISOString(),
      status: "pending_review",
    })
    .select("slug")
    .single();

  if (error) {
    return { status: "error", message: "Could not save campaign. Please check inputs and try again." };
  }

  revalidatePath("/dashboard/clipping/campaigns");
  return {
    status: "success",
    message: `Campaign submitted for review! Total invoice: ₹${(budgetInr + ownerFeeInr).toLocaleString("en-IN")}. Portfolix will contact you with bank transfer details.`,
    slug: newCampaign.slug,
  };
}

export async function reviewSubmission(input: unknown): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Database is not configured." };
  }

  const parsed = reviewSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Invalid review decision." };
  }

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { status: "error", message: "Please sign in to review submissions." };
  }

  // Update submission status (RLS verifies user is campaign owner or admin)
  const { error } = await supabase
    .from("clip_submissions")
    .update({
      status: parsed.data.status,
      reject_reason: parsed.data.status === "rejected" ? parsed.data.reject_reason || "Does not meet brief requirements" : null,
      reviewed_by: authData.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.submission_id);

  if (error) {
    return { status: "error", message: "Could not update submission status." };
  }

  revalidatePath("/dashboard/clipping/campaigns");
  return { status: "success", message: `Submission marked as ${parsed.data.status}.` };
}

// -------------------------------------------------------------
// Clipper Payout Action
// -------------------------------------------------------------

export async function requestPayout(input: unknown): Promise<FormState> {
  if (!(await limited("payout-request"))) {
    return { status: "error", message: "Too many payout requests. Please try again later." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Database is not configured." };
  }

  const parsed = payoutRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Check payout amount and UPI ID." };
  }

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { status: "error", message: "Please sign in to request payouts." };
  }

  // Check for open fraud flags
  const { data: openFlags } = await supabase
    .from("clip_fraud_flags")
    .select("id")
    .eq("status", "open")
    .limit(1);

  if (openFlags && openFlags.length > 0) {
    return {
      status: "error",
      message: "Payouts are paused on your account pending an automated security review. Please contact support.",
    };
  }

  // Check for an existing open payout request
  const { data: pendingRequests } = await supabase
    .from("clip_payout_requests")
    .select("id")
    .eq("profile_id", authData.user.id)
    .in("status", ["requested", "processing"])
    .limit(1);

  if (pendingRequests && pendingRequests.length > 0) {
    return {
      status: "error",
      message: "You already have a payout request being processed. Please wait for it to complete.",
    };
  }

  // Calculate net wallet balance from ledger
  const { data: ledgerRows } = await supabase
    .from("clip_wallet_ledger")
    .select("amount_inr")
    .eq("profile_id", authData.user.id);

  const netBalance = (ledgerRows || []).reduce((acc, row) => acc + (row.amount_inr || 0), 0);

  if (netBalance < parsed.data.amount_inr) {
    return {
      status: "error",
      message: `Requested amount (₹${parsed.data.amount_inr}) exceeds your available net balance (₹${netBalance}).`,
    };
  }

  const { error } = await supabase.from("clip_payout_requests").insert({
    profile_id: authData.user.id,
    amount_inr: parsed.data.amount_inr,
    upi_id_encrypted: parsed.data.upi_id,
    status: "requested",
  });

  if (error) {
    return { status: "error", message: "Could not submit payout request. Please try again." };
  }

  revalidatePath("/dashboard/clipping");
  return {
    status: "success",
    message: `Payout request for ₹${parsed.data.amount_inr} submitted! Batch payouts are processed on the weekly cycle via UPI.`,
  };
}
