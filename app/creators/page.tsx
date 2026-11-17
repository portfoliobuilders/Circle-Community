import type { Metadata } from "next";

import Link from "next/link";

import { LeadForm } from "@/components/leads/lead-form";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { servicePath, servicesFor } from "@/lib/content/agency-services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "For creators",
  "The brief is already on CIRCLE. Sign up, open your profile, and apply. Brands pay you directly.",
  "/creators",
);

export default function CreatorsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        For creators
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        From first match to lasting income
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-silver">
        <p>
          The brief is already on the platform. Sign up and find it. List your category, the content you make, your starting price, and whether you are open to collabs, ads, giveaways, or affiliate offers.
        </p>
        <p>
          Follower counts stay labelled self-reported until they are verified. At 1,000 or more you can be marked a promoter. Membership is free. Brands pay you directly. CIRCLE does not take payment in v1.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PillLink href="/signup?role=creator">Create account</PillLink>
        <PillLink href="#lead-form" variant="secondary">
          Talk to our team
        </PillLink>
      </div>

      <h2 className="font-display mt-16 text-title font-medium tracking-tight uppercase">
        Creator services
      </h2>
      <p className="mt-4 max-w-2xl text-silver">
        Portfolix can help with the account itself. These are lead-capture
        services, not a tool that logs into your profiles. We will never ask
        for your password.
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
