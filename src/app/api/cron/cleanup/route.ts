import { adminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { errInfo, log } from "@/lib/log";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staleThreshold = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { error, data } = await adminClient
    .from("orders")
    .delete()
    .eq("status", "pending")
    .lt("created_at", staleThreshold)
    .select("id, razorpay_order_id");

  if (error) {
    log.error("cron_cleanup_failed", errInfo(error));
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }

  const count = data?.length ?? 0;
  log.info("cron_cleanup_done", { deleted: count, orders: data?.map((o) => o.id) });
  return NextResponse.json({ deleted: count });
}
