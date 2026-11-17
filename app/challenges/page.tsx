import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/site/container";
import { listChallenges } from "@/lib/data/marketplace";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Challenges",
  "Tasks for creators, brands, and members. Points are added only after CIRCLE confirms the work.",
  "/challenges",
);

const audienceLabel = { creator: "Creators", brand: "Brands", anyone: "Anyone" } as const;

export default function ChallengesPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Challenges</p>
      <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Tasks that can earn points</h1>
      <p className="mt-4 max-w-2xl text-silver">
        Do the task, then the CIRCLE team confirms it before any points are added. A post or a click on its own does not move the <Link className="underline underline-offset-4" href="/leaderboard">leaderboard</Link>.
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
