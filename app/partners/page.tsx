import type { Metadata } from "next";

import { PartnerForm } from "@/components/partners/partner-form";
import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Partners",
  "Partner with CIRCLE on member perks, event venues, awards, or free learning. No audience numbers are published.",
  "/partners",
);

const audiences = [
  {
    title: "Brands with member perks",
    body: "Studios, gear, and tools can offer a discount that CIRCLE lists for members.",
  },
  {
    title: "Studios and venues",
    body: "Host a meetup or a community event.",
  },
  {
    title: "Sponsors",
    body: "Support an award or a community event.",
  },
  {
    title: "Educators",
    body: "Run a free webinar or bootcamp session.",
  },
];

const offers = [
  "A perk listing, once the discount is agreed.",
  "The event named with the venue, once a date is set.",
  "Credit on the awards or event page, once the sponsorship is agreed.",
  "A session listed under free learning, once the date is set.",
];

export default function PartnersPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Partners</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Partner with us
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        CIRCLE does not publish audience or member counts. A partnership is a written agreement, not a promised reach.
      </p>
      <h2 className="font-display mt-14 text-title font-medium uppercase">Who it is for</h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {audiences.map((item) => (
          <li key={item.title} className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-display text-lead font-medium">{item.title}</h3>
            <p className="mt-2 text-silver">{item.body}</p>
          </li>
        ))}
      </ul>
      <h2 className="font-display mt-14 text-title font-medium uppercase">What partners can get</h2>
      <ul className="mt-6 max-w-2xl list-disc space-y-2 pl-5 text-silver">
        {offers.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <section className="mt-16 max-w-xl">
        <h2 className="font-display text-title-sm font-medium">Tell us what you offer</h2>
        <div className="mt-6">
          <PartnerForm />
        </div>
      </section>
    </Container>
  );
}
