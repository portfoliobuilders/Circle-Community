"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatInr } from "@/lib/format";

const categories = [
  "All",
  "Technology",
  "Gaming",
  "Lifestyle",
  "Finance",
  "Fitness",
  "Culinary",
  "Automotive",
  "Education",
];

const languages = [
  { value: "all", label: "All languages" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "highest_rate", label: "Highest net rate" },
  { value: "most_budget_left", label: "Most budget left" },
];

interface FilterControlsProps {
  onApplied?: () => void;
}

export function FilterControls({ onApplied }: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "All";
  const currentLanguage = searchParams.get("language") || "all";
  const minRate = Number(searchParams.get("minRate")) || 10;
  const maxRate = Number(searchParams.get("maxRate")) || 200;
  const budgetLeft = searchParams.get("budgetLeft") === "true";
  const currentSort = searchParams.get("sort") || "newest";

  function updateQuery(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "category" && value === "All") || (key === "language" && value === "all")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/clipping/campaigns?${params.toString()}`, { scroll: false });
      if (onApplied) onApplied();
    });
  }

  function handleReset() {
    startTransition(() => {
      const params = new URLSearchParams();
      const platform = searchParams.get("platform");
      if (platform) params.set("platform", platform);
      const q = searchParams.get("q");
      if (q) params.set("q", q);
      router.push(`/clipping/campaigns?${params.toString()}`, { scroll: false });
      if (onApplied) onApplied();
    });
  }

  const hasActiveFilters =
    currentCategory !== "All" ||
    currentLanguage !== "all" ||
    minRate > 10 ||
    maxRate < 200 ||
    budgetLeft ||
    currentSort !== "newest";

  return (
    <div className="flex flex-col gap-6 text-sm">
      {/* Header / Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <span className="font-display font-semibold tracking-wide text-white uppercase text-xs">
          Filter Campaigns
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex min-h-8 items-center gap-1.5 text-xs text-lime hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="flex flex-col gap-2">
        <label htmlFor="sort-select" className="text-xs font-medium text-silver">
          Sort by
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => updateQuery({ sort: e.target.value })}
          className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label htmlFor="category-select" className="text-xs font-medium text-silver">
          Category
        </label>
        <select
          id="category-select"
          value={currentCategory}
          onChange={(e) => updateQuery({ category: e.target.value })}
          className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div className="flex flex-col gap-2">
        <label htmlFor="language-select" className="text-xs font-medium text-silver">
          Language
        </label>
        <select
          id="language-select"
          value={currentLanguage}
          onChange={(e) => updateQuery({ language: e.target.value })}
          className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rate Range (10 to 200 INR per 1k views) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-silver">Gross Rate Range</span>
          <span className="font-mono text-white font-medium">
            {formatInr(minRate)} – {formatInr(maxRate)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="min-rate-slider" className="text-[11px] text-silver/80">
            Min rate ({formatInr(minRate)} / 1K)
          </label>
          <input
            id="min-rate-slider"
            type="range"
            min={10}
            max={maxRate}
            step={5}
            value={minRate}
            onChange={(e) => updateQuery({ minRate: e.target.value })}
            className="w-full accent-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
          />

          <label htmlFor="max-rate-slider" className="text-[11px] text-silver/80 mt-1">
            Max rate ({formatInr(maxRate)} / 1K)
          </label>
          <input
            id="max-rate-slider"
            type="range"
            min={minRate}
            max={200}
            step={5}
            value={maxRate}
            onChange={(e) => updateQuery({ maxRate: e.target.value })}
            className="w-full accent-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
          />
        </div>
      </div>

      {/* Budget Left Toggle */}
      <div className="pt-2">
        <label
          htmlFor="budget-left-toggle"
          className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-surface/50 p-3 cursor-pointer hover:border-silver/40"
        >
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white">Open campaigns only</span>
            <span className="text-[11px] text-silver">Only show campaigns with budget left</span>
          </div>
          <input
            id="budget-left-toggle"
            type="checkbox"
            checked={budgetLeft}
            onChange={(e) => updateQuery({ budgetLeft: e.target.checked ? "true" : null })}
            className="size-5 rounded border-border bg-bg text-lime accent-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          />
        </label>
      </div>
    </div>
  );
}

export function DesktopFilterRail() {
  return (
    <aside
      aria-label="Filter rail"
      className="hidden lg:block w-72 shrink-0 rounded-2xl border border-border bg-card p-6 self-start sticky top-28"
    >
      <FilterControls />
    </aside>
  );
}

export function MobileFilterSheet() {
  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <Sheet>
        <SheetTrigger
          render={
            <button
              type="button"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-lime px-6 text-sm font-semibold text-bg shadow-xl hover:bg-lime/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Filter className="size-4" aria-hidden="true" />
              <span>Filters & Sort</span>
            </button>
          }
        />
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-card p-6">
          <SheetHeader className="p-0 pb-4">
            <SheetTitle>Filter Campaigns</SheetTitle>
            <SheetDescription className="text-xs text-silver">
              Narrow down campaigns by rate, category, and platform.
            </SheetDescription>
          </SheetHeader>
          <div className="pt-2">
            <FilterControls />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
