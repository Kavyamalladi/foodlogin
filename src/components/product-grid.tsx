"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import type { ProductWithVariants } from "@/lib/supabase/types";

type Props = {
  products: ProductWithVariants[];
  nonVeg?: boolean;
  category?: string;
};

export function ProductGrid({ products, nonVeg, category }: Props) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600">No products found.</p>
        <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-brand-deep hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <Reveal each className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} nonVeg={nonVeg} category={category} />
      ))}
    </Reveal>
  );
}
