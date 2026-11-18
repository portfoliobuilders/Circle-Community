"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import {
  adminFundCampaignSchema,
  adminVerifyFollowersSchema,
  adminVerifyInstagramSnapshotSchema,
} from "@/lib/validation/clipping";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import type { FormState } from "@/lib/actions/support";

// -------------------------------------------------------------
// Campaign Approval & Funding
// -------------------------------------------------------------

export async function adminApproveCampaign(campaignId: string): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin.ok) return { status: "error", message: "Admin authorization required." };

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("clip_campaigns")
    .update({ status: "approved" })
    .eq("id", campaignId);

  if (error) return { status: "error", message: "Could not approve campaign." };

  await supabase.from("admin_actions").insert({
    admin_id: admin.userId,
    action: "approve_campaign",
    target_type: "clip_campaign",
    target_id: campaignId,
    detail: { timestamp: new Date().toISOString() },
  });

  revalidatePath("/admin/clipping");
  return { status: "success", message: "Campaign approved. Ready for invoice payment." };
}

export async function adminFundCampaign(input: unknown): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin.ok) return { status: "error", message: "Admin authorization required." };

  const parsed = adminFundCampaignSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Valid UTR required." };
  }

  const supabase = await createSessionClient();
  const { data: campaign, error: fetchErr } = await supabase
    .from("clip_campaigns")
    .select("id, status, budget_inr, owner_fee_inr")
    .eq("id", parsed.data.campaign_id)
    .single();

  if (fetchErr || !campaign) {
    return { status: "error", message: "Campaign not found." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("clip_campaigns")
    .update({
      status: "live",
      funded_at: now,
      funded_ref: parsed.data.funded_ref,
      starts_at: now,
    })
    .eq("id", campaign.id);

  if (error) return { status: "error", message: "Could not mark campaign funded." };

  await supabase.from("admin_actions").insert({
    admin_id: admin.userId,
    action: "fund_campaign",
    target_type: "clip_campaign",
    target_id: campaign.id,
    detail: {
      funded_ref: parsed.data.funded_ref,
      budget_inr: campaign.budget_inr,
      owner_fee_inr: campaign.owner_fee_inr,
      timestamp: now,
    },
  });

  revalidatePath("/admin/clipping");
  revalidatePath("/clipping/campaigns");
  return { status: "success", message: "Campaign marked funded and set to LIVE!" };
}

// -------------------------------------------------------------
// Creator Platform Bio Verification & Follower Auditing
// -------------------------------------------------------------

export async function adminVerifyPlatformBio(platformAccountId: string): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin.ok) return { status: "error", message: "Admin authorization required." };

  const supabase = await createSessionClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("creator_platforms")
    .update({
      verified: true,
      verified_at: now,
    })
    .eq("id", platformAccountId);

  if (error) return { status: "error", message: "Could not verify platform account." };

  await supabase.from("admin_actions").insert({
    admin_id: admin.userId,
    action: "verify_platform_bio",
    target_type: "creator_platform",
    target_id: platformAccountId,
    detail: { timestamp: now },
  });

  revalidatePath("/admin/clipping");
  return { status: "success", message: "Platform account verified successfully." };
}

export async function adminVerifyFollowers(input: unknown): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin.ok) return { status: "error", message: "Admin authorization required." };

  const parsed = adminVerifyFollowersSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Invalid follower count." };
  }

  const supabase = await createSessionClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("creator_platforms")
    .update({
      admin_verified_followers: parsed.data.followers,
      followers_verified_at: now,
      followers_verified_by: admin.userId,
    })
    .eq("id", parsed.data.platform_account_id);

  if (error) return { status: "error", message: "Could not record follower count." };

  await supabase.from("admin_actions").insert({
    admin_id: admin.userId,
    action: "verify_followers",
    target_type: "creator_platform",
    target_id: parsed.data.platform_account_id,
    detail: { followers: parsed.data.followers, timestamp: now },
  });

  revalidatePath("/admin/clipping");
  return { status: "success", message: `Follower count (${parsed.data.followers.toLocaleString("en-IN")}) recorded.` };
}

