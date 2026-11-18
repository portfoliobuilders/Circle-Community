import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Clipping & PR for Brands",
  "Scale your content distribution across India. Choose between performance video clipping paid per view or authoritative PR across established 10K+ follower accounts.",
  "/clipping/for-brands"
);

export const instant = false;

const comparisonTable = [
  {
    dimension: "Primary Objective",
    clipping: "Viral reach at scale across dozens of unique editor hooks and perspectives.",
    pr: "Targeted, authoritative endorsement on established niche community pages.",
  },
  {
    dimension: "Creator Profile",
    clipping: "Skilled vertical video editors (no minimum follower count required).",
    pr: "Vetted creators and theme pages with ≥ 10,000 admin-verified followers.",
  },
  {
    dimension: "Pricing Model",
    clipping: "Pay-per-view: ₹10 to ₹200 per 1,000 verified views (custom per-clip caps).",
    pr: "Pay-per-post: Guaranteed fixed fee or accepted quote per deliverable.",
  },
  {
    dimension: "Content Approval",
    clipping: "Pre-cleared source footage guidelines; editors cut independently.",
    pr: "On-platform draft review with up to 1 revision round before publishing.",
  },
  {
    dimension: "Settlement Mechanism",
    clipping: "Single view count snapshot taken on Day 7 post-submission.",
    pr: "7-day continuous live post hold with verified ASCI paid-partnership tag.",
  },
  {
    dimension: "Budget Guarantee",
    clipping: "Unspent budget for unverified views is fully refunded to the brand.",
    pr: "Unfulfilled slots or non-compliant posts automatically refund to escrow.",
  },
];

export default function ForBrandsPage() {
  return (
    <main className="py-16 sm:py-24 space-y-20 sm:space-y-28">
      {/* 1. Hero */}
      <section>
        <Container>
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-lime font-semibold">
              Brand & Owner Handbook
            </span>
            <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
              Scale your story across Indian social media
            </h1>
            <p className="mt-6 text-lead text-silver leading-relaxed max-w-2xl">
              Distribute long-form footage to creative clippers or book verified 10,000+ follower accounts. Transparent upfront escrow with zero payment risk.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PillLink href="/dashboard/clipping/campaigns/new">Launch a campaign</PillLink>
              <PillLink href="#compare" variant="secondary">
                Compare models
              </PillLink>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Comparison Table */}
      <section id="compare" className="scroll-mt-24 border-t border-border pt-16 sm:pt-20">
        <Container>
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs uppercase tracking-wider text-lime">Strategic Selection</span>
            <h2 className="font-display mt-2 text-2xl sm:text-4xl font-medium tracking-tight text-white uppercase">
              Choose the right model for your goals
            </h2>
            <p className="mt-3 text-silver text-sm sm:text-base">
              Whether you need volume testing for YouTube Shorts or brand positioning on respected Instagram pages, CIRCLE provides protected escrow.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/60 font-mono uppercase text-silver">
                  <th className="p-4 sm:p-5 w-1/4">Criteria</th>
                  <th className="p-4 sm:p-5 w-3/8 text-white">Video Clipping (Pay-per-view)</th>
                  <th className="p-4 sm:p-5 w-3/8 text-lime">Social Media PR (Pay-per-post)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface/30 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-text font-mono text-xs">{row.dimension}</td>
                    <td className="p-4 sm:p-5 text-silver leading-relaxed">{row.clipping}</td>
                    <td className="p-4 sm:p-5 text-silver leading-relaxed">{row.pr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* 3. Escrow & Upfront Invoice Math */}
      <section className="border-t border-border pt-16 sm:pt-20 bg-surface/20">
        <Container>
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-wider text-lime">Transparent Invoicing</span>
              <h2 className="font-display mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
                Upfront escrow security for both sides
              </h2>
              <p className="mt-4 text-silver text-sm leading-relaxed">
                Creators only invest effort when they know funds are secured. Brand budgets are funded 100% upfront into CIRCLE escrow prior to launch.
              </p>

              <div className="mt-8 rounded-xl border border-border bg-surface p-6 font-mono text-xs space-y-3">
                <div className="flex justify-between text-silver">
                  <span>Core Creator Escrow Budget:</span>
                  <span className="text-white font-medium">₹50,000</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>CIRCLE Platform Fee (10% on top):</span>
                  <span className="text-white font-medium">₹5,000</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-sm">
                  <span className="text-white font-semibold">Total Bank UTR Invoice:</span>
                  <span className="text-lime font-bold">₹55,000</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 text-xs text-silver">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-lime shrink-0 mt-0.5" />
                  <span>Unspent budget for unreached views or unaccepted slots is fully refunded.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span>Manual invoice raised by Portfolix with corporate GST invoicing.</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Action CTA */}
      <section className="border-t border-border pt-16 pb-8">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-2xl sm:text-4xl font-medium uppercase tracking-tight text-white">
              Launch your campaign on CIRCLE
            </h2>
            <p className="text-xs sm:text-sm text-silver leading-relaxed">
              Submit your brief in 5 minutes. An administrator will verify rights and issue your invoice within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <PillLink href="/dashboard/clipping/campaigns/new">Create a campaign</PillLink>
              <PillLink href="/clipping/rules" variant="secondary">
                Review platform rules
              </PillLink>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
