import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-6 sm:px-6">
        <Skeleton className="h-5 w-48 bg-ink/10" />
        <Skeleton className="mt-6 h-14 w-3/5 max-w-sm bg-ink/10" />
        <Skeleton className="mt-3 h-5 w-24 bg-ink/10" />
        <div className="mb-8 mt-6 flex gap-2 overflow-hidden">
          {[28, 36, 24, 20].map((w, i) => (
            <Skeleton key={i} className="h-11 shrink-0 rounded-full bg-ink/10" style={{ width: `${w * 4}px` }} />
          ))}
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}
