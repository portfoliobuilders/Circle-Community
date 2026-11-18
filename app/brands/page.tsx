import type { Metadata } from "next";

import Link from "next/link";

import { LeadForm } from "@/components/leads/lead-form";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { servicePath, servicesFor } from "@/lib/content/agency-services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "For brands",
  "Hire verified Indian creators, launch fixed collabs with a 10% platform fee, or run performance video clipping campaigns.",
  "/brands",
);

export default function BrandsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        For brands
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Hire creators. Scale video distribution.
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        Filter verified creator portfolios by niche and location, launch fixed collab briefs with a 10% platform fee, or run viral clipping campaigns.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PillLink href="/directory">Find creators</PillLink>
        <PillLink href="/signup?role=brand" variant="secondary">
          Post a collab
        </PillLink>
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <span className="text-small tracking-[0.18em] text-silver uppercase font-mono">Performance Engine</span>
        <h2 className="font-display mt-2 text-title font-medium tracking-tight uppercase">
          Video clipping campaigns
        </h2>
        <p className="mt-3 max-w-2xl text-silver">
          Turn existing long-form video into high-velocity vertical reels. Set your payout rate per 100K views. Hundreds of clippers edit and post clips across social channels—you pay only for verified view milestones.
        </p>
        <div className="mt-6">
          <PillLink href="/clipping" variant="secondary">
            Explore clipping engine
          </PillLink>
        </div>
      </section>

      <h2 className="font-display mt-16 text-title font-medium tracking-tight uppercase">
        Managed agency services
      </h2>
      <p className="mt-4 max-w-2xl text-silver">
        Portfolix.Media and Portfolix.Tech offer managed campaign production, contract negotiation, and dedicated ad video creation for enterprise brands.
      </p>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {servicesFor("brand").map((service) => (
          <li key={service.slug} className="bg-surface">
            <Link
              href={servicePath(service)}
              className="flex min-h-11 items-center px-5 py-4 text-text underline-offset-4 hover:underline"
            >
              {service.title}
            </Link>
          </li>
        ))}
      </ul>

      <section
        id="lead-form"
        className="mt-16 scroll-mt-24 max-w-2xl rounded-2xl border border-border p-6 sm:p-10"
      >
        <h2 className="font-display text-title-sm font-medium">
          Talk to our team
        </h2>
        <p className="mt-3 text-silver">
          Tell us what the brand needs. Portfolix replies with a scope. Prices are quoted after that, not on this page. We will never ask for a password.
        </p>
        <div className="mt-6">
          <LeadForm audience="brand" />
        </div>
      </section>
    </Container>
  );
}
