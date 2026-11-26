"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { ChevronRight, ChevronLeft, Search, X } from "lucide-react";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderListItem, OrderStatus } from "@/lib/supabase/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  preparing: "Preparing",
  delivered: "Delivered",
  expired: "Expired",
};

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  expired: "bg-red-100 text-red-800 border-red-200",
};

const FILTER_OPTIONS: Array<{ label: string; value: OrderStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Preparing", value: "preparing" },
  { label: "Delivered", value: "delivered" },
  { label: "Expired", value: "expired" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function OrdersList({
  orders,
  filteredCount,
  totalPages,
  currentPage,
  searchQuery,
  activeFilter,
  pageSize,
}: {
  orders: OrderListItem[];
  filteredCount: number;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  activeFilter: OrderStatus | null;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchQuery);

  function navigateWithParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    if (!("page" in updates)) params.delete("page");
    router.push(`${ADMIN_BASE_PATH}/orders?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigateWithParams({ q: searchInput.trim() || null });
  }

  function clearSearch() {
    setSearchInput("");
    navigateWithParams({ q: null });
  }

  function goToOrder(orderId: string) {
    router.push(`${ADMIN_BASE_PATH}/orders/${orderId}`);
  }

  function orderRowKeyDown(
    e: KeyboardEvent<HTMLTableRowElement>,
    orderId: string,
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToOrder(orderId);
    }
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, (currentPage - 1) * pageSize + orders.length);

  return (
    <div className="space-y-4">
      {/* Search — submit on Enter, no auto-fetch */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or phone... (Enter to search)"
          className="w-full h-10 pl-9 pr-9 rounded-xl border border-[#E8D8CC] bg-white text-sm text-[#0f172a] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        />
        {searchInput && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#0f172a]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filter pills — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTER_OPTIONS.map((opt) => {
          const isActive =
            opt.value === "all" ? !activeFilter : activeFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() =>
                navigateWithParams(
                  opt.value === "all" ? { status: null } : { status: opt.value },
                )
              }
              className={`flex-none px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                isActive
                  ? "bg-brand text-white border-brand"
                  : "bg-white border-[#E8D8CC] text-[#0f172a] hover:border-brand/50 hover:text-brand"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Results meta */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          {orders.length === 0
            ? `No orders matching "${searchQuery}"`
            : `Showing ${start}–${end} of ${filteredCount} for "${searchQuery}"`}
        </p>
      )}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[#E8D8CC] bg-white p-12 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {searchQuery
              ? `No orders matching "${searchQuery}"`
              : activeFilter
                ? `No ${STATUS_LABELS[activeFilter].toLowerCase()} orders`
                : "No orders here"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-2xl border border-[#E8D8CC] overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F9F4F0] hover:bg-[#F9F4F0]">
                  <TableHead className="px-4 font-semibold text-[#0f172a]">Customer</TableHead>
                  <TableHead className="px-4 font-semibold text-[#0f172a]">Phone</TableHead>
                  <TableHead className="px-4 font-semibold text-[#0f172a]">Total</TableHead>
                  <TableHead className="px-4 font-semibold text-[#0f172a]">Status</TableHead>
                  <TableHead className="px-4 font-semibold text-[#0f172a]">Date</TableHead>
                  <TableHead className="px-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    tabIndex={0}
                    className="hover:bg-[#F9F4F0]/60 cursor-pointer focus-visible:bg-[#F9F4F0]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    aria-label={`Open order for ${order.name}`}
                    onClick={() => goToOrder(order.id)}
                    onKeyDown={(e) => orderRowKeyDown(e, order.id)}
                  >
                    <TableCell className="px-4">
                      <span className="font-semibold text-[#0f172a]">{order.name}</span>
                    </TableCell>
                    <TableCell className="px-4 text-muted-foreground">
                      {order.phone}
                    </TableCell>
                    <TableCell className="px-4 font-semibold text-brand">
                      ₹{order.total}
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge className={STATUS_BADGE_CLASS[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 text-muted-foreground text-xs">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell className="px-4 text-muted-foreground">
                      <ChevronRight className="w-4 h-4" aria-hidden />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden rounded-2xl border border-[#E8D8CC] bg-white overflow-hidden divide-y divide-[#E8D8CC]">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`${ADMIN_BASE_PATH}/orders/${order.id}`}
                className="flex items-start justify-between gap-3 p-5 hover:bg-[#F9F4F0]/60 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[#0f172a]">{order.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {order.phone} · <span className="font-semibold text-brand">₹{order.total}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <Badge className={`${STATUS_BADGE_CLASS[order.status]} shrink-0`}>
                  {STATUS_LABELS[order.status]}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 py-2">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateWithParams({ page: String(currentPage - 1) })}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-[#E8D8CC] bg-white text-[#0f172a] hover:bg-[#F9F4F0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => navigateWithParams({ page: String(currentPage + 1) })}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-[#E8D8CC] bg-white text-[#0f172a] hover:bg-[#F9F4F0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
