import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ReportForm } from "@/components/reports/report-form";
import { Container } from "@/components/site/container";
import { getGiveaway, listProfileCards } from "@/lib/data/marketplace";
import { formatKolkata } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { row } = await getGiveaway(id);
  if (!row) return pageMetadata("Giveaway", "A CIRCLE community giveaway.", "/giveaways");
  return pageMetadata(
    `${row.title} · Giveaway`,
    `Prize: ${row.prize}. ${row.summary.slice(0, 140)}...`,
    `/giveaways/${id}`,
  );
}

export default function GiveawayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Container className="py-16 sm:py-24">
          <div className="animate-pulse space-y-4 max-w-2xl">
            <div className="h-6 w-32 rounded bg-border" />
            <div className="h-10 w-3/4 rounded bg-border" />
            <div className="h-24 w-full rounded-2xl bg-border" />
          </div>
        </Container>
      }
    >
      <GiveawayDetail params={params} />
    </Suspense>
  );
}

async function GiveawayDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ row, error }, cardsResult] = await Promise.all([
    getGiveaway(id),
    listProfileCards(),
  ]);

  if (!row && !error) notFound();
  if (!row) {
    return (
      <Container className="py-16 sm:py-24">
        <p className="text-silver">{error ?? "Giveaway not found."}</p>
        <div className="mt-6">
          <Link href="/giveaways" className="inline-flex min-h-11 items-center text-sm underline">
            ← Back to all giveaways
          </Link>
        </div>
      </Container>
    );
  }

  const host = cardsResult.rows.find((card) => card.id === row.owner_id);
  const isVerified = host?.follower_status === "verified";
  const hasValidUrl = row.social_url.startsWith("https://");

  return (
    <Container className="py-16 sm:py-24">
      <div className="mb-6">
        <Link
          href="/giveaways"
          className="inline-flex min-h-11 items-center text-small text-silver hover:text-text transition-colors"
        >
          ← Back to all giveaways
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full border border-lime/30 bg-lime/10 px-3.5 py-1 text-xs font-medium text-lime">
          Prize: {row.prize}
        </span>
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-silver">
          Status: {row.status === "open" ? "Active" : row.status}
        </span>
        {row.ends_at ? (
          <span className="text-xs text-silver">
            Ends: {formatKolkata(row.ends_at)}
          </span>
        ) : null}
      </div>

      <h1 className="font-display mt-5 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        {row.title}
      </h1>

      {/* Host Card */}
      <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wider text-silver uppercase">Giveaway Host</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lead font-medium text-text">
                {host?.display_name ?? "Community Member"}
              </span>
              {isVerified ? (
                <span className="rounded-full bg-lime/20 px-2 py-0.5 text-xs font-semibold text-lime">
                  ✓ Verified
                </span>
              ) : null}
            </div>
            {host?.category || host?.city ? (
              <p className="mt-1 text-xs text-silver">
                {[host.category, host.city].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
          {host?.id ? (
            <Link
              href={`/directory?id=${host.id}`}
              className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-xs font-medium text-text hover:bg-bg"
            >
              View profile
            </Link>
          ) : null}
        </div>
      </div>

      {/* Giveaway description & entry instructions */}
      <div className="mt-10 max-w-2xl space-y-8">
        <div>
          <h2 className="font-display text-title-sm font-medium">Description & details</h2>
          <p className="mt-3 whitespace-pre-wrap text-silver leading-relaxed">{row.summary}</p>
        </div>

        <div className="rounded-2xl border border-lime/30 bg-lime/5 p-6 sm:p-8">
          <h2 className="font-display text-title-sm font-medium text-lime">How to enter</h2>
          <ol className="mt-4 list-decimal pl-5 space-y-2 text-small text-silver">
            <li>Click the button below to open the official social post.</li>
            <li>Follow the host&apos;s entry requirements (e.g., like, comment, tag, or follow).</li>
            <li>The host chooses the winner and distributes the prize directly according to their stated rules.</li>
          </ol>
          <div className="mt-6">
            {hasValidUrl ? (
              <a
                href={row.social_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-8 text-sm font-medium text-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-lime"
              >
                Enter on social post ↗
              </a>
            ) : (
              <p className="text-small text-silver">No valid social link provided for this giveaway.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/50 p-5 text-xs text-silver space-y-2">
          <p className="font-medium text-text">Safety & Transparency Notice</p>
          <p>
            This giveaway is hosted independently by the creator or brand. CIRCLE is an open community discovery platform and does not hold prizes, manage entry draws, or process fees.
          </p>
          <p>
            Never pay money to enter a giveaway or pay to receive a prize. If you believe this listing is fraudulent, violates community guidelines, or infringes intellectual property, please report it below.
          </p>
        </div>

        {row.owner_id ? (
          <div className="border-t border-border pt-8">
            <ReportForm targetType="profile" targetId={row.owner_id} />
          </div>
        ) : null}
      </div>
    </Container>
  );
}
