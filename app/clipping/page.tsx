import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";
import { listCampaigns } from "@/lib/clipping/data";
import { SampleBanner } from "@/components/clipping/sample-banner";
import { HeroOrbit } from "@/components/clipping/hero-orbit";
import { HowItWorksSteps } from "@/components/clipping/how-it-works-steps";
import { ClippingCalculator } from "@/components/clipping/clipping-calculator";
import { FaqAccordion } from "@/components/clipping/faq-accordion";
import { HubCampaignsExplorer } from "@/components/clipping/hub-campaigns-explorer";

export const metadata: Metadata = pageMetadata(
  "Video Clipping",
  "Clip, post, and get paid per 1,000 verified views. Turn long-form footage into high-retention YouTube Shorts and Instagram Reels.",
  "/clipping"
);

export const instant = false;

export default async function ClippingHubPage() {
  const { campaigns } = await listCampaigns();

  return (
    <>
      <SampleBanner />

      <main className="relative overflow-hidden py-16 sm:py-24">
        {/* 1. Hero Section */}
        <section className="relative pb-16 md:pb-24">
          <Container className="relative">
            <HeroOrbit />
            <div className="max-w-3xl">
              <p className="text-small tracking-[0.18em] text-silver uppercase font-mono">
                Performance Video Marketplace
              </p>
              <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium tracking-tight uppercase text-white">
                Clip. Post. Get paid per view.
              </h1>
              <p className="mt-6 text-lead text-silver leading-relaxed max-w-2xl">
                Edit vertical short-form video for brands and creators from approved source footage, and earn transparent performance-based payouts per 1,000 verified views.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PillLink href="#campaigns">Browse campaigns</PillLink>
                <PillLink href="/brands" variant="secondary">
                  Launch a campaign
                </PillLink>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. Live Campaigns Explorer Section */}
        <section id="campaigns" className="scroll-mt-24 py-16 md:py-20 border-t border-border bg-surface/20">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-lime font-mono">
                  Live Marketplace
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                  Active Clipping Campaigns
                </h2>
                <p className="mt-2 text-silver text-sm max-w-xl">
                  Choose a campaign, claim source footage, and start editing. Payouts are verified on Day 7 and disbursed weekly via UPI.
                </p>
              </div>
              <Link
                href="/clipping/campaigns"
                className="text-xs font-medium text-silver hover:text-white inline-flex items-center gap-1.5 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <span>Advanced directory & filter board</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <HubCampaignsExplorer initialCampaigns={campaigns} />
          </Container>
        </section>

        {/* 3. How It Works (4 Steps) */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-lime font-mono">
                Simple 4-Step Process
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
                How Video Clipping Works
              </h2>
              <p className="mt-4 text-silver text-sm sm:text-base">
                Whether you edit high-velocity reels or need scalable distribution for your podcast and brand, our single-snapshot verification guarantees fairness.
              </p>
            </div>

            <HowItWorksSteps />
          </Container>
        </section>

        {/* 4. Plain Fee Statement */}
        <section className="py-12 border-t border-border bg-surface/40">
          <Container>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
              <div className="max-w-3xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-lime font-mono">
                  Transparent Pricing
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                  Free to join. CIRCLE keeps 10% of clip earnings. Campaign owners pay 10% on top of their budget.
                </h3>
                <p className="mt-4 text-silver text-sm leading-relaxed">
                  Zero signup fees, zero submission charges, and zero payout processing deductions. 100% of the campaign owner&apos;s core budget goes directly to paying clippers. CIRCLE&apos;s dual 10% fee covers automated view snapshot verification, anti-fraud moderation, and weekly bank UPI disbursements.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white">
                      For Clippers
                    </p>
                    <p className="mt-1 text-sm text-silver">
                      10% platform fee deducted from gross earnings upon the Day 7 lock. You always see the net rate first.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white">
                      For Campaign Owners
                    </p>
                    <p className="mt-1 text-sm text-silver">
                      10% owner fee invoiced on top of your budget. Unused budget for unverified views is fully refunded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. Mini Earnings Calculator */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <ClippingCalculator />
          </Container>
        </section>

        {/* 6. FAQ Excerpt */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="mb-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-lime font-mono">
                  Questions & Answers
                </span>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-2">
                  Frequently Asked Questions
                </h2>
                <p className="mt-2 text-silver text-sm">
                  Clear guidelines on view verification, rights clearance, and payment mechanics.
                </p>
              </div>

              <FaqAccordion />

              <div className="mt-8 text-center sm:text-left">
                <Link
                  href="/help"
                  className="text-xs text-silver hover:text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  Visit CIRCLE Help Center for more questions
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* 7. Final Call to Action */}
        <section className="py-16 md:py-20 border-t border-border bg-surface/20">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Start Clipping Vertical Video
              </h2>
              <p className="mt-4 text-silver text-sm sm:text-base leading-relaxed">
                Join verified campaigns, turn creator footage into engaging YouTube Shorts and Instagram Reels, and receive transparent weekly UPI earnings.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <PillLink href="/clipping/campaigns">Explore active campaigns</PillLink>
                <PillLink href="/signup" variant="secondary">
                  Create a creator account
                </PillLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
