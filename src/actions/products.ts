"use server";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";
import type { Category, ProductWithVariants } from "@/lib/supabase/types";

// React.cache deduplicates calls within a single server render.
// generateMetadata and the page component both call these — without cache,
// each call fires a separate DB query even though the result is identical.
export const getCategories = cache(async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
});

export async function getProducts(categorySlug?: string): Promise<ProductWithVariants[]> {
  try {
    const supabase = createPublicClient();

    let query = supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (!category) return [];
      query = query.eq("category_id", category.id);
    }

    const { data, error } = await query;
    if (error) return [];

    return (data ?? []).map((p) => ({
      ...p,
      variants: (p.variants ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    }));
  } catch {
    return [];
  }
}

export const getProduct = cache(async function getProduct(id: string): Promise<ProductWithVariants | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return {
    ...data,
    variants: (data.variants ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  };
});

// Fetches up to 4 products in the same category, excluding the current product.
// Accepts categoryId directly — no slug lookup needed, single query.
export async function getRelatedProducts(
  categoryId: string,
  excludeId: string
): Promise<ProductWithVariants[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .order("sort_order", { ascending: true })
    .limit(4);

  if (error) return [];
  return (data ?? []).map((p) => ({
    ...p,
    variants: (p.variants ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  }));
}
