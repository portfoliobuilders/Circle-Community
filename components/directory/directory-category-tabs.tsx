"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidingTabs, type TabItem } from "@/components/ui-motion/sliding-tabs"

interface DirectoryCategoryTabsProps {
  categories: readonly { readonly slug: string; readonly label: string }[]
  activeCategory?: string
}

export function DirectoryCategoryTabs({ categories, activeCategory }: DirectoryCategoryTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const tabs: TabItem[] = [
    { id: "all", label: "All Categories" },
    ...categories.map((c) => ({ id: c.slug, label: c.label })),
  ]

  const currentTab = activeCategory || "all"

  function handleTabChange(tabId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (tabId === "all") {
      params.delete("category")
    } else {
      params.set("category", tabId)
    }

    startTransition(() => {
      const query = params.toString()
      router.push(query ? `/directory?${query}` : "/directory", { scroll: false })
    })
  }

  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <SlidingTabs
        tabs={tabs}
        activeId={currentTab}
        onChange={handleTabChange}
        layoutId="directory-category-pill"
      />
    </div>
  )
}
