import type { Metadata } from "next";

import { PartnerForm } from "@/components/partners/partner-form";
import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Partners",
  "Partner with CIRCLE on creator perks, studio discounts, event sponsorship, and free community education.",
  "/partners",
);

const audiences = [
  {
    title: "Brands with creator perks",
    body: "Offer member discounts on gear, editing software, and creative tools.",
  },
  {
    title: "Studios and production venues",
    body: "Host in-person creator meetups, video shoots, and community workshops.",
  },
  {
    title: "Event & award sponsors",
    body: "Support annual creator awards and regional meetup activations.",
  },
  {
    title: "Industry educators",
    body: "Host free webinars, short-form editing bootcamps, and masterclasses.",
  },
];

const offers = [
  "Dedicated perk listing in our member toolkit.",
  "Co-branded event promotion across our community channels.",
  "Direct accreditation on award ceremonies and workshop assets.",
  "Curated session listings on our official learning calendar.",
];

export default function PartnersPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Partners</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Partner with CIRCLE
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        Collaborate on verified creator perks, venue partnerships, or sponsored community masterclasses.
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
