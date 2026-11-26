import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[244px] rounded-md" />
          <Skeleton className="h-9 w-[132px] rounded-md" />
        </div>
      </div>

      {/* All-time revenue card */}
      <Skeleton className="mb-6 h-24 w-full rounded-2xl" />

      {/* Monthly stat cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </section>

      {/* Revenue trend chart */}
      <section className="mt-6">
        <Skeleton className="h-[380px] w-full rounded-2xl" />
      </section>
    </main>
  );
}
