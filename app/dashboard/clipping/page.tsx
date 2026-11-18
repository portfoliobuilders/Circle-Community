import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/site/container";
import { noIndex } from "@/lib/seo";
import { getOwnProfile } from "@/lib/data/marketplace";
import {
  getClipperPlatforms,
  getClipperSubmissions,
  getClipperWalletSummary,
} from "@/lib/clipping/data";
import { ClipperWalletCard } from "@/components/clipping/dashboard/clipper-wallet-card";
import { LinkedPlatforms } from "@/components/clipping/dashboard/linked-platforms";
import { ClipperSubmissionsList } from "@/components/clipping/dashboard/clipper-submissions-list";

export const metadata: Metadata = {
  title: "Clipper Studio & Wallet",
  description: "Track your video clipping submissions, 7-day maturation, and UPI earnings.",
  robots: noIndex,
};

export default function ClipperDashboardPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-silver">Creator Workspace</p>
          <h1 className="font-display mt-1 text-display-sm font-medium uppercase tracking-tight text-text sm:text-display">
            Clipper Studio
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/clipping/campaigns"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 text-sm font-medium text-bg transition hover:bg-lime/90"
          >
            Find Live Campaigns
          </Link>
          <Link
            href="/dashboard/clipping/campaigns"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-medium text-text transition hover:border-border-strong"
          >
            Brand Campaigns Hub →
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-44 animate-pulse rounded-2xl border border-border bg-surface/50" />
              <div className="h-60 animate-pulse rounded-2xl border border-border bg-surface/50" />
            </div>
          }
        >
          <ClipperDashboardContent />
        </Suspense>
      </div>
    </Container>
  );
}

async function ClipperDashboardContent() {
  const { userId, profile, error } = await getOwnProfile();

  if (!userId) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
        <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
          Sign In to Access Clipper Studio
        </h2>
        <p className="mx-auto mt-2 max-w-md text-small text-silver">
          Connect your verified YouTube or Instagram accounts, track Day-7 views, and withdraw your clipping earnings directly to your UPI ID.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/login?next=/dashboard/clipping"
            className="inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="inline-flex min-h-11 items-center rounded-full border border-border px-6 text-sm font-medium text-text transition hover:border-border-strong"
          >
            Create Creator Account
          </Link>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-silver">
        <p>{error}</p>
      </div>
    );
  }

  const [wallet, platforms, submissions] = await Promise.all([
    getClipperWalletSummary(userId),
    getClipperPlatforms(userId),
    getClipperSubmissions(userId),
  ]);

  return (
    <div className="space-y-8">
      {/* Wallet Card */}
      <ClipperWalletCard wallet={wallet} />

      {/* Linked Accounts */}
      <LinkedPlatforms initialPlatforms={platforms} />

      {/* Submissions List */}
      <ClipperSubmissionsList submissions={submissions} />
    </div>
  );
}
