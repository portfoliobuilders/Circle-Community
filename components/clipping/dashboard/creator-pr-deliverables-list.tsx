"use client";

import { useState, useTransition, useSyncExternalStore } from "react";
import Link from "next/link";
import { formatInr, formatKolkata } from "@/lib/format";
import { uploadPrDraft, submitPrPostUrl } from "@/lib/actions/pr";
import type { PrApplication } from "@/lib/clipping/types";

const emptySubscribe = () => () => {};

export function CreatorPrDeliverablesList({ applications }: { applications: PrApplication[] }) {
  const now = useSyncExternalStore(emptySubscribe, () => Date.now(), () => 0);
  const [draftPathMap, setDraftPathMap] = useState<Record<string, string>>({});
  const [postUrlMap, setPostUrlMap] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ id: string; text: string; isError?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="font-display text-lead font-medium uppercase text-text">No PR Applications Yet</p>
        <p className="mt-2 text-small text-silver">
          If you run an established account (10,000+ verified followers), browse active Social Media PR campaigns to pitch approved posts and earn fixed or quoted compensation.
        </p>
        <div className="mt-6">
          <Link
            href="/clipping/campaigns"
            className="inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90"
          >
            Find PR Campaigns
          </Link>
        </div>
      </div>
    );
  }

  function handleUploadDraft(deliverableId: string) {
    const path = draftPathMap[deliverableId]?.trim();
    if (!path) {
      setNotice({ id: deliverableId, text: "Please enter your draft video link or file path.", isError: true });
      return;
    }

    setNotice(null);
    startTransition(async () => {
      const res = await uploadPrDraft({
        deliverable_id: deliverableId,
        draft_path: path,
      });

      if (res.status === "success") {
        setNotice({ id: deliverableId, text: "Draft submitted for owner review!" });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setNotice({ id: deliverableId, text: res.message, isError: true });
      }
    });
  }

  function handleSubmitPostUrl(deliverableId: string) {
    const url = postUrlMap[deliverableId]?.trim();
    if (!url) {
      setNotice({ id: deliverableId, text: "Please enter your published post URL.", isError: true });
      return;
    }

    setNotice(null);
    startTransition(async () => {
      const res = await submitPrPostUrl({
        deliverable_id: deliverableId,
        post_url: url,
      });

      if (res.status === "success") {
        setNotice({ id: deliverableId, text: "Post URL submitted! Admin will audit live status." });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setNotice({ id: deliverableId, text: res.message, isError: true });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
            Social Media PR Deliverables ({applications.length})
          </h2>
          <p className="mt-1 text-small text-silver">
            Deliverables require ASCI paid-partnership tag (#ad / #collab) and must remain live for 7 days.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((app) => {
          const deliv = app.deliverable;
          const matureDate = deliv?.posted_at_submitted
            ? new Date(new Date(deliv.posted_at_submitted).getTime() + 7 * 24 * 60 * 60 * 1000)
            : null;
          const isMatured = matureDate ? now > 0 && now >= matureDate.getTime() : false;

          return (
            <div
              key={app.id}
              className="rounded-xl border border-border bg-bg p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-mono uppercase text-silver">
                      PR Deliverable
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase ${
                        app.status === "accepted"
                          ? "border-lime/30 bg-lime/10 text-lime"
                          : app.status === "rejected"
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      Application: {app.status}
                    </span>
                    <span className="text-xs text-silver">
                      Applied {formatKolkata(app.created_at)}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-text">
                    {app.campaign?.title || "PR Campaign"}
                  </h3>
                  <p className="text-xs text-silver">
                    Your Pitch: &ldquo;{app.pitch}&rdquo;
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-3 text-right text-xs">
                  <p className="uppercase text-silver font-medium">Agreed Fee</p>
                  <p className="font-display text-base font-bold text-lime">
                    {formatInr(app.quote_inr || app.campaign?.fee_per_post_inr || 0)}
                  </p>
                  <p className="text-[10px] text-silver/80">Net after 10% fee on Day 7</p>
                </div>
              </div>

              {/* Deliverable Lifecycle Tracker */}
              {app.status === "accepted" && deliv ? (
                <div className="border-t border-border pt-4 space-y-4">
                  {/* Step 1: Draft review */}
                  {deliv.draft_status === "none" && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                        Step 1: Upload Content Draft
                      </p>
                      <p className="text-xs text-silver">
                        Please upload your draft reel video or Google Drive link for the brand to review.
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                          type="text"
                          placeholder="Link to preview draft (e.g. Google Drive link or video URL)"
                          value={draftPathMap[deliv.id] || ""}
                          onChange={(e) =>
                            setDraftPathMap({ ...draftPathMap, [deliv.id]: e.target.value })
                          }
                          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-xs text-text focus:border-lime focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleUploadDraft(deliv.id)}
                          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-lime px-5 text-xs font-semibold text-bg transition hover:bg-lime/90 disabled:opacity-50"
                        >
                          Submit Draft
                        </button>
                      </div>
                    </div>
                  )}

                  {deliv.draft_status === "submitted" && (
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-blue-400">
                      ⏳ Draft submitted! The campaign owner is currently reviewing your content.
                    </div>
                  )}

                  {deliv.draft_status === "changes_requested" && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                        Changes Requested by Owner (Revision 1 of 1)
                      </p>
                      <p className="text-xs text-silver font-mono">
                        {deliv.fail_reason || "Please adjust pacing and ensure required hashtags are prominent."}
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                          type="text"
                          placeholder="Link to revised draft"
                          value={draftPathMap[deliv.id] || ""}
                          onChange={(e) =>
                            setDraftPathMap({ ...draftPathMap, [deliv.id]: e.target.value })
                          }
                          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-xs text-text focus:border-lime focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleUploadDraft(deliv.id)}
                          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-lime px-5 text-xs font-semibold text-bg transition hover:bg-lime/90 disabled:opacity-50"
                        >
                          Submit Revised Draft
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Post URL submission */}
                  {deliv.draft_status === "approved" && !deliv.post_url && (
                    <div className="rounded-xl border border-lime/20 bg-lime/5 p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                        Draft Approved! You are cleared to publish.
                      </p>
                      <p className="text-xs text-silver">
                        Publish the deliverable on your verified account. Ensure the native paid-partnership label plus #ad or #collab is visible, then paste the public URL below.
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                          type="url"
                          placeholder="https://instagram.com/reel/... or https://youtube.com/shorts/..."
                          value={postUrlMap[deliv.id] || ""}
                          onChange={(e) =>
                            setPostUrlMap({ ...postUrlMap, [deliv.id]: e.target.value })
                          }
                          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-xs text-text focus:border-lime focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleSubmitPostUrl(deliv.id)}
                          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-lime px-5 text-xs font-semibold text-bg transition hover:bg-lime/90 disabled:opacity-50"
                        >
                          Submit Post URL
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Live hold and maturation status */}
                  {deliv.post_url && (
                    <div className="rounded-xl border border-border bg-surface p-4 text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-silver">
                          Published Post:{" "}
                          <a
                            href={deliv.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-lime underline"
                          >
                            {deliv.post_url} ↗
                          </a>
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase ${
                            deliv.status === "paid"
                              ? "border-lime/30 bg-lime/10 text-lime"
                              : deliv.status === "live_verified"
                              ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                              : deliv.status === "failed"
                              ? "border-red-500/30 bg-red-500/10 text-red-400"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          Status: {deliv.status}
                        </span>
                      </div>

                      {deliv.status === "pending" && (
                        <p className="text-amber-400">
                          Awaiting CIRCLE admin audit to verify native paid-partnership label and public status.
                        </p>
                      )}

                      {deliv.status === "live_verified" && matureDate && (
                        <div className="text-silver">
                          {isMatured ? (
                            <p className="text-lime font-medium">
                              ✓ 7-Day live maturation hold complete. Payout will disburse into wallet shortly.
                            </p>
                          ) : (
                            <p>
                              ⏳ 7-Day Live Maturation Hold: Post must remain live and unedited until{" "}
                              <strong className="text-text">{formatKolkata(matureDate.toISOString())}</strong>.
                            </p>
                          )}
                        </div>
                      )}

                      {deliv.status === "paid" && (
                        <p className="text-lime font-semibold">
                          ✓ Deliverable fee locked and credited to your CIRCLE wallet!
                        </p>
                      )}

                      {deliv.status === "failed" && (
                        <p className="text-red-400">
                          Disqualified: {deliv.fail_reason || "Post was deleted, made private, or lacked disclosure."}
                        </p>
                      )}
                    </div>
                  )}

                  {notice && notice.id === deliv.id ? (
                    <p
                      className={`text-xs font-medium ${
                        notice.isError ? "text-red-400" : "text-lime"
                      }`}
                    >
                      {notice.text}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
