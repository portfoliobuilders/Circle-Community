import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Resources",
  "Guides, templates, gear notes, suppliers, and recordings for CIRCLE members. Files are not published yet.",
  "/resources",
);

const groups = [
  {
    title: "Brief templates",
    body: "Standardised brief outlines for fixed, open-bid, and barter brand collabs.",
  },
  {
    title: "Rate benchmarks",
    body: "Reference pricing tiers and deliverable scoping models across Indian creator categories.",
  },
  {
    title: "ASCI disclosure guides",
    body: "Practical checklists for required #ad and #collab disclosures on paid social media posts.",
  },
  {
    title: "Clipping workflows",
    body: "Vertical short-form editing frameworks and view milestone optimization strategies.",
  },
  {
    title: "Studio & gear directory",
    body: "Verified production spaces, camera packages, and partner creator discounts.",
  },
];

export default function ResourcesPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-small tracking-[0.18em] text-silver uppercase">Resources</p>
          <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">
            Creator Toolkit
          </h1>
        </div>
        <Link href="/guides" className="inline-flex min-h-11 items-center rounded-full bg-lime px-5 text-sm font-medium text-bg">
          Browse guides
        </Link>
      </div>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        Actionable templates, rate calculators, and compliance checklists designed for Indian creators and brands.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {groups.map((group) => (
          <li key={group.title} className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-display text-lead font-medium">{group.title}</h2>
            <p className="mt-2 text-silver">{group.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-silver">
        Read the <Link className="text-text underline" href="/journal">journal</Link> for editorial insights and platform updates, or register for upcoming sessions on <Link className="text-text underline" href="/learn">Learn</Link>.
      </p>
    </Container>
  );
}
