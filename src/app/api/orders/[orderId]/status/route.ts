import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Status only (no name, phone or address). The order id is an unguessable UUID, same as the order page itself. */
export async function GET(_req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  if (!UUID.test(orderId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data } = await adminClient.from("orders").select("status").eq("id", orderId).maybeSingle();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ status: data.status }, { headers: { "Cache-Control": "no-store" } });
}
