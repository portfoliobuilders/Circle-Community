import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AffiliateForm } from "@/components/affiliates/affiliate-form";
import { Container } from "@/components/site/container";
import { listAffiliates, listProfileCards } from "@/lib/data/marketplace";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Affiliate offers",
  "Brands list affiliate offers for creators. CIRCLE does not set the commission and does not pay it in v1.",
  "/affiliates",
);

export default function AffiliatesPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-small tracking-[0.18em] text-silver uppercase">Affiliates</p>
          <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Verified affiliate offers</h1>
        </div>
        <Link href="#submit-offer" className="inline-flex min-h-11 items-center rounded-full bg-lime px-5 text-sm font-medium text-bg">
          Submit affiliate offer
        </Link>
      </div>
      <p className="mt-4 max-w-2xl text-silver">
        Brands publish affiliate products, commission percentages, and custom tracking URLs. Review terms before sharing tracking links. Disclose partner links with #ad or #affiliate.
      </p>
      <Suspense fallback={<p className="mt-8 text-silver">Loading offers.</p>}>
        <OfferList />
      </Suspense>
      <h2 id="submit-offer" className="font-display mt-16 text-title font-medium uppercase scroll-mt-24">List an offer</h2>
      <p className="mt-4 max-w-2xl text-silver">Brand accounts only. Mark paid posts with #ad or #collab.</p>
      <div className="mt-6">
        <AffiliateForm />
      </div>
      <p className="mt-8 text-small text-silver">
        Looking for a creator who is open to this work? <Link className="underline underline-offset-4" href="/directory?fit=affiliate">Filter the directory</Link>.
      </p>
    </Container>
  );
}

async function OfferList() {
  const [{ rows, error }, cards] = await Promise.all([listAffiliates(), listProfileCards()]);
  const names = new Map(cards.rows.map((row) => [row.id, row.display_name]));
  return (
    <>
      {error ? <p className="mt-8 text-silver">{error}</p> : null}
      {!error && rows.length === 0 ? <p className="mt-8 text-silver">No affiliate offers listed yet.</p> : null}
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <li key={row.id} className="py-5">
            <h2 className="font-display text-lead font-medium">{row.title}</h2>
            <p className="mt-2 text-small text-silver">{names.get(row.brand_id) ?? "Brand"}</p>
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-silver">{row.summary}</p>
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-small">Terms: {row.terms}</p>
            {row.destination_url.startsWith("https://") ? (
              <a className="mt-3 inline-flex min-h-11 items-center underline underline-offset-4" href={row.destination_url}>
                Open the offer link
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
