export function CampaignCardSkeleton() {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded-full bg-border" />
          <div className="h-4 w-8 rounded bg-border" />
        </div>

        {/* Title */}
        <div className="mt-4 space-y-2">
          <div className="h-5 w-3/4 rounded bg-border" />
          <div className="h-4 w-1/3 rounded bg-border/60" />
        </div>

        {/* Summary */}
        <div className="mt-4 space-y-1.5">
          <div className="h-3 w-full rounded bg-border/50" />
          <div className="h-3 w-4/5 rounded bg-border/50" />
        </div>

        {/* Rate Box */}
        <div className="mt-4 h-16 rounded-xl border border-border/60 bg-surface/50 p-3" />
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-border" />
            <div className="space-y-1">
              <div className="h-3 w-16 rounded bg-border" />
              <div className="h-2.5 w-12 rounded bg-border/60" />
            </div>
          </div>
          <div className="h-8 w-24 rounded-full bg-border" />
        </div>
      </div>
    </div>
  );
}

export function CampaignGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CampaignCardSkeleton key={i} />
      ))}
    </div>
  );
}
