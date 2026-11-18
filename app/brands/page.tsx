import type { Metadata } from "next"
import Link from "next/link"

import { LeadForm } from "@/components/leads/lead-form"
import { Container } from "@/components/site/container"
import { servicePath, servicesFor } from "@/lib/content/agency-services"
import { pageMetadata } from "@/lib/seo"
import { MagneticButton } from "@/components/ui-motion/magnetic-button"
import { StatementLine } from "@/components/visual/statement-line"
import { ConnectionGraph, type GraphNode } from "@/components/visual/connection-graph"
import { BentoGrid, BentoCard } from "@/components/ui-motion/bento-grid"
import { Check, ArrowRight } from "lucide-react"

export const metadata: Metadata = pageMetadata(
  "For brands",
  "Hire verified Indian creators, launch fixed collabs with a 10% platform fee, or run performance video clipping campaigns.",
  "/brands",
)

const brandGraphNodes: GraphNode[] = [
  {
    id: "step-1",
    step: "01",
    title: "Brand Brief",
    subtitle: "Post fixed budget or open bid brief with clear scope",
    badge: "Free to Post",
  },
  {
    id: "step-2",
    step: "02",
    title: "Verified Match",
    subtitle: "Screen audited portfolios and review creator pitches",
    badge: "Audited Profiles",
  },
  {
    id: "step-3",
    step: "03",
    title: "Milestone Escrow",
    subtitle: "Funds release on deliverable approval with 10% platform fee",
    badge: "10% Platform Fee",
    highlight: true,
  },
]

export default function BrandsPage() {
  return (
    <Container className="py-16 sm:py-24">
      {/* 1. Hero Section */}
      <div className="max-w-4xl">
        <p className="text-small tracking-[0.18em] text-silver uppercase font-mono">
          For Brands & Agencies // 04
        </p>
        <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium tracking-tight uppercase text-white">
          Hire creators. Scale video distribution.
        </h1>
        <div className="mt-4">
          <StatementLine statement="Verified creator talent with milestone payment safety and performance metrics." />
        </div>
        <p className="mt-6 max-w-2xl text-lead text-silver">
          Filter verified creator portfolios by niche and location, launch fixed collab briefs with a 10% platform fee, or run viral clipping campaigns.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <MagneticButton href="/directory" variant="primary">
            Find creators
          </MagneticButton>
          <MagneticButton href="/signup?role=brand" variant="secondary">
            Post a collab
          </MagneticButton>
        </div>
      </div>

      {/* 2. Three Ways to Work Bento Grid */}
      <section className="mt-20">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
            Engagement Models
          </span>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
            Three Ways to Partner
          </h2>
          <p className="mt-2 text-sm text-silver">
            Choose between self-serve marketplace briefs, performance clipping campaigns, or end-to-end managed agency production.
          </p>
        </div>

        <BentoGrid className="grid-cols-1 md:grid-cols-3">
          {/* Card 1: Self-Serve Collabs */}
          <BentoCard spanCol="col-span-1" className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
                Marketplace // 01
              </span>
              <h3 className="font-display mt-2 text-xl font-medium tracking-tight text-white uppercase">
                Direct Collabs
              </h3>
              <p className="mt-2 text-xs text-silver leading-relaxed">
                Post fixed or open-bid briefs directly to verified creators with escrow milestone security.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-silver">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>Zero upfront brief posting charges</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>Transparent 10% platform fee on completion</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>ASCI compliance disclosure tag enforcement</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-border">
              <Link href="/collabs/new" className="text-xs font-mono font-medium text-lime hover:underline inline-flex items-center gap-1">
                <span>Post collab brief</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </BentoCard>

          {/* Card 2: Video Clipping & PR */}
          <BentoCard spanCol="col-span-1" className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
                Performance // 02
              </span>
              <h3 className="font-display mt-2 text-xl font-medium tracking-tight text-white uppercase">
                Video Clipping & PR
              </h3>
              <p className="mt-2 text-xs text-silver leading-relaxed">
                Distribute source footage into dozens of viral vertical edits with pay-per-view accounting.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-silver">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>Pay ₹10–₹200 per 1,000 verified views</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>Automated Day 7 view snapshot audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>10% campaign service fee on total budget</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-border">
              <Link href="/clipping/for-brands" className="text-xs font-mono font-medium text-lime hover:underline inline-flex items-center gap-1">
                <span>Explore brand clipping guide</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </BentoCard>

          {/* Card 3: Managed Agency Services */}
          <BentoCard spanCol="col-span-1" className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
                Enterprise // 03
              </span>
              <h3 className="font-display mt-2 text-xl font-medium tracking-tight text-white uppercase">
                Managed Agency
              </h3>
              <p className="mt-2 text-xs text-silver leading-relaxed">
                Dedicated strategy, talent booking, and multi-format production managed by Portfolix.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-silver">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>Full-service contract & rights handling</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>Dedicated production & shoot coordination</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-lime shrink-0" />
                  <span>Custom deliverables quoted on scope</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-border">
              <a href="#lead-form" className="text-xs font-mono font-medium text-lime hover:underline inline-flex items-center gap-1">
                <span>Request custom scope</span>
                <ArrowRight className="size-3" />
              </a>
            </div>
          </BentoCard>
        </BentoGrid>
      </section>

      {/* 3. Connection Graph Workflow Engine */}
      <section className="mt-20 border-t border-border pt-16">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
            Process Reliability
          </span>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
            How Brand Deals Run
          </h2>
          <p className="mt-2 text-sm text-silver">
            Direct collaboration with milestone protection, transparent fees, and verified deliverables.
          </p>
        </div>

        <ConnectionGraph nodes={brandGraphNodes} />
      </section>

      {/* 4. Managed Agency Services List */}
      <section className="mt-20 border-t border-border pt-16">
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight uppercase text-white">
          Managed Agency Capabilities
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-silver">
          Portfolix.Media and Portfolix.Tech offer managed campaign production, contract negotiation, and ad video creation for enterprise brands.
        </p>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {servicesFor("brand").map((service) => (
            <li key={service.slug} className="bg-card">
              <Link
                href={servicePath(service)}
                className="flex min-h-12 items-center px-6 py-4 text-sm font-medium text-white hover:text-lime transition-colors"
              >
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Lead Form */}
      <section
        id="lead-form"
        className="mt-20 scroll-mt-24 max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-10"
      >
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
          Direct Scope Consultation
        </span>
        <h2 className="font-display mt-2 text-xl sm:text-2xl font-medium tracking-tight text-white uppercase">
          Talk to our team
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-silver leading-relaxed">
          Tell us what your brand needs. Portfolix provides a formal scope and timeline. Prices are quoted after scoping. We never request account passwords.
        </p>
        <div className="mt-6">
          <LeadForm audience="brand" />
        </div>
      </section>
    </Container>
  )
}