// -------------------------------------------------------------
// View Snapshot Verification & Day-7 Lock Engine
// -------------------------------------------------------------

export async function adminVerifyInstagramSnapshot(input: unknown): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin.ok) return { status: "error", message: "Admin authorization required." };

  const parsed = adminVerifyInstagramSnapshotSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Invalid view counts or parameters." };
  }

  const supabase = await createSessionClient();
  const now = new Date().toISOString();

  // Insert snapshot
  const { error: snapErr } = await supabase.from("clip_view_snapshots").insert({
    submission_id: parsed.data.submission_id,
    views: parsed.data.views,
    likes: parsed.data.likes || null,
    comments: parsed.data.comments || null,
    source: "admin_verified",
    is_live: true,
    evidence_path: parsed.data.evidence_path || null,
    captured_by: admin.userId,
    captured_at: now,
  });

  if (snapErr) return { status: "error", message: "Could not record view snapshot." };

  // Trigger earnings calculation and lock
  const lockResult = await executeClipEarningsLock(parsed.data.submission_id, admin.userId);

  revalidatePath("/admin/clipping");
  return lockResult;
}

/**
 * Idempotent Single-Count Earnings Lock Function.
 * Runs on Day 7 post-submission to lock verified views into wallet ledger.
 */
export async function executeClipEarningsLock(submissionId: string, adminUserId?: string): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Database not configured." };

  const supabase = await createSessionClient();

  // 1. Fetch submission details
  const { data: sub, error: subErr } = await supabase
    .from("clip_submissions")
    .select(`
      id, clipper_id, status, created_at,
      campaign:clip_campaigns (
        id, rate_inr_per_1k, per_clip_view_cap, min_views_to_qualify,
        budget_inr, budget_reserved_inr
      )
    `)
    .eq("id", submissionId)
    .single();

  if (subErr || !sub || !sub.campaign) {
    return { status: "error", message: "Submission or campaign not found." };
  }

  // 2. Fetch highest verified view snapshot
  const { data: latestSnap } = await supabase
    .from("clip_view_snapshots")
    .select("views, is_live")
    .eq("submission_id", submissionId)
    .in("source", ["youtube_api", "admin_verified"])
    .order("views", { ascending: false })
    .limit(1)
    .single();

  if (!latestSnap || !latestSnap.is_live) {
    return { status: "error", message: "No live verified view snapshot found for this clip." };
  }

  const verifiedViews = Number(latestSnap.views);
  const campaign = Array.isArray(sub.campaign) ? sub.campaign[0] : sub.campaign;
  const minViews = campaign.min_views_to_qualify || 1000;
  const ratePer1k = campaign.rate_inr_per_1k || 10;
  const capViews = campaign.per_clip_view_cap || 100000;

  if (verifiedViews < minViews) {
    return {
      status: "success",
      message: `Views (${verifiedViews}) did not reach qualification threshold (${minViews}). Zero earnings locked.`,
    };
  }

  const payableViews = Math.min(verifiedViews, capViews);
  let grossAmount = Math.floor((payableViews / 1000) * ratePer1k);

  // Check remaining budget
  const availableBudget = campaign.budget_inr - campaign.budget_reserved_inr;
  if (availableBudget <= 0) {
    return { status: "error", message: "Campaign budget is completely exhausted." };
  }
  grossAmount = Math.min(grossAmount, availableBudget);

  const feeAmount = Math.floor((grossAmount * CLIPPING_CONFIG.clipperFeePct) / 100);
  const netAmount = grossAmount - feeAmount;
  const now = new Date().toISOString();

  // 3. Upsert clip_earnings
  const { error: earnErr } = await supabase.from("clip_earnings").upsert({
    submission_id: submissionId,
    verified_views: verifiedViews,
    payable_views: payableViews,
    gross_amount_inr: grossAmount,
    fee_amount_inr: feeAmount,
    net_amount_inr: netAmount,
    status: "payable",
    locked_at: now,
    updated_at: now,
  });

  if (earnErr) return { status: "error", message: "Could not update earnings record." };

  // 4. Double ledger rows write: 'earning' (+gross) and 'fee' (-fee)
  // Idempotent via unique(type, ref_type, ref_id)
  const { error: ledgerEarnErr } = await supabase.from("clip_wallet_ledger").upsert({
    profile_id: sub.clipper_id,
    type: "earning",
    amount_inr: grossAmount,
    ref_type: "clip_submission",
    ref_id: submissionId,
    note: `Clip earnings (${payableViews.toLocaleString("en-IN")} views @ ₹${ratePer1k}/1K)`,
    created_by: adminUserId || null,
  });

  const { error: ledgerFeeErr } = await supabase.from("clip_wallet_ledger").upsert({
    profile_id: sub.clipper_id,
    type: "fee",
    amount_inr: -feeAmount,
    ref_type: "clip_submission",
    ref_id: submissionId,
    note: `CIRCLE platform fee (10%)`,
    created_by: adminUserId || null,
  });

  if (ledgerEarnErr || ledgerFeeErr) {
    return { status: "error", message: "Could not write wallet ledger rows." };
  }

  // 5. Reserve budget on campaign
  await supabase
    .from("clip_campaigns")
    .update({
      budget_reserved_inr: campaign.budget_reserved_inr + grossAmount,
    })
    .eq("id", campaign.id);

  if (adminUserId) {
    await supabase.from("admin_actions").insert({
      admin_id: adminUserId,
      action: "lock_clip_earnings",
      target_type: "clip_submission",
      target_id: submissionId,
      detail: {
        verified_views: verifiedViews,
        gross_amount: grossAmount,
        net_amount: netAmount,
        timestamp: now,
      },
    });
  }

  return {
    status: "success",
    message: `Locked ₹${netAmount} net (Gross: ₹${grossAmount}, Fee: ₹${feeAmount}) into clipper wallet.`,
  };
}

