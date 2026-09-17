import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12 animate-in fade-in duration-200">
      {/* Hero Skeleton */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Skeleton className="h-6 w-32 rounded-full mx-auto" />
        <Skeleton className="h-12 sm:h-16 w-3/4 rounded-2xl mx-auto" />
        <Skeleton className="h-5 w-2/3 rounded-xl mx-auto" />
        <Skeleton className="h-12 w-full max-w-xl rounded-2xl mx-auto mt-4" />
      </div>

      {/* Category Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/40 pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Product Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-border/40 bg-card/25 p-4 space-y-4 shadow-sm"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
              <Skeleton className="h-6 w-4/5 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
