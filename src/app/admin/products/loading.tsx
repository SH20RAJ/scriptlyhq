import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProductsLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-border/30 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-border/30 bg-muted/10 flex items-center gap-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-32 rounded-md" />
          <Skeleton className="h-3.5 w-20 rounded-md ml-auto sm:ml-48" />
          <Skeleton className="h-3.5 w-16 rounded-md hidden sm:block" />
          <Skeleton className="h-3.5 w-20 rounded-md ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border/20">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="p-4 flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded shrink-0" />
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="space-y-1.5 min-w-0 flex-1">
                  <Skeleton className="h-4 w-48 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full shrink-0 hidden sm:block" />
              <Skeleton className="h-4 w-16 rounded-md shrink-0" />
              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-border/30 bg-muted/5 flex items-center justify-between">
          <Skeleton className="h-4 w-36 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
