import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";

export interface PrMaturationResult {
  processed: number;
  paidCount: number;
  totalPaidInr: number;
  errors: string[];
}

/**
 * Executes 7-day live maturation hold for Social Media PR deliverables.
 * When a deliverable post has remained live, public, and disclosed for PR_LIVE_DAYS (7 days),
 * it atomically writes earning (+gross) and fee (-10%) rows into clip_wallet_ledger.
 */
export async function runMaturedPrDeliverablesBatch(): Promise<PrMaturationResult> {
  if (!isSupabaseConfigured()) {
    return { processed: 0, paidCount: 0, totalPaidInr: 0, errors: ["Database unconfigured"] };
  }

  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - CLIPPING_CONFIG.pr.liveDays * 24 * 60 * 60 * 1000).toISOString();

  // Find all live_verified deliverables submitted before the 7-day cutoff
  const { data: deliverables, error: fetchErr } = await supabase
    .from("pr_deliverables")
    .select(`
      id,
      application_id,
      post_url,
      posted_at_submitted,
      application:pr_applications (
        id,
        creator_id,
        quote_inr,
        campaign:clip_campaigns (
          id,
          pricing_mode,
          fee_per_post_inr,
          budget_inr,
          budget_reserved_inr,
          budget_paid_inr
        )
      )
    `)
    .eq("status", "live_verified")
    .lte("posted_at_submitted", cutoff);

  if (fetchErr || !deliverables || deliverables.length === 0) {
    return { processed: 0, paidCount: 0, totalPaidInr: 0, errors: fetchErr ? [fetchErr.message] : [] };
  }

  let paidCount = 0;
  let totalPaidInr = 0;
  const errors: string[] = [];

  for (const deliv of deliverables) {
    try {
      type PrAppInfo = {
        creator_id: string;
        quote_inr?: number;
        campaign: {
          id: string;
          pricing_mode?: string;
          fee_per_post_inr?: number;
          owner_id: string;
          budget_reserved_inr?: number;
          budget_paid_inr?: number;
        };
      };
      const app = deliv.application as unknown as PrAppInfo;
      if (!app || !app.campaign) continue;

      const grossFee = app.campaign.pricing_mode === "fixed" ? (app.campaign.fee_per_post_inr || 0) : (app.quote_inr || 0);
      if (grossFee <= 0) continue;

      const feeInr = Math.floor((grossFee * CLIPPING_CONFIG.pr.creatorFeePct) / 100);
      const netFee = grossFee - feeInr;

      // 1. Write double ledger rows atomically
      // Row 1: Earning (+gross)
      const { error: earnErr } = await supabase
        .from("clip_wallet_ledger")
        .insert({
          profile_id: app.creator_id,
          type: "earning",
          ref_type: "pr_deliverable",
          ref_id: deliv.id,
          amount_inr: grossFee,
          description: `Social Media PR Deliverable: Net ₹${netFee.toLocaleString("en-IN")} after CIRCLE 10% fee`,
        });

      if (earnErr && earnErr.code !== "23505") {
        errors.push(`Ledger earning failed for deliverable ${deliv.id}: ${earnErr.message}`);
        continue;
      }

      // Row 2: Fee (-10%)
      const { error: feeErr } = await supabase
        .from("clip_wallet_ledger")
        .insert({
          profile_id: app.creator_id,
          type: "fee",
          ref_type: "pr_deliverable",
          ref_id: deliv.id,
          amount_inr: -feeInr,
          description: "CIRCLE 10% Platform Service Fee",
        });

      if (feeErr && feeErr.code !== "23505") {
        errors.push(`Ledger fee failed for deliverable ${deliv.id}: ${feeErr.message}`);
      }

      // 2. Update Campaign budget allocations
      const currentReserved = app.campaign.budget_reserved_inr || 0;
      const currentPaid = app.campaign.budget_paid_inr || 0;

      await supabase
        .from("clip_campaigns")
        .update({
          budget_reserved_inr: Math.max(0, currentReserved - grossFee),
          budget_paid_inr: currentPaid + grossFee,
        })
        .eq("id", app.campaign.id);

      // 3. Mark Deliverable as Paid
      await supabase
        .from("pr_deliverables")
        .update({ status: "paid" })
        .eq("id", deliv.id);

      paidCount++;
      totalPaidInr += netFee;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Error processing deliverable ${deliv.id}: ${msg}`);
    }
  }

  return {
    processed: deliverables.length,
    paidCount,
    totalPaidInr,
    errors,
  };
}
