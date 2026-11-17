import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/site/container";
import { listCollabs } from "@/lib/data/marketplace";
import { formatInr } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Collabs",
  "Open collabs on CIRCLE. Brands pay creators directly. CIRCLE does not process payment.",
  "/collabs",
);

const kindLabel = { fixed: "Fixed", open_bid: "Open bid", barter: "Barter" } as const;

export default function CollabsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-small tracking-[0.18em] text-silver uppercase">Marketplace</p>
          <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Collabs</h1>
        </div>
        <Link href="/collabs/new" className="inline-flex min-h-11 items-center rounded-full bg-lime px-5 text-sm font-medium text-bg">
          Post a collab
        </Link>
      </div>
      <p className="mt-4 max-w-2xl text-silver">
        The budget is information. The brand pays the creator directly. CIRCLE does not hold the money. Ad disclosure is required.
      </p>
      <Suspense fallback={<p className="mt-8 text-silver">Loading collabs.</p>}>
        <CollabList />
      </Suspense>
    </Container>
  );
}

async function CollabList() {
  const { rows, error } = await listCollabs();
  return (
    <>
      {error ? <p className="mt-8 text-silver">{error}</p> : null}
      {!error && rows.length === 0 ? <p className="mt-8 text-silver">No collabs posted yet.</p> : null}
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {rows.map((collab) => (
          <li key={collab.id} className="py-5">
            <Link href={`/collabs/${collab.id}`} className="font-display text-lead font-medium underline-offset-4 hover:underline">
              {collab.title}
            </Link>
            <p className="mt-2 text-small text-silver">
              {kindLabel[collab.kind]}
              {collab.budget_inr != null ? ` · ${formatInr(collab.budget_inr)}` : ""}
              {collab.barter_offer ? ` · ${collab.barter_offer}` : ""}
              {` · ${collab.status}`}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
