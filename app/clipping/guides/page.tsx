import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";
import { CLIPPING_GUIDES } from "@/lib/clipping/guides-data";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Clipping & PR Creator Guides",
  "In-depth guides on vertical video editing, retention hooks, ASCI compliance, bio-code verification, and PR rate cards.",
  "/clipping/guides"
);

export const instant = false;

export default function ClippingGuidesPage() {
  return (
    <main className="py-16 sm:py-24 space-y-16">
      <Container>
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-lime font-semibold">
            Educational Knowledge Base
          </span>
          <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
            Creator & Editor Guides
          </h1>
          <p className="mt-4 text-lead text-silver leading-relaxed max-w-2xl">
            Practical strategies, compliance guidelines, and craft frameworks for video clippers and established social media PR creators.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLIPPING_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/clipping/guides/${guide.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-lime/40 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-silver">
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-lime border border-border">
                    {guide.category}
                  </span>
                  <span>{guide.readTime}</span>
                </div>
                <h2 className="font-display text-lg font-bold text-white group-hover:text-lime transition-colors">
                  {guide.title}
                </h2>
                <p className="text-xs text-silver leading-relaxed line-clamp-3">
                  {guide.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-lime">
                <span>Read article</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-surface/30 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 max-w-4xl">
          <div>
            <h3 className="font-display text-lg font-bold text-white uppercase">Ready to put these to practice?</h3>
            <p className="text-xs text-silver mt-1">
              Browse active clipping campaigns and pitch open social media PR briefs.
            </p>
          </div>
          <PillLink href="/clipping/campaigns">Explore campaigns</PillLink>
        </div>
      </Container>
    </main>
  );
}
