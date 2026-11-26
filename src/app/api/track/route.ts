import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { errInfo, log } from "@/lib/log";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PHONE = /^[6-9]\d{9}$/;

// Phone lookups are the guessable path (10-digit numbers), so cap them per IP. In-memory is fine: one Node process.
// 30 per 10 minutes, not lower: many Indian mobile users share one carrier IP (CGNAT), and real customers must not be locked out.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 30) { hits.set(ip, recent); return true; }
  hits.set(ip, [...recent, now]);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= 10 * 60_000)) hits.delete(k);
  return false;
}

/**
 * Body: { phone } (paid orders for that number) or { ids } (orders remembered on this device).
 * Returns only what a tracking page needs: never the name or address.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { phone?: unknown; ids?: unknown } | null;
  const select = "id, status, total, created_at, items:order_items(product_name, variant_weight, quantity)";
  let query;
  let by: "phone" | "ids";

  if (typeof body?.phone === "string") {
    if (!PHONE.test(body.phone)) return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
    // Last entry: the one our proxy (Caddy) added. The first can be faked by the client to dodge the limit.
    const ip = req.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
    // Dev has no proxy, so every request would share one bucket: only limit in production.
    if (process.env.NODE_ENV === "production" && limited(ip)) {
      log.warn("track_rate_limited", { ip });
      return NextResponse.json({ error: "Too many tries. Please wait a few minutes." }, { status: 429 });
    }
    by = "phone";
    query = adminClient.from("orders").select(select).eq("phone", body.phone).in("status", ["paid", "preparing", "delivered"]);
  } else if (Array.isArray(body?.ids)) {
    const ids = body.ids.filter((x): x is string => typeof x === "string" && UUID.test(x)).slice(0, 10);
    if (!ids.length) return NextResponse.json({ orders: [] });
    by = "ids";
    query = adminClient.from("orders").select(select).in("id", ids);
  } else {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(10);
  if (error) {
    log.error("track_lookup_failed", { by, ...errInfo(error) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  log.info("track_lookup", { by, found: data.length });
  return NextResponse.json(
    { orders: data.map((o) => ({ id: o.id, shortId: o.id.slice(-8).toUpperCase(), status: o.status, total: o.total, createdAt: o.created_at, items: o.items })) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
