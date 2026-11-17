import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/site/container";
import { listPointTotals, listProfileCards } from "@/lib/data/marketplace";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Recognition",
  "Points come only from completed collabs, attended events, and admin-approved tasks.",
  "/recognition",
);

export default function RecognitionPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Recognition</p>
      <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Points</h1>
      <p className="mt-4 max-w-2xl text-silver">
        Points come only from completed collabs, events you attended, and tasks an admin has approved. Logins and likes do not count. Points have no cash value.
      </p>
      <Suspense fallback={<p className="mt-8 text-silver">Loading points.</p>}>
        <PointList />
      </Suspense>
    </Container>
  );
}

async function PointList() {
  const [{ rows, error }, cards] = await Promise.all([listPointTotals(), listProfileCards()]);
  const names = new Map(cards.rows.map((row) => [row.id, row.display_name]));
  return (
    <>
      {error ? <p className="mt-8 text-silver">{error}</p> : null}
      {!error && rows.length === 0 ? <p className="mt-8 text-silver">No points have been awarded yet.</p> : null}
      <ol className="mt-8 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <li key={row.profile_id} className="flex items-baseline justify-between py-4">
            <span>{names.get(row.profile_id) ?? "Member"}</span>
            <span className="text-silver">{row.points}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
