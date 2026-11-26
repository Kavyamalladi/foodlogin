import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-4">
      {/* Back link */}
      <Skeleton className="h-4 w-16" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Customer card */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5 space-y-4">
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-3">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>

      {/* Items card */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8D8CC]">
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="divide-y divide-[#E8D8CC]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <Skeleton className="size-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-12 shrink-0" />
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-white border-t border-[#E8D8CC] space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex justify-between pt-2">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>

      {/* References card */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </main>
  );
}
