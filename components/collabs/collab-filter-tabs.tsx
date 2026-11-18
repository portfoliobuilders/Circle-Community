"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidingTabs, type TabItem } from "@/components/ui-motion/sliding-tabs"

const tabs: TabItem[] = [
  { id: "all", label: "All Briefs" },
  { id: "fixed", label: "Fixed Rate" },
  { id: "open_bid", label: "Open Bid" },
  { id: "barter", label: "Barter" },
]

interface CollabFilterTabsProps {
  activeKind?: string
}

export function CollabFilterTabs({ activeKind }: CollabFilterTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentTab = activeKind || "all"

  function handleTabChange(tabId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (tabId === "all") {
      params.delete("kind")
    } else {
      params.set("kind", tabId)
    }

    startTransition(() => {
      const query = params.toString()
      router.push(query ? `/collabs?${query}` : "/collabs", { scroll: false })
    })
  }

  return (
    <div className="flex items-center">
      <SlidingTabs
        tabs={tabs}
        activeId={currentTab}
        onChange={handleTabChange}
        layoutId="collab-filter-pill"
      />
    </div>
  )
}
