"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "cn";

interface CampaignTabsProps {
  currentPlatform: string;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "youtube_shorts", label: "YouTube Shorts" },
  { id: "instagram_reels", label: "Instagram Reels" },
] as const;

export function CampaignTabs({ currentPlatform }: CampaignTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTab = currentPlatform || "all";

  function handleTabChange(tabId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === "all") {
      params.delete("platform");
    } else {
      params.set("platform", tabId);
    }

    startTransition(() => {
      router.push(`/clipping/campaigns?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div
      role="tablist"
      aria-label="Filter campaigns by vertical video platform"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 text-xs"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls="campaign-list"
            disabled={isPending}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative min-h-9 rounded-full px-4 font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white motion-reduce:transition-none",
              isActive
                ? "bg-lime text-bg shadow-sm"
                : "text-silver hover:text-white hover:bg-surface/50"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
