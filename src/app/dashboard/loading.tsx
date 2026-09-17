import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container max-w-6xl mx-auto px-4 space-y-10">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-32 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Inventory Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48 rounded-lg" />
                    <Skeleton className="h-3.5 w-32 rounded-md" />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Skeleton className="h-10 w-28 rounded-xl" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History Section */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-40 rounded-md" />
          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/20 last:border-0"
              >
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-44 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
