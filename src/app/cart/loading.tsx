import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CartLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title block */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-48 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-7 space-y-6">
          {Array.from({ length: 2 }).map((_, idx) => (
            <Card key={idx} className="border-border/50 bg-card/40 rounded-2xl overflow-hidden">
              <CardContent className="p-4 sm:p-6 flex gap-6 items-center">
                {/* Product image skeleton */}
                <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl shrink-0" />
                
                {/* Content details skeleton */}
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                </div>
                
                {/* Actions & Price */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column - Cart Summary */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/60 bg-card/50 rounded-2xl overflow-hidden p-6 space-y-6">
            <Skeleton className="h-6 w-32 rounded-md" />
            
            {/* Promo Code Input block */}
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>

            {/* Calculations specs */}
            <div className="space-y-4 pt-4 border-t border-border/20">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
              <div className="flex justify-between pt-4 border-t border-border/20">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </div>

            {/* Checkout button */}
            <Skeleton className="h-12 w-full rounded-xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}
