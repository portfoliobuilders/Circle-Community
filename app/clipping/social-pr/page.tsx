import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";
import { formatInr } from "@/lib/format";
import { ShieldCheck, Users, Clock, Award, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Social Media PR",
  "Book verified Indian influencers and established pages with 10,000+ followers for fixed-fee sponsored posts with guaranteed 7-day live verification.",
  "/clipping/social-pr"
);

export const instant = false;

const prFaqs = [
  {
    question: "Who qualifies to apply for Social Media PR campaigns?",
    answer:
      "Only creators and theme pages with at least 10,000 admin-verified followers on YouTube or Instagram can apply. You must be 18+, have an active CIRCLE profile, and verify ownership of your account via our bio-code verification protocol.",
  },
  {
    question: "How does CIRCLE verify that follower counts are real?",
    answer:
      "Follower counts are never self-reported. CIRCLE administrators manually inspect the connected profile, verify the temporary bio code, and audit recent post engagement (likes, comments, and view ratios) to detect artificial bot amplification before recording your verified count.",
  },
  {
    question: "How long is my follower verification valid?",
    answer:
      "Follower verification remains valid for 90 days (PR_FOLLOWER_RECHECK_DAYS). Before each payout and upon expiry, an admin re-verifies your follower count to ensure your profile continues meeting the 10,000 floor.",
  },
  {
    question: "When and how are creators paid for PR posts?",
    answer:
      "Campaign owners pay CIRCLE 100% upfront into escrow. Once you publish your approved post and submit its live URL, the post must remain public, live, and unedited for 7 consecutive days (PR_LIVE_DAYS). On Day 7, your fee locks into your wallet ledger and is settled weekly via UPI.",
  },
  {
    question: "What fees does CIRCLE charge for Social Media PR?",
    answer:
      "CIRCLE charges a transparent dual-sided 10% fee: campaign owners pay a 10% service fee on top of their campaign budget, and CIRCLE deducts a 10% platform fee from each creator's locked post fee upon Day 7 completion.",
  },
  {
    question: "What are the rules regarding ASCI ad disclosure?",
    answer:
      "Under ASCI influencer guidelines, every sponsored post must feature the platform's native paid-partnership tag plus #ad or #collab prominently in the primary caption. Posts lacking disclosure or removing it prior to Day 7 forfeit payment.",
  },
  {
    question: "Which industries and topics are banned from Social Media PR?",
    answer:
      "CIRCLE strictly rejects campaigns in political advocacy, real-money betting and gambling, cryptocurrency and speculative schemes, unproven health claims, adult content, and defamatory hit pieces. Campaigns promoting an individual require written legal authorization.",
  },
];

