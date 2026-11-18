import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { SteppedWorkflow } from "@/components/clipping/stepped-workflow";

export const metadata: Metadata = pageMetadata(
  "How Clipping & PR Works",
  "Step-by-step guide to CIRCLE's dual performance video models: Video Clipping paid per verified view and Social Media PR paid per post.",
  "/clipping/how-it-works"
);

export const instant = false;

const clippingSteps = [
  {
    step: "01",
    title: "Browse briefs & claim source footage",
    desc: "Browse live campaigns filtered by platform (YouTube Shorts or Instagram Reels), category, or payout rate. Review the editing brief, hook instructions, and asset kits.",
  },
  {
    step: "02",
    title: "Edit and publish vertical cuts",
    desc: "Transform long-form discussions into high-retention 30–60s vertical clips. Add kinetic subtitles, hooks, and mandatory ASCI disclosure (#ad or #collab).",
  },
  {
    step: "03",
    title: "Submit URL & wait for Day 7 snapshot",
    desc: "Submit your live post URL. CIRCLE logs the submission. Exactly 7 days later (VIEW_HOLD_DAYS), our automated verification engine takes a single view count snapshot.",
  },
  {
    step: "04",
    title: "Accrue wallet earnings & withdraw via UPI",
    desc: "Views lock into your wallet ledger at the campaign rate minus CIRCLE's 10% platform fee. Request bank payout at any time once balance meets the ₹500 floor.",
  },
];

const prSteps = [
  {
    step: "01",
    title: "Verify account ownership (10K+ followers)",
    desc: "Link your Instagram or YouTube account and verify bio-code ownership. An admin audits your follower authentic engagement and records your count.",
  },
  {
    step: "02",
    title: "Apply or quote on open PR slots",
    desc: "Find campaigns matching your niche. Submit a short pitch explaining how you will tell the brand story. Apply at the fixed fee or quote your custom rate.",
  },
  {
    step: "03",
    title: "Escrow reservation & draft approval",
    desc: "The owner accepts your pitch and funds are row-locked in escrow. Upload your draft to private storage. The owner approves or requests at most 1 revision.",
  },
  {
    step: "04",
    title: "Publish with ASCI paid-partnership tag",
    desc: "Post the approved content to your verified handle with platform paid partnership tools and #ad/#collab. Submit the live post link in your dashboard.",
  },
  {
    step: "05",
    title: "7-Day live hold & weekly UPI disbursement",
    desc: "The post remains public and unedited for 7 days (PR_LIVE_DAYS). On Day 7, the fee locks to your ledger and is disbursed weekly to your bank account via UPI.",
  },
];

export default function HowItWorksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How CIRCLE Video Clipping and Social Media PR Works",
    description: "Guide to earning through performance video clipping and fixed-fee social media PR.",
    step: [
      ...clippingSteps.map((s, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: s.title,
        text: s.desc,
      })),
      ...prSteps.map((s, idx) => ({
        "@type": "HowToStep",
        position: clippingSteps.length + idx + 1,
        name: s.title,
        text: s.desc,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="py-16 sm:py-24 space-y-20 sm:space-y-28">
        {/* Hero */}
        <section>
          <Container>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-lime font-semibold">
                Execution Blueprint
              </span>
              <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
                How CIRCLE campaigns work
              </h1>
              <p className="mt-6 text-lead text-silver leading-relaxed max-w-2xl">
                Choose between performance video clipping (paid per verified view) or social media PR (paid per post for verified 10K+ follower accounts).
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <PillLink href="#clipping-flow">Video Clipping Flow</PillLink>
                <PillLink href="#pr-flow" variant="secondary">
                  Social PR Flow
                </PillLink>
              </div>
            </div>
          </Container>
        </section>

        {/* Track 1: Video Clipping Pipeline */}
        <section id="clipping-flow" className="scroll-mt-24 border-t border-border pt-16 sm:pt-20">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-lime">Model 01</span>
                <h2 className="font-display mt-2 text-2xl sm:text-4xl font-medium tracking-tight text-white uppercase">
                  Video Clipping · Pay-per-view
                </h2>
                <p className="mt-2 text-silver text-sm max-w-xl">
                  Open to all active creators (18+). Edit vertical shorts from authorized source footage and earn ₹10–₹200 per 1,000 verified views.
                </p>
              </div>
              <Link
                href="/clipping/campaigns?campaign_type=clipping"
                className="text-xs font-semibold text-lime hover:underline inline-flex items-center gap-1.5"
              >
                <span>Browse clipping briefs</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <SteppedWorkflow steps={clippingSteps} badge="Pay-Per-View" />

            <div className="mt-8 rounded-xl border border-border bg-surface/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <span className="text-silver">
                Key verification rule: Single snapshot on Day 7. Subsequent views do not generate earnings.
              </span>
              <Link href="/clipping/rules" className="text-lime hover:underline shrink-0">
                Read clipping rules →
              </Link>
            </div>
          </Container>
        </section>

        {/* Track 2: Social Media PR Pipeline */}
        <section id="pr-flow" className="scroll-mt-24 border-t border-border pt-16 sm:pt-20 bg-surface/20">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-lime">Model 02</span>
                <h2 className="font-display mt-2 text-2xl sm:text-4xl font-medium tracking-tight text-white uppercase">
                  Social Media PR · Pay-per-post
                </h2>
                <p className="mt-2 text-silver text-sm max-w-xl">
                  For established pages and influencers with 10,000+ admin-verified followers. Upfront escrow payment released after a 7-day live verification hold.
                </p>
              </div>
              <Link
                href="/clipping/social-pr"
                className="text-xs font-semibold text-lime hover:underline inline-flex items-center gap-1.5"
              >
                <span>Read PR handbook</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <SteppedWorkflow steps={prSteps} badge="10K+ Followers" />

            <div className="mt-8 rounded-xl border border-lime/30 bg-lime/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <span className="text-silver">
                Strict compliance: 10,000+ admin-verified followers, 1 revision round max, ASCI disclosure, 7-day live hold.
              </span>
              <Link href="/clipping/campaigns?campaign_type=social_pr" className="text-lime hover:underline shrink-0 font-medium">
                Browse open PR slots →
              </Link>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-border pt-16 pb-8">
          <Container>
            <div className="text-center max-w-2xl mx-auto space-y-6">
              <h2 className="font-display text-2xl sm:text-4xl font-medium uppercase tracking-tight text-white">
                Ready to get started?
              </h2>
              <p className="text-xs sm:text-sm text-silver leading-relaxed">
                Join verified campaigns, turn creator footage into engaging YouTube Shorts and Instagram Reels, or book high-reach PR pages.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <PillLink href="/clipping/campaigns">Explore active campaigns</PillLink>
                <PillLink href="/dashboard/clipping/campaigns/new" variant="secondary">
                  Launch your campaign
                </PillLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
