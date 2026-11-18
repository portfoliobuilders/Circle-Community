import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { OrbitScene } from "@/components/visual/orbit-scene";
import { CategoryMarquee } from "@/components/ui-motion/category-marquee";
import { UIPreview } from "@/components/visual/ui-preview";
import { StepSequence } from "@/components/visual/step-sequence";
import { DataRingGroup } from "@/components/visual/data-ring-group";
import { PhotoSlot } from "@/components/visual/photo-slot";
import { AnimatedAccordion } from "@/components/ui-motion/animated-accordion";
import { faqSeed } from "@/lib/content/faqs";

const marqueeCategories = [
  { id: "c1", label: "Photographers", href: "/directory?category=photographers" },
  { id: "c2", label: "Videographers", href: "/directory?category=videographers" },
  { id: "c3", label: "Video Editors", href: "/directory?category=video-editors" },
  { id: "c4", label: "Script Writers", href: "/directory?category=script-writers" },
  { id: "c5", label: "Studio Floors", href: "/directory?category=studio-floors" },
  { id: "c6", label: "Podcast Setups", href: "/directory?category=podcast-setups" },
  { id: "c7", label: "Models & Talents", href: "/directory?category=models" },
  { id: "c8", label: "UGC Creators", href: "/directory?category=ugc" },
  { id: "c9", label: "Short-Form Clippers", href: "/clipping" },
];

const homeFaqIds = [
  "00000000-0000-4000-8000-000000000001",
  "00000000-0000-4000-8000-000000000002",
  "00000000-0000-4000-8000-000000000006",
  "00000000-0000-4000-8000-000000000007",
  "00000000-0000-4000-8000-000000000004",
  "00000000-0000-4000-8000-000000000010",
];

