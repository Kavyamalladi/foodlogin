"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product-grid";
import type { Category, ProductWithVariants } from "@/lib/supabase/types";

type Props = {
  categories: Category[];
  products: ProductWithVariants[];
};

export function CategoryFilter({ categories, products }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected
    ? products.filter((p) => p.category_id === selected)
    : products;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selected === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelected(null)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selected === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}
