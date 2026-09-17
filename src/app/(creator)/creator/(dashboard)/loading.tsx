import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl shrink-0" />
      </div>

      {/* Stats Cards Skeleton Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-border/40 bg-card/20 space-y-2">
            <Skeleton className="h-3.5 w-20 rounded-md" />
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Content Split Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-border/40 bg-card/20 p-5 space-y-4">
          <Skeleton className="h-4 w-32 rounded-md" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-border/40 bg-card/20 p-5 space-y-4">
          <Skeleton className="h-4 w-28 rounded-md" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-14 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
