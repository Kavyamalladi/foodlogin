"use client";

import { useEffect, useState, type FormEventHandler } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STATUS_COLORS, STATUS_LABELS } from "@/components/order-status-watcher";
import { readOrders } from "@/lib/my-orders";

type TrackedOrder = {
  id: string;
  shortId: string;
  status: string;
  total: number;
  createdAt: string;
  items: { product_name: string; variant_weight: string; quantity: number }[];
};

const STEPS = [
  ["paid", "Paid"],
  ["preparing", "Being prepared"],
  ["delivered", "Delivered"],
] as const;

async function lookup(body: { phone: string } | { ids: string[] }): Promise<TrackedOrder[]> {
  const res = await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = (await res.json().catch(() => ({}))) as { orders?: TrackedOrder[]; error?: string };
  if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
  return json.orders ?? [];
}

function OrderCard({ o }: { o: TrackedOrder }) {
  const at = STEPS.findIndex(([s]) => s === o.status);
  return (
    <Card className="gap-4 border-0 bg-white p-5 ring-1 ring-ink/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold text-ink">
          Order #{o.shortId}
          <span className="ml-2 text-sm font-normal text-ink/70">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        </p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[o.status] ?? "bg-muted"}`}>{STATUS_LABELS[o.status] ?? o.status}</span>
      </div>

      {at >= 0 && (
        <ol className="flex items-center gap-2" aria-label="Order progress">
          {STEPS.map(([s, label], i) => (
            <li key={s} className="flex flex-1 flex-col gap-1.5">
              <span className={`h-1.5 rounded-full ${i <= at ? "bg-brand-deep" : "bg-ink/10"}`} />
              <span className={`text-xs ${i <= at ? "font-bold text-ink" : "text-ink/60"}`}>{label}</span>
            </li>
          ))}
        </ol>
      )}

      <ul className="text-sm text-ink/80">
        {o.items.map((it, i) => (
          <li key={i}>{it.product_name} · {it.variant_weight} · Qty {it.quantity}</li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <span className="font-bold tabular-nums text-ink">₹{o.total}</span>
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href={`/order/${o.id}`}>View order</Link>
        </Button>
      </div>
    </Card>
  );
}

export function TrackClient() {
  const [mine, setMine] = useState<TrackedOrder[] | null>(null);
  const [found, setFound] = useState<TrackedOrder[] | null>(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ids = readOrders();
    (ids.length ? lookup({ ids }) : Promise.resolve([])).then(setMine).catch(() => setMine([]));
  }, []);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    if (!/^[6-9]\d{9}$/.test(phone)) { setError("Enter a valid 10-digit mobile number"); return; }
    setBusy(true);
    try { setFound(await lookup({ phone })); }
    catch (err) { setError(err instanceof Error ? err.message : "Something went wrong. Please try again."); setFound(null); }
    finally { setBusy(false); }
  };

  return (
    <div className="mt-8 space-y-10">
      {mine === null ? (
        <p className="text-sm text-ink/70" aria-live="polite">Looking for your orders…</p>
      ) : mine.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-extrabold text-ink">On this phone</h2>
          {mine.map((o) => <OrderCard key={o.id} o={o} />)}
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-2xl font-extrabold text-ink">Find by mobile number</h2>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
          <div className="flex-1">
            <Label htmlFor="track-phone" className="mb-2 block text-ink">Mobile number</Label>
            <div className="flex items-center gap-2">
              <span className="flex h-12 items-center rounded-xl bg-ink/5 px-3 text-ink/70">+91</span>
              <Input id="track-phone" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit number" value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="h-12 flex-1 bg-white" aria-invalid={!!error} />
            </div>
          </div>
          <Button type="submit" variant="custom" className="h-12 px-8" disabled={busy}>{busy ? "Looking…" : "Find my orders"}</Button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}

        {found && (
          <div className="mt-6 space-y-4">
            {found.length === 0
              ? <p className="rounded-2xl bg-ink/5 p-4 text-sm text-ink/80">No paid orders found for this number. Check the number you ordered with, or message us on WhatsApp.</p>
              : found.map((o) => <OrderCard key={o.id} o={o} />)}
          </div>
        )}
      </section>
    </div>
  );
}
