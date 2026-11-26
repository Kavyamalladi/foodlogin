"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { CHECKOUT_RESET_AFTER_ORDER_EXPIRED_KEY } from "@/lib/checkout-expiry-sync";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending payment",
  paid: "Payment received",
  preparing: "Being prepared",
  delivered: "Delivered",
  expired: "Expired",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  preparing: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  expired: "bg-gray-100 text-gray-500",
};

type Props = {
  orderId: string;
  shortId: string;
  initialStatus: string;
};

// What the top of the page says for each status. "Order confirmed" only once payment is actually in.
const HERO: Record<string, { Icon: typeof CheckCircle; tone: string; title: string; text: string }> = {
  pending: {
    Icon: Clock,
    tone: "bg-yellow-500/10 text-yellow-600",
    title: "Confirming your payment",
    text: "We haven't received your payment yet. This page updates by itself, so there's no need to refresh.",
  },
  expired: {
    Icon: XCircle,
    tone: "bg-ink/5 text-ink/60",
    title: "Payment not completed",
    text: "This order wasn't paid, so we won't make it. You can try again from checkout.",
  },
  delivered: {
    Icon: CheckCircle,
    tone: "bg-green-500/10 text-green-600",
    title: "Order delivered",
    text: "Thank you for ordering from Foodlogin. We hope you enjoy it.",
  },
};
const PAID_HERO = {
  Icon: CheckCircle,
  tone: "bg-green-500/10 text-green-600",
  title: "Order confirmed",
  text: "Thank you! We'll start making your order fresh now.",
};

export function OrderStatusWatcher({ orderId, shortId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (status !== "expired") return;
    try {
      sessionStorage.setItem(CHECKOUT_RESET_AFTER_ORDER_EXPIRED_KEY, "1");
    } catch {
      /* ignore quota / private mode */
    }
  }, [status]);

  // Poll the status route (the orders table is no longer readable from the browser). Stops once the order is final.
  useEffect(() => {
    if (status === "delivered" || status === "expired") return;
    const id = setInterval(async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(`/api/orders/${orderId}/status`, { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as { status?: string };
        if (next.status) setStatus(next.status);
      } catch {
        /* offline: try again on the next tick */
      }
    }, 5000);
    return () => clearInterval(id);
  }, [orderId, status]);

  const hero = HERO[status] ?? PAID_HERO;

  return (
    <>
      <div className="mb-12 flex flex-col items-center text-center">
        <div className={`mb-6 rounded-full p-5 ${hero.tone}`}>
          <hero.Icon className="size-16 stroke-[1.5]" />
        </div>
        <h1 className="mb-4 font-display text-5xl font-extrabold leading-none tracking-tight text-ink">{hero.title}</h1>
        <p className="mb-2 max-w-xl text-lg text-ink/70">{hero.text}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-ink/70">Order #{shortId}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[status] ?? "bg-muted text-foreground"}`}
          >
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>
      </div>

      <Dialog open={status === "expired"}>
        <DialogContent
          className="[&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Payment not completed</DialogTitle>
            <DialogDescription>
              Payment was cancelled or failed. Please try again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="custom" className="w-full sm:w-auto" asChild>
              <Link href="/checkout" replace>
                Back to checkout
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
