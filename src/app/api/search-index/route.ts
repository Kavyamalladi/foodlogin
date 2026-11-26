import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";
import type { Catalog } from "@/lib/catalog";

/** Read-only, narrow catalog snapshot for instant search and cart suggestions. */
export const revalidate = 3600;

export async function GET() {
  const supabase = createPublicClient();
  const [cats, prods] = await Promise.all([
    supabase.from("categories").select("id,name,slug").order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("id,name,image_url,category_id,variants:product_variants(id,weight,price,sort_order)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);
  if (cats.error || prods.error) {
    return NextResponse.json({ error: "Catalog unavailable" }, { status: 500 });
  }

  const catalog: Catalog = {
    categories: cats.data ?? [],
    products: (prods.data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      image_url: p.image_url,
      category_id: p.category_id,
      variants: [...(p.variants ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(({ id, weight, price }) => ({ id, weight, price })),
    })),
  };
  return NextResponse.json(catalog, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
