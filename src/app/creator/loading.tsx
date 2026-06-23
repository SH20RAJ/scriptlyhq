import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl shrink-0" />
      </div>

      {/* Integration Banner Skeleton */}
      <div className="p-5 rounded-2xl border border-border/40 bg-card/10 flex gap-4 items-start">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>
      </div>

      {/* Stats Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-6 border border-border/50 bg-card/20 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-3.5 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Split Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Table/List Block */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <div className="border border-border/40 bg-card/15 rounded-2xl p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center pb-3 border-b border-border/20 last:border-0 last:pb-0">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-12 rounded-md ml-auto" />
                  <Skeleton className="h-4 w-16 rounded-md ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Ledger/Activity Block */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <div className="p-5 border border-border/40 bg-card/15 rounded-2xl space-y-4">
            <Skeleton className="h-5 w-32 rounded-md" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-start pb-3 border-b border-border/20 last:border-0 last:pb-0">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-10 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
