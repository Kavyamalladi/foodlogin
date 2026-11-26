"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/** Phone-only pinned total + Checkout. Hidden once the real summary card is on screen or scrolled past. */
export function StickyCheckoutBar({ total, targetId }: { total: number; targetId: string }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bone/95 p-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-center gap-4">
        <div className="leading-tight">
          <p className="text-xs text-ink/70">Total</p>
          <p className="text-2xl font-extrabold tabular-nums text-ink">₹{total}</p>
        </div>
        <Link
          href="/checkout"
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-3xl bg-brand text-base font-bold text-white hover:bg-brand/90"
        >
          Checkout now <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
