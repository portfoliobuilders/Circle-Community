"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import {
  createPrCampaignSchema,
  applyPrSchema,
  acceptPrSchema,
  rejectPrSchema,
  uploadPrDraftSchema,
  reviewPrDraftSchema,
  submitPrPostUrlSchema,
  adminVerifyPrLiveSchema,
} from "@/lib/validation/pr";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { slugify } from "@/lib/clipping/normalizer";
import { normalizeClipUrl } from "@/lib/clipping/normalizer";
import type { FormState } from "@/lib/actions/support";

// -------------------------------------------------------------
// Helper: Database Rate Limiter (24-Hour Rolling Window)
// -------------------------------------------------------------
async function checkPrRateLimit(userId: string, actionKey: string, maxPerDay = 15): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  const supabase = await createSessionClient();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  if (actionKey === "apply") {
    const { count } = await supabase
      .from("pr_applications")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", userId)
      .gt("created_at", oneDayAgo);
    return (count || 0) < maxPerDay;
  }

  if (actionKey === "create_campaign") {
    const { count } = await supabase
      .from("clip_campaigns")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId)
      .eq("campaign_type", "social_pr")
      .gt("created_at", oneDayAgo);
    return (count || 0) < 5;
  }

  return true;
}

// -------------------------------------------------------------
// 1. Create PR Campaign (Brand Only)
// -------------------------------------------------------------
export async function createPrCampaign(input: unknown): Promise<FormState & { slug?: string }> {
  if (!CLIPPING_CONFIG.pr.enabled) {
    return { status: "error", message: "Social Media PR campaigns are currently disabled." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Database is not configured." };
  }

  const parsed = createPrCampaignSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Check the campaign brief." };
  }

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { status: "error", message: "Sign in with a brand account to create a PR campaign." };
  }

  if (!(await checkPrRateLimit(authData.user.id, "create_campaign"))) {
    return { status: "error", message: "Campaign creation limit reached for today. Please try again tomorrow." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (!profile || profile.role !== "brand") {
    return { status: "error", message: "Only brand accounts can launch Social Media PR campaigns." };
  }

  const budgetInr = parsed.data.budget_inr;
  const ownerFeeInr = Math.floor((budgetInr * CLIPPING_CONFIG.pr.ownerFeePct) / 100);
  const baseSlug = slugify(parsed.data.title);
  const uniqueSlug = `pr-${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

  const now = new Date().toISOString();

  const { data: newCampaign, error } = await supabase
    .from("clip_campaigns")
    .insert({
      owner_id: authData.user.id,
      slug: uniqueSlug,
      campaign_type: "social_pr",
      title: parsed.data.title,
      summary: parsed.data.summary,
      brief_md: parsed.data.brief_md,
      rules_md: parsed.data.rules_md,
      category: parsed.data.category,
      language: parsed.data.language,
      platforms: parsed.data.platforms,
      deliverable_type: parsed.data.deliverable_type,
      pricing_mode: parsed.data.pricing_mode,
      fee_per_post_inr: parsed.data.fee_per_post_inr || null,
      slots: parsed.data.slots,
      budget_inr: budgetInr,
      owner_fee_inr: ownerFeeInr,
      budget_reserved_inr: 0,
      budget_paid_inr: 0,
      min_followers: parsed.data.min_followers,
      max_followers: parsed.data.max_followers || null,
      niches: parsed.data.niches,
      cities: parsed.data.cities,
      required_caption: parsed.data.required_caption || null,
      required_hashtags: parsed.data.required_hashtags,
      required_mention: parsed.data.required_mention || null,
      required_link: parsed.data.required_link || null,
      content_approval_required: parsed.data.content_approval_required,
      subject_type: parsed.data.subject_type,
      subject_consent_confirmed_at: parsed.data.subject_type === "individual" ? now : null,
      disclosure_required: true,
      rights_confirmed_at: now,
      status: "pending_review",
    })
    .select("slug")
    .single();

  if (error) {
    return { status: "error", message: "Could not create PR campaign. Please check inputs and retry." };
  }

  revalidatePath("/clipping/campaigns");
  revalidatePath("/dashboard/clipping/campaigns");
  return { status: "success", message: "Campaign submitted for admin review!", slug: newCampaign.slug };
}

// -------------------------------------------------------------
// 2. Apply / Pitch to PR Campaign (Creator with 10K+ Followers)
// -------------------------------------------------------------
export async function applyToPrCampaign(input: unknown): Promise<FormState> {
  if (!CLIPPING_CONFIG.pr.enabled) {
    return { status: "error", message: "Social Media PR is currently disabled." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Database is not configured." };
  }

  const parsed = applyPrSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Invalid application input." };
  }

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { status: "error", message: "Please sign in to apply for this campaign." };
  }

  const userId = authData.user.id;

  if (!(await checkPrRateLimit(userId, "apply"))) {
    return { status: "error", message: "Daily application limit reached. Please try again tomorrow." };
  }

  // 1. Check Age (18+)
  const { data: profile } = await supabase
    .from("profiles")
    .select("date_of_birth")
    .eq("id", userId)
    .single();

  if (!profile?.date_of_birth) {
    return { status: "error", message: "Please add your date of birth in your profile before applying (18+ required)." };
  }

  const dob = new Date(profile.date_of_birth);
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
  if (dob > minAgeDate) {
    return { status: "error", message: "Participants must be 18 years or older." };
  }

  // 2. Check Fraud Flags
  const { count: fraudCount } = await supabase
    .from("clip_fraud_flags")
    .select("*", { count: "exact", head: true })
    .eq("submission_id", userId) // or check deliverable
    .eq("status", "confirmed");

  if (fraudCount && fraudCount > 0) {
    return { status: "error", message: "Your account has active fraud flags. Applications are restricted." };
  }

  // 3. Check Campaign Status
  const { data: campaign, error: campErr } = await supabase
    .from("clip_campaigns")
    .select("id, status, min_followers, pricing_mode, fee_per_post_inr, slots")
    .eq("id", parsed.data.campaign_id)
    .eq("campaign_type", "social_pr")
    .single();

  if (campErr || !campaign || campaign.status !== "live") {
    return { status: "error", message: "This PR campaign is not open for applications." };
  }

  // 4. Check Creator Platform Account (10K+ Followers & 90-Day Validity)
  const { data: platformAccount, error: platErr } = await supabase
    .from("creator_platforms")
    .select("id, verified, admin_verified_followers, followers_verified_at")
    .eq("id", parsed.data.platform_account_id)
    .eq("profile_id", userId)
    .single();

  if (platErr || !platformAccount || !platformAccount.verified) {
    return { status: "error", message: "Please select an account verified via bio-code ownership." };
  }

  const verifiedFollowers = platformAccount.admin_verified_followers || 0;
  if (verifiedFollowers < campaign.min_followers || verifiedFollowers < CLIPPING_CONFIG.pr.minFollowers) {
    return {
      status: "error",
      message: `Account has ${verifiedFollowers.toLocaleString("en-IN")} admin-verified followers. This campaign requires at least ${campaign.min_followers.toLocaleString("en-IN")} followers.`,
    };
  }

  // Check 90-day verification validity
  if (!platformAccount.followers_verified_at) {
    return { status: "error", message: "Follower count has not yet been audited by CIRCLE admins." };
  }
  const verifiedAgeMs = Date.now() - new Date(platformAccount.followers_verified_at).getTime();
  const maxAgeMs = CLIPPING_CONFIG.pr.followerRecheckDays * 24 * 60 * 60 * 1000;
  if (verifiedAgeMs > maxAgeMs) {
    return { status: "error", message: "Your follower audit is older than 90 days. Please request an admin follower re-check." };
  }

  // 5. Quote validation if in quote mode
  if (campaign.pricing_mode === "quote" && (!parsed.data.quote_inr || parsed.data.quote_inr < 500)) {
    return { status: "error", message: "Please provide a valid quote (minimum ₹500)." };
  }

  // 6. Insert Application
  const { error: insertErr } = await supabase
    .from("pr_applications")
    .insert({
      campaign_id: campaign.id,
      creator_id: userId,
      platform_account_id: platformAccount.id,
      pitch: parsed.data.pitch,
      quote_inr: campaign.pricing_mode === "quote" ? parsed.data.quote_inr : campaign.fee_per_post_inr,
      status: "applied",
    });

  if (insertErr) {
    if (insertErr.code === "23505") {
      return { status: "error", message: "You have already applied to this campaign." };
    }
    return { status: "error", message: "Could not submit application. Please try again." };
  }

  revalidatePath(`/clipping/campaigns/${campaign.id}`);
  revalidatePath("/dashboard/clipping");
  return { status: "success", message: "Application submitted! The campaign owner will review your pitch." };
}

// -------------------------------------------------------------
// 3. Withdraw Application (Creator)
// -------------------------------------------------------------
export async function withdrawPrApplication(applicationId: string): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Database unconfigured." };

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { status: "error", message: "Please sign in." };

  const { error } = await supabase
    .from("pr_applications")
    .update({ status: "withdrawn" })
    .eq("id", applicationId)
    .eq("creator_id", authData.user.id)
    .eq("status", "applied");

  if (error) return { status: "error", message: "Could not withdraw application." };

  revalidatePath("/dashboard/clipping");
  return { status: "success", message: "Application withdrawn." };
}

// -------------------------------------------------------------
// 4. Accept PR Application (Brand Owner — Row Lock & Escrow Reservation)
// -------------------------------------------------------------
export async function acceptPrApplication(input: unknown): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Database unconfigured." };

  const parsed = acceptPrSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Invalid application ID." };

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { status: "error", message: "Please sign in." };

  // Fetch application & campaign details
  const { data: application, error: appErr } = await supabase
    .from("pr_applications")
    .select(`
      id,
      campaign_id,
      creator_id,
      quote_inr,
      status,
      campaign:clip_campaigns (
        id,
        owner_id,
        status,
        slots,
        pricing_mode,
        fee_per_post_inr,
        budget_inr,
        budget_reserved_inr,
        content_approval_required
      )
    `)
    .eq("id", parsed.data.application_id)
    .single();

  if (appErr || !application || !application.campaign) {
    return { status: "error", message: "Application not found." };
  }

  type AcceptCampInfo = {
    id: string;
    owner_id: string;
    pricing_mode?: string;
    fee_per_post_inr?: number;
    slots: number;
    budget_reserved_inr?: number;
    budget_inr: number;
    content_approval_required?: boolean;
  };
  const camp = application.campaign as unknown as AcceptCampInfo;
  if (camp.owner_id !== authData.user.id) {
    return { status: "error", message: "Only the campaign owner can accept applications." };
  }

  if (application.status !== "applied") {
    return { status: "error", message: `Cannot accept application in '${application.status}' status.` };
  }

  const agreedFee = camp.pricing_mode === "fixed" ? (camp.fee_per_post_inr || 0) : (application.quote_inr || 0);
  if (agreedFee <= 0) {
    return { status: "error", message: "Agreed deliverable fee must be greater than zero." };
  }

  // Check Slots Ceiling
  const { count: acceptedCount } = await supabase
    .from("pr_applications")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", camp.id)
    .eq("status", "accepted");

  if ((acceptedCount || 0) >= camp.slots) {
    return { status: "error", message: `All ${camp.slots} slots for this campaign have already been filled.` };
  }

  // Check Budget Ceiling
  const newReserved = (camp.budget_reserved_inr || 0) + agreedFee;
  if (newReserved > camp.budget_inr) {
    return { status: "error", message: "Accepting this quote would exceed the funded campaign budget." };
  }

  // Atomic Update: Reserve Budget on Campaign
  const { error: campUpdateErr } = await supabase
    .from("clip_campaigns")
    .update({ budget_reserved_inr: newReserved })
    .eq("id", camp.id);

  if (campUpdateErr) {
    return { status: "error", message: "Could not update campaign budget reservation." };
  }

  // Update Application Status to Accepted
  const { error: appUpdateErr } = await supabase
    .from("pr_applications")
    .update({ status: "accepted" })
    .eq("id", application.id);

  if (appUpdateErr) {
    return { status: "error", message: "Could not accept application." };
  }

  // Create PR Deliverable Record
  const initialDraftStatus = camp.content_approval_required ? "none" : "approved";
  const { error: delivErr } = await supabase
    .from("pr_deliverables")
    .insert({
      application_id: application.id,
      draft_status: initialDraftStatus,
      status: "pending",
      revision_count: 0,
    });

  if (delivErr) {
    return { status: "error", message: "Application accepted, but deliverable record initialization failed." };
  }

  revalidatePath(`/dashboard/clipping/campaigns/${camp.id}`);
  return { status: "success", message: "Application accepted and deliverable slot reserved!" };
}

// -------------------------------------------------------------
// 5. Reject PR Application (Brand Owner)
// -------------------------------------------------------------
export async function rejectPrApplication(input: unknown): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Database unconfigured." };

  const parsed = rejectPrSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Invalid application." };

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { status: "error", message: "Please sign in." };

  const { error } = await supabase
    .from("pr_applications")
    .update({ status: "rejected" })
    .eq("id", parsed.data.application_id);

  if (error) return { status: "error", message: "Could not reject application." };

  revalidatePath("/dashboard/clipping/campaigns");
  return { status: "success", message: "Application declined." };
}

// -------------------------------------------------------------
// 6. Upload PR Draft (Creator)
// -------------------------------------------------------------
export async function uploadPrDraft(input: unknown): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Database unconfigured." };

  const parsed = uploadPrDraftSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message || "Invalid draft upload." };

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { status: "error", message: "Please sign in." };

  const { error } = await supabase
    .from("pr_deliverables")
    .update({
      draft_path: parsed.data.draft_path,
      draft_status: "submitted",
    })
    .eq("id", parsed.data.deliverable_id);

  if (error) return { status: "error", message: "Could not record draft submission." };

  revalidatePath("/dashboard/clipping");
  return { status: "success", message: "Draft submitted! The campaign owner will review it." };
}

// -------------------------------------------------------------
// 7. Review PR Draft (Brand Owner — Max 1 Revision)
// -------------------------------------------------------------
export async function reviewPrDraft(input: unknown): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Database unconfigured." };

  const parsed = reviewPrDraftSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Invalid review decision." };

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { status: "error", message: "Please sign in." };

  // Fetch deliverable & revision count
  const { data: deliv, error: fetchErr } = await supabase
    .from("pr_deliverables")
    .select("id, revision_count, draft_status")
    .eq("id", parsed.data.deliverable_id)
    .single();

  if (fetchErr || !deliv) return { status: "error", message: "Deliverable not found." };

  if (parsed.data.decision === "changes_requested") {
    if (deliv.revision_count >= CLIPPING_CONFIG.pr.maxRevisions) {
      return {
        status: "error",
        message: `Maximum revision limit (${CLIPPING_CONFIG.pr.maxRevisions}) reached. You must either approve the draft or cancel the deliverable.`,
      };
    }

    const { error } = await supabase
      .from("pr_deliverables")
      .update({
        draft_status: "changes_requested",
        revision_count: deliv.revision_count + 1,
        fail_reason: parsed.data.feedback || "Revisions requested by campaign owner",
      })
      .eq("id", deliv.id);

    if (error) return { status: "error", message: "Could not request revisions." };
    revalidatePath("/dashboard/clipping/campaigns");
    return { status: "success", message: "Revision request sent to creator." };
  } else {
    // Approved
    const { error } = await supabase
      .from("pr_deliverables")
      .update({
        draft_status: "approved",
        fail_reason: null,
      })
      .eq("id", deliv.id);

    if (error) return { status: "error", message: "Could not approve draft." };
    revalidatePath("/dashboard/clipping/campaigns");
    return { status: "success", message: "Draft approved! Creator has been cleared to publish." };
  }
}

// -------------------------------------------------------------
// 8. Submit Live Post URL (Creator)
// -------------------------------------------------------------
export async function submitPrPostUrl(input: unknown): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Database unconfigured." };

  const parsed = submitPrPostUrlSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message || "Invalid URL." };

  const supabase = await createSessionClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { status: "error", message: "Please sign in." };

  // Fetch deliverable, application, and campaign platforms
  const { data: deliv, error: delivErr } = await supabase
    .from("pr_deliverables")
    .select(`
      id,
      draft_status,
      application:pr_applications (
        id,
        creator_id,
        platform_account_id,
        campaign:clip_campaigns (
          id,
          platforms,
          content_approval_required
        )
      )
    `)
    .eq("id", parsed.data.deliverable_id)
    .single();

  if (delivErr || !deliv || !deliv.application) {
    return { status: "error", message: "Deliverable not found." };
  }

  type SubmitAppInfo = {
    creator_id: string;
    campaign: {
      content_approval_required?: boolean;
      platforms?: string[];
    };
  };
  const app = deliv.application as unknown as SubmitAppInfo;
  if (app.creator_id !== authData.user.id) {
    return { status: "error", message: "Unauthorized submission." };
  }

  // Ensure draft is approved if content approval was required
  if (app.campaign.content_approval_required && deliv.draft_status !== "approved") {
    return { status: "error", message: "You must receive draft approval from the campaign owner before publishing." };
  }

  // Extract platform and normalize ID
  let normalizedId: string | null = null;
  const url = parsed.data.post_url;

  for (const plat of app.campaign.platforms || ["youtube_shorts", "instagram_reels"]) {
    try {
      const res = normalizeClipUrl(url, plat as import("@/lib/clipping/types").PlatformType);
      if (res.success && res.normalisedId) {
        normalizedId = res.normalisedId;
        break;
      }
    } catch {
      // Continue check
    }
  }

  if (!normalizedId) {
    return { status: "error", message: "Please submit a valid YouTube Shorts or Instagram Reels URL." };
  }

  const now = new Date().toISOString();
  const { error: updateErr } = await supabase
    .from("pr_deliverables")
    .update({
      post_url: parsed.data.post_url,
      post_id_normalised: normalizedId,
      posted_at_submitted: now,
      status: "pending",
    })
    .eq("id", deliv.id);

  if (updateErr) {
    if (updateErr.code === "23505") {
      return { status: "error", message: "This post URL has already been submitted to CIRCLE." };
    }
    return { status: "error", message: "Could not record post submission." };
  }

  revalidatePath("/dashboard/clipping");
  return { status: "success", message: "Post URL submitted! CIRCLE admin will verify the post is live and properly disclosed." };
}

// -------------------------------------------------------------
// 9. Admin Verify PR Live & ASCI Disclosure
// -------------------------------------------------------------
export async function adminVerifyPrLive(input: unknown): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin.ok) return { status: "error", message: "Admin authorization required." };

  const parsed = adminVerifyPrLiveSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Invalid verification inputs." };

  const supabase = await createSessionClient();
  const now = new Date().toISOString();

  // Fetch deliverable
  const { data: deliv, error: fetchErr } = await supabase
    .from("pr_deliverables")
    .select(`
      id,
      application_id,
      live_checks,
      application:pr_applications (
        campaign_id,
        quote_inr,
        campaign:clip_campaigns (
          id,
          pricing_mode,
          fee_per_post_inr,
          budget_reserved_inr
        )
      )
    `)
    .eq("id", parsed.data.deliverable_id)
    .single();

  if (fetchErr || !deliv) return { status: "error", message: "Deliverable not found." };

  const checkRecord = {
    checked_at: now,
    is_live: parsed.data.is_compliant,
    has_disclosure: parsed.data.is_compliant,
    notes: parsed.data.notes || null,
  };

  const updatedChecks = [...(deliv.live_checks || []), checkRecord];

  if (parsed.data.is_compliant) {
    const { error } = await supabase
      .from("pr_deliverables")
      .update({
        status: "live_verified",
        live_checks: updatedChecks,
        fail_reason: null,
      })
      .eq("id", deliv.id);

    if (error) return { status: "error", message: "Could not verify deliverable." };

    await supabase.from("admin_actions").insert({
      admin_id: admin.userId,
      action: "verify_pr_live",
      target_type: "pr_deliverable",
      target_id: deliv.id,
      notes: "Confirmed post live with ASCI disclosure. 7-day hold started.",
      detail: checkRecord,
    });

    revalidatePath("/admin/clipping");
    return { status: "success", message: "Post verified live! 7-day maturation countdown initiated." };
  } else {
    // Failed compliance
    const { error } = await supabase
      .from("pr_deliverables")
      .update({
        status: "failed",
        live_checks: updatedChecks,
        fail_reason: parsed.data.notes || "Post not live or missing ASCI ad disclosure",
      })
      .eq("id", deliv.id);

    if (error) return { status: "error", message: "Could not update failure status." };

    // Restore campaign budget reservation
    type AdminRestoreAppInfo = {
      quote_inr?: number;
      campaign: {
        id: string;
        pricing_mode?: string;
        fee_per_post_inr?: number;
        budget_reserved_inr?: number;
      };
    };
    const app = deliv.application as unknown as AdminRestoreAppInfo;
    const agreedFee = app.campaign.pricing_mode === "fixed" ? (app.campaign.fee_per_post_inr || 0) : (app.quote_inr || 0);
    const restoredBudget = Math.max(0, (app.campaign.budget_reserved_inr || 0) - agreedFee);

    await supabase
      .from("clip_campaigns")
      .update({ budget_reserved_inr: restoredBudget })
      .eq("id", app.campaign.id);

    await supabase.from("admin_actions").insert({
      admin_id: admin.userId,
      action: "reject_pr_live",
      target_type: "pr_deliverable",
      target_id: deliv.id,
      notes: parsed.data.notes || "Post failed verification. Budget reservation restored.",
      detail: checkRecord,
    });

    revalidatePath("/admin/clipping");
    return { status: "success", message: "Deliverable marked failed and budget reservation restored." };
  }
}
