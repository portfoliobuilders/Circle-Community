"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function CampaignSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") || "";

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("q") as string)?.trim() || "";

    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`/clipping/campaigns?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <label htmlFor="search-campaigns" className="sr-only">
        Search campaigns by title, brand or category
      </label>
      <div className="relative flex items-center">
        <Search className="absolute left-4 size-4 text-silver pointer-events-none" aria-hidden="true" />
        <input
          id="search-campaigns"
          name="q"
          type="search"
          defaultValue={currentQuery}
          placeholder="Search by title, brand, or topic..."
          className="min-h-11 w-full rounded-full border border-border bg-card pl-11 pr-24 text-sm text-white placeholder:text-silver/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
        />
        <button
          type="submit"
          className="absolute right-1.5 inline-flex min-h-8 items-center rounded-full bg-border/80 px-3 text-xs font-medium text-silver hover:text-white hover:bg-border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          Search
        </button>
      </div>
    </form>
  );
}
