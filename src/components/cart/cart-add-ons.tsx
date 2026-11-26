"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { flyToCart } from "@/components/motion/fly-to-cart";
import { useCatalog } from "@/lib/catalog";
import { NON_VEG_SLUGS } from "@/lib/diet";
import { useCartStore } from "@/store/cart";

const MAX = 6;

/** One-tap strip of the cheapest photographed products not already in the cart. */
export function CartAddOns() {
  const catalog = useCatalog(true);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  if (!catalog) return null;

  const inCart = new Set(items.map((i) => i.productId));
  const nonVegIds = new Set(catalog.categories.filter((c) => NON_VEG_SLUGS.has(c.slug)).map((c) => c.id));
  const cartHasNonVeg = catalog.products.some((p) => inCart.has(p.id) && nonVegIds.has(p.category_id));

  const picks = catalog.products
    .filter(
      (p) =>
        p.image_url &&
        p.variants.length > 0 &&
        !inCart.has(p.id) &&
        (cartHasNonVeg || !nonVegIds.has(p.category_id)),
    )
    .map((p) => ({ p, v: p.variants.reduce((a, b) => (a.price <= b.price ? a : b)) }))
    .sort((a, b) => a.v.price - b.v.price)
    .slice(0, MAX);
  if (picks.length === 0) return null;

  return (
    <section aria-label="Complete your order" className="border-t border-ink/10 pt-4">
      <h3 className="font-display text-lg font-extrabold text-ink">Complete your order</h3>
      <div className="-mx-4 mt-3 flex snap-x scroll-pl-4 gap-3 overflow-x-auto overflow-y-hidden px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {picks.map(({ p, v }) => (
          <div key={p.id} className="flex w-44 shrink-0 snap-start items-center gap-2 rounded-2xl border border-ink/10 bg-white p-2">
            <div data-addon-img className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-turmeric">
              <Image src={p.image_url!} alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs font-bold leading-tight text-ink">{p.name}</p>
              <p className="text-xs tabular-nums text-ink/70">₹{v.price} · {v.weight}</p>
            </div>
            <button
              aria-label={`Add ${p.name}, ${v.weight}`}
              onClick={(e) => {
                const img = e.currentTarget.parentElement?.querySelector("[data-addon-img]");
                flyToCart((img ?? e.currentTarget).getBoundingClientRect(), p.image_url);
                addItem({
                  productId: p.id,
                  variantId: v.id,
                  productName: p.name,
                  variantWeight: v.weight,
                  productImageUrl: p.image_url,
                  price: v.price,
                });
              }}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-white active:scale-90"
            >
              <Plus className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
