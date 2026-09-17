import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container max-w-7xl mx-auto px-4 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-4 w-44 rounded-md" />
        </div>

        {/* Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-y border-border/30">
          <Skeleton className="h-10 w-full sm:w-80 rounded-xl" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden flex flex-col space-y-4 p-4"
            >
              {/* Media Thumbnail */}
              <Skeleton className="aspect-[16/10] w-full rounded-xl" />

              {/* Title & Category */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-2/3 rounded-md" />
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-border/20">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
