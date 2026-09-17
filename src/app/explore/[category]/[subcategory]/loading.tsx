import { Skeleton } from "@/components/ui/skeleton";

export default function SubcategoryLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12 rounded-md" />
        <Skeleton className="h-4 w-14 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-5 w-24 rounded-md" />
      </div>

      {/* Filter Toolbar Skeleton */}
      <div className="p-3.5 rounded-2xl bg-card/25 border border-border/40 flex justify-between gap-3">
        <Skeleton className="h-9 w-full max-w-md rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-14 rounded-lg" />
        </div>
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
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-6 w-4/5 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
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
