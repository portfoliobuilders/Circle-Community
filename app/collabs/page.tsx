import type { Metadata } from "next"
import { Suspense } from "react"
import { Container } from "@/components/site/container"
import { listCollabs, type CollabRow } from "@/lib/data/marketplace"
import { pageMetadata } from "@/lib/seo"
import { CollabFilterTabs } from "@/components/collabs/collab-filter-tabs"
import { CollabCard } from "@/components/collabs/collab-card"
import { MagneticButton } from "@/components/ui-motion/magnetic-button"
import { StepSequence } from "@/components/visual/step-sequence"

export const metadata: Metadata = pageMetadata(
  "Collabs",
  "Browse open brand collabs on CIRCLE. Transparent 10% platform fee on completed deals with verified ASCI disclosure.",
  "/collabs",
)

export const instant = false


interface CollabsPageProps {
  searchParams: Promise<{ kind?: string }>
}

export default async function CollabsPage({ searchParams }: CollabsPageProps) {
  const params = await searchParams

  return (
    <Container className="py-16 sm:py-24">
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-8">
        <div>
          <p className="text-small tracking-[0.18em] text-silver uppercase font-mono">Marketplace // 01</p>
          <h1 className="font-display mt-3 text-display-sm font-medium tracking-tight uppercase text-white">
            Collabs
          </h1>
          <p className="mt-3 max-w-2xl text-lead text-silver">
            Browse open brand briefs. Deals operate with verified deliverables and a 10% platform fee.
          </p>
        </div>
        <div>
          <MagneticButton href="/collabs/new" variant="primary">
            Post a collab
          </MagneticButton>
        </div>
      </div>

      {/* 2. Filter Strip */}
      <div className="mt-8">
        <Suspense fallback={<div className="h-10 w-64 rounded-full bg-card border border-border" />}>
          <CollabFilterTabs activeKind={params.kind} />
        </Suspense>
      </div>

      {/* 3. Collabs Feed Grid */}
      <div className="mt-8">
        <Suspense fallback={<CollabsLoadingSkeleton />}>
          <CollabFeed activeKind={params.kind} />
        </Suspense>
      </div>

      {/* 4. How Collabs Work */}
      <section className="mt-20 border-t border-border pt-16">
        <div className="max-w-2xl">
          <p className="text-small tracking-[0.18em] text-silver uppercase font-mono">Workflow Engine</p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl font-medium tracking-tight uppercase text-white">
            How Collabs Work
          </h2>
          <p className="mt-2 text-sm text-silver">
            Direct brand deals with verified deliverables, ASCI disclosure, and milestone payment safety.
          </p>
        </div>
        <div className="mt-10">
          <StepSequence
            steps={[
              {
                number: "01",
                title: "Discover Briefs",
                description: "Filter verified brand briefs by niche, deliverable, and budget model.",
              },
              {
                number: "02",
                title: "Agree & Escrow",
                description: "Lock deliverables and deposit funds into secure milestone escrow.",
              },
              {
                number: "03",
                title: "Milestone Release",
                description: "Post approved work with #ad disclosure. Funds release with transparent 10% platform fee.",
              },
            ]}
          />
        </div>
      </section>

      {/* 5. Post a Collab Closing Banner */}
      <section className="mt-20 rounded-2xl border border-border bg-surface p-8 sm:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime">
              For Brands & Agencies
            </span>
            <h3 className="font-display mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
              Ready to work with verified creators?
            </h3>
            <p className="mt-2 text-sm text-silver leading-relaxed">
              Post your brief in under two minutes. Review pitches with zero upfront platform charges.
            </p>
          </div>
          <div>
            <MagneticButton href="/collabs/new" variant="primary">
              Post a collab
            </MagneticButton>
          </div>
        </div>
      </section>
    </Container>
  )
}

async function CollabFeed({ activeKind }: { activeKind?: string }) {
  const { rows, error } = await listCollabs()

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-silver">
        <p>{error}</p>
      </div>
    )
  }

  const filtered = activeKind && activeKind !== "all"
    ? rows.filter((r) => r.kind === activeKind)
    : rows

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <h3 className="font-display text-lg font-medium text-white uppercase">No collabs found</h3>
        <p className="mt-2 text-sm text-silver max-w-md mx-auto">
          {activeKind && activeKind !== "all"
            ? `No active briefs matching the "${activeKind}" filter right now.`
            : "No collabs posted yet. Check back soon or post the first brief."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((collab: CollabRow) => (
        <CollabCard key={collab.id} collab={collab} />
      ))}
    </div>
  )
}

function CollabsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
      ))}
    </div>
  )
}