export function HomePage() {
  const homeFaqs = homeFaqIds.flatMap((id) => {
    const faq = faqSeed.find((item) => item.id === id);
    return faq ? [faq] : [];
  });

  const accordionItems = homeFaqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: (
      <div className="text-xs sm:text-sm text-silver leading-relaxed whitespace-pre-wrap">
        {faq.answer_md}
      </div>
    ),
  }));

  return (
    <>
      {/* 1. Hero Section with OrbitScene */}
      <section className="relative overflow-hidden border-b border-border bg-bg py-16 sm:py-24 lg:py-28">
        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Outcome Headline & Primary Action */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-silver">
                Creator Community · circlecommunity.in
              </span>

              <h1 className="font-display mt-5 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-[0.98] text-white">
                <span className="block text-white">Find collabs.</span>
                <span className="block text-lime">Keep your rates.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg text-silver leading-relaxed">
                Connect with verified Indian creators and brands. Free to join with a transparent 10% platform fee on completed deals.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <PillLink href="/join" className="w-full sm:w-auto text-center font-semibold">
                  Join the circle
                </PillLink>
                <PillLink href="/directory" variant="secondary" className="w-full sm:w-auto text-center">
                  Browse directory
                </PillLink>
              </div>

              {/* Factual Highlights Microcopy */}
              <div className="mt-10 pt-6 border-t border-border/80 flex flex-wrap items-center gap-6 text-xs font-mono text-silver/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-lime" />
                  <span>10% Fixed Fee on Deals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-lime" />
                  <span>Zero Membership Paywalls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-lime" />
                  <span>ASCI Ad Disclosure Standard</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Ecosystem Orbit Scene */}
            <div className="lg:col-span-5 flex items-center justify-center overflow-hidden">
              <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center scale-[0.72] sm:scale-90 lg:scale-100 origin-center -my-14 sm:my-0">
                <OrbitScene size={460} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Live Category Ticker */}
      <section className="border-b border-border bg-surface/30 py-6">
        <Container className="mb-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-silver">
              Marketplace Categories
            </span>
            <Link
              href="/directory"
              className="font-mono text-xs text-lime hover:underline inline-flex items-center gap-1"
            >
              <span>View all 9 categories</span>
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Container>
        <CategoryMarquee items={marqueeCategories} speed={40} />
      </section>

      {/* 3. Marketplace Dual Showcase (Collabs & Video Clipping) */}
      <section className="py-16 sm:py-24 border-b border-border bg-bg">
        <Container>
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
              Dual Marketplace Architecture
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight uppercase text-white mt-2">
              Two ways to partner and monetise
            </h2>
            <p className="mt-3 text-silver text-sm sm:text-base leading-relaxed">
              From negotiated brand campaigns to performance-based short-form video clipping, every deal is backed by clear deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Collab Brief Card Preview */}
            <UIPreview
              title="collabs/brief-4091.json"
              badge="10% Deal Fee"
              interactive={true}
            >
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-lime font-semibold">
                      Fixed Collab Brief
                    </span>
                    <h3 className="font-display text-lg font-bold text-white mt-1">
                      Beverage Brand Summer Campaign
                    </h3>
                    <p className="text-xs text-silver mt-1">
                      Deliverables: 1 Instagram Reel + 1 Story sequence
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-base font-bold text-white">₹18,000</span>
                    <span className="block text-[11px] font-mono text-silver">Net payout</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-silver">
                  <span>Requirement: 18+ · ASCI #ad</span>
                  <span className="text-lime">Open for pitches</span>
                </div>
              </div>
            </UIPreview>

            {/* Clipping Campaign Card Preview */}
            <UIPreview
              title="clipping/campaign-2804.json"
              badge="Pay-Per-View"
              interactive={true}
            >
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-lime font-semibold">
                      Performance Clipping
                    </span>
                    <h3 className="font-display text-lg font-bold text-white mt-1">
                      Founder Podcast Reel Cuts
                    </h3>
                    <p className="text-xs text-silver mt-1">
                      Target: Vertical shorts from official interview episodes
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-base font-bold text-white">₹80 / 1K</span>
                    <span className="block text-[11px] font-mono text-silver">Verified views</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-silver">
                  <span>Budget: ₹60,000 Reserved</span>
                  <span className="text-lime">Day 7 Lock</span>
                </div>
              </div>
            </UIPreview>
          </div>
        </Container>
      </section>

      {/* 4. How It Works: StepSequence */}
      <section className="py-16 sm:py-24 border-b border-border bg-surface/20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
              Workflow Standard
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight uppercase text-white mt-2">
              How collabs work
            </h2>
            <p className="mt-3 text-silver text-sm sm:text-base">
              Direct agreements with transparent terms, verified milestones, and protected payouts.
            </p>
          </div>

          <StepSequence
            steps={[
              {
                number: "01 //",
                title: "Post or Discover Briefs",
                description:
                  "Brands publish fixed, open bid, or barter requirements. Creators explore briefs with public follower floors.",
              },
              {
                number: "02 //",
                title: "Apply & Agree Terms",
                description:
                  "Creators submit verified portfolios and custom pitches. Agreements confirm rights and ASCI disclosures.",
              },
              {
                number: "03 //",
                title: "Verify & Disburse",
                description:
                  "Approved deliverables are verified upon publishing. Completed deals disburse with a 10% platform fee.",
              },
            ]}
          />
        </Container>
      </section>

      {/* 5. Verified Data Stats Strip */}
      <section className="py-16 sm:py-20 border-b border-border bg-bg">
        <Container>
          <DataRingGroup
            title="Marketplace Trust Standards"
            subtitle="Built on verifiable deliverables and fair commercial standards"
            items={[
              { id: "stat-1", label: "Fixed Platform Fee", value: 10, percentage: 10, suffix: "%", color: "lime" },
              { id: "stat-2", label: "Membership Cost", value: 0, percentage: 0, prefix: "₹", suffix: " Free", color: "silver" },
              { id: "stat-3", label: "ASCI Ad Transparency", value: 100, percentage: 100, suffix: "%", color: "lime" },
              { id: "stat-4", label: "View Lock Maturation", value: 7, percentage: 70, suffix: " Days", color: "silver" },
            ]}
          />
        </Container>
      </section>

      {/* 6. Community Moment: PhotoSlot */}
      <section className="py-16 sm:py-20 border-b border-border bg-surface/10">
        <Container className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
              Real Community
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight uppercase text-white mt-2">
              Work with people doing the work
            </h2>
            <p className="mt-4 text-silver text-sm sm:text-base leading-relaxed">
              We connect creators, editors, and brands in India through monthly meetups, community showcases, and collaborative learning.
            </p>
            <div className="mt-6">
              <PillLink href="/events" variant="secondary">
                See upcoming events
              </PillLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <PhotoSlot
              label="[PHOTO: Community Meetup, Kochi]"
              caption="Portfolix creator meetup and studio workshop floor"
              aspectRatio="wide"
            />
          </div>
        </Container>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section id="faq" className="py-16 sm:py-24 border-b border-border bg-bg">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center sm:text-left">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
                Questions Answered
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight uppercase text-white mt-2">
                Frequently asked questions
              </h2>
              <p className="mt-2 text-silver text-sm">
                Factual guidelines on joining, fees, collabs, and performance payouts.
              </p>
            </div>

            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: homeFaqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer_md },
                })),
              }}
            />

            <AnimatedAccordion items={accordionItems} />

            <div className="mt-8 text-center sm:text-left">
              <Link
                href="/help"
                className="font-mono text-xs text-silver hover:text-white underline underline-offset-4"
              >
                Read all questions in Help Center →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Final Call to Action */}
      <section className="py-16 sm:py-24 bg-surface/30">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white">
              Join the circle today
            </h2>
            <p className="mt-4 text-silver text-sm sm:text-base leading-relaxed">
              Membership is free with zero subscription paywalls. Create your profile, discover open brand briefs, or launch performance clipping campaigns.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <PillLink href="/join" className="w-full sm:w-auto font-semibold">
                Join free
              </PillLink>
              <PillLink href="/directory" variant="secondary" className="w-full sm:w-auto">
                Explore directory
              </PillLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
