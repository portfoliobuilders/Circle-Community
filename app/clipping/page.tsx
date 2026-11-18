import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/site/container"
import { pageMetadata } from "@/lib/seo"
import { listCampaigns } from "@/lib/clipping/data"
import { SampleBanner } from "@/components/clipping/sample-banner"
import { OrbitScene, type OrbitNode } from "@/components/visual/orbit-scene"
import { HowItWorksSteps } from "@/components/clipping/how-it-works-steps"
import { ClippingCalculator } from "@/components/clipping/clipping-calculator"
import { AnimatedAccordion, type AccordionItemData } from "@/components/ui-motion/animated-accordion"
import { MagneticButton } from "@/components/ui-motion/magnetic-button"
import { HubCampaignsExplorer } from "@/components/clipping/hub-campaigns-explorer"

export const metadata: Metadata = pageMetadata(
  "Video Clipping",
  "Clip, post, and get paid per 1,000 verified views. Turn long-form footage into high-retention YouTube Shorts and Instagram Reels.",
  "/clipping"
)

export const instant = false

const clippingOrbitNodes: OrbitNode[] = [
  { id: "c-footage", label: "Source Footage", role: "Long-form 4K", angle: 30, radius: 140, highlight: true },
  { id: "c-clips", label: "Vertical Edits", role: "9:16 Shorts/Reels", angle: 110, radius: 140 },
  { id: "c-pr", label: "Social Media PR", role: "10K+ Verified Pages", angle: 195, radius: 210, highlight: true },
  { id: "c-audit", label: "Day 7 View Audit", role: "Snapshot Lock", angle: 280, radius: 140, highlight: true },
  { id: "c-payout", label: "UPI Disbursements", role: "Weekly Net Rates", angle: 345, radius: 210, highlight: true },
]

const clippingFaqs: AccordionItemData[] = [
  {
    id: "faq-eligibility",
    title: "Who is eligible to join clipping campaigns?",
    content: (
      <p className="text-sm text-silver leading-relaxed">
        To join a campaign and submit clips, you must be at least 18 years old (confirmed via the date of birth on your CIRCLE profile to comply with India&apos;s DPDP Act), possess an active CIRCLE member account, and have verified ownership of the YouTube or Instagram account where clips will be published via our bio-code verification system.
      </p>
    ),
  },
  {
    id: "faq-views",
    title: "When and how are video views counted?",
    content: (
      <p className="text-sm text-silver leading-relaxed">
        Views are verified exactly once, on day 7 following your submission to CIRCLE. For YouTube Shorts, views are automatically queried via the YouTube Data API. For Instagram Reels, verification is conducted against the public post and native Insights. Views occurring after day 7 do not generate additional earnings.
      </p>
    ),
  },
  {
    id: "faq-fees",
    title: "What fees does CIRCLE charge for clipping?",
    content: (
      <p className="text-sm text-silver leading-relaxed">
        Joining campaigns and submitting clips is free with zero registration or withdrawal fees. CIRCLE charges a transparent dual-sided 10% fee: campaign owners pay a 10% service fee on top of their campaign budget, and CIRCLE deducts a 10% platform fee from each clip&apos;s locked gross earnings to cover automated view verification, fraud prevention, and UPI payout processing.
      </p>
    ),
  },
  {
    id: "faq-payouts",
    title: "How and when do clippers get paid?",
    content: (
      <p className="text-sm text-silver leading-relaxed">
        Once views lock on day 7, net earnings immediately accrue to your CIRCLE wallet. Clippers can request a payout at any time as long as their net wallet balance meets the ₹500 minimum threshold. Payouts are batch-processed weekly directly to your Indian bank account via UPI.
      </p>
    ),
  },
  {
    id: "faq-rights",
    title: "What are the rules regarding copyright, source footage, and disclosures?",
    content: (
      <p className="text-sm text-silver leading-relaxed">
        Campaign owners legally certify that they own or license all source material provided for clipping. Clippers may only edit and monetize content from approved source links for the duration of the campaign. Under ASCI influencer marketing guidelines, every clip must include the designated #ad or #collab hashtag in its primary caption.
      </p>
    ),
  },
]

