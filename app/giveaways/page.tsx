import type { Metadata } from "next";
import { Suspense } from "react";

import { GiveawayForm } from "@/components/giveaways/giveaway-form";
import { Container } from "@/components/site/container";
import { listGiveaways, listProfileCards } from "@/lib/data/marketplace";
import { formatKolkata } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Giveaways",
  "Creators and brands list a giveaway here. You enter on the social post they link, not inside CIRCLE.",
  "/giveaways",
);

export default function GiveawaysPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Giveaways</p>
      <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Every listed giveaway</h1>
      <p className="mt-4 max-w-2xl text-silver">
        A listing shows the prize the host described and the social post where you enter. CIRCLE does not run the draw and does not hold the prize.
      </p>
      <Suspense fallback={<p className="mt-8 text-silver">Loading giveaways.</p>}>
        <GiveawayList />
      </Suspense>
      <h2 className="font-display mt-16 text-title font-medium uppercase">List a giveaway</h2>
      <div className="mt-6">
        <GiveawayForm />
      </div>
    </Container>
  );
}

async function GiveawayList() {
  const [{ rows, error }, cards] = await Promise.all([listGiveaways(), listProfileCards()]);
  const names = new Map(cards.rows.map((row) => [row.id, row.display_name]));
  return (
    <>
      {error ? <p className="mt-8 text-silver">{error}</p> : null}
      {!error && rows.length === 0 ? <p className="mt-8 text-silver">No giveaways listed yet.</p> : null}
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <li key={row.id} className="py-5">
            <h2 className="font-display text-lead font-medium">{row.title}</h2>
            <p className="mt-2 text-small text-silver">
              {names.get(row.owner_id) ?? "Member"} · Prize: {row.prize}
              {row.ends_at ? ` · Ends ${formatKolkata(row.ends_at)}` : ""}
            </p>
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-silver">{row.summary}</p>
            {row.social_url.startsWith("https://") ? (
              <a className="mt-3 inline-flex min-h-11 items-center underline underline-offset-4" href={row.social_url}>
                Open the social post
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
