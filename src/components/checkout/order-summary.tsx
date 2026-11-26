"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DELIVERY_CHARGE } from "@/lib/delivery";
import { foodArt } from "@/lib/food-art";
import { useCartUi } from "@/store/cart-ui";
import type { PaymentState } from "@/hooks/use-razorpay";

const FALLBACK_IMAGE = "/foodlogin.webp";
const inr = (n: number) => n.toLocaleString("en-IN");

interface CartItem {
  variantId: string;
  productName: string;
  variantWeight: string;
  productImageUrl: string | null;
  price: number;
  quantity: number;
}

interface Props {
  items: CartItem[];
  paymentState: PaymentState;
  isPaymentBusy: boolean;
}

function totals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { subtotal, total: subtotal + DELIVERY_CHARGE, count: items.reduce((n, i) => n + i.quantity, 0) };
}

function ItemList({ items }: { items: CartItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.variantId} className="flex items-center gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-turmeric">
            {item.productImageUrl ? (
              <Image src={item.productImageUrl} alt="" fill sizes="56px" className="object-cover" />
            ) : (
              <Image src={foodArt(undefined, item.productName) ?? FALLBACK_IMAGE} alt="" fill unoptimized sizes="56px" className={foodArt(undefined, item.productName) ? "object-contain p-1" : "object-cover"} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{item.productName}</p>
            <p className="text-sm tabular-nums text-ink/70">
              {item.variantWeight} × {item.quantity}
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold tabular-nums text-ink">₹{inr(item.price * item.quantity)}</p>
        </li>
      ))}
    </ul>
  );
}

function Totals({ subtotal, total }: { subtotal: number; total: number }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-ink/70">Subtotal</dt>
        <dd className="tabular-nums">₹{inr(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink/70">Delivery (flat, per order)</dt>
        <dd className="tabular-nums">₹{inr(DELIVERY_CHARGE)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
        <dt className="text-base font-bold text-ink">Total</dt>
        <dd className="text-3xl font-extrabold tabular-nums text-brand">₹{inr(total)}</dd>
      </div>
    </dl>
  );
}

function PayButton({ total, paymentState, isPaymentBusy, className = "" }: { total: number; paymentState: PaymentState; isPaymentBusy: boolean; className?: string }) {
  if (paymentState.status === "cancelled") return null;
  return (
    <Button variant="custom" type="submit" form="checkout-form" className={`h-14 w-full gap-2 text-base ${className}`} disabled={isPaymentBusy}>
      <Lock className="size-4" />
      {paymentState.status === "verifying" ? "Verifying payment…" : `Pay ₹${inr(total)}`}
    </Button>
  );
}

/** Phone: collapsed recap above the form so the order stays in view without pushing the form down. */
export function OrderSummaryCompact({ items }: { items: CartItem[] }) {
  const { subtotal, total, count } = totals(items);
  return (
    <details className="faq group rounded-2xl border border-ink/10 bg-white lg:hidden">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-bold text-ink">
          Your order · {count} item{count !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-xl font-extrabold tabular-nums text-ink">₹{inr(total)}</span>
          <ChevronDown aria-hidden className="size-4 text-ink/60 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="space-y-4 border-t border-ink/10 p-4">
        <ItemList items={items} />
        <Totals subtotal={subtotal} total={total} />
        <button type="button" onClick={() => useCartUi.getState().setOpen(true)} className="inline-flex min-h-11 items-center text-sm font-bold text-brand">
          Edit cart
        </button>
      </div>
    </details>
  );
}

/** Desktop: sticky card with the Pay button inside. */
export function OrderSummary({ items, paymentState, isPaymentBusy }: Props) {
  const { subtotal, total } = totals(items);
  return (
    <div className="sticky top-6 hidden rounded-3xl border border-ink/10 bg-white p-6 lg:block">
      <h2 className="mb-5 font-display text-2xl font-extrabold text-ink">Your order</h2>
      <ItemList items={items} />
      <div className="mt-5 border-t border-ink/10 pt-5">
        <Totals subtotal={subtotal} total={total} />
      </div>
      <PayButton total={total} paymentState={paymentState} isPaymentBusy={isPaymentBusy} className="mt-5" />
      <p className="mt-3 text-center text-sm text-ink/70">
        By paying you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}

/** Phone: pinned total + Pay, always reachable while filling the form. */
export function PayBar({ items, paymentState, isPaymentBusy }: Props) {
  const { total } = totals(items);
  if (paymentState.status === "cancelled") return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bone/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden [--brand:var(--brand-deep)]">
      <PayButton total={total} paymentState={paymentState} isPaymentBusy={isPaymentBusy} />
      <p className="mt-2 text-center text-xs text-ink/70">
        By paying you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
