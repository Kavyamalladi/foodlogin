"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2026 + 1 }, (_, i) => 2026 + i);

function MonthYearSelectorInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const now = new Date();
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");
  const month = monthParam !== null ? Number(monthParam) : now.getMonth();
  const year = yearParam !== null ? Number(yearParam) : now.getFullYear();

  function updateParams(m: number, y: number) {
    const params = new URLSearchParams();
    params.set("month", String(m));
    params.set("year", String(y));
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Calendar className="size-4 shrink-0 text-muted-foreground" />
      <Select
        value={String(month)}
        onValueChange={(v) => updateParams(Number(v), year)}
      >
        <SelectTrigger className="h-9 w-[130px] border-[#E8D8CC] bg-white text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((name, idx) => (
            <SelectItem key={idx} value={String(idx)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(year)}
        onValueChange={(v) => updateParams(month, Number(v))}
      >
        <SelectTrigger className="h-9 w-[100px] border-[#E8D8CC] bg-white text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function MonthYearSelectorFallback() {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="size-4 shrink-0 text-muted-foreground" />
      <div className="h-9 w-[130px] animate-pulse rounded-md border border-[#E8D8CC] bg-white" />
      <div className="h-9 w-[100px] animate-pulse rounded-md border border-[#E8D8CC] bg-white" />
    </div>
  );
}

export function MonthYearSelector() {
  return (
    <Suspense fallback={<MonthYearSelectorFallback />}>
      <MonthYearSelectorInner />
    </Suspense>
  );
}