export default async function ClippingHubPage() {
  const { campaigns } = await listCampaigns()

  return (
    <>
      <SampleBanner />

      <main className="relative overflow-hidden py-16 sm:py-24">
        {/* 1. Hero Section */}
        <section className="relative pb-16 md:pb-24">
          <Container className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <p className="text-small tracking-[0.18em] text-silver uppercase font-mono">
                  Performance Video Marketplace // 03
                </p>
                <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium tracking-tight uppercase text-white">
                  Clip. Post. Get paid per view.
                </h1>
                <p className="mt-6 text-lead text-silver leading-relaxed max-w-2xl">
                  Edit vertical short-form video for brands and creators from approved source footage, and earn transparent performance-based payouts per 1,000 verified views.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <MagneticButton href="#campaigns" variant="primary">
                    Browse campaigns
                  </MagneticButton>
                  <MagneticButton href="/dashboard/clipping/campaigns/new" variant="secondary">
                    Launch a campaign
                  </MagneticButton>
                </div>
              </div>

              {/* Ambient Orbit Scene */}
              <div className="lg:col-span-5 flex justify-center">
                <OrbitScene nodes={clippingOrbitNodes} size={420} />
              </div>
            </div>

            {/* Dual Tracks: Clipping vs Social Media PR */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
                    Model 01
                  </span>
                  <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-silver">
                    No Follower Minimum
                  </span>
                </div>
                <h2 className="font-display mt-4 text-xl font-medium text-white uppercase">
                  Video Clipping · Pay-per-view
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-silver leading-relaxed">
                  Turn long-form podcast discussions and founder stories into viral vertical edits. Earn ₹10–₹200 per 1,000 verified views with automated view cap safeguards.
                </p>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-silver">10% platform fee on Day 7 lock</span>
                  <Link href="/clipping/campaigns?campaign_type=clipping" className="text-lime hover:underline font-mono font-medium">
                    View clipping briefs →
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
                    Model 02
                  </span>
                  <span className="rounded-full border border-lime/30 bg-lime/10 px-2.5 py-0.5 text-xs font-mono font-medium text-lime">
                    10,000+ Verified Followers
                  </span>
                </div>
                <h2 className="font-display mt-4 text-xl font-medium text-white uppercase">
                  Social Media PR · Pay-per-post
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-silver leading-relaxed">
                  Established theme pages and creators earn a guaranteed fixed fee per post. Upfront escrow payment released after a 7-day live verification hold.
                </p>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-silver">Standard: ASCI #ad disclosure</span>
                  <Link href="/clipping/campaigns?campaign_type=social_pr" className="text-lime hover:underline font-mono font-medium">
                    View PR openings →
                  </Link>
                </div>
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
                <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase mt-1">
                  Active Clipping Campaigns
                </h2>
                <p className="mt-2 text-silver text-sm max-w-xl">
                  Choose a campaign, claim source footage, and start editing. Payouts are verified on Day 7 and disbursed weekly via UPI.
                </p>
              </div>
              <Link
                href="/clipping/campaigns"
                className="text-xs font-mono text-silver hover:text-white inline-flex items-center gap-1.5 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
              >
                <span>Advanced directory & filter board →</span>
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
                Workflow Engine
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase mt-2">
                How Video Clipping Works
              </h2>
              <p className="mt-3 text-silver text-sm sm:text-base">
                Scale video distribution across social channels with automated view snapshot auditing and verified milestone payouts.
              </p>
            </div>

            <HowItWorksSteps />
          </Container>
        </section>

        {/* 4. Plain Fee Statement */}
        <section className="py-12 border-t border-border bg-surface/30">
          <Container>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
              <div className="max-w-3xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-lime font-mono">
                  Transparent Pricing
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-white uppercase mt-2">
                  Free to join. CIRCLE keeps 10% of clip earnings. Campaign owners pay 10% on top of budget.
                </h3>
                <p className="mt-3 text-silver text-sm leading-relaxed">
                  Zero signup fees, zero submission charges, and zero payout processing deductions. 100% of the campaign owner&apos;s core budget goes directly to paying clippers. CIRCLE&apos;s dual 10% fee covers automated view snapshot verification, anti-fraud moderation, and weekly bank UPI disbursements.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                      For Clippers
                    </p>
                    <p className="mt-1 text-xs text-silver leading-relaxed">
                      10% platform fee deducted from gross earnings upon the Day 7 lock. You always see the net rate first.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                      For Campaign Owners
                    </p>
                    <p className="mt-1 text-xs text-silver leading-relaxed">
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

        {/* 6. FAQ Section */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-lime font-mono">
                  Questions & Answers
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase mt-2">
                  Frequently Asked Questions
                </h2>
                <p className="mt-2 text-silver text-sm">
                  Clear guidelines on view verification, rights clearance, and payment mechanics.
                </p>
              </div>

              <AnimatedAccordion items={clippingFaqs} />

              <div className="mt-8">
                <Link
                  href="/help"
                  className="text-xs font-mono text-silver hover:text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
                >
                  Visit CIRCLE Help Center for more questions →
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* 7. Final Call to Action */}
        <section className="py-16 md:py-20 border-t border-border bg-surface/30">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
                Start Clipping Vertical Video
              </h2>
              <p className="mt-3 text-silver text-sm leading-relaxed">
                Join verified campaigns, turn creator footage into engaging YouTube Shorts and Instagram Reels, and receive transparent weekly UPI earnings.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <MagneticButton href="/clipping/campaigns" variant="primary">
                  Explore active campaigns
                </MagneticButton>
                <MagneticButton href="/signup" variant="secondary">
                  Create a creator account
                </MagneticButton>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  )
}
