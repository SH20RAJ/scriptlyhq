import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Categories filter skeleton */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-b border-border/20">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Skeleton className="h-9 w-16 rounded-full shrink-0" />
          <Skeleton className="h-9 w-24 rounded-full shrink-0" />
          <Skeleton className="h-9 w-28 rounded-full shrink-0" />
          <Skeleton className="h-9 w-20 rounded-full shrink-0" />
          <Skeleton className="h-9 w-24 rounded-full shrink-0" />
        </div>
        <Skeleton className="h-10 w-full md:w-80 rounded-full" />
      </div>

      {/* Grid skeleton of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="border border-border/40 rounded-2xl p-6 space-y-6 bg-card/10">
            {/* Thumbnail aspect ratio */}
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-2/3 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
            {/* Footer buttons row */}
            <div className="flex items-center justify-between pt-4 border-t border-border/20">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
