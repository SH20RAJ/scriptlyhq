import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container max-w-7xl mx-auto px-4 space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-md" />
          <span className="text-muted-foreground/40">/</span>
          <Skeleton className="h-4 w-24 rounded-md" />
          <span className="text-muted-foreground/40">/</span>
          <Skeleton className="h-4 w-36 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Media & Overview */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Preview Container */}
            <div className="aspect-[16/10] w-full rounded-3xl border border-border/40 overflow-hidden bg-card/30">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            {/* Screenshots Row */}
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[16/10] rounded-2xl border border-border/30" />
              ))}
            </div>

            {/* Content Tabs & Description */}
            <div className="pt-4 space-y-5">
              <div className="flex items-center gap-3 border-b border-border/30 pb-3">
                <Skeleton className="h-8 w-24 rounded-xl" />
                <Skeleton className="h-8 w-28 rounded-xl" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>

              <div className="space-y-3 pt-2">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>

              <div className="space-y-3 pt-4">
                <Skeleton className="h-5 w-36 rounded-md" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-7 w-full rounded-lg" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>

              {/* Price skeleton */}
              <div className="pt-2 border-t border-border/20">
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>

              {/* CTAs */}
              <div className="space-y-2.5">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>

              {/* Specs List */}
              <div className="space-y-3 pt-4 border-t border-border/20">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Creator Bio Card Skeleton */}
            <div className="rounded-2xl border border-border/30 bg-card/20 p-5 flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-40 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
