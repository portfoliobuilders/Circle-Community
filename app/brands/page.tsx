import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";
import { brandServices } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "For brands",
  "Post a fixed collab, an open bid, or a barter on CIRCLE. Agency services from Portfolix are lead-capture only.",
);

export default function BrandsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        For brands
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Find people who can make the work
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        Post a requirement with a fixed budget, invite bids, or offer a barter.
        Browse creator rates when the creator has made them visible. Payment
        happens directly between you and the creator. CIRCLE does not hold
        funds.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PillLink href="/signup?role=brand">Post a collab</PillLink>
        <PillLink href="#lead-form" variant="secondary">
          Talk to our team
        </PillLink>
      </div>

      <h2 className="font-display mt-16 text-title font-medium tracking-tight uppercase">
        Agency services
      </h2>
      <p className="mt-4 max-w-2xl text-silver">
        Portfolix.Media and Portfolix.Tech can run paid work for brands. These
        pages collect a lead. CIRCLE does not ask for or store social media
        passwords. Prices are not listed here.
      </p>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {brandServices.map((service) => (
          <li key={service} className="bg-surface px-5 py-4 text-text">
            {service}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-small text-silver">
        Service detail pages: [PLACEHOLDER]
      </p>

      <section
        id="lead-form"
        className="mt-16 scroll-mt-24 rounded-2xl border border-border p-6 sm:p-10"
      >
        <h2 className="font-display text-title-sm font-medium">
          Talk to our team
        </h2>
        <p className="mt-3 max-w-xl text-silver">
          The lead form is not on this page yet. [PLACEHOLDER]
        </p>
      </section>
    </Container>
  );
}
