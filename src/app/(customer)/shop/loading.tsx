import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Skeleton className="h-5 w-32 bg-ink/10" />
        <Skeleton className="mt-6 h-14 w-4/5 max-w-md bg-ink/10" />
        <Skeleton className="mt-3 h-5 w-64 bg-ink/10" />
        <div className="mt-6 flex gap-2 overflow-hidden">
          {[28, 36, 24, 20].map((w, i) => (
            <Skeleton key={i} className="h-11 shrink-0 rounded-full bg-ink/10" style={{ width: `${w * 4}px` }} />
          ))}
        </div>
        <div className="mt-6 space-y-14">
          {[1, 2].map((s) => (
            <section key={s}>
              <Skeleton className="mb-5 h-9 w-48 bg-ink/10" />
              <ProductGridSkeleton count={4} />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
