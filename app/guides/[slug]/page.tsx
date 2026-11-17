import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/site/container";
import { findGuide, guides } from "@/lib/content/guides";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) return pageMetadata("Guide", "A CIRCLE guide.", "/guides");
  return pageMetadata(guide.title, guide.summary, `/guides/${guide.slug}`);
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();

  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Guide</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">{guide.title}</h1>
      <p className="mt-4 text-small text-silver">CIRCLE · Updated {guide.updated}</p>
      <div className="mt-10 max-w-2xl space-y-8">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-title-sm font-medium">{section.heading}</h2>
            <p className="mt-3 text-silver">{section.body}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
