import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductLoading() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-6">
      {/* Back link */}
      <Skeleton className="h-4 w-20" />

      {/* Product header */}
      <div className="flex items-center gap-4">
        <Skeleton className="size-[72px] rounded-2xl shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-16" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="size-10 rounded-lg shrink-0" />
          </div>
        ))}
      </div>

      <Skeleton className="h-10 w-full rounded-lg" />
    </main>
  );
}
