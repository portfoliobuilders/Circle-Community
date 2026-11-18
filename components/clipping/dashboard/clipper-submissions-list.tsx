"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { formatInr, formatKolkata } from "@/lib/format";
import type { ClipSubmission } from "@/lib/clipping/types";

const emptySubscribe = () => () => {};

export function ClipperSubmissionsList({ submissions }: { submissions: ClipSubmission[] }) {
  const now = useSyncExternalStore(emptySubscribe, () => Date.now(), () => 0);

  if (submissions.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="font-display text-lead font-medium uppercase text-text">No Clips Submitted Yet</p>
        <p className="mt-2 text-small text-silver">
          Browse active campaigns, produce high-energy vertical edits, and submit your post URLs to start earning.
        </p>
        <div className="mt-6">
          <Link
            href="/clipping/campaigns"
            className="inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90"
          >
            Explore Live Campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
            Your Submissions ({submissions.length})
          </h2>
          <p className="mt-1 text-small text-silver">
            Views mature on Day 7 post-submission for a single final earnings calculation.
          </p>
        </div>
        <Link
          href="/clipping/campaigns"
          className="inline-flex min-h-11 items-center rounded-full border border-border bg-bg px-4 text-xs font-medium text-text transition hover:border-lime"
        >
          Submit New Clip
        </Link>
      </div>

      <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-bg">
        {submissions.map((sub) => {
          const submissionDate = new Date(sub.created_at);
          const matureDate = new Date(submissionDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          const isMatured = now > 0 && now >= matureDate.getTime();

          return (
            <div key={sub.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase text-silver">
                    {sub.platform === "youtube_shorts" ? "YouTube Shorts" : "Instagram Reels"}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium uppercase ${
                      sub.status === "approved"
                        ? "border-lime/30 bg-lime/10 text-lime"
                        : sub.status === "rejected"
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {sub.status}
                  </span>
                  <span className="text-xs text-silver">
                    Submitted {formatKolkata(sub.created_at)}
                  </span>
                </div>

                <p className="text-sm font-medium text-text">{sub.campaign_title}</p>
                <p className="font-mono text-xs text-lime break-all">
                  <a href={sub.post_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-lime/80">
                    {sub.post_url} ↗
                  </a>
                </p>

                {sub.status === "rejected" && sub.reject_reason ? (
                  <p className="text-xs text-red-400">Reason: {sub.reject_reason}</p>
                ) : null}
              </div>

              {/* Maturation & Earnings Status */}
              <div className="text-left sm:text-right">
                {sub.status === "approved" ? (
                  isMatured ? (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-lime">Day-7 Views Locked</p>
                      <p className="font-display text-lg font-semibold text-text">
                        {sub.earnings ? formatInr(sub.earnings.net_amount_inr) : "Calculating..."}
                      </p>
                      {sub.earnings && (
                        <p className="text-xs text-silver">
                          {sub.earnings.verified_views.toLocaleString("en-IN")} verified views
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-amber-400">Maturing in Progress</p>
                      <p className="text-xs text-silver mt-0.5">
                        Locks {formatKolkata(matureDate.toISOString())}
                      </p>
                    </div>
                  )
                ) : sub.status === "pending" ? (
                  <p className="text-xs text-silver">Awaiting brand review</p>
                ) : (
                  <p className="text-xs text-silver">Disqualified from payout</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
