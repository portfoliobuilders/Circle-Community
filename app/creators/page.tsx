import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";
import { creatorServices } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "For creators",
  "Build a CIRCLE profile, apply for collabs, join events, and request a profile audit. We never ask for your password.",
);

export default function CreatorsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        For creators
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Show your work. Find the next brief.
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-silver">
        <p>
          List your platforms, follower counts, and rates. Apply for fixed
          collabs, send a bid, or take a barter. Join meetups, webinars, and
          awards. Follower counts stay labelled self-reported until they are
          verified.
        </p>
        <p>
          Collaborators confirm they are 18 or older. Membership is free.
          Brands pay you directly. CIRCLE does not take payment in v1.
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
        {creatorServices.map((service) => (
          <li key={service} className="bg-surface px-5 py-4">
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