export default function SocialPrPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: prFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="py-16 sm:py-24 space-y-20 sm:space-y-28">
        {/* 1. Hero Section */}
        <section className="relative">
          <Container>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-lime font-semibold">
                Social Media PR · 10,000+ Followers
              </span>
              <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
                Share stories. Get paid per post.
              </h1>
              <p className="mt-6 text-lead text-silver leading-relaxed max-w-2xl">
                A brand or verified individual pays established creators and niche pages a guaranteed fee to publish approved reels, carousels, or stories with 100% upfront escrow.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PillLink href="/clipping/campaigns?campaign_type=social_pr">
                  Browse PR briefs
                </PillLink>
                <PillLink href="/dashboard/clipping/campaigns/new" variant="secondary">
                  Launch a PR campaign
                </PillLink>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-silver font-mono border-t border-border pt-6">
                <span className="inline-flex items-center gap-1.5 text-white">
                  <ShieldCheck className="size-4 text-lime" />
                  10K+ Verified Followers Only
                </span>
                <span className="inline-flex items-center gap-1.5 text-white">
                  <Clock className="size-4 text-lime" />
                  7-Day Live Maturation Hold
                </span>
                <span className="inline-flex items-center gap-1.5 text-white">
                  <Award className="size-4 text-lime" />
                  ASCI Ad Disclosure Required
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. Qualification Criteria (The 10K Standard) */}
        <section className="border-t border-border pt-16 sm:pt-20">
          <Container>
            <div className="max-w-2xl mb-12">
              <span className="font-mono text-xs uppercase tracking-wider text-lime">Verification Standards</span>
              <h2 className="font-display mt-2 text-2xl sm:text-4xl font-medium tracking-tight text-white uppercase">
                Zero self-reported numbers
              </h2>
              <p className="mt-3 text-silver text-sm sm:text-base">
                To protect brands and ensure credible distribution, participation in Social Media PR requires rigorous account verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-3">
                <div className="size-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
                  <Users className="size-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase">
                  10,000+ Follower Floor
                </h3>
                <p className="text-xs text-silver leading-relaxed">
                  Only accounts with at least 10,000 followers are eligible. An administrator audits your account to verify authentic engagement ratios and filter out bot pages.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-3">
                <div className="size-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase">
                  Bio-Code Ownership
                </h3>
                <p className="text-xs text-silver leading-relaxed">
                  Connect your YouTube or Instagram handle and place a unique 6-character verification code in your bio. Ownership is confirmed before any application can be placed.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-3">
                <div className="size-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
                  <Clock className="size-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase">
                  90-Day Validity Recheck
                </h3>
                <p className="text-xs text-silver leading-relaxed">
                  Follower verifications expire after 90 days. Follower counts are re-verified prior to payout release to guarantee ongoing account health and legitimacy.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. How It Works (Step-by-Step Escrow Pipeline) */}
        <section className="border-t border-border pt-16 sm:pt-20 bg-surface/30">
          <Container>
            <div className="max-w-2xl mb-12">
              <span className="font-mono text-xs uppercase tracking-wider text-lime">Escrow Protocol</span>
              <h2 className="font-display mt-2 text-2xl sm:text-4xl font-medium tracking-tight text-white uppercase">
                The PR Delivery Pipeline
              </h2>
              <p className="mt-3 text-silver text-sm sm:text-base">
                From approved pitch to weekly UPI payout, every deliverable follows an immutable 5-step flow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <span className="font-mono text-xs font-semibold text-lime">STEP 01</span>
                <h4 className="font-display text-base font-bold text-white uppercase">Apply or Quote</h4>
                <p className="text-xs text-silver leading-relaxed">
                  Pitch how your page will present the story. Apply at the owner&apos;s fixed fee or submit a bespoke quote.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <span className="font-mono text-xs font-semibold text-lime">STEP 02</span>
                <h4 className="font-display text-base font-bold text-white uppercase">Escrow Reserved</h4>
                <p className="text-xs text-silver leading-relaxed">
                  Owner accepts your pitch. The agreed fee is row-locked against the campaign&apos;s funded escrow pool.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <span className="font-mono text-xs font-semibold text-lime">STEP 03</span>
                <h4 className="font-display text-base font-bold text-white uppercase">Draft Approval</h4>
                <p className="text-xs text-silver leading-relaxed">
                  Upload your video or image draft. Owner approves or requests at most one revision round.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <span className="font-mono text-xs font-semibold text-lime">STEP 04</span>
                <h4 className="font-display text-base font-bold text-white uppercase">Post Live & ASCI</h4>
                <p className="text-xs text-silver leading-relaxed">
                  Publish with platform paid partnership label + #ad/#collab. Submit the live post link in dashboard.
                </p>
              </div>

              <div className="rounded-2xl border border-lime/30 bg-lime/5 p-5 space-y-2">
                <span className="font-mono text-xs font-semibold text-lime">STEP 05</span>
                <h4 className="font-display text-base font-bold text-white uppercase">Day 7 Lock & Pay</h4>
                <p className="text-xs text-silver leading-relaxed">
                  Post remains live for 7 unedited days. Fee unlocks to your wallet and disburses weekly via UPI.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. Pricing & Transparent Fees */}
        <section className="border-t border-border pt-16 sm:pt-20">
          <Container>
            <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
              <div className="max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-wider text-lime">Clear Fee Model</span>
                <h2 className="font-display mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
                  Dual 10% platform fee. No surprises.
                </h2>
                <p className="mt-4 text-silver text-sm leading-relaxed">
                  CIRCLE operates on a transparent dual 10% fee structure to power escrow management, bio-code follower verification, daily live audits, and weekly UPI transfers.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-border bg-surface p-5">
                    <p className="font-mono text-xs text-lime uppercase font-semibold">For Campaign Owners</p>
                    <p className="font-display mt-2 text-xl font-bold text-white">10% On Top of Budget</p>
                    <p className="mt-2 text-xs text-silver leading-relaxed">
                      If you book 5 pages at ₹5,000 each (₹25,000 budget), your invoice total is ₹27,500. 100% of the core ₹25,000 budget is reserved strictly for creator compensation.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface p-5">
                    <p className="font-mono text-xs text-lime uppercase font-semibold">For Creators & Pages</p>
                    <p className="font-display mt-2 text-xl font-bold text-white">10% Platform Deduction</p>
                    <p className="mt-2 text-xs text-silver leading-relaxed">
                      On a ₹5,000 post fee, your net earning is <strong className="text-lime">{formatInr(4500)}</strong>. You always see the net rate first before applying.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. ASCI Ad Standards & Editorial Guardrails */}
        <section className="border-t border-border pt-16 sm:pt-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-wider text-lime">Consumer Protection</span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
                  ASCI Ad Standards Mandatory
                </h2>
                <p className="text-silver text-sm leading-relaxed">
                  Under the Advertising Standards Council of India (ASCI) code for influencer marketing, all commercial arrangements must be transparently disclosed.
                </p>
                <ul className="space-y-2.5 text-xs text-silver">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                    <span>Native Instagram paid-partnership tag or YouTube sponsored card must be active.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                    <span>Caption must prominently feature <code>#ad</code> or <code>#collab</code> within the first two lines.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                    <span>Disclosures must remain untouched for the entire 7-day live verification window.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="size-5" />
                  <span className="font-mono text-xs uppercase font-semibold tracking-wider">Prohibited Content</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase">
                  Banned Categories
                </h3>
                <p className="text-xs text-silver leading-relaxed">
                  Campaigns in the following categories are strictly rejected at admin review:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-silver">
                  <span className="rounded-lg bg-bg/60 p-2 border border-border">✕ Political & elections</span>
                  <span className="rounded-lg bg-bg/60 p-2 border border-border">✕ Real-money betting</span>
                  <span className="rounded-lg bg-bg/60 p-2 border border-border">✕ Crypto & schemes</span>
                  <span className="rounded-lg bg-bg/60 p-2 border border-border">✕ Unproven health claims</span>
                  <span className="rounded-lg bg-bg/60 p-2 border border-border">✕ Adult & explicit</span>
                  <span className="rounded-lg bg-bg/60 p-2 border border-border">✕ Defamation & hit pieces</span>
                </div>
                <p className="text-[11px] text-silver pt-2 border-t border-border/60">
                  Promoting an individual person requires explicit written legal consent on file.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 6. FAQ Accordion */}
        <section className="border-t border-border pt-16 sm:pt-20">
          <Container>
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-lime">Knowledge Base</span>
                <h2 className="font-display mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="divide-y divide-border border-y border-border">
                {prFaqs.map((faq, i) => (
                  <details key={i} className="group py-4 text-sm">
                    <summary className="font-medium text-text cursor-pointer list-none flex justify-between items-center group-open:text-lime">
                      <span>{faq.question}</span>
                      <span className="font-mono text-xs text-silver group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-3 text-xs text-silver leading-relaxed pl-2 border-l border-lime/30">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>

              <div className="text-xs text-silver">
                Need more information? Check our{" "}
                <Link href="/clipping/rules" className="text-lime hover:underline">
                  Platform Rules
                </Link>{" "}
                or{" "}
                <Link href="/clipping/how-it-works" className="text-lime hover:underline">
                  Step-by-Step Workflow
                </Link>.
              </div>
            </div>
          </Container>
        </section>

        {/* 7. Final Call to Action */}
        <section className="border-t border-border pt-16 pb-8 bg-surface/20">
          <Container>
            <div className="text-center max-w-2xl mx-auto space-y-6">
              <h2 className="font-display text-2xl sm:text-4xl font-medium uppercase tracking-tight text-white">
                Launch or join a PR campaign
              </h2>
              <p className="text-xs sm:text-sm text-silver leading-relaxed">
                Connect with verified high-reach accounts across India or book credible pages for your product story.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <PillLink href="/clipping/campaigns?campaign_type=social_pr">
                  Explore active PR briefs
                </PillLink>
                <PillLink href="/dashboard/clipping/campaigns/new" variant="secondary">
                  Create a PR brief
                </PillLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
