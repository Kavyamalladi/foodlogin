"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductWithVariants } from "@/lib/supabase/types";

const low = (p: ProductWithVariants) => Math.min(...p.variants.map((v) => v.price));

const SORTS = {
  featured: { label: "Featured", fn: null },
  "price-asc": { label: "Price: low to high", fn: (a: ProductWithVariants, b: ProductWithVariants) => low(a) - low(b) },
  "price-desc": { label: "Price: high to low", fn: (a: ProductWithVariants, b: ProductWithVariants) => low(b) - low(a) },
  name: { label: "Name: A to Z", fn: (a: ProductWithVariants, b: ProductWithVariants) => a.name.localeCompare(b.name) },
} as const;
type SortKey = keyof typeof SORTS;

/** Count + Sort bar above the grid on a category page. */
export function CategoryProducts({ products, nonVeg, category }: { products: ProductWithVariants[]; nonVeg?: boolean; category?: string }) {
  const [sort, setSort] = useState<SortKey>("featured");
  const fn = SORTS[sort].fn;
  const list = fn ? [...products].sort(fn) : products;

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        {products.length > 1 && (
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger aria-label="Sort products" className="h-11 w-auto min-w-44 gap-2 rounded-full border-ink/20 bg-white px-4 text-sm font-bold text-ink">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="[--brand:var(--brand-deep)]">
              {Object.entries(SORTS).map(([k, s]) => (
                <SelectItem key={k} value={k}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <ProductGrid products={list} nonVeg={nonVeg} category={category} />
    </>
  );
}
