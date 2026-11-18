import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { Container } from "@/components/site/container"
import { campaignFits, creatorCategories } from "@/lib/content/categories"
import { listProfileCards, type ProfileCard } from "@/lib/data/marketplace"
import { pageMetadata } from "@/lib/seo"
import { DirectoryCategoryTabs } from "@/components/directory/directory-category-tabs"
import { CreatorProfileCard } from "@/components/directory/creator-profile-card"

export const metadata: Metadata = pageMetadata(
  "Creator directory",
  "Find verified creators by category, location, and collab format. Transparent 10% platform fee on completed deals.",
  "/directory",
)

export const instant = false


function filterHref(category?: string, fit?: string) {
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (fit) params.set("fit", fit)
  const query = params.toString()
  return query ? `/directory?${query}` : "/directory"
}

function chipClass(active: boolean) {
  return active
    ? "inline-flex min-h-10 items-center rounded-full border border-lime bg-lime/10 px-3.5 text-xs font-mono font-medium text-lime"
    : "inline-flex min-h-10 items-center rounded-full border border-border bg-surface px-3.5 text-xs font-mono text-silver hover:border-silver hover:text-white transition-colors"
}

interface DirectoryPageProps {
  searchParams: Promise<{ category?: string; fit?: string }>
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const params = await searchParams

  return (
    <Container className="py-16 sm:py-24">
      {/* 1. Header */}
      <div className="border-b border-border pb-8">
        <p className="text-small tracking-[0.18em] text-silver uppercase font-mono">Directory // 02</p>
        <h1 className="font-display mt-3 text-display-sm font-medium tracking-tight uppercase text-white">
          Find high-fit creators in minutes, not weeks
        </h1>
        <p className="mt-3 max-w-2xl text-lead text-silver">
          Filter creators by category, location, and collab format. Deals operate with a transparent 10% platform fee.
        </p>
      </div>

      {/* 2. Primary Category Tabs */}
      <div className="mt-8">
        <Suspense fallback={<div className="h-10 w-full rounded-full bg-card border border-border" />}>
          <DirectoryCategoryTabs
            categories={creatorCategories}
            activeCategory={params.category}
          />
        </Suspense>
      </div>

      {/* 3. Secondary Fit Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-silver mr-1">Open to:</span>
        {campaignFits.map((item) => {
          const isActive = params.fit === item.slug
          return (
            <Link
              key={item.slug}
              className={chipClass(isActive)}
              href={filterHref(params.category, isActive ? undefined : item.slug)}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* 4. Creator Directory Grid */}
      <div className="mt-10">
        <Suspense fallback={<DirectoryLoadingSkeleton />}>
          <DirectoryFeed searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  )
}

function matches(profile: ProfileCard, category?: string, fit?: string) {
  if (profile.role !== "creator") return false
  if (category && category !== "all" && profile.category !== category) return false
  const field = campaignFits.find((item) => item.slug === fit)?.field
  if (field && !profile[field]) return false
  return true
}

async function DirectoryFeed({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; fit?: string }>
}) {
  const params = await searchParams
  const { rows, error } = await listProfileCards()

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-silver">
        <p>{error}</p>
      </div>
    )
  }

  const listed = rows.filter((row) => matches(row, params.category, params.fit))

  if (listed.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <h3 className="font-display text-lg font-medium text-white uppercase">No creators found</h3>
        <p className="mt-2 text-sm text-silver max-w-md mx-auto">
          No creators match the current filter selection. Profiles appear once creators complete registration and publish their rates.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listed.map((profile) => (
        <CreatorProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  )
}

function DirectoryLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
      ))}
    </div>
  )
}
