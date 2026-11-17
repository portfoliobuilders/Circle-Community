import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { guides } from "@/lib/content/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Guides",
  "Guides for creators and brands on finding people, reading a price, giveaways, affiliates, and ad disclosure.",
  "/guides",
);

export default function GuidesPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Guides</p>
      <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Guides for everyone</h1>
      <p className="mt-4 max-w-2xl text-silver">
        Written by CIRCLE. Longer notes are on the <Link className="underline underline-offset-4" href="/blog">blog</Link>, product announcements are on <Link className="underline underline-offset-4" href="/news">news</Link>, and the change log is on <Link className="underline underline-offset-4" href="/updates">updates</Link>. Awards and member features are added when there is a real recipient.
      </p>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {guides.map((guide) => (
          <li key={guide.slug} className="py-5">
            <Link href={`/guides/${guide.slug}`} className="font-display text-lead font-medium underline-offset-4 hover:underline">
              {guide.title}
            </Link>
            <p className="mt-2 max-w-2xl text-silver">{guide.summary}</p>
            <p className="mt-2 text-small text-silver">Updated {guide.updated}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
