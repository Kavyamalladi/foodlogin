"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useCatalog } from "@/lib/catalog";
import { NON_VEG_SLUGS } from "@/lib/diet";
import type { CatalogProduct } from "@/lib/catalog";
import { useCartStore } from "@/store/cart";

const MAX = 4;
// Never suggest meat to a vegetarian cart (NON_VEG_SLUGS in lib/diet).

/** Cross-sell: photographed products from categories not already in the cart. */
export function CartUpsell() {
  const catalog = useCatalog(true);
  // Frozen at mount so a suggestion doesn't vanish the moment it's added.
  const [initialIds] = useState(() => new Set(useCartStore.getState().items.map((i) => i.productId)));

  if (!catalog) return null;

  const nonVegIds = new Set(catalog.categories.filter((c) => NON_VEG_SLUGS.has(c.slug)).map((c) => c.id));
  const inCartCategories = new Set(
    catalog.products.filter((p) => initialIds.has(p.id)).map((p) => p.category_id),
  );
  const cartHasNonVeg = [...inCartCategories].some((id) => nonVegIds.has(id));

  const pool = catalog.products.filter(
    (p) =>
      p.image_url &&
      p.variants.length > 0 &&
      !initialIds.has(p.id) &&
      (cartHasNonVeg || !nonVegIds.has(p.category_id)),
  );

  // Round-robin across categories (new categories first) so suggestions are varied.
  const byCategory = new Map<string, CatalogProduct[]>();
  for (const p of pool) byCategory.set(p.category_id, [...(byCategory.get(p.category_id) ?? []), p]);
  const lanes = [...byCategory.entries()]
    .sort(([a], [b]) => Number(inCartCategories.has(a)) - Number(inCartCategories.has(b)))
    .map(([, items]) => items);
  const picks: CatalogProduct[] = [];
  for (let round = 0; picks.length < MAX && lanes.some((l) => l[round]); round++) {
    for (const lane of lanes) {
      if (lane[round] && picks.length < MAX) picks.push(lane[round]);
    }
  }
  if (picks.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-extrabold leading-none text-ink">You might also like</h2>
      <div className="-mx-4 mt-4 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {picks.map((p) => (
          <div key={p.id} className="w-40 shrink-0 snap-start sm:w-auto">
            <ProductCard product={p} nonVeg={nonVegIds.has(p.category_id)} />
          </div>
        ))}
      </div>
    </section>
  );
}
