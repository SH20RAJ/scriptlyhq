import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container max-w-6xl mx-auto px-4 space-y-8">
        {/* Title block */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-36 rounded-xl" />
          <Skeleton className="h-4 w-60 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-border/40 bg-card/30 flex gap-4 sm:gap-6 items-center"
              >
                {/* Product image skeleton */}
                <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl shrink-0" />

                {/* Content details skeleton */}
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-5 w-4/5 rounded-md" />
                  <Skeleton className="h-3.5 w-1/2 rounded-md" />
                </div>

                {/* Actions & Price */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <Skeleton className="h-6 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 space-y-6">
              <Skeleton className="h-6 w-32 rounded-lg" />

              {/* Promo Code Input block */}
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 w-20 rounded-xl" />
              </div>

              {/* Calculations specs */}
              <div className="space-y-3 pt-4 border-t border-border/20">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-14 rounded-md" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
                <div className="flex justify-between pt-3 border-t border-border/20">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-6 w-24 rounded-lg" />
                </div>
              </div>

              {/* Checkout button */}
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
