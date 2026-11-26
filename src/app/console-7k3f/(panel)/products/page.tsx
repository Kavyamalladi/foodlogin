import { adminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import Link from "next/link";
import { AdminProductsList } from "@/components/admin/products-list";

export default async function AdminProductsPage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    adminClient
      .from("products")
      .select(
        "id, name, image_url, category_id, category:categories(id, name), variants:product_variants(id, weight, price, sort_order)"
      )
      .order("sort_order", { ascending: true }),
    adminClient
      .from("categories")
      .select("id, name")
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{(products ?? []).length} products</p>
        </div>
        <Button variant="custom" asChild>
          <Link href={`${ADMIN_BASE_PATH}/products/new`}>+ Add Product</Link>
        </Button>
      </div>
      <AdminProductsList
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products={(products ?? []) as any}
        categories={(categories ?? []) as Array<{ id: string; name: string }>}
      />
    </main>
  );
}
