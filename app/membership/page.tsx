import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { AnimatedAccordion } from "@/components/ui-motion/animated-accordion";
import { faqSeed } from "@/lib/content/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Membership & Fees",
  "CIRCLE membership is free to join. No monthly paywalls. A 10% platform fee applies only to completed collab and clipping deals.",
  "/membership",
);

const excerptFaqIds = [
  "00000000-0000-4000-8000-000000000001",
  "00000000-0000-4000-8000-000000000006",
  "00000000-0000-4000-8000-000000000003",
  "00000000-0000-4000-8000-000000000007",
];

export default function MembershipPage() {
  const faqs = faqSeed.filter((faq) => excerptFaqIds.includes(faq.id));

  const accordionItems = faqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: (
      <div className="text-xs sm:text-sm text-silver leading-relaxed whitespace-pre-wrap">
        {faq.answer_md}
      </div>
    ),
  }));

  return (
    <Container className="py-16 sm:py-24">
      {/* 1. Statement Header */}
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-silver">
          Fair Marketplace · Zero Paywalls
        </span>
        <h1 className="font-display mt-4 text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white">
          Membership is free
        </h1>
        <p className="mt-4 text-base sm:text-lg text-silver leading-relaxed">
          No monthly subscriptions and no paywalled directory listings. A transparent 10% platform fee applies only when you earn or hire through completed marketplace deals.
        </p>
      </div>

      {/* 2. Three-Tier Value Comparison Matrix (Bento Layout) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Free Community Member */}
        <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                Community
              </span>
              <span className="font-mono text-xs font-bold text-lime">₹0 / month</span>
            </div>
            <h2 className="font-display text-xl font-bold text-white uppercase">
              Free Member
            </h2>
            <p className="mt-2 text-xs text-silver leading-relaxed">
              For creators, freelancers, and studios listing their craft in the national directory.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-silver">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Verified profile in public directory</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Apply or bid for brand collabs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Free webinars, workshops, and bootcamps</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Partner perks on studio floors & gear</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <span className="block text-[11px] font-mono text-silver mb-3">
              Fee: 10% on completed collab payouts
            </span>
            <Link
              href="/signup?role=creator"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-lime text-xs font-bold text-bg hover:bg-lime/90 transition-colors"
            >
              Join free
            </Link>
          </div>
        </div>

        {/* Tier 2: Video Clipper */}
        <div className="rounded-2xl border border-lime/40 bg-surface/90 p-6 sm:p-7 flex flex-col justify-between relative shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
                Performance
              </span>
              <span className="font-mono text-xs font-bold text-lime">Pay-Per-View</span>
            </div>
            <h2 className="font-display text-xl font-bold text-white uppercase">
              Clipping & PR Creator
            </h2>
            <p className="mt-2 text-xs text-silver leading-relaxed">
              For video editors editing short-form video and established pages (10K+ followers) publishing PR deliverables.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-silver">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Access funded campaign asset drives</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Earn ₹10–₹200 per 1,000 views or fixed post fees</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Automated view snapshot & live hold audits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Weekly direct UPI ledger payouts</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <span className="block text-[11px] font-mono text-lime mb-3">
              Fee: 10% deducted on Day 7 lock
            </span>
            <Link
              href="/clipping"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-lime text-xs font-bold text-bg hover:bg-lime/90 transition-colors"
            >
              Browse clipping & PR briefs
            </Link>
          </div>
        </div>

        {/* Tier 3: Brand & Agency Client */}
        <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                Advertisers
              </span>
              <span className="font-mono text-xs font-bold text-silver">Custom Scope</span>
            </div>
            <h2 className="font-display text-xl font-bold text-white uppercase">
              Brand & Agency
            </h2>
            <p className="mt-2 text-xs text-silver leading-relaxed">
              For brands hiring creators directly or commissioning dedicated Portfolix managed campaigns.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-silver">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Post self-serve collabs with budget floors</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Launch performance clipping campaigns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Direct creator contact without markups</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Optional managed production services</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <span className="block text-[11px] font-mono text-silver mb-3">
              Fee: 10% on brief budgets
            </span>
            <Link
              href="/brands"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border bg-bg text-xs font-semibold text-white hover:bg-surface transition-colors"
            >
              Explore brand options
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Fee Transparency Strip */}
      <section className="mt-14 rounded-2xl border border-border bg-surface/30 p-6 sm:p-10">
        <div className="max-w-3xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
            Commercial Standards
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-2">
            Why CIRCLE charges a 10% platform fee
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-silver leading-relaxed">
            We don&apos;t charge monthly memberships, profile listing costs, or application fees. The 10% platform fee on completed deals sustains our fraud review team, manual creator bio verification, automated view snapshot auditing, and escrow disbursement security.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-bg/80 p-4">
              <span className="font-mono text-xs font-semibold text-white">What is free to access</span>
              <p className="mt-1 text-xs text-silver">
                Creating your profile, appearing in search, pitching on briefs, and attending all community workshops.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-bg/80 p-4">
              <span className="font-mono text-xs font-semibold text-white">When the 10% fee applies</span>
              <p className="mt-1 text-xs text-silver">
                Only when deliverables are completed and approved, or upon the Day 7 view lock on clipping payouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Common Questions Accordion */}
      <section className="mt-16 max-w-3xl">
        <div className="mb-8">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
            Membership FAQ
          </span>
          <h2 className="font-display text-2xl font-bold text-white mt-1">
            Questions about membership
          </h2>
        </div>

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer_md },
            })),
          }}
        />

        <AnimatedAccordion items={accordionItems} />

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/help"
            className="font-mono text-xs text-silver hover:text-white underline underline-offset-4"
          >
            Read all questions in Help Center →
          </Link>
          <PillLink href="/signup">Create free account</PillLink>
        </div>
      </section>
    </Container>
  );
}
