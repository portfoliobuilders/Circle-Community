"use client";

import { useState, useTransition, useSyncExternalStore } from "react";
import { formatInr, formatKolkata } from "@/lib/format";
import { acceptPrApplication, rejectPrApplication, reviewPrDraft } from "@/lib/actions/pr";
import type { Campaign, PrApplication } from "@/lib/clipping/types";

const emptySubscribe = () => () => { };

export function OwnerPrCampaignManager({
  campaign,
  initialApplications,
}: {
  campaign: Campaign;
  initialApplications: PrApplication[];
}) {
  const now = useSyncExternalStore(emptySubscribe, () => Date.now(), () => 0);
  const [applications, setApplications] = useState<PrApplication[]>(initialApplications);
  const [filter, setFilter] = useState<"all" | "applied" | "accepted" | "rejected">("all");
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [actionNotice, setActionNotice] = useState<{ id: string; text: string; isError?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const acceptedCount = applications.filter((a) => a.status === "accepted").length;
  const appliedCount = applications.filter((a) => a.status === "applied").length;

  function handleAccept(applicationId: string) {
    setActionNotice(null);
    startTransition(async () => {
      const res = await acceptPrApplication({ application_id: applicationId });
      if (res.status === "success") {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === applicationId
              ? {
                ...a,
                status: "accepted",
                deliverable: {
                  id: "temp-" + Date.now(),
                  application_id: a.id,
                  draft_status: campaign.content_approval_required ? "none" : "approved",
                  revision_count: 0,
                  live_checks: [],
                  status: "pending",
                  created_at: new Date().toISOString(),
                },
              }
              : a
          )
        );
        setActionNotice({ id: applicationId, text: "Application accepted! Deliverable slot reserved." });
      } else {
        setActionNotice({ id: applicationId, text: res.message, isError: true });
      }
    });
  }

  function handleReject(applicationId: string) {
    setActionNotice(null);
    startTransition(async () => {
      const res = await rejectPrApplication({ application_id: applicationId });
      if (res.status === "success") {
        setApplications((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, status: "rejected" } : a))
        );
        setActionNotice({ id: applicationId, text: "Application declined." });
      } else {
        setActionNotice({ id: applicationId, text: res.message, isError: true });
      }
    });
  }

  function handleReviewDraft(deliverableId: string, decision: "approved" | "changes_requested") {
    const feedback = feedbackMap[deliverableId]?.trim();
    if (decision === "changes_requested" && !feedback) {
      setActionNotice({ id: deliverableId, text: "Please enter feedback describing the requested changes.", isError: true });
      return;
    }

    setActionNotice(null);
    startTransition(async () => {
      const res = await reviewPrDraft({
        deliverable_id: deliverableId,
        decision,
        feedback: decision === "changes_requested" ? feedback : undefined,
      });

      if (res.status === "success") {
        setActionNotice({
          id: deliverableId,
          text: decision === "approved" ? "Draft approved! Creator cleared to post." : "Changes requested (Revision 1).",
        });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setActionNotice({ id: deliverableId, text: res.message, isError: true });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase text-silver">Slots Filled</p>
          <p className="font-display text-xl font-bold text-text mt-1">
            {acceptedCount} / {campaign.slots}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase text-silver">Pending Pitches</p>
          <p className="font-display text-xl font-bold text-amber-400 mt-1">
            {appliedCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase text-silver">Budget Reserved</p>
          <p className="font-display text-xl font-bold text-lime mt-1">
            {formatInr(campaign.budget_reserved_inr)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase text-silver">Budget Paid</p>
          <p className="font-display text-xl font-bold text-text mt-1">
            {formatInr(campaign.budget_paid_inr)}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`min-h-11 rounded-full px-4 text-xs font-medium transition ${filter === "all" ? "bg-lime text-bg font-semibold" : "border border-border bg-surface text-silver hover:text-text"
            }`}
        >
          All Applications ({applications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("applied")}
          className={`min-h-11 rounded-full px-4 text-xs font-medium transition ${filter === "applied" ? "bg-amber-400 text-bg font-semibold" : "border border-border bg-surface text-silver hover:text-text"
            }`}
        >
          Pending Review ({appliedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("accepted")}
          className={`min-h-11 rounded-full px-4 text-xs font-medium transition ${filter === "accepted" ? "bg-lime/20 text-lime font-semibold border border-lime/40" : "border border-border bg-surface text-silver hover:text-text"
            }`}
        >
          Accepted & Deliverables ({acceptedCount})
        </button>
      </div>

      {/* Applications / Deliverables List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center">
          <p className="font-display text-lead font-medium uppercase text-text">No Applications Found</p>
          <p className="mt-1 text-small text-silver">
            {filter === "all"
              ? "No creators have applied to this PR campaign yet."
              : `No applications currently in '${filter}' status.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const deliv = app.deliverable;
            const matureDate = deliv?.posted_at_submitted
              ? new Date(new Date(deliv.posted_at_submitted).getTime() + 7 * 24 * 60 * 60 * 1000)
              : null;
            const isMatured = matureDate ? now > 0 && now >= matureDate.getTime() : false;

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs font-mono uppercase text-silver">
                        @{app.platform_account?.handle || "creator"}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-lime/30 bg-lime/10 px-2.5 py-0.5 text-xs font-mono text-lime font-medium">
                        {(app.platform_account?.admin_verified_followers || 0).toLocaleString("en-IN")} verified followers
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase ${app.status === "accepted"
                            ? "border-lime/30 bg-lime/10 text-lime"
                            : app.status === "rejected"
                              ? "border-red-500/30 bg-red-500/10 text-red-400"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          }`}
                      >
                        {app.status}
                      </span>
                      <span className="text-xs text-silver">
                        Applied {formatKolkata(app.created_at)}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-silver">
                        Creator: <strong className="text-text">{app.creator?.display_name || "Page Owner"}</strong>
                      </p>
                      <div className="mt-2 rounded-xl border border-border bg-bg p-3 text-xs text-silver">
                        <strong className="text-text uppercase font-semibold text-[11px] block mb-1">Creator Pitch:</strong>
                        <p className="leading-relaxed">&ldquo;{app.pitch}&rdquo;</p>
                      </div>
                    </div>
                  </div>

                  {/* Fee & Action for Applied status */}
                  <div className="flex flex-col items-end gap-3 sm:min-w-48">
                    <div className="text-right">
                      <p className="text-xs text-silver uppercase">Deliverable Fee</p>
                      <p className="font-display text-xl font-bold text-lime">
                        {formatInr(app.quote_inr || campaign.fee_per_post_inr || 0)}
                      </p>
                      <p className="text-[10px] text-silver">
                        {campaign.pricing_mode === "quote" ? "Creator Quote" : "Fixed Fee"}
                      </p>
                    </div>

                    {app.status === "applied" && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isPending || (campaign.slots != null && acceptedCount >= campaign.slots)}
                          onClick={() => handleAccept(app.id)}
                          className="inline-flex min-h-10 items-center justify-center rounded-full bg-lime px-4 text-xs font-semibold text-bg transition hover:bg-lime/90 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleReject(app.id)}
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg px-3 text-xs text-red-400 hover:border-red-500/50 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deliverable Review (for accepted applications) */}
                {app.status === "accepted" && deliv && (
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs uppercase font-semibold text-silver">
                        Deliverable Status: <strong className="text-text">{deliv.status}</strong>
                      </p>
                      <span className="text-xs text-silver">
                        Draft Status: <strong className="text-lime uppercase">{deliv.draft_status}</strong>
                      </span>
                    </div>

                    {/* Draft Review Card */}
                    {deliv.draft_status === "submitted" && (
                      <div className="rounded-xl border border-amber-500/30 bg-bg p-4 space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold text-amber-400 uppercase">
                              Draft Submitted for Review
                            </p>
                            <p className="text-xs text-silver mt-1">
                              Preview:{" "}
                              <a
                                href={deliv.draft_path || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-lime underline"
                              >
                                {deliv.draft_path} ↗
                              </a>
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleReviewDraft(deliv.id, "approved")}
                            className="inline-flex min-h-10 items-center justify-center rounded-full bg-lime px-5 text-xs font-semibold text-bg transition hover:bg-lime/90 disabled:opacity-50"
                          >
                            Approve Draft
                          </button>
                        </div>

                        {deliv.revision_count < 1 && (
                          <div className="border-t border-border pt-3 space-y-2">
                            <label className="block text-[11px] text-silver uppercase">
                              Or Request 1 Round of Changes:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Specific feedback for creator (e.g. adjust logo placement, fix caption typo)"
                                value={feedbackMap[deliv.id] || ""}
                                onChange={(e) =>
                                  setFeedbackMap({ ...feedbackMap, [deliv.id]: e.target.value })
                                }
                                className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text focus:border-red-400 focus:outline-none"
                              />
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleReviewDraft(deliv.id, "changes_requested")}
                                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-500/30 px-4 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                              >
                                Request Changes
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Live Post Tracker */}
                    {deliv.post_url && (
                      <div className="rounded-xl border border-border bg-bg p-4 text-xs space-y-1">
                        <p className="text-silver">
                          Published Post URL:{" "}
                          <a
                            href={deliv.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-lime underline"
                          >
                            {deliv.post_url} ↗
                          </a>
                        </p>
                        {deliv.status === "live_verified" && matureDate && (
                          <p className="text-blue-400">
                            {isMatured
                              ? "✓ 7-Day hold mature. Payout ready for release."
                              : `⏳ 7-Day hold active. Maturing on ${formatKolkata(matureDate.toISOString())}.`}
                          </p>
                        )}
                        {deliv.status === "paid" && (
                          <p className="text-lime font-medium">✓ Creator fee paid and settled.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {actionNotice && actionNotice.id === (deliv?.id || app.id) && (
                  <p className={`text-xs font-medium ${actionNotice.isError ? "text-red-400" : "text-lime"}`}>
                    {actionNotice.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
