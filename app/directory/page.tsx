import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/site/container";
import { campaignFits, categoryLabel, creatorCategories } from "@/lib/content/categories";
import { listProfileCards, type ProfileCard } from "@/lib/data/marketplace";
import { followerLabel, formatInr } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Creator directory",
  "Find a creator by category and by the work they are open to: collabs, ads, giveaways, or affiliate offers.",
  "/directory",
);

function filterHref(category?: string, fit?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (fit) params.set("fit", fit);
  const query = params.toString();
  return query ? `/directory?${query}` : "/directory";
}

function chipClass(active: boolean) {
  return active
    ? "inline-flex min-h-11 items-center rounded-full border border-text bg-text px-4 text-small text-bg"
    : "inline-flex min-h-11 items-center rounded-full border border-border px-4 text-small hover:border-silver";
}

async function DirectoryFilters({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; fit?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const fit = params.fit;
  return (
    <>
      <div className="mt-8">
        <p className="text-small font-medium">Category</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          <li>
            <Link className={chipClass(!category)} href={filterHref(undefined, fit)} aria-current={!category ? "page" : undefined}>
              All
            </Link>
          </li>
          {creatorCategories.map((item) => (
            <li key={item.slug}>
              <Link
                className={chipClass(category === item.slug)}
                href={filterHref(item.slug, fit)}
                aria-current={category === item.slug ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <p className="text-small font-medium">Open to</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {campaignFits.map((item) => (
            <li key={item.slug}>
              <Link
                className={chipClass(fit === item.slug)}
                href={filterHref(category, fit === item.slug ? undefined : item.slug)}
                aria-current={fit === item.slug ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function matches(profile: ProfileCard, category?: string, fit?: string) {
  if (profile.role !== "creator") return false;
  if (category && category !== "all" && profile.category !== category) return false;
  const field = campaignFits.find((item) => item.slug === fit)?.field;
  if (field && !profile[field]) return false;
  return true;
}

async function DirectoryList({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; fit?: string }>;
}) {
  const params = await searchParams;
  const { rows, error } = await listProfileCards();
  const listed = rows.filter((row) => matches(row, params.category, params.fit));
  return (
    <>
      {error ? <p className="mt-8 rounded-2xl border border-border p-5 text-silver">{error}</p> : null}
      {!error && listed.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border p-5 text-silver">
          No creator matches this filter yet. A profile appears after a creator saves one in the dashboard.
        </p>
      ) : null}
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {listed.map((profile) => (
          <li key={profile.id} className="py-5">
            <Link href={`/directory/${profile.id}`} className="font-display text-lead font-medium underline-offset-4 hover:underline">
              {profile.display_name}
            </Link>
            <p className="mt-2 text-small text-silver">
              {categoryLabel(profile.category) ?? "Category not set"}
              {profile.city ? ` · ${profile.city}` : ""}
              {profile.follower_count != null
                ? ` · ${profile.follower_count.toLocaleString("en-IN")} followers · ${followerLabel(profile.follower_status)}`
                : ""}
            </p>
            {(profile.follower_count ?? 0) >= 1000 ? (
              <p className="mt-2 text-small text-text">Promoter · 1,000 or more followers · {followerLabel(profile.follower_status)}</p>
            ) : null}
            {profile.content_summary ? <p className="mt-3 max-w-2xl text-silver">{profile.content_summary}</p> : null}
            {profile.price_from_inr != null ? <p className="mt-3 text-small">From {formatInr(profile.price_from_inr)}</p> : null}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; fit?: string }>;
}) {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Directory</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">
        Find high-fit creators in minutes, not weeks
      </h1>
      <p className="mt-4 max-w-2xl text-silver">
        Filter creators by category, location, and collab format. Profiles display verified follower tiers and starting rates. Completed collab deals operate with a transparent 10% platform fee.
      </p>
      <Suspense fallback={<p className="mt-8 text-silver">Loading filters.</p>}>
        <DirectoryFilters searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<p className="mt-8 text-silver">Loading profiles.</p>}>
        <DirectoryList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
