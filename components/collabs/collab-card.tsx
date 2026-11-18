import Link from "next/link"
import { SharedCardTransition } from "@/components/ui-motion/shared-element"
import { formatInr, formatKolkata } from "@/lib/format"
import type { CollabRow } from "@/lib/data/marketplace"
import { ShieldCheck, Tag } from "lucide-react"

interface CollabCardProps {
  collab: CollabRow
}

const kindBadges: Record<CollabRow["kind"], { label: string; class: string }> = {
  fixed: { label: "Fixed Rate", class: "border-border text-silver bg-surface" },
  open_bid: { label: "Open Bid", class: "border-lime/30 text-lime bg-lime/10" },
  barter: { label: "Barter Offer", class: "border-border text-white bg-surface" },
}

export function CollabCard({ collab }: CollabCardProps) {
  const badge = kindBadges[collab.kind] || { label: collab.kind, class: "border-border text-silver bg-surface" }

  return (
    <SharedCardTransition layoutId={`collab-${collab.id}`}>
      <Link
        href={`/collabs/${collab.id}`}
        className="group relative flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-silver focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
      >
        <div>
          {/* Top meta tags */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${badge.class}`}>
              {badge.label}
            </span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-mono text-silver uppercase">
              {collab.status}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display mt-4 text-xl font-medium tracking-tight text-white group-hover:text-lime transition-colors">
            {collab.title}
          </h2>

          {/* Summary */}
          <p className="mt-2 text-sm text-silver line-clamp-2 leading-relaxed">
            {collab.summary}
          </p>
        </div>

        {/* Bottom compensation strip */}
        <div className="mt-6 pt-4 border-t border-border flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            {collab.budget_inr != null ? (
              <div>
                <span className="font-mono text-base font-semibold text-white">
                  {formatInr(collab.budget_inr)}
                </span>
                <span className="ml-2 text-silver text-xs">
                  · 10% platform fee
                </span>
              </div>
            ) : collab.barter_offer ? (
              <div className="flex items-center gap-1.5 text-silver">
                <Tag className="size-3.5 text-lime" />
                <span className="font-medium text-white truncate max-w-[200px]">
                  {collab.barter_offer}
                </span>
              </div>
            ) : (
              <span className="text-silver">Compensation negotiable</span>
            )}

            <span className="text-silver font-mono text-xs">
              {formatKolkata(collab.created_at).split(" at ")[0]}
            </span>
          </div>

          {collab.ad_disclosure && (
            <div className="flex items-center gap-1.5 text-[11px] text-silver font-mono">
              <ShieldCheck className="size-3.5 text-lime" />
              <span>ASCI #ad disclosure required</span>
            </div>
          )}
        </div>
      </Link>
    </SharedCardTransition>
  )
}
