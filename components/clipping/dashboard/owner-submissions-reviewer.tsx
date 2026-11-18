"use client";

import { useState, useTransition, useSyncExternalStore } from "react";
import { formatInr, formatKolkata } from "@/lib/format";
import { reviewSubmission } from "@/lib/actions/clipping";
import type { ClipSubmission } from "@/lib/clipping/types";

const emptySubscribe = () => () => {};

export function OwnerSubmissionsReviewer({
  initialSubmissions,
  campaignTitle,
}: {
  initialSubmissions: ClipSubmission[];
  campaignTitle: string;
}) {
  const now = useSyncExternalStore(emptySubscribe, () => Date.now(), () => 0);
  const [submissions, setSubmissions] = useState<ClipSubmission[]>(initialSubmissions);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionMsg, setActionMsg] = useState<{ id: string; text: string; isError?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = submissions.filter((sub) => {
    if (filter === "all") return true;
    return sub.status === filter;
  });

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length;

  function handleApprove(id: string) {
    setActionMsg(null);
    startTransition(async () => {
      const res = await reviewSubmission({
        submission_id: id,
        status: "approved",
      });

      if (res.status === "success") {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "approved", reject_reason: null } : s))
        );
        setActionMsg({ id, text: "Clip approved! Day-7 view tracking started." });
      } else {
        setActionMsg({ id, text: res.message, isError: true });
      }
    });
  }

  function handleReject(id: string) {
    if (!rejectReason.trim()) return;
    setActionMsg(null);
    startTransition(async () => {
      const res = await reviewSubmission({
        submission_id: id,
        status: "rejected",
        reject_reason: rejectReason.trim(),
      });

      if (res.status === "success") {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status: "rejected", reject_reason: rejectReason.trim() } : s
          )
        );
        setRejectingId(null);
        setRejectReason("");
        setActionMsg({ id, text: "Clip rejected." });
      } else {
        setActionMsg({ id, text: res.message, isError: true });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Filters & Counters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`min-h-11 rounded-full px-4 text-xs font-medium transition ${
              filter === "all" ? "bg-lime text-bg font-semibold" : "border border-border bg-surface text-silver hover:text-text"
            }`}
          >
            All Submissions ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`min-h-11 rounded-full px-4 text-xs font-medium transition ${
              filter === "pending"
                ? "bg-amber-400 text-bg font-semibold"
                : "border border-border bg-surface text-silver hover:text-text"
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("approved")}
            className={`min-h-11 rounded-full px-4 text-xs font-medium transition ${
              filter === "approved"
                ? "bg-lime/20 text-lime font-semibold border border-lime/40"
                : "border border-border bg-surface text-silver hover:text-text"
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("rejected")}
            className={`min-h-11 rounded-full px-4 text-xs font-medium transition ${
              filter === "rejected"
                ? "bg-red-500/20 text-red-400 font-semibold border border-red-500/40"
                : "border border-border bg-surface text-silver hover:text-text"
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center">
          <p className="font-display text-lead font-medium uppercase text-text">No Submissions Found</p>
          <p className="mt-1 text-small text-silver">
            {filter === "all"
              ? `Clippers have not submitted any clips to "${campaignTitle}" yet.`
              : `No clips currently in '${filter}' status for "${campaignTitle}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const submissionDate = new Date(sub.created_at);
            const matureDate = new Date(submissionDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            const isMatured = now > 0 && now >= matureDate.getTime();

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-border bg-surface p-6 transition sm:p-7"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs font-mono uppercase text-silver">
                        {sub.platform === "youtube_shorts" ? "YouTube Shorts" : "Instagram Reels"}
                      </span>
                      {sub.status === "pending" && (
                        <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium uppercase text-amber-400">
                          Pending Review
                        </span>
                      )}
                      {sub.status === "approved" && (
                        <span className="inline-flex items-center rounded-full border border-lime/30 bg-lime/10 px-2.5 py-0.5 text-xs font-medium uppercase text-lime">
                          Approved
                        </span>
                      )}
                      {sub.status === "rejected" && (
                        <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium uppercase text-red-400">
                          Rejected
                        </span>
                      )}
                      <span className="text-xs text-silver">
                        Submitted {formatKolkata(sub.created_at)}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-silver">
                        Clipper: <strong className="text-text">{sub.clipper_name || "Community Creator"}</strong>
                      </p>
                      <p className="mt-1 font-mono text-sm break-all">
                        <a
                          href={sub.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lime underline hover:text-lime/80"
                        >
                          {sub.post_url} ↗
                        </a>
                      </p>
                    </div>

                    {/* Maturation Status */}
                    {sub.status === "approved" ? (
                      <div className="rounded-xl border border-border bg-bg p-3 text-xs text-silver space-y-1">
                        {isMatured ? (
                          sub.earnings ? (
                            <p className="text-lime font-medium">
                              ✓ Matured on Day 7: {sub.earnings.verified_views.toLocaleString("en-IN")} views · Gross {formatInr(sub.earnings.gross_amount_inr)} (Net {formatInr(sub.earnings.net_amount_inr)})
                            </p>
                          ) : (
                            <p className="text-amber-400">
                              Day 7 reached. Scheduled for automated view lock in next batch.
                            </p>
                          )
                        ) : (
                          <p>
                            ⏳ Day 7 Maturation: Views will be locked on{" "}
                            <strong className="text-text">{formatKolkata(matureDate.toISOString())}</strong>
                          </p>
                        )}
                      </div>
                    ) : null}

                    {/* Rejection Note */}
                    {sub.status === "rejected" && sub.reject_reason ? (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400">
                        <strong>Reason:</strong> {sub.reject_reason}
                      </div>
                    ) : null}

                    {/* Action notification */}
                    {actionMsg && actionMsg.id === sub.id ? (
                      <p
                        className={`text-xs font-medium ${
                          actionMsg.isError ? "text-red-400" : "text-lime"
                        }`}
                      >
                        {actionMsg.text}
                      </p>
                    ) : null}
                  </div>

                  {/* Actions for submitted clips */}
                  {sub.status === "pending" ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleApprove(sub.id)}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 text-sm font-medium text-bg transition hover:bg-lime/90 disabled:opacity-50"
                      >
                        Approve Clip
                      </button>

                      {rejectingId === sub.id ? (
                        <div className="flex flex-col gap-2 rounded-xl border border-red-500/30 bg-bg p-3">
                          <input
                            type="text"
                            placeholder="Reason (e.g. missing required hashtag, poor audio)"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text focus:border-red-400 focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isPending || !rejectReason.trim()}
                              onClick={() => handleReject(sub.id)}
                              className="inline-flex min-h-9 items-center justify-center rounded-lg bg-red-500 px-3 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                            >
                              Confirm Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason("");
                              }}
                              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-border px-3 text-xs text-silver hover:text-text"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingId(sub.id);
                            setRejectReason("");
                          }}
                          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-bg px-4 text-xs font-medium text-red-400 transition hover:border-red-400/50 hover:bg-red-500/10"
                        >
                          Reject...
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
