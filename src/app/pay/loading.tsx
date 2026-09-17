import { Skeleton } from "@/components/ui/skeleton";

export default function PayLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Header Skeleton */}
      <header className="border-b border-border/40 bg-background/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </header>

      {/* Card Skeleton */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-card/60 border border-border/40 backdrop-blur-xl shadow-xl space-y-6">
          <div className="space-y-3 text-center flex flex-col items-center">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-8 w-56 rounded-xl" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>

          <div className="p-6 rounded-2xl bg-muted/20 border border-border/30 text-center space-y-2">
            <Skeleton className="h-3 w-20 rounded-md mx-auto" />
            <Skeleton className="h-10 w-36 rounded-xl mx-auto" />
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-20 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-16 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>

          <Skeleton className="h-12 w-full rounded-xl" />

          <div className="flex items-center justify-center gap-2 pt-2">
            <Skeleton className="h-3.5 w-32 rounded-md" />
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-border/30 py-6 text-center">
        <Skeleton className="h-3.5 w-48 rounded-md mx-auto" />
      </footer>
    </div>
  );
}
