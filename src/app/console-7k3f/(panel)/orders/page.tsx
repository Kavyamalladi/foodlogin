import { Suspense } from "react";
import { adminClient } from "@/lib/supabase/admin";
import { OrderListItem, OrderStatus } from "@/lib/supabase/types";
import { OrdersList } from "@/components/admin/orders-list";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const { page: pageParam, q, status: statusParam } = await searchParams;

  const searchQuery = q?.trim() || "";
  const activeFilter = (statusParam as OrderStatus) ?? null;
  const isFiltered = !!searchQuery || !!activeFilter;

  // 1. Count queries first (all lightweight head-only)
  const [totalResult, actionableResult, filteredResult] = await Promise.all([
    isFiltered
      ? adminClient.from("orders").select("*", { count: "exact", head: true })
      : Promise.resolve({ count: null }),
    adminClient
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["paid", "preparing"]),
    (() => {
      let q = adminClient
        .from("orders")
        .select("*", { count: "exact", head: true });
      if (searchQuery)
        q = q.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      if (activeFilter) q = q.eq("status", activeFilter);
      return q;
    })(),
  ]);

  const filteredCount = filteredResult.count ?? 0;
  const totalCount = isFiltered
    ? (totalResult.count ?? 0)
    : filteredCount;
  const actionableCount = actionableResult.count ?? 0;

  // 2. Clamp page after we know the real filtered total
  const totalPages = Math.ceil(filteredCount / PAGE_SIZE);
  const currentPage = Math.min(
    Math.max(1, Number(pageParam) || 1),
    Math.max(1, totalPages),
  );

  // 3. Paginated data query
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let dataQuery = adminClient
    .from("orders")
    .select("id, name, phone, total, status, created_at");

  if (searchQuery) {
    dataQuery = dataQuery.or(
      `name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`,
    );
  }
  if (activeFilter) {
    dataQuery = dataQuery.eq("status", activeFilter);
  }

  const { data: orders } = await dataQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  const all = (orders as OrderListItem[]) ?? [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalCount} total
            {actionableCount > 0 && (
              <span className="ml-2 font-semibold text-brand">
                · {actionableCount} need action
              </span>
            )}
          </p>
        </div>
      </div>
      <Suspense fallback={<OrdersListSkeleton />}>
        <OrdersList
          orders={all}
          filteredCount={filteredCount}
          totalPages={totalPages}
          currentPage={currentPage}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          pageSize={PAGE_SIZE}
        />
      </Suspense>
    </main>
  );
}

function OrdersListSkeleton() {
  const columns = ["Customer", "Phone", "Total", "Status", "Date"];
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="flex gap-2">
        {["All", "Pending", "Paid", "Preparing", "Delivered", "Expired"].map(
          (l) => (
            <Skeleton key={l} className="h-8 w-20 rounded-full flex-none" />
          ),
        )}
      </div>
      <div className="hidden sm:block rounded-2xl border border-[#E8D8CC] overflow-hidden bg-white">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_2fr_1.5rem] gap-4 px-4 py-3 bg-[#F9F4F0] border-b border-[#E8D8CC]">
          {columns.map((c) => (
            <Skeleton key={c} className="h-4 w-16" />
          ))}
          <div />
        </div>
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
    </div>
  );
}
