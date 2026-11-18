"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatInr } from "@/lib/format";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { applyToPrCampaign } from "@/lib/actions/pr";
import type { Campaign, CreatorPlatform } from "@/lib/clipping/types";

interface PrApplyDialogProps {
  campaign: Campaign;
  userPlatforms: CreatorPlatform[];
  isLoggedIn: boolean;
}

export function PrApplyDialog({ campaign, userPlatforms, isLoggedIn }: PrApplyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>(
    userPlatforms.length > 0 ? userPlatforms[0].id : ""
  );
  const [pitch, setPitch] = useState("");
  const [quoteInr, setQuoteInr] = useState<number>(campaign.fee_per_post_inr || 5000);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const minFollowers = campaign.min_followers || CLIPPING_CONFIG.pr.minFollowers;
  const isQuoteMode = campaign.pricing_mode === "quote";

  const eligiblePlatforms = userPlatforms.filter(
    (p) => p.verified && (p.admin_verified_followers || 0) >= minFollowers
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);

    if (!selectedPlatformId) {
      setStatusMsg({ type: "error", text: "Please select an account with at least 10,000 verified followers." });
      return;
    }

    startTransition(async () => {
      const res = await applyToPrCampaign({
        campaign_id: campaign.id,
        platform_account_id: selectedPlatformId,
        pitch,
        quote_inr: isQuoteMode ? quoteInr : undefined,
      });

      if (res.status === "success") {
        setStatusMsg({ type: "success", text: res.message });
        setPitch("");
        setTimeout(() => setIsOpen(false), 2500);
      } else {
        setStatusMsg({ type: "error", text: res.message });
      }
    });
  }

  const prGross = campaign.fee_per_post_inr || 0;
  const prNet = prGross - Math.floor((prGross * CLIPPING_CONFIG.pr.creatorFeePct) / 100);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-full bg-lime px-8 text-base font-semibold text-bg transition-colors hover:bg-lime/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        Apply with Verified Page (10K+)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isPending && setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-lime font-mono">
                  Social Media PR Application
                </span>
                <h3 className="font-display mt-1 text-2xl font-bold tracking-tight text-white">
                  Pitch to {campaign.owner_name}
                </h3>
                <p className="mt-1 text-xs text-silver">
                  Format: <strong className="text-text capitalize">{campaign.deliverable_type || "Post"}</strong> · Floor:{" "}
                  <strong className="text-text">{minFollowers.toLocaleString("en-IN")}+ verified followers</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-silver hover:bg-surface hover:text-white"
              >
                ✕
              </button>
            </div>

            {statusMsg ? (
              <div
                className={`rounded-xl border p-4 text-small ${
                  statusMsg.type === "success"
                    ? "border-lime/30 bg-lime/10 text-lime"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}
              >
                {statusMsg.text}
              </div>
            ) : null}

            {!isLoggedIn ? (
              <div className="rounded-xl border border-border bg-surface p-6 text-center space-y-3">
                <p className="text-sm text-silver">
                  Sign in with your CIRCLE creator account to submit your pitch and select your verified 10K+ follower account.
                </p>
                <Link
                  href={`/login?next=/clipping/campaigns/${campaign.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 text-sm font-semibold text-bg"
                >
                  Sign in
                </Link>
              </div>
            ) : eligiblePlatforms.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-6 text-center space-y-3">
                <div className="text-2xl">🔒</div>
                <h4 className="font-display text-base font-semibold text-text uppercase">
                  10,000+ Verified Followers Required
                </h4>
                <p className="text-xs text-silver max-w-sm mx-auto leading-relaxed">
                  Only accounts with at least {minFollowers.toLocaleString("en-IN")} admin-verified followers can participate in PR campaigns. Connect your account in Clipper Studio and complete bio verification.
                </p>
                <div className="pt-2">
                  <Link
                    href="/dashboard/clipping"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 text-xs font-semibold text-bg"
                  >
                    Open Clipper Studio to Connect Account
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Select Account */}
                <div>
                  <label htmlFor="pr-account" className="block text-xs font-medium uppercase text-silver">
                    Verified Account *
                  </label>
                  <select
                    id="pr-account"
                    required
                    value={selectedPlatformId}
                    onChange={(e) => setSelectedPlatformId(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text focus:border-lime focus:outline-none"
                  >
                    {eligiblePlatforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        @{p.handle} ({p.platform === "youtube_shorts" ? "YouTube" : "Instagram"} ·{" "}
                        {(p.admin_verified_followers || 0).toLocaleString("en-IN")} verified followers)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pitch */}
                <div>
                  <label htmlFor="pr-pitch" className="block text-xs font-medium uppercase text-silver">
                    Your Pitch & Narrative Angle * (Min 20 chars)
                  </label>
                  <textarea
                    id="pr-pitch"
                    required
                    rows={4}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Briefly describe how you will frame this story for your audience, key visual hooks, and why your followers will engage."
                    className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text placeholder-silver/50 focus:border-lime focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-silver">
                    Do not share phone numbers or email addresses. All communication remains on CIRCLE.
                  </p>
                </div>

                {/* Pricing: Quote vs Fixed */}
                {isQuoteMode ? (
                  <div>
                    <label htmlFor="pr-quote" className="block text-xs font-medium uppercase text-silver">
                      Your Proposed Quote (INR) *
                    </label>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-3 text-silver">₹</span>
                      <input
                        id="pr-quote"
                        type="number"
                        required
                        min={500}
                        step={500}
                        value={quoteInr}
                        onChange={(e) => setQuoteInr(Number(e.target.value))}
                        className="w-full rounded-xl border border-border bg-bg pl-8 pr-4 py-3 text-sm text-text focus:border-lime focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-silver">
                      CIRCLE retains a 10% platform fee upon lock. You will receive net{" "}
                      <strong className="text-lime">
                        {formatInr(quoteInr - Math.floor((quoteInr * CLIPPING_CONFIG.pr.creatorFeePct) / 100))}
                      </strong>
                      .
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-surface p-4 text-xs space-y-1">
                    <p className="text-silver uppercase tracking-wider font-semibold">Fixed Campaign Compensation</p>
                    <p className="font-display text-lg font-bold text-lime">
                      {formatInr(prNet)}{" "}
                      <span className="text-xs font-normal text-silver">net payout per post</span>
                    </p>
                    <p className="text-silver/80">
                      Gross: {formatInr(prGross)} · Deducts CIRCLE 10% platform fee on Day 7 maturation.
                    </p>
                  </div>
                )}

                {/* Compliance Disclosure Notice */}
                <div className="rounded-xl border border-border bg-surface p-4 text-xs text-silver space-y-1">
                  <p className="font-semibold text-text">ASCI Disclosure & 7-Day Live Hold</p>
                  <p>
                    By applying, you agree to tag the post with the native paid-partnership label plus #ad or #collab. The post must remain live, public, and unedited for 7 days before earnings lock.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-xs font-medium text-silver hover:text-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 text-xs font-semibold text-bg transition hover:bg-lime/90 disabled:opacity-50"
                  >
                    {isPending ? "Submitting..." : "Submit Pitch"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
