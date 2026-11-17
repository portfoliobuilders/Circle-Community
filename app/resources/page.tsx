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
    title: "Guides",
    body: "Short notes are published on Guides. Longer notes, product news, and the change log are on the journal.",
  },
  {
    title: "Templates and presets",
    body: "Briefs, shot lists, and edit presets the team has the rights to share. Nothing is uploaded yet, and we will not host files we do not own.",
  },
  {
    title: "Gear",
    body: "Lists of kit with a reason and a price range written as text. No shop is live on this page.",
  },
  {
    title: "Suppliers",
    body: "Studios, labs, and vendors. A partner or affiliate link will be labelled when one exists.",
  },
  {
    title: "Recordings",
    body: "Webinar and bootcamp recordings, linked out to the host. CIRCLE does not stream video itself.",
  },
];

export default function ResourcesPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Resources</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">
        Toolkit
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        A library for creators. The shelves are labelled. The files are not published yet, so there is nothing to download and no download count to show.
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
        Read the <Link className="text-text underline" href="/journal">journal</Link> for guides, the blog, news, and updates. Sessions that are scheduled sit on <Link className="text-text underline" href="/learn">Learn</Link>. A studio or a tool brand can write through <Link className="text-text underline" href="/partners">Partners</Link>.
      </p>
    </Container>
  );
}
