import { isSampleData } from "@/lib/clipping/data";

export function SampleBanner() {
  if (!isSampleData()) return null;

  return (
    <aside
      aria-label="Preview notice"
      className="sticky top-16 z-40 w-full border-b border-border bg-[#121212]/95 px-4 py-2.5"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs text-silver">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 shrink-0 rounded-full bg-lime animate-pulse" />
          <span className="font-medium text-white">Preview with sample data. Not real campaigns.</span>
        </div>
        <span className="hidden sm:inline text-[11px] text-silver/80">
          Database & live submissions launch in Part 15
        </span>
      </div>
    </aside>
  );
}
