import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4">
        {["All", "Pending", "Paid", "Preparing", "Delivered", "Expired"].map((label) => (
          <Skeleton key={label} className="h-8 w-20 rounded-full flex-none" />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-2xl border border-[#E8D8CC] overflow-hidden bg-white">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_2fr_1.5rem] gap-4 px-4 py-3 bg-[#F9F4F0] border-b border-[#E8D8CC]">
          {["Customer", "Phone", "Total", "Status", "Date"].map((col) => (
            <Skeleton key={col} className="h-4 w-16" />
          ))}
          <div />
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_1.5fr_1fr_1fr_2fr_1.5rem] gap-4 px-4 py-4 border-b border-[#E8D8CC] last:border-0 items-center"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-4" />
          </div>
        ))}
      </div>

      {/* Mobile list */}
      <div className="sm:hidden rounded-2xl border border-[#E8D8CC] bg-white overflow-hidden divide-y divide-[#E8D8CC]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start justify-between gap-3 p-5">
            <div className="space-y-1.5 min-w-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </main>
  );
}
