"use client"

import * as React from "react"
import { notFound } from "next/navigation"
import {
  SlidingTabs,
  MobileMenuSheet,
  BentoGrid,
  BentoCard,
  SharedElement,
  ExpandableCard,
  MagneticButton,
  AnimatedToggle,
  CopyButton,
  NumberTicker,
  ProgressRing,
  SkeletonShimmer,
  StickyScrollSteps,
  DrawLine,
  TextRevealWord,
  AnimatedAccordion,
  CategoryMarquee,
} from "@/components/ui-motion"
import { MotionConfigProvider } from "@/lib/motion"
import { Menu } from "lucide-react"

export default function DesignSystemShowcasePage() {
  // If in strict production without showcase override, 404
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ENABLE_DEV_SHOWCASE !== "true"
  ) {
    notFound()
  }

  // Interactive Reduced Motion Simulator State
  const [reducedMotionSim, setReducedMotionSim] = React.useState(false)

  // Demo States
  const [activeTab, setActiveTab] = React.useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [toggleActive, setToggleActive] = React.useState(true)
  const [progressVal, setProgressVal] = React.useState(68)

  const sampleTabs = [
    { id: "all", label: "All Collabs", count: 42 },
    { id: "creators", label: "Creators", count: 28 },
    { id: "brands", label: "Brands", count: 14 },
    { id: "clipping", label: "Video Clipping", count: 8 },
  ]

  const sampleCategories = [
    { id: "1", label: "Photographers", count: 140 },
    { id: "2", label: "Videographers", count: 95 },
    { id: "3", label: "UGC Creators", count: 210 },
    { id: "4", label: "Script Writers", count: 48 },
    { id: "5", label: "Studio Floors", count: 22 },
    { id: "6", label: "Podcast Setups", count: 18 },
    { id: "7", label: "Video Editors", count: 160 },
  ]

  const sampleSteps = [
    {
      id: "step-1",
      stepNumber: "01 //",
      title: "Discover Briefs & Rates",
      description:
        "Brands publish open collab briefs with transparent INR budgets or barter perks. Creators list verified rates and platforms.",
      visualSlot: (
        <div className="p-6 rounded-xl bg-bg border border-border w-full text-center">
          <span className="font-mono text-xs text-lime">STEP 01 PREVIEW</span>
          <p className="font-display font-medium text-white text-lg mt-2">
            ₹15,000 Collab Brief
          </p>
          <span className="text-xs text-silver mt-1 block">ASCI #ad disclosure tagged</span>
        </div>
      ),
    },
    {
      id: "step-2",
      stepNumber: "02 //",
      title: "Direct Agreement & Verification",
      description:
        "No middleman paywalls in v1. Parties agree directly on deliverables, timelines, and rights with verified profiles.",
      visualSlot: (
        <div className="p-6 rounded-xl bg-bg border border-border w-full text-center">
          <span className="font-mono text-xs text-lime">STEP 02 PREVIEW</span>
          <p className="font-display font-medium text-white text-lg mt-2">
            Direct Peer Agreement
          </p>
          <span className="text-xs text-silver mt-1 block">Bio-code verified accounts</span>
        </div>
      ),
    },
    {
      id: "step-3",
      stepNumber: "03 //",
      title: "Complete & Earn Recognition",
      description:
        "Deliver content, get reviewed, earn monthly points and badges, and climb the verified CIRCLE leaderboard.",
      visualSlot: (
        <div className="p-6 rounded-xl bg-bg border border-border w-full text-center">
          <span className="font-mono text-xs text-lime">STEP 03 PREVIEW</span>
          <p className="font-display font-medium text-white text-lg mt-2">
            +500 Points Awarded
          </p>
          <span className="text-xs text-silver mt-1 block">Promoter Badge Active</span>
        </div>
      ),
    },
  ]

  const sampleFaqs = [
    {
      id: "faq-1",
      title: "Is CIRCLE really free for creators and brands?",
      content:
        "Yes. Joining CIRCLE is completely free. We charge zero commission on brand collabs in v1—brands pay creators directly. For video clipping campaigns, a transparent 10% performance fee applies to locked clip payouts.",
    },
    {
      id: "faq-2",
      title: "How do motion tokens ensure accessibility?",
      content:
        "Every motion component queries prefers-reduced-motion. When enabled, animations immediately collapse to instantaneous state changes or subtle 150ms opacity fades, with zero 3D tilt or parallax displacement.",
    },
    {
      id: "faq-3",
      title: "What are the rules regarding Electric Lime (#C6FF00)?",
      content:
        "Electric Lime is used exclusively on dark backgrounds (16.89:1 contrast ratio against Obsidian) as the single primary interactive accent. It is never paired with white text.",
    },
  ]

  return (
    <MotionConfigProvider forcedReducedMotion={reducedMotionSim}>
      <div className="min-h-screen bg-bg text-text pb-24 font-sans selection:bg-lime selection:text-bg">
        {/* Sticky Control & Testing Bar */}
        <div className="sticky top-0 z-50 w-full bg-surface/95 border-b border-border py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-white text-sm sm:text-base tracking-tight">
                CIRCLE // Design System & Motion Showcase
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-border text-silver font-mono">
                /dev/design-system
              </span>
            </div>

            {/* Reduced Motion Simulator Switch */}
            <div className="flex items-center gap-3 bg-bg px-3 py-1.5 rounded-full border border-border">
              <span className="text-xs font-medium text-silver">
                Simulate Reduced Motion:
              </span>
              <AnimatedToggle
                checked={reducedMotionSim}
                onChange={setReducedMotionSim}
                id="reduced-motion-toggle"
              />
              <span
                className={`text-xs font-mono font-semibold ${
                  reducedMotionSim ? "text-lime" : "text-silver"
                }`}
              >
                {reducedMotionSim ? "ON (Static Fallbacks)" : "OFF (Motion Active)"}
              </span>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-20">
          {/* Section 1: Hero & Typography */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-lime">
              <span>01 // TYPOGRAPHY & STORYTELLING</span>
            </div>
            <div className="max-w-3xl">
              <TextRevealWord
                text="Where creativity connects without friction."
                as="h1"
                highlightWords={["creativity", "connects"]}
                className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight"
              />
              <p className="text-lg text-silver mt-4 leading-relaxed">
                Motion at CIRCLE communicates hierarchy, feedback, and marketplace
                mechanics. All components adhere strictly to Obsidian, Charcoal, Graphite,
                and Electric Lime tokens.
              </p>
            </div>
            <DrawLine orientation="horizontal" color="border" className="mt-8" />
          </section>

          {/* Section 2: Navigation & Indicators */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-lime">
                <span>02 // NAVIGATION & TABS</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border text-xs font-medium text-silver hover:text-white"
              >
                <Menu className="size-4" />
                <span>Test Mobile Sheet</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
              <h3 className="font-display font-semibold text-lg text-white">
                Sliding Tabs with Pill Indicator
              </h3>
              <p className="text-sm text-silver">
                Spring-animated indicator that glides between active tabs with keyboard
                arrow navigation and reduced-motion instant snap.
              </p>
              <SlidingTabs
                tabs={sampleTabs}
                activeId={activeTab}
                onChange={setActiveTab}
              />
            </div>

            {/* Mobile Menu Sheet Demo */}
            <MobileMenuSheet
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              links={[
                { href: "/collabs", label: "Collab Board", badge: "Live" },
                { href: "/clipping", label: "Video Clipping", badge: "10% Fee" },
                { href: "/directory", label: "Creator Directory" },
                { href: "/events", label: "Community Events" },
                { href: "/learn", label: "Creator Academy" },
                { href: "/about", label: "About CIRCLE" },
              ]}
              actionSlot={
                <MagneticButton
                  variant="primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join CIRCLE Free
                </MagneticButton>
              }
            />
          </section>

          {/* Section 3: Interactive Feedback & Micro-Interactions */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-lime">
              <span>03 // FEEDBACK & MICRO-INTERACTIONS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Magnetic Buttons */}
              <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">
                    Magnetic Button
                  </h3>
                  <p className="text-xs text-silver mt-1">
                    Desktop-only elastic attraction capped at strict 4px displacement.
                  </p>
                </div>
                <div className="flex flex-col gap-3 items-start">
                  <MagneticButton variant="primary">
                    Primary Lime CTA
                  </MagneticButton>
                  <MagneticButton variant="secondary">
                    Secondary Surface
                  </MagneticButton>
                  <MagneticButton variant="outline">
                    Outline Button
                  </MagneticButton>
                </div>
              </div>

              {/* Animated Toggle */}
              <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">
                    Animated Toggle
                  </h3>
                  <p className="text-xs text-silver mt-1">
                    Tactile micro-spring snap for form controls, filters, and ASCI tags.
                  </p>
                </div>
                <div className="space-y-4 py-2">
                  <AnimatedToggle
                    checked={toggleActive}
                    onChange={setToggleActive}
                    label="ASCI Ad Disclosure (#ad)"
                  />
                  <AnimatedToggle
                    checked={false}
                    onChange={() => {}}
                    disabled
                    label="Disabled Option"
                  />
                </div>
              </div>

              {/* Copy Button */}
              <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">
                    Copy to Clipboard
                  </h3>
                  <p className="text-xs text-silver mt-1">
                    Spring icon morph with polite screen reader announcement.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-3 py-2 rounded-lg bg-bg border border-border text-silver truncate max-w-[180px]">
                    circlecommunity.in/c/128
                  </span>
                  <CopyButton value="https://circlecommunity.in/c/128" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Data Visualization & Numerals */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-lime">
              <span>04 // DATA VISUALIZATION</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Number Ticker: Indian INR */}
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <span className="text-xs font-mono text-silver">CAMPAIGN BUDGET</span>
                <div className="text-3xl font-display font-bold text-white mt-2">
                  <NumberTicker value={150000} prefix="₹" />
                </div>
                <p className="text-xs text-silver mt-1">
                  Indian grouping (₹1,50,000) integer counter.
                </p>
              </div>

              {/* Number Ticker: Followers */}
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <span className="text-xs font-mono text-silver">VERIFIED AUDIENCE</span>
                <div className="text-3xl font-display font-bold text-lime mt-2">
                  <NumberTicker value={24500} suffix="+" />
                </div>
                <p className="text-xs text-silver mt-1">
                  Creator verified reach milestone.
                </p>
              </div>

              {/* Progress Ring */}
              <div className="p-6 rounded-2xl bg-surface border border-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-silver">BUDGET ALLOCATED</span>
                  <p className="text-xs text-silver mt-1 max-w-[140px]">
                    Dynamic circular progress with Graphite track and Lime fill.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ProgressRing value={progressVal} size={76} strokeWidth={6} />
                  <div className="flex gap-1 justify-center">
                    {[25, 50, 68, 100].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setProgressVal(v)}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                          progressVal === v
                            ? "border-lime text-lime bg-lime/10"
                            : "border-border text-silver hover:text-white"
                        }`}
                      >
                        {v}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Shimmer */}
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h4 className="text-xs font-mono text-silver">
                DARK SKELETON SHIMMER (LOADING STATE)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SkeletonShimmer className="h-24 w-full" />
                <SkeletonShimmer className="h-24 w-full" />
                <SkeletonShimmer className="h-24 w-full" />
              </div>
            </div>
          </section>

          {/* Section 5: Bento Grid & Expandable Cards */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-lime">
              <span>05 // BENTO GRID & EXPANDABLE CARDS</span>
            </div>

            <BentoGrid>
              <BentoCard spanCol="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-lime">FEATURED COLLAB</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-border text-silver">
                    Fixed INR
                  </span>
                </div>
                <SharedElement layoutId="demo-collab-title">
                  <h3 className="font-display font-semibold text-2xl text-white">
                    AudioByte Podcast Studio Launch
                  </h3>
                </SharedElement>
                <p className="text-sm text-silver mt-2 leading-relaxed">
                  Looking for 3 tech creators in Kochi to review our new podcast setup.
                  Reels + 1 static carousel post.
                </p>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <SharedElement layoutId="demo-collab-budget">
                    <span className="font-mono text-lg font-semibold text-white">
                      ₹25,000
                    </span>
                  </SharedElement>
                  <span className="text-xs text-silver">3 Applications Received</span>
                </div>
              </BentoCard>

              <BentoCard>
                <span className="font-mono text-xs text-silver">DIRECT PAYMENTS</span>
                <h4 className="font-display font-semibold text-xl text-white mt-2">
                  0% Commission
                </h4>
                <p className="text-xs text-silver mt-2 leading-relaxed">
                  Collab budgets are transferred directly between brands and creators.
                </p>
              </BentoCard>

              <BentoCard>
                <span className="font-mono text-xs text-silver">VIDEO CLIPPING</span>
                <h4 className="font-display font-semibold text-xl text-white mt-2">
                  10% Performance
                </h4>
                <p className="text-xs text-silver mt-2 leading-relaxed">
                  Dual-sided model: 10% platform fee on clipper payouts and campaign setup.
                </p>
              </BentoCard>
            </BentoGrid>

            {/* Expandable Card Inline Preview */}
            <div className="mt-6">
              <ExpandableCard
                id="demo-collab-1"
                title="Monochrome Studio Walkthrough Brief"
                subtitle="Kochi, Kerala · Commercial Barter"
                badge="Barter"
                triggerContent={
                  <p className="text-sm text-silver">
                    Click to test expandable card with layoutId spring modal.
                  </p>
                }
                expandedContent={
                  <div className="space-y-4">
                    <p>
                      <strong>Scope:</strong> Full day studio floor access + lighting kit
                      in exchange for 2 vertical video reels highlighting the acoustic setup.
                    </p>
                    <p>
                      <strong>Requirements:</strong> Creator must have verified promoter
                      badge or 10K+ self-reported follower portfolio.
                    </p>
                    <div className="pt-4 border-t border-border flex gap-3">
                      <MagneticButton variant="primary">
                        Apply for Barter
                      </MagneticButton>
                    </div>
                  </div>
                }
              />
            </div>
          </section>

          {/* Section 6: Storytelling & Sticky Scroll Steps */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-lime">
              <span>06 // STORYTELLING & STICKY SCROLL</span>
            </div>

            <StickyScrollSteps steps={sampleSteps} />
          </section>

          {/* Section 7: Content & Tickers */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-lime">
              <span>07 // CATEGORY MARQUEE & ACCORDION</span>
            </div>

            {/* Category Marquee */}
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-lg text-white">
                Category Marquee (Pauses on Hover & Focus)
              </h3>
              <CategoryMarquee items={sampleCategories} speed={30} />
            </div>

            {/* Accordion */}
            <div className="pt-6 space-y-4">
              <h3 className="font-display font-semibold text-lg text-white">
                Animated Accordion
              </h3>
              <AnimatedAccordion items={sampleFaqs} />
            </div>
          </section>
        </main>
      </div>
    </MotionConfigProvider>
  )
}
