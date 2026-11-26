import { ADMIN_DASHBOARD_PATH } from "@/lib/admin-route";
import { BarChart3, Download, IndianRupee, ShoppingCart } from "lucide-react";
import { adminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueTrendChart, type RevenueTrendPoint } from "@/components/admin/dashboard-revenue-chart";
import { MonthYearSelector } from "@/components/admin/month-year-selector";

type DashboardOrder = {
  total: number;
  status: "pending" | "paid" | "preparing" | "delivered" | "expired";
  created_at: string;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const REVENUE_STATUSES = new Set<DashboardOrder["status"]>(["paid", "preparing", "delivered"]);
const IST_OFFSET_MINUTES = 330;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function toIstDate(date: Date) {
  return new Date(date.getTime() + IST_OFFSET_MINUTES * 60 * 1000);
}

function getMonthRangeInIst(year: number, month: number) {
  const start = new Date(Date.UTC(year, month, 1, 0, 0) - IST_OFFSET_MINUTES * 60 * 1000);
  const end = new Date(Date.UTC(year, month + 1, 1, 0, 0) - IST_OFFSET_MINUTES * 60 * 1000);
  return { start, end };
}

function isPastMonth(year: number, month: number) {
  const istNow = toIstDate(new Date());
  return year < istNow.getUTCFullYear() || (year === istNow.getUTCFullYear() && month < istNow.getUTCMonth());
}

function buildTrendPoints(year: number, month: number, orders: DashboardOrder[]) {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const past = isPastMonth(year, month);
  const byDay = new Map<number, number>();

  for (const order of orders) {
    if (!REVENUE_STATUSES.has(order.status)) continue;
    const orderDateIst = toIstDate(new Date(order.created_at));
    const day = orderDateIst.getUTCDate();
    byDay.set(day, (byDay.get(day) ?? 0) + order.total);
  }

  const currentDay = toIstDate(new Date()).getUTCDate();
  const maxDay = past ? daysInMonth : currentDay;

  const points: RevenueTrendPoint[] = [];
  for (let day = 1; day <= maxDay; day += 1) {
    points.push({
      label: day.toString().padStart(2, "0"),
      revenue: byDay.get(day) ?? 0,
    });
  }
  return points;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const { month: monthParam, year: yearParam } = await searchParams;
  const istNow = toIstDate(new Date());
  const selectedMonth = monthParam !== undefined ? Number(monthParam) : istNow.getUTCMonth();
  const selectedYear = yearParam !== undefined ? Number(yearParam) : istNow.getUTCFullYear();

  const { start, end } = getMonthRangeInIst(selectedYear, selectedMonth);

  const [monthlyResult, allTimeResult] = await Promise.all([
    adminClient
      .from("orders")
      .select("total, status, created_at")
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString())
      .order("created_at", { ascending: true }),
    adminClient
      .from("orders")
      .select("total, status")
      .in("status", [...REVENUE_STATUSES]),
  ]);

  if (monthlyResult.error) {
    console.error("[admin-dashboard] Failed to fetch month analytics", monthlyResult.error);
  }
  if (allTimeResult.error) {
    console.error("[admin-dashboard] Failed to fetch all-time revenue", allTimeResult.error);
  }

  const monthOrders = (monthlyResult.data as DashboardOrder[] | null) ?? [];
  const allOrders = (allTimeResult.data as Pick<DashboardOrder, "total" | "status">[] | null) ?? [];

  const monthRevenueOrders = monthOrders.filter((order) => REVENUE_STATUSES.has(order.status));
  const totalRevenue = monthRevenueOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = monthRevenueOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const allTimeTotal = allOrders.reduce((sum, order) => sum + order.total, 0);

  const trendPoints = buildTrendPoints(selectedYear, selectedMonth, monthOrders);
  const hasChartData = trendPoints.some((point) => point.revenue > 0);

  const subtitle = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Business metrics for <span className="font-semibold text-[#0f172a]">{subtitle}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MonthYearSelector />
          <Button asChild variant="outline" className="h-9 border-[#E8D8CC] bg-white">
            <a href={`${ADMIN_DASHBOARD_PATH}/export`} download>
              <Download className="size-4" />
              Export report
            </a>
          </Button>
        </div>
      </div>

      <Card className="mb-6 rounded-2xl border-[#D94F2B]/20 bg-white">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5 text-[#756154]">
            <IndianRupee className="size-4 text-[#D94F2B]" />
            All-Time Total Revenue
          </CardDescription>
          <CardTitle className="text-3xl font-black text-[#0f172a]">
            {formatCurrency(allTimeTotal)}
          </CardTitle>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-[#E8D8CC] bg-white">
          <CardHeader>
            <CardDescription className="text-[#756154]">{subtitle} Revenue</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl font-black text-[#0f172a]">
              <IndianRupee className="size-5 text-[#D94F2B]" />
              {formatCurrency(totalRevenue)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-[#E8D8CC] bg-white">
          <CardHeader>
            <CardDescription className="text-[#756154]">{subtitle} Orders</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl font-black text-[#0f172a]">
              <ShoppingCart className="size-5 text-[#D94F2B]" />
              {totalOrders}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-[#E8D8CC] bg-white">
          <CardHeader>
            <CardDescription className="text-[#756154]">{subtitle} AOV</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl font-black text-[#0f172a]">
              <BarChart3 className="size-5 text-[#D94F2B]" />
              {formatCurrency(averageOrderValue)}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="rounded-2xl border-[#E8D8CC] bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#0f172a]">Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue by day for {subtitle}.</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyResult.error ? (
              <div className="rounded-xl border border-dashed border-[#E8D8CC] bg-[#F9F4F0] p-6 text-sm text-[#7d6757]">
                Analytics data could not be loaded right now. Please try again.
              </div>
            ) : hasChartData ? (
              <RevenueTrendChart points={trendPoints} />
            ) : (
              <div className="rounded-xl border border-dashed border-[#E8D8CC] bg-[#F9F4F0] p-6 text-sm text-[#7d6757]">
                No revenue data available for {subtitle} yet.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
