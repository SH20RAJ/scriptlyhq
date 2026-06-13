import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back button link skeleton */}
      <Skeleton className="h-8 w-28 rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left Column (Core Details & Description) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main preview player/image */}
          <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
          
          {/* Screenshots row */}
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="aspect-[16/9] rounded-xl" />
            <Skeleton className="aspect-[16/9] rounded-xl" />
            <Skeleton className="aspect-[16/9] rounded-xl" />
          </div>

          {/* Overview text lines */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Specifications & Purchase) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-12 w-full md:w-3/4 rounded-xl" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
          </div>

          {/* Price spec & buy buttons */}
          <div className="space-y-6">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-6 w-10 rounded-md" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Table list rows specs */}
          <div className="pt-6 border-t border-border/20 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
