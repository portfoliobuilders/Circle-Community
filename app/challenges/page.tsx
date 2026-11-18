import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/site/container";
import { listChallenges } from "@/lib/data/marketplace";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Challenges",
  "Complete creative tasks and collab milestones to earn verified CIRCLE points and leaderboard badges.",
  "/challenges",
);

const audienceLabel = { creator: "Creators", brand: "Brands", anyone: "Anyone" } as const;

export default function ChallengesPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-small tracking-[0.18em] text-silver uppercase">Challenges</p>
          <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Community challenges</h1>
        </div>
        <Link href="/leaderboard" className="inline-flex min-h-11 items-center rounded-full bg-lime px-5 text-sm font-medium text-bg">
          View leaderboard
        </Link>
      </div>
      <p className="mt-4 max-w-2xl text-silver">
        Complete verified creative tasks and milestone briefs. Points are credited upon moderation review and determine monthly rankings.
      </p>
      <Suspense fallback={<p className="mt-8 text-silver">Loading challenges.</p>}>
        <ChallengeList />
      </Suspense>
    </Container>
  );
}

async function ChallengeList() {
  const { rows, error } = await listChallenges();
  return (
    <>
      {error ? <p className="mt-8 text-silver">{error}</p> : null}
      {!error && rows.length === 0 ? <p className="mt-8 text-silver">No challenges published yet.</p> : null}
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <li key={row.id} className="py-5">
            <h2 className="font-display text-lead font-medium">{row.title}</h2>
            <p className="mt-2 text-small text-silver">{audienceLabel[row.audience as keyof typeof audienceLabel] ?? row.audience}</p>
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-silver">{row.summary}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
