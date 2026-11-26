"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";

const subscribe = () => () => {};

/** Floating cart summary on browse pages. Product pages have their own sticky bar. */
export function MiniCartBar() {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const items = useCartStore((s) => s.items);
  const setOpen = useCartUi((s) => s.setOpen);

  if (!mounted || items.length === 0) return null;
  if (pathname !== "/" && !pathname.startsWith("/shop")) return null;

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const total = items.reduce((n, i) => n + i.price * i.quantity, 0);

  return (
    <>
      {/* Keeps the footer's last line clear of the fixed bar */}
      <div aria-hidden className="h-16 bg-ink" />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center gap-3 text-left rounded-full bg-turmeric py-1.5 pl-2 pr-4 text-ink shadow-lg shadow-ink/25"
      >
        <span className="flex -space-x-3">
          {items.slice(0, 2).map((i) => (
            <span key={i.variantId} className="relative size-9 overflow-hidden rounded-full border-2 border-turmeric bg-brand">
              {i.productImageUrl && <Image src={i.productImageUrl} alt="" fill sizes="36px" className="object-cover" />}
            </span>
          ))}
        </span>
        <span className="flex-1 text-sm font-bold">
          {count} item{count !== 1 ? "s" : ""} · <span className="text-lg font-extrabold tabular-nums">₹{total}</span>
        </span>
        <span className="flex items-center gap-0.5 font-bold">
          View cart <ChevronRight className="size-5" />
        </span>
      </button>
    </>
  );
}
