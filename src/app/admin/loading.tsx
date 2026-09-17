import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2 border-b border-border/30 pb-6">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-border/40 bg-card/30 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-28 rounded-xl" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* Recent Activity Table Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-36 rounded-md" />

        <div className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden">
          <div className="p-4 border-b border-border/30 bg-muted/10 grid grid-cols-4 gap-4">
            <Skeleton className="h-3.5 w-20 rounded-md" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="h-3.5 w-16 rounded-md" />
            <Skeleton className="h-3.5 w-16 rounded-md ml-auto" />
          </div>
          <div className="divide-y divide-border/20">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="p-4 grid grid-cols-4 gap-4 items-center">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-full ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
