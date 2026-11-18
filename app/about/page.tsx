import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";
import { site, values } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "About",
  "CIRCLE is a free community run by Portfolix Enterprise Pvt Ltd in Kochi, connecting creators, service providers, and brands.",
  "/about",
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
          Free membership · Transparent fees
        </h2>
        <p className="mt-4 max-w-2xl text-silver">
          Joining CIRCLE and listing your creative profile is free. For marketplace transactions (Collabs and Video Clipping), CIRCLE charges a transparent 10% platform fee on completed payouts to protect deliverables, verify metrics, and maintain community infrastructure.
        </p>
      </section>

      <section className="mt-16 max-w-2xl">
        <h2 className="font-display text-title font-medium tracking-tight uppercase">
          Who runs CIRCLE
        </h2>
        <p className="mt-4 text-silver">
          {site.operatorDetail} The official platform is {site.domain}. Contact{" "}
          <a className="text-text underline" href="mailto:info@circlecommunity.in">info@circlecommunity.in</a>.
          Read <Link className="text-text underline" href="/membership">membership terms</Link>,{" "}
          <Link className="text-text underline" href="/help">help center</Link>, and{" "}
          <Link className="text-text underline" href="/contact">contact options</Link>.
        </p>
        <div className="mt-8">
          <Link href="/directory" className="inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg">
            Explore the community
          </Link>
        </div>
      </section>
    </Container>
  );
}
