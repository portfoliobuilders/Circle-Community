import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { guides } from "@/lib/content/guides";
import { posts } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Journal",
  "CIRCLE guides, blog posts, product news, and the update log. Written by CIRCLE.",
  "/journal",
);

const shelves = [
  {
    href: "/guides",
    title: "Guides",
    body: "Short notes on finding a creator, reading a price, giveaways, affiliates, and ad disclosure.",
  },
  {
    href: "/blog",
    title: "Blog",
    body: "Longer notes on briefs, applications, follower labels, and paid posts.",
  },
  {
    href: "/news",
    title: "News",
    body: "Announcements from CIRCLE about what is on the site.",
  },
  {
    href: "/updates",
    title: "Updates",
    body: "A dated log of product changes. One entry per change, with no sample numbers.",
  },
] as const;

export default function JournalPage() {
  const latest = [...posts].reverse().slice(0, 4);
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Journal</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">
        Guides, blog, news, and updates
      </h1>
      <p className="mt-4 max-w-2xl text-silver">
        Written by CIRCLE. News here is product news from us. A feature about a member is added when there is a real recipient.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {shelves.map((shelf) => (
          <li key={shelf.href}>
            <Link href={shelf.href} className="block rounded-2xl border border-border p-5 hover:border-text">
              <h2 className="font-display text-lead font-medium">{shelf.title}</h2>
              <p className="mt-2 text-silver">{shelf.body}</p>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="font-display mt-16 text-title font-medium uppercase">Latest</h2>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {latest.map((post) => (
          <li key={`${post.kind}-${post.slug}`} className="py-5">
            <p className="text-small text-silver">{post.kind === "update" ? "Update" : post.kind === "news" ? "News" : "Blog"} · {post.published}</p>
            <Link href={`/${post.kind === "update" ? "updates" : post.kind}/${post.slug}`} className="mt-2 inline-block font-display text-lead font-medium underline-offset-4 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-small text-silver">{guides.length} guides are already published.</p>
    </Container>
  );
}
