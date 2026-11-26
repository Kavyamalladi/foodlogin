import { Skeleton } from "@/components/ui/skeleton";

export default function OrderLoading() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center space-y-4 text-center">
          <Skeleton className="size-24 rounded-full bg-ink/10" />
          <Skeleton className="h-12 w-72 max-w-full bg-ink/10" />
          <Skeleton className="h-5 w-80 max-w-full bg-ink/10" />
          <Skeleton className="h-5 w-40 bg-ink/10" />
        </div>
        <div className="mx-auto mb-6 grid max-w-2xl gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-ink/10" />
          ))}
        </div>
        <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-ink/10 bg-white p-6 md:p-8">
          <Skeleton className="h-8 w-44 bg-ink/10" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="size-16 shrink-0 rounded-lg bg-ink/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-ink/10" />
                <Skeleton className="h-3 w-1/2 bg-ink/10" />
              </div>
              <Skeleton className="h-4 w-12 shrink-0 bg-ink/10" />
            </div>
          ))}
          <Skeleton className="h-14 w-full rounded-full bg-ink/10" />
        </div>
      </div>
    </main>
  );
}
