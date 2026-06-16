import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
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
          <div key={idx} className="border border-border/50 bg-card rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
            {/* Image Aspect ratio skeleton */}
            <div className="aspect-[4/3] w-full bg-muted relative">
              <div className="absolute top-4 left-4">
                <Skeleton className="h-5 w-20 rounded-md opacity-80" />
              </div>
              <div className="absolute top-4 right-4">
                <Skeleton className="h-6 w-12 rounded-md opacity-80" />
              </div>
            </div>
            
            {/* Card Content skeleton */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                </div>
                <div className="flex gap-1.5 pt-1.5">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-10 rounded-full" />
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
