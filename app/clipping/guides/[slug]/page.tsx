import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";
import { CLIPPING_GUIDES } from "@/lib/clipping/guides-data";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export const instant = false;

export async function generateStaticParams() {
  return CLIPPING_GUIDES.map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = CLIPPING_GUIDES.find((g) => g.slug === slug);
  if (!guide) return {};

  return pageMetadata(guide.title, guide.summary, `/clipping/guides/${guide.slug}`);
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = CLIPPING_GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const related = CLIPPING_GUIDES.filter((g) => g.slug !== slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    datePublished: guide.publishedAt,
    author: {
      "@type": "Organization",
      name: "CIRCLE",
      url: "https://circle.community",
    },
    publisher: {
      "@type": "Organization",
      name: "CIRCLE",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://circle.community/clipping/guides/${guide.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://circle.community",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Clipping",
        item: "https://circle.community/clipping",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Guides",
        item: "https://circle.community/clipping/guides",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: guide.title,
        item: `https://circle.community/clipping/guides/${guide.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="py-16 sm:py-24 space-y-16">
        <Container>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-silver mb-8">
            <Link href="/clipping" className="hover:text-white transition">
              Clipping
            </Link>
            <span>/</span>
            <Link href="/clipping/guides" className="hover:text-white transition">
              Guides
            </Link>
            <span>/</span>
            <span className="text-lime truncate max-w-xs">{guide.title}</span>
          </div>

          {/* Article Header */}
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-silver">
              <span className="rounded-full bg-surface px-3 py-1 text-lime border border-border">
                {guide.category}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {guide.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {guide.publishedAt}
              </span>
            </div>

            <h1 className="font-display text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
              {guide.title}
            </h1>

            <p className="text-lead text-silver leading-relaxed pt-2">
              {guide.summary}
            </p>
          </div>

          {/* Article Prose Content */}
          <article className="mt-12 max-w-3xl border-t border-border pt-10 text-text space-y-6 leading-relaxed">
            {guide.contentMd.split("\n\n").map((block, idx) => {
              if (block.startsWith("### ")) {
                return (
                  <h2 key={idx} className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white pt-4">
                    {block.replace("### ", "")}
                  </h2>
                );
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n- ").map((item) => item.replace(/^- /, ""));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 text-sm text-silver">
                    {items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(block)) {
                const items = block.split(/\n\d+\.\s/).filter(Boolean);
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-2 text-sm text-silver">
                    {items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-sm text-silver leading-relaxed">
                  {block}
                </p>
              );
            })}
          </article>

          {/* Related Articles */}
          <div className="mt-20 border-t border-border pt-12 max-w-3xl space-y-8">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white">
              Related Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/clipping/guides/${rel.slug}`}
                  className="rounded-2xl border border-border bg-card p-6 space-y-2 hover:border-lime/40 transition block"
                >
                  <span className="text-[11px] font-mono text-lime uppercase">{rel.category}</span>
                  <h4 className="font-display text-base font-bold text-white line-clamp-2">{rel.title}</h4>
                  <p className="text-xs text-silver line-clamp-2">{rel.summary}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Back to Guides link */}
          <div className="mt-12">
            <Link
              href="/clipping/guides"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-6 text-xs font-semibold text-text hover:border-lime transition"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to all guides</span>
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}
