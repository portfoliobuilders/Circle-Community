"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidingTabs, type TabItem } from "@/components/ui-motion/sliding-tabs"

interface CampaignTabsProps {
  currentPlatform: string
}

const tabs: TabItem[] = [
  { id: "all", label: "All Platforms" },
  { id: "youtube_shorts", label: "YouTube Shorts" },
  { id: "instagram_reels", label: "Instagram Reels" },
]

export function CampaignTabs({ currentPlatform }: CampaignTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeTab = currentPlatform || "all"

  function handleTabChange(tabId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (tabId === "all") {
      params.delete("platform")
    } else {
      params.set("platform", tabId)
    }

    startTransition(() => {
      router.push(`/clipping/campaigns?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="flex items-center">
      <SlidingTabs
        tabs={tabs}
        activeId={activeTab}
        onChange={handleTabChange}
        layoutId="campaign-platform-pill"
      />
    </div>
  )
}
