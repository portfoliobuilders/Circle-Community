import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/site/container";
import { listBrandOpportunity, listPointTotals, listProfileCards } from "@/lib/data/marketplace";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Leaderboard",
  "Creator points come from completed collabs, attended events, and approved tasks. Brands are ranked by collabs they have posted.",
  "/leaderboard",
);

export default function LeaderboardPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Leaderboard</p>
      <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Creators and brands</h1>
      <p className="mt-4 max-w-2xl text-silver">
        Creator points come only from a completed collab, an event they attended, or a task an admin has confirmed. Likes and logins do not count. Points have no cash value. Brands are ranked by how many collabs they have posted, not by money spent.
      </p>
      <p className="mt-4 text-small text-silver">
        Awards and written features are published as guides when there is a real recipient. <Link className="underline underline-offset-4" href="/guides">Read the guides</Link>.
      </p>
      <Suspense fallback={<p className="mt-8 text-silver">Loading the board.</p>}>
        <Boards />
      </Suspense>
    </Container>
  );
}

async function Boards() {
  const [points, brands, cards] = await Promise.all([listPointTotals(), listBrandOpportunity(), listProfileCards()]);
  const names = new Map(cards.rows.map((row) => [row.id, row.display_name]));
  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-2">
      <section>
        <h2 className="font-display text-title font-medium uppercase">Creators</h2>
        {points.error ? <p className="mt-4 text-silver">{points.error}</p> : null}
        {!points.error && points.rows.length === 0 ? <p className="mt-4 text-silver">No points have been awarded yet.</p> : null}
        <ol className="mt-4 divide-y divide-border border-y border-border">
          {points.rows.map((row, index) => (
            <li key={row.profile_id} className="flex items-baseline justify-between gap-4 py-4">
              <span>{index + 1}. <Link className="underline underline-offset-4" href={`/directory/${row.profile_id}`}>{names.get(row.profile_id) ?? "Member"}</Link></span>
              <span className="text-silver">{row.points}</span>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="font-display text-title font-medium uppercase">Brands</h2>
        {brands.error ? <p className="mt-4 text-silver">{brands.error}</p> : null}
        {!brands.error && brands.rows.length === 0 ? <p className="mt-4 text-silver">No collabs posted yet.</p> : null}
        <ol className="mt-4 divide-y divide-border border-y border-border">
          {brands.rows.map((row, index) => (
            <li key={row.brand_id} className="flex items-baseline justify-between gap-4 py-4">
              <span>{index + 1}. <Link className="underline underline-offset-4" href={`/directory/${row.brand_id}`}>{names.get(row.brand_id) ?? "Brand"}</Link></span>
              <span className="text-silver">{row.collabs} collabs</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
