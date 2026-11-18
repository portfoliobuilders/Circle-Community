import type { Metadata } from "next";

import Link from "next/link";

import { LeadForm } from "@/components/leads/lead-form";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { servicePath, servicesFor } from "@/lib/content/agency-services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "For creators",
  "Join CIRCLE free. Apply for paid brand collabs with a 10% platform fee, monetise viral shorts, and access creator workshops.",
  "/creators",
);

export default function CreatorsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        For creators
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Get booked for collabs. Monetise clips.
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-silver">
        <p>
          Discover open brand briefs across India. List your niche, sample deliverables, and starting rates for fixed collabs, open bids, and barter opportunities.
        </p>
        <p>
          Membership is free to join. Completed brand collabs and clipping campaigns carry a transparent 10% platform fee.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PillLink href="/signup?role=creator">Create creator account</PillLink>
        <PillLink href="/collabs" variant="secondary">
          Browse open collabs
        </PillLink>
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <span className="text-small tracking-[0.18em] text-silver uppercase font-mono">Performance & PR Engine</span>
        <h2 className="font-display mt-2 text-title font-medium tracking-tight uppercase">
          Video clipping & Social media PR
        </h2>
        <p className="mt-3 max-w-xl text-silver">
          Earn per 1,000 verified views editing vertical video clips, or book guaranteed fixed-fee sponsored posts on your 10K+ follower accounts with 100% upfront escrow.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <PillLink href="/clipping">Browse clipping briefs</PillLink>
          <PillLink href="/clipping/social-pr" variant="secondary">PR (10K+ followers)</PillLink>
        </div>
      </section>

      <h2 className="font-display mt-16 text-title font-medium tracking-tight uppercase">
        Creator services
      </h2>
      <p className="mt-4 max-w-2xl text-silver">
        Portfolix offers professional profile audits, media kit positioning, and dedicated account management for full-time creators.
      </p>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
        {servicesFor("creator").map((service) => (
          <li key={service.slug} className="bg-surface">
            <Link
              href={servicePath(service)}
              className="flex min-h-11 items-center px-5 py-4 underline-offset-4 hover:underline"
            >
              {service.title}
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-16 rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <p className="text-small tracking-[0.18em] text-silver uppercase">Audience growth</p>
        <h2 className="font-display mt-3 text-title-sm font-medium">Community giveaways</h2>
        <p className="mt-3 max-w-xl text-silver">
          Hosting a giveaway on Instagram Reels or YouTube Shorts? List it on CIRCLE to get discovered by creators and community members across India.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <PillLink href="/giveaways" variant="secondary">Browse giveaways</PillLink>
          <PillLink href="/giveaways/new" variant="secondary">List a giveaway</PillLink>
        </div>
      </section>

      <section
        id="lead-form"
        className="mt-16 scroll-mt-24 max-w-2xl rounded-2xl border border-border p-6 sm:p-10"
      >
        <h2 className="font-display text-title-sm font-medium">
          Talk to our team
        </h2>
        <p className="mt-3 text-silver">
          Send your handle and what you want help with. We will never ask for your password.
        </p>
        <div className="mt-6">
          <LeadForm audience="creator" />
        </div>
      </section>
    </Container>
  );
}
