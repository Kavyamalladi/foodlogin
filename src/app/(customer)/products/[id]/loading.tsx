import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="mx-auto max-w-6xl space-y-16 px-4 pt-6 sm:px-6">
      <div>
        <Skeleton className="mb-4 h-5 w-56 bg-ink/10" />
        <div className="grid items-start gap-0 sm:gap-8 lg:grid-cols-2 lg:gap-14">
          <Skeleton className="-mx-4 aspect-5/4 rounded-none bg-ink/10 sm:mx-0 sm:aspect-4/5 sm:rounded-3xl lg:aspect-square" />
          <div className="relative -mx-4 -mt-7 space-y-6 rounded-t-3xl bg-bone px-4 pt-7 sm:mx-0 sm:mt-0 sm:bg-transparent sm:px-0 sm:pt-0">
            <Skeleton className="h-12 w-3/4 bg-ink/10" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-24 rounded-2xl bg-ink/10" />
              ))}
            </div>
            <Skeleton className="h-14 w-full rounded-full bg-ink/10" />
            <Skeleton className="h-11 w-full bg-ink/10" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-[72px] rounded-2xl bg-ink/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <section>
        <Skeleton className="mb-5 h-9 w-64 bg-ink/10" />
        <ProductGridSkeleton count={4} />
      </section>
    </main>
  );
}
