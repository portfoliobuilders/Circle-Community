import Link from "next/link"
import { SharedCardTransition } from "@/components/ui-motion/shared-element"
import { categoryLabel } from "@/lib/content/categories"
import { followerLabel, formatInr } from "@/lib/format"
import type { ProfileCard } from "@/lib/data/marketplace"
import { CheckCircle2, Globe, MapPin } from "lucide-react"
import { InstagramIcon, YouTubeIcon } from "@/components/site/social-icons"

interface CreatorProfileCardProps {
  profile: ProfileCard
}

export function CreatorProfileCard({ profile }: CreatorProfileCardProps) {
  const isVerified = profile.follower_status === "verified" || profile.follower_status === "audited"
  const isPromoter = (profile.follower_count ?? 0) >= 1000

  // Initials for avatar
  const initials = profile.display_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <SharedCardTransition layoutId={`creator-${profile.id}`}>
      <Link
        href={`/directory/${profile.id}`}
        className="group relative flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-silver focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
      >
        <div>
          {/* Top row: Avatar + Follower Badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-sm font-mono font-medium text-white group-hover:border-lime transition-colors">
                {initials}
              </div>
              <div>
                <h2 className="font-display text-lg font-medium tracking-tight text-white group-hover:text-lime transition-colors">
                  {profile.display_name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-silver mt-0.5">
                  <span>{categoryLabel(profile.category) ?? "Creator"}</span>
                  {profile.city && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="size-3 text-silver" />
                        {profile.city}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isPromoter && (
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium ${
                isVerified ? "border-lime/30 bg-lime/10 text-lime" : "border-border bg-surface text-silver"
              }`}>
                {isVerified ? "Promoter · Verified" : "Promoter"}
              </span>
            )}
          </div>

          {/* Follower stats & verification status */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-silver">
            {profile.follower_count != null ? (
              <div className="flex items-center gap-1 text-white">
                <span className="font-semibold">{profile.follower_count.toLocaleString("en-IN")}</span>
                <span className="text-silver">followers</span>
                {isVerified && <CheckCircle2 className="size-3 text-lime ml-0.5" />}
              </div>
            ) : null}

            {profile.follower_status && profile.follower_count != null ? (
              <span className="text-[11px] text-silver">
                ({followerLabel(profile.follower_status).toLowerCase()})
              </span>
            ) : null}
          </div>

          {/* Content Summary / Niche */}
          {profile.content_summary ? (
            <p className="mt-3 text-xs text-silver line-clamp-2 leading-relaxed">
              {profile.content_summary}
            </p>
          ) : null}
        </div>

        {/* Bottom row: Rates & Platform Badges */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <div>
            {profile.price_from_inr != null ? (
              <div className="text-xs">
                <span className="text-silver">From </span>
                <span className="font-mono font-semibold text-white">
                  {formatInr(profile.price_from_inr)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-silver">Rates on request</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-silver">
            {profile.instagram_url && <InstagramIcon className="size-3.5 hover:text-white" />}
            {profile.youtube_url && <YouTubeIcon className="size-3.5 hover:text-white" />}
            {profile.other_url && <Globe className="size-3.5 hover:text-white" />}
          </div>
        </div>
      </Link>
    </SharedCardTransition>
  )
}
