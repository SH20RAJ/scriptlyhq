import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorLandingLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto flex flex-col items-center">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-12 w-full max-w-lg rounded-2xl" />
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <div className="flex justify-center gap-3 pt-4">
          <Skeleton className="h-12 w-48 rounded-2xl" />
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
      </div>

      <div className="h-72 rounded-3xl border border-border/40 bg-card/20 p-8 flex flex-col justify-between">
        <div className="space-y-3">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