// -------------------------------------------------------------
// Payout Processing & UPI Settlement
// -------------------------------------------------------------

export async function adminMarkPayoutPaid(payoutId: string, paidRef: string): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin.ok) return { status: "error", message: "Admin authorization required." };

  if (!paidRef || paidRef.trim().length < 4) {
    return { status: "error", message: "Bank UTR or transaction reference is required." };
  }

  const supabase = await createSessionClient();
  const now = new Date().toISOString();

  const { data: req, error: fetchErr } = await supabase
    .from("clip_payout_requests")
    .select("id, profile_id, amount_inr, status")
    .eq("id", payoutId)
    .single();

  if (fetchErr || !req) {
    return { status: "error", message: "Payout request not found." };
  }

  // Update payout request status
  const { error: updateErr } = await supabase
    .from("clip_payout_requests")
    .update({
      status: "paid",
      paid_ref: paidRef.trim(),
      paid_at: now,
      processed_by: admin.userId,
    })
    .eq("id", payoutId);

  if (updateErr) return { status: "error", message: "Could not update payout status." };

  // Write debit to wallet ledger
  await supabase.from("clip_wallet_ledger").upsert({
    profile_id: req.profile_id,
    type: "payout",
    amount_inr: -req.amount_inr,
    ref_type: "payout_request",
    ref_id: payoutId,
    note: `UPI Payout UTR: ${paidRef.trim()}`,
    created_by: admin.userId,
  });

  await supabase.from("admin_actions").insert({
    admin_id: admin.userId,
    action: "mark_payout_paid",
    target_type: "clip_payout_request",
    target_id: payoutId,
    detail: { amount_inr: req.amount_inr, paid_ref: paidRef.trim(), timestamp: now },
  });

  revalidatePath("/admin/clipping");
  return { status: "success", message: `Payout marked paid with UTR: ${paidRef.trim()}` };
}
