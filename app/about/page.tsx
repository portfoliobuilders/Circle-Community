import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";
import { site, values } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "About",
  "CIRCLE is a free community run by Portfolix Enterprise Pvt Ltd in Kochi, connecting creators, service providers, and brands.",
);

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        About
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        A free place to find your people
      </h1>
      <div className="mt-8 max-w-2xl space-y-4 text-silver">
        <p>
          CIRCLE exists so creators, influencers, freelancers, and service
          providers can meet brands without a paywall. The point is the work:
          collabs, services, events, and learning.
        </p>
        <p>
          The mission is to keep membership free, make collab terms visible,
          and recognise completed work — not noise.
        </p>
      </div>

      <h2 className="font-display mt-16 text-title font-medium tracking-tight uppercase">
        Values
      </h2>
      <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => (
          <li key={value.title}>
            <h3 className="font-display text-title-sm font-medium">
              {value.title}
            </h3>
            <p className="mt-2 text-silver">{value.body}</p>
          </li>
        ))}
      </ul>

      <section className="mt-16 rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <h2 className="font-display text-title font-medium tracking-tight uppercase">
          Free forever for members
        </h2>
        <p className="mt-4 max-w-2xl text-silver">
          Joining CIRCLE is free. There is no member paywall in v1. Collab
          budgets are shown on the brief. Money, when any is involved, moves
          directly between the brand and the creator. CIRCLE does not process
          payments.
        </p>
      </section>

      <section className="mt-16 max-w-2xl">
        <h2 className="font-display text-title font-medium tracking-tight uppercase">
          Who runs it
        </h2>
        <p className="mt-4 text-silver">
          {site.operatorDetail} The site is {site.domain}.
        </p>
      </section>
    </Container>
  );
}
