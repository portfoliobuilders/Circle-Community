import type { Metadata } from "next";

import Link from "next/link";

import { LeadForm } from "@/components/leads/lead-form";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { servicePath, servicesFor } from "@/lib/content/agency-services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "For brands",
  "Find creators by category, post a collab, and read giveaway and affiliate listings. You pay the creator directly.",
  "/brands",
);

export default function BrandsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        For brands
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Find high-fit creators in minutes, not weeks
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        Filter the directory by category and by the work a creator is open to: a collab, an ad, a giveaway, or an affiliate offer. Post the brief. You pay the creator directly. CIRCLE does not hold the money and does not track ad ROI.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PillLink href="/directory">Find creators</PillLink>
        <PillLink href="/signup?role=brand" variant="secondary">
          Post a collab
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
