"use client";

import { useState, useTransition } from "react";
import { formatInr, formatKolkata } from "@/lib/format";
import {
  adminApproveCampaign,
  adminFundCampaign,
  adminVerifyPlatformBio,
  adminVerifyFollowers,
  adminMarkPayoutPaid,
} from "@/lib/actions/clipping-admin";

import type { Campaign, CreatorPlatform, PayoutRequest } from "@/lib/clipping/types";

export interface AdminActionRecord {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  notes?: string | null;
  created_at: string;
  admin?: { display_name?: string | null } | null;
}

export interface AdminClippingData {
  pendingCampaigns: (Campaign & { owner?: { display_name?: string | null } })[];
  pendingPlatforms: (CreatorPlatform & { profile?: { display_name?: string | null } })[];
  pendingPayouts: (PayoutRequest & { profile?: { display_name?: string | null } })[];
  recentActions: AdminActionRecord[];
}

export function ClippingAdminPanel({ initialData }: { initialData: AdminClippingData }) {
  const [data, setData] = useState<AdminClippingData>(initialData);
  const [tab, setTab] = useState<"campaigns" | "platforms" | "payouts" | "audit">("campaigns");
  const [isPending, startTransition] = useTransition();

  // Action states
  const [fundRefMap, setFundRefMap] = useState<Record<string, string>>({});
  const [followersMap, setFollowersMap] = useState<Record<string, number>>({});
  const [payoutRefMap, setPayoutRefMap] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ text: string; isError?: boolean } | null>(null);

  // Tab 1: Approve Campaign
  function handleApproveCampaign(campaignId: string) {
    setNotice(null);
    startTransition(async () => {
      const res = await adminApproveCampaign(campaignId);
      if (res.status === "success") {
        setNotice({ text: "Campaign approved! Now awaiting invoice payment." });
        setData((prev) => ({
          ...prev,
          pendingCampaigns: prev.pendingCampaigns.map((c) =>
            c.id === campaignId ? { ...c, status: "approved" } : c
          ),
        }));
      } else {
        setNotice({ text: res.message, isError: true });
      }
    });
  }

  // Tab 1: Fund Campaign
  function handleFundCampaign(campaignId: string) {
    const ref = fundRefMap[campaignId]?.trim();
    if (!ref) {
      setNotice({ text: "Please enter the bank UTR or invoice reference.", isError: true });
      return;
    }

    setNotice(null);
    startTransition(async () => {
      const res = await adminFundCampaign({ campaign_id: campaignId, funded_ref: ref });
      if (res.status === "success") {
        setNotice({ text: "Campaign funded and launched live!" });
        setData((prev) => ({
          ...prev,
          pendingCampaigns: prev.pendingCampaigns.filter((c) => c.id !== campaignId),
        }));
      } else {
        setNotice({ text: res.message, isError: true });
      }
    });
  }

  // Tab 2: Verify Platform Bio
  function handleVerifyBio(platformId: string) {
    setNotice(null);
    startTransition(async () => {
      const res = await adminVerifyPlatformBio(platformId);
      if (res.status === "success") {
        setNotice({ text: "Account ownership confirmed via bio verification code." });
        setData((prev) => ({
          ...prev,
          pendingPlatforms: prev.pendingPlatforms.map((p) =>
            p.id === platformId ? { ...p, verified: true } : p
          ),
        }));
      } else {
        setNotice({ text: res.message, isError: true });
      }
    });
  }

  // Tab 2: Record Verified Followers
  function handleSetFollowers(platformId: string) {
    const followers = followersMap[platformId];
    if (followers === undefined || followers < 0) {
      setNotice({ text: "Enter a valid follower count.", isError: true });
      return;
    }

    setNotice(null);
    startTransition(async () => {
      const res = await adminVerifyFollowers({
        platform_account_id: platformId,
        followers,
      });
      if (res.status === "success") {
        setNotice({ text: `Recorded ${followers.toLocaleString("en-IN")} verified followers.` });
        setData((prev) => ({
          ...prev,
          pendingPlatforms: prev.pendingPlatforms.map((p) =>
            p.id === platformId ? { ...p, admin_verified_followers: followers } : p
          ),
        }));
      } else {
        setNotice({ text: res.message, isError: true });
      }
    });
  }

  // Tab 3: Mark Payout Paid
  function handleMarkPayoutPaid(payoutId: string) {
    const ref = payoutRefMap[payoutId]?.trim();
    if (!ref) {
      setNotice({ text: "Please enter the bank UTR for this UPI transfer.", isError: true });
      return;
    }

    setNotice(null);
    startTransition(async () => {
      const res = await adminMarkPayoutPaid(payoutId, ref);
      if (res.status === "success") {
        setNotice({ text: "Payout marked paid and recorded in ledger." });
        setData((prev) => ({
          ...prev,
          pendingPayouts: prev.pendingPayouts.filter((p) => p.id !== payoutId),
        }));
      } else {
        setNotice({ text: res.message, isError: true });
      }
    });
  }

  // Export CSV for banking payouts
  function handleExportPayoutsCsv() {
    if (data.pendingPayouts.length === 0) return;
    const headers = ["payout_id", "profile_id", "clipper_name", "upi_id", "amount_inr", "created_at"];
    const rows = data.pendingPayouts.map((p) => [
      p.id,
      p.profile_id,
      p.profile?.display_name || "Clipper",
      p.upi_id || p.upi_id_encrypted,
      p.amount_inr,
      p.created_at,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `circle_clipping_payouts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-8">
      {/* Notice Banner */}
      {notice ? (
        <div
          className={`rounded-xl border p-4 text-small ${
            notice.isError
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-lime/30 bg-lime/10 text-lime"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setTab("campaigns")}
          className={`min-h-11 rounded-full px-5 text-sm font-medium transition ${
            tab === "campaigns"
              ? "bg-lime text-bg font-semibold"
              : "border border-border bg-surface text-silver hover:text-text"
          }`}
        >
          Campaign Moderation ({data.pendingCampaigns.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("platforms")}
          className={`min-h-11 rounded-full px-5 text-sm font-medium transition ${
            tab === "platforms"
              ? "bg-lime text-bg font-semibold"
              : "border border-border bg-surface text-silver hover:text-text"
          }`}
        >
          Bio Verification Queue ({data.pendingPlatforms.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("payouts")}
          className={`min-h-11 rounded-full px-5 text-sm font-medium transition ${
            tab === "payouts"
              ? "bg-lime text-bg font-semibold"
              : "border border-border bg-surface text-silver hover:text-text"
          }`}
        >
          UPI Payout Queue ({data.pendingPayouts.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("audit")}
          className={`min-h-11 rounded-full px-5 text-sm font-medium transition ${
            tab === "audit"
              ? "bg-lime text-bg font-semibold"
              : "border border-border bg-surface text-silver hover:text-text"
          }`}
        >
          Audit Trail ({data.recentActions.length})
        </button>
      </div>

      {/* TAB 1: Campaigns Moderation & Funding */}
      {tab === "campaigns" && (
        <div className="space-y-4">
          {data.pendingCampaigns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center">
              <p className="font-display text-lead font-medium uppercase text-text">No Campaigns Awaiting Review</p>
              <p className="mt-1 text-small text-silver">All submitted campaigns have been approved or funded.</p>
            </div>
          ) : (
            data.pendingCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs font-mono uppercase text-silver">
                        {camp.campaign_type || "clipping"}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase ${
                          camp.status === "pending_review"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {camp.status === "pending_review" ? "Pending Review" : "Approved · Awaiting UTR"}
                      </span>
                      <span className="text-xs text-silver">
                        Submitted {formatKolkata(camp.created_at)}
                      </span>
                    </div>

                    <h3 className="font-display mt-2 text-xl font-medium tracking-tight text-text">
                      {camp.title}
                    </h3>
                    <p className="mt-1 text-small text-silver">
                      Owner: <strong className="text-text">{camp.owner?.display_name || "Brand"}</strong> · Category:{" "}
                      <strong className="text-text">{camp.category}</strong>
                    </p>
                    <p className="mt-2 text-small text-silver max-w-2xl">{camp.summary}</p>
                  </div>

                  {/* Financials Summary */}
                  <div className="rounded-xl border border-border bg-bg p-4 text-xs space-y-1 sm:min-w-64">
                    <p className="text-silver">
                      Budget Escrow: <strong className="text-text">{formatInr(camp.budget_inr)}</strong>
                    </p>
                    <p className="text-silver">
                      CIRCLE 10% Fee: <strong className="text-text">{formatInr(camp.owner_fee_inr || 0)}</strong>
                    </p>
                    <p className="border-t border-border pt-1 font-medium text-lime">
                      Total Invoice: {formatInr(camp.budget_inr + (camp.owner_fee_inr || 0))}
                    </p>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-silver">
                    Rights Confirmed:{" "}
                    {camp.rights_confirmed_at ? (
                      <span className="text-lime">✓ Legal confirmation on record</span>
                    ) : (
                      <span className="text-red-400">✗ Rights unconfirmed</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {camp.status === "pending_review" ? (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleApproveCampaign(camp.id)}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90 disabled:opacity-50"
                      >
                        Approve Campaign
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          placeholder="Bank UTR / Invoice Ref (e.g. UTR-20261118-01)"
                          value={fundRefMap[camp.id] || ""}
                          onChange={(e) =>
                            setFundRefMap({ ...fundRefMap, [camp.id]: e.target.value })
                          }
                          className="rounded-xl border border-border bg-bg px-4 py-2 text-xs text-text placeholder-silver/50 focus:border-lime focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleFundCampaign(camp.id)}
                          className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 text-xs font-semibold text-bg transition hover:bg-lime/90 disabled:opacity-50"
                        >
                          Confirm Payment & Launch
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Bio & Follower Verification Queue */}
      {tab === "platforms" && (
        <div className="space-y-4">
          {data.pendingPlatforms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center">
              <p className="font-display text-lead font-medium uppercase text-text">No Accounts Pending Bio Verification</p>
              <p className="mt-1 text-small text-silver">All creator platforms have been verified.</p>
            </div>
          ) : (
            data.pendingPlatforms.map((plat) => (
              <div
                key={plat.id}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs font-mono uppercase text-silver">
                        {plat.platform === "youtube_shorts" ? "YouTube Shorts" : "Instagram"}
                      </span>
                      <span className="text-xs text-silver">
                        Submitted {formatKolkata(plat.created_at)}
                      </span>
                    </div>

                    <h3 className="font-display mt-2 text-xl font-medium tracking-tight text-text">
                      @{plat.handle}
                    </h3>
                    <p className="mt-1 text-small text-silver">
                      Creator: <strong className="text-text">{plat.profile?.display_name || "Creator"}</strong>
                    </p>
                  </div>

                  {/* Bio Code Box */}
                  <div className="rounded-xl border border-dashed border-border bg-bg p-4 text-center sm:min-w-48">
                    <p className="text-xs uppercase tracking-wider text-silver">Required Code in Bio</p>
                    <p className="font-mono mt-1 text-lg font-bold text-lime">
                      {plat.verification_code}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Followers seen (e.g. 15400)"
                      value={followersMap[plat.id] ?? ""}
                      onChange={(e) =>
                        setFollowersMap({ ...followersMap, [plat.id]: Number(e.target.value) })
                      }
                      className="w-44 rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text focus:border-lime focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleSetFollowers(plat.id)}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg px-3 text-xs font-medium text-text hover:border-lime disabled:opacity-50"
                    >
                      Record Count
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleVerifyBio(plat.id)}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90 disabled:opacity-50"
                    >
                      Confirm Bio Match & Verify Account
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: UPI Payouts Queue */}
      {tab === "payouts" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
                Pending Creator Payouts
              </h2>
              <p className="mt-1 text-small text-silver">
                Process UPI transfers in bulk via your bank or corporate netbanking portal.
              </p>
            </div>
            {data.pendingPayouts.length > 0 && (
              <button
                type="button"
                onClick={handleExportPayoutsCsv}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-medium text-text transition hover:border-lime"
              >
                📥 Export Payouts CSV
              </button>
            )}
          </div>

          {data.pendingPayouts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center">
              <p className="font-display text-lead font-medium uppercase text-text">No Pending Payouts</p>
              <p className="mt-1 text-small text-silver">All withdrawal requests have been settled.</p>
            </div>
          ) : (
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {data.pendingPayouts.map((p) => (
                <div
                  key={p.id}
                  className="p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase text-silver">ID: {p.id.slice(0, 8)}...</span>
                      <span className="text-xs text-silver">
                        Requested {formatKolkata(p.created_at)}
                      </span>
                    </div>
                    <p className="text-base text-text">
                      Creator: <strong className="font-medium">{p.profile?.display_name || "Clipper"}</strong>
                    </p>
                    <p className="font-mono text-sm text-lime">UPI: {p.upi_id || p.upi_id_encrypted}</p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="text-right sm:pr-4">
                      <p className="text-xs uppercase tracking-wider text-silver">Amount to Transfer</p>
                      <p className="font-display text-2xl font-semibold text-text">
                        {formatInr(p.amount_inr)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Bank UPI Ref (UTR)"
                        value={payoutRefMap[p.id] || ""}
                        onChange={(e) =>
                          setPayoutRefMap({ ...payoutRefMap, [p.id]: e.target.value })
                        }
                        className="rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text placeholder-silver/50 focus:border-lime focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleMarkPayoutPaid(p.id)}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 text-xs font-semibold text-bg transition hover:bg-lime/90 disabled:opacity-50"
                      >
                        Confirm Settled
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Audit Trail */}
      {tab === "audit" && (
        <div className="space-y-4">
          <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
            System Moderation Audit Log
          </h2>
          <p className="text-small text-silver">
            Immutable log of all financial and status changes executed by CIRCLE administrators.
          </p>

          <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {data.recentActions.map((act) => (
              <div key={act.id} className="p-4 sm:p-5 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-semibold text-lime">
                    {act.action}
                  </span>
                  <span className="text-xs text-silver">{formatKolkata(act.created_at)}</span>
                </div>
                <p className="text-silver">
                  Target: <strong className="text-text font-mono text-xs">{act.target_type} ({act.target_id?.slice(0, 8)})</strong> · Admin:{" "}
                  <strong className="text-text">{act.admin?.display_name || act.admin_id?.slice(0, 8)}</strong>
                </p>
                {act.notes ? (
                  <p className="text-xs text-silver font-mono bg-bg p-2 rounded-lg mt-1">
                    {act.notes}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
