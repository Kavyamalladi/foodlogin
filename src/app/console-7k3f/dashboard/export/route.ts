import { isWhitelistedAdminUser } from "@/lib/admin-whitelist";
import { adminClient } from "@/lib/supabase/admin";
import { getClaimsSafely } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type ExportOrder = {
  id: string;
  name: string;
  phone: string;
  total: number;
  status: "pending" | "paid" | "preparing" | "delivered" | "expired";
  created_at: string;
};
const IST_OFFSET_MINUTES = 330;

function csvEscape(value: string | number) {
  const text = String(value);
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export async function GET() {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MINUTES * 60 * 1000);
  const monthStart = new Date(
    Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), 1, 0, 0) - IST_OFFSET_MINUTES * 60 * 1000
  );
  const monthEnd = new Date(
    Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth() + 1, 1, 0, 0) - IST_OFFSET_MINUTES * 60 * 1000
  );

  const { data, error } = await adminClient
    .from("orders")
    .select("id, name, phone, total, status, created_at")
    .neq("status", "pending")
    .gte("created_at", monthStart.toISOString())
    .lt("created_at", monthEnd.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin-dashboard-export] Failed to export monthly CSV", error);
    return new Response("Failed to export report", { status: 500 });
  }

  const rows = (data as ExportOrder[] | null) ?? [];
  const header = ["Order ID", "Customer Name", "Phone", "Total", "Status", "Created At"];
  const csvLines = [
    header.join(","),
    ...rows.map((row) =>
      [
        csvEscape(row.id),
        csvEscape(row.name),
        csvEscape(row.phone),
        csvEscape(row.total),
        csvEscape(row.status),
        csvEscape(new Date(row.created_at).toISOString()),
      ].join(",")
    ),
  ];

  const yearMonth = `${istNow.getUTCFullYear()}-${String(istNow.getUTCMonth() + 1).padStart(2, "0")}`;

  return new Response(csvLines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dashboard-report-${yearMonth}.csv"`,
      "Cache-Control": "no-store, max-age=0",
      Pragma: "no-cache",
    },
  });
}
