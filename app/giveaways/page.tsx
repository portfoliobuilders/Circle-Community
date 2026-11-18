import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { listGiveaways, listProfileCards } from "@/lib/data/marketplace";
import { formatKolkata } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Community giveaways",
  "Discover creator and brand giveaways. Enter directly on the host's official social post. Free to list and open to the CIRCLE community.",
  "/giveaways",
);

export default function GiveawaysPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-small tracking-[0.18em] text-silver uppercase">Marketplace</p>
          <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase sm:text-display">
            Community giveaways
          </h1>
          <p className="mt-4 max-w-2xl text-silver">
            Creators and brands list giveaways here. You enter directly on the host&apos;s official social post. CIRCLE does not hold prizes or run draws.
          </p>
        </div>
        <div className="shrink-0">
          <PillLink href="/giveaways/new">List a giveaway</PillLink>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface/60 p-4 sm:p-5 text-small text-silver">
        <p>
          <strong className="text-text">How giveaways work:</strong> Listings show the prize and the social link provided by the host. Always review the rules on their post. Never share passwords or pay entry fees.
        </p>
      </div>

      <Suspense fallback={<GiveawaySkeleton />}>
        <GiveawayList />
      </Suspense>

      <section className="mt-16 border-t border-border pt-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-title-sm font-medium uppercase">Host a giveaway?</h2>
            <p className="mt-2 max-w-xl text-small text-silver">
              Reach creators, clippers, and community members across India. Share your Instagram or YouTube link and grow your community audience.
            </p>
          </div>
          <PillLink href="/giveaways/new" variant="secondary">
            List your giveaway
          </PillLink>
        </div>
      </section>
    </Container>
  );
}

async function GiveawayList() {
  const [{ rows, error }, cardsResult] = await Promise.all([listGiveaways(), listProfileCards()]);
  const profileMap = new Map(cardsResult.rows.map((row) => [row.id, row]));

  if (error) {
    return <p className="mt-10 text-silver">{error}</p>;
  }

  if (rows.length === 0) {
    return (
      <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface/30 p-8 text-center sm:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-border bg-surface text-lime">
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v13m0-13V4.5a2.5 2.5 0 115 0V8m-5 0H7m5 0h7.5A2.5 2.5 0 0122 10.5v1a1.5 1.5 0 01-1.5 1.5H19m-7 0H5a1.5 1.5 0 01-1.5-1.5v-1A2.5 2.5 0 016 8h1m5 5v8m-7 0h14"
            />
          </svg>
        </div>
        <h2 className="font-display mt-5 text-title-sm font-medium text-text">No active giveaways listed yet</h2>
        <p className="mx-auto mt-2 max-w-md text-small text-silver">
          Be the first to list a community giveaway, or subscribe below to get notified when members drop new prizes.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PillLink href="/giveaways/new">List a giveaway</PillLink>
          <PillLink href="/collabs" variant="secondary">Browse collabs</PillLink>
        </div>

        <div className="mx-auto mt-10 max-w-md border-t border-border pt-8 text-left">
          <p className="text-xs font-medium text-silver uppercase tracking-wider">Get giveaway alerts</p>
          <div className="mt-3">
            <NewsletterForm source="giveaways" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => {
        const host = profileMap.get(row.owner_id);
        const isVerified = host?.follower_status === "verified";
        const hasValidUrl = row.social_url.startsWith("https://");

        return (
          <article
            key={row.id}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-lime/40 focus-within:ring-2 focus-within:ring-lime"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-medium text-lime">
                  Prize: {row.prize}
                </span>
                {row.ends_at ? (
                  <span className="text-xs text-silver">
                    Ends {formatKolkata(row.ends_at)}
                  </span>
                ) : (
                  <span className="text-xs text-silver">Ongoing</span>
                )}
              </div>

              <h2 className="font-display mt-4 text-lead font-medium text-text group-hover:text-lime transition-colors">
                <Link href={`/giveaways/${row.id}`} className="focus:outline-none focus:underline">
                  {row.title}
                </Link>
              </h2>

              <p className="mt-2 line-clamp-3 text-small text-silver whitespace-pre-wrap">
                {row.summary}
              </p>
            </div>

            <div className="mt-6 border-t border-border/60 pt-4">
              <div className="flex items-center justify-between text-xs text-silver">
                <span className="truncate">
                  Host:{" "}
                  <strong className="font-medium text-text">
                    {host?.display_name ?? "Community Member"}
                  </strong>
                  {isVerified ? (
                    <span className="ml-1 text-lime" title="Verified Creator">✓</span>
                  ) : null}
                </span>
                {host?.city ? <span className="shrink-0">{host.city}</span> : null}
              </div>

              <div className="mt-4 flex items-center gap-3">
                {hasValidUrl ? (
                  <a
                    href={row.social_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-lime px-4 text-xs font-medium text-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-bg"
                  >
                    Enter giveaway ↗
                  </a>
                ) : null}
                <Link
                  href={`/giveaways/${row.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-4 text-xs font-medium text-text hover:bg-bg focus:outline-none focus:ring-2 focus:ring-lime"
                >
                  Details
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function GiveawaySkeleton() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-border bg-surface p-6">
          <div className="flex justify-between">
            <div className="h-6 w-24 rounded-full bg-border" />
            <div className="h-4 w-16 rounded bg-border" />
          </div>
          <div className="mt-4 h-6 w-3/4 rounded bg-border" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-border" />
            <div className="h-4 w-5/6 rounded bg-border" />
          </div>
          <div className="mt-8 flex gap-3">
            <div className="h-11 flex-1 rounded-full bg-border" />
            <div className="h-11 w-20 rounded-full bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
