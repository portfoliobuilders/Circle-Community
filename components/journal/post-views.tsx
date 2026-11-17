import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/site/container";
import { postKinds, type Post } from "@/lib/content/posts";
import { site } from "@/lib/site";

export function PostList({
  eyebrow,
  title,
  intro,
  posts,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  posts: Post[];
}) {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">{eyebrow}</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">{title}</h1>
      <p className="mt-4 max-w-2xl text-silver">{intro}</p>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {posts.map((post) => (
          <li key={post.slug} className="py-5">
            <Link
              href={`${postKinds[post.kind].href}/${post.slug}`}
              className="font-display text-lead font-medium underline-offset-4 hover:underline"
            >
              {post.title}
            </Link>
            <p className="mt-2 max-w-2xl text-silver">{post.summary}</p>
            <p className="mt-2 text-small text-silver">{post.published}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export function PostArticle({ post }: { post: Post }) {
  const kind = postKinds[post.kind];
  const url = `${site.url}${kind.href}/${post.slug}`;
  return (
    <Container className="py-16 sm:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": post.kind === "news" ? "NewsArticle" : "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.publishedIso,
          dateModified: post.publishedIso,
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@id": `${site.url}/#organization` },
          mainEntityOfPage: url,
        }}
      />
      <p className="text-small tracking-[0.18em] text-silver uppercase">{kind.singular}</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">{post.title}</h1>
      <p className="mt-4 text-small text-silver">CIRCLE · {post.published}</p>
      <div className="mt-10 max-w-2xl space-y-8">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-title-sm font-medium">{section.heading}</h2>
            <p className="mt-3 text-silver">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 text-small text-silver">
        <Link className="underline underline-offset-4" href={kind.href}>
          All {kind.label.toLowerCase()}
        </Link>
        {" · "}
        <Link className="underline underline-offset-4" href="/guides">
          Guides
        </Link>
      </p>
    </Container>
  );
}
