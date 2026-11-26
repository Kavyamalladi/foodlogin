"use client";

import { useSyncExternalStore } from "react";
import { m } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { flyToCart } from "@/components/motion/fly-to-cart";
import { useCartStore } from "@/store/cart";

const subscribe = () => () => {};
const PILL = { borderRadius: 9999 }; // inline so layout animations don't distort the radius

type Props = {
  productId: string;
  productName: string;
  productImageUrl: string | null;
  variant: { id: string; weight: string; price: number };
  className?: string;
  /** "block" = full-width button under a card; default floats on the photo. */
  block?: boolean;
};

/** Add the chosen size to the cart. The pill morphs into a stepper once it's in (shared layoutId). */
export function QuickAdd({ productId, productName, productImageUrl, variant, className = "", block = false }: Props) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const stored = useCartStore((s) => s.items.find((i) => i.variantId === variant.id)?.quantity ?? 0);
  const { addItem, incrementItem, decrementItem } = useCartStore();
  const quantity = mounted ? stored : 0;
  const label = `${productName}, ${variant.weight}`;

  if (quantity === 0) {
    return (
      <m.button
        layoutId={`qa-${variant.id}`}
        style={PILL}
        onClick={(e) => {
          const photo = e.currentTarget.closest("[data-card]")?.querySelector("img");
          flyToCart((photo ?? e.currentTarget).getBoundingClientRect(), productImageUrl);
          addItem({
            productId,
            variantId: variant.id,
            productName,
            variantWeight: variant.weight,
            productImageUrl,
            price: variant.price,
          });
        }}
        aria-label={`Add ${label} to cart`}
        className={`flex h-11 items-center gap-1 text-sm font-extrabold active:scale-95 ${block ? "w-full justify-center border-2 border-brand bg-white text-brand" : "bg-white px-4 text-ink shadow-md"} ${className}`}
      >
        <Plus className="size-4 text-brand" />
        Add
      </m.button>
    );
  }

  return (
    <m.div
      layoutId={`qa-${variant.id}`}
      style={PILL}
      className={`flex h-11 items-center bg-brand text-white ${block ? "w-full justify-between" : "shadow-md"} ${className}`}
    >
      <button
        onClick={() => decrementItem(variant.id)}
        aria-label={`Remove one ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-full active:scale-90"
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="min-w-4 text-center text-sm font-extrabold tabular-nums">
        {quantity}
      </span>
      <button
        onClick={() => incrementItem(variant.id)}
        aria-label={`Add one more ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-full active:scale-90"
      >
        <Plus className="size-4" />
      </button>
    </m.div>
  );
}
