import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { adminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { OrderStatusWatcher } from "@/components/order-status-watcher";
import { foodArt } from "@/lib/food-art";

const FALLBACK_IMAGE = "/foodlogin.webp";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) notFound();

  // Read on the server (the table is closed to the public). Only the columns this page shows: never phone or address.
  const { data: order, error } = await adminClient
    .from("orders")
    .select("status, subtotal, delivery_charge, total, items:order_items(id, product_name, variant_weight, product_image_url, price, quantity)")
    .eq("id", orderId)
    .single();

  if (error || !order) notFound();

  const items = (order.items ?? []) as Array<{
    id: string;
    product_name: string;
    variant_weight: string;
    product_image_url: string | null;
    price: number;
    quantity: number;
  }>;

  const shortId = orderId.slice(-8).toUpperCase();

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <OrderStatusWatcher orderId={orderId} shortId={shortId} initialStatus={order.status} />

          {/* Order Summary */}
          <ol className="mx-auto mb-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["Made fresh", "Ready and dispatched in 2–4 business days"],
              ["On its way", "Delivery takes 3–7 business days"],
              ["Need help?", "Message us on WhatsApp with your order number"],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-ink/5 p-4">
                <p className="font-display text-2xl font-extrabold text-brand">{i + 1}</p>
                <p className="font-bold text-ink">{t}</p>
                <p className="text-sm text-ink/70">{d}</p>
              </li>
            ))}
          </ol>

          <div className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white p-6 md:p-8">
            <h2 className="mb-6 font-display text-2xl font-extrabold text-ink">Order summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative size-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item.product_image_url ? (
                      <Image src={item.product_image_url} alt={item.product_name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <Image
                        src={foodArt(undefined, item.product_name) ?? FALLBACK_IMAGE}
                        alt={item.product_name}
                        fill
                        unoptimized
                        sizes="64px"
                        className="bg-turmeric/30 object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-bold text-sm leading-snug">
                        {item.product_name}
                      </h3>
                      <span className="font-bold text-sm tabular-nums shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                    <p className="text-xs text-ink/70 mt-0.5">
                      {item.variant_weight} · Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-dashed border-brand/20 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-ink/70">
                <span>Subtotal</span>
                <span className="tabular-nums">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-ink/70">
                <span>Delivery</span>
                <span className="tabular-nums">₹{order.delivery_charge}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-brand/10 mt-2">
                <span>Total</span>
                <span className="text-brand tabular-nums">
                  ₹{order.total}
                </span>
              </div>
            </div>

            {order.status === "delivered" && (
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Foodlogin, my feedback on order #${shortId}: `)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex min-h-14 items-center justify-center gap-2 rounded-3xl border-2 border-brand px-6 text-base font-bold text-brand-deep hover:bg-brand/5"
              >
                <MessageCircle className="size-5" />
                Enjoyed it? Tell us on WhatsApp
              </a>
            )}

            <div className="mt-4">
              <Button variant="custom" className="w-full h-14" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>

        {/* Help footer */}
        <div className="text-center pt-8">
          <p className="text-ink/70 text-sm mb-4">
            Need help with your order?
          </p>
          <div className="flex justify-center gap-6">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi, I need help with my order %23${shortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-deep font-medium hover:underline text-sm"
            >
              <MessageCircle className="size-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
