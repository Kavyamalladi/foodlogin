import { adminClient } from "@/lib/supabase/admin";
import { CategoriesList } from "@/components/admin/categories-list";

export default async function AdminCategoriesPage() {
  const [{ data: categories }, { data: products }] = await Promise.all([
    adminClient
      .from("categories")
      .select("id, name, slug")
      .order("sort_order", { ascending: true }),
    adminClient.from("products").select("category_id"),
  ]);

  const productCounts = ((products ?? []) as Array<{ category_id: string }>).reduce<
    Record<string, number>
  >((acc, p) => {
    acc[p.category_id] = (acc[p.category_id] ?? 0) + 1;
    return acc;
  }, {});

  const enriched = ((categories ?? []) as Array<{ id: string; name: string; slug: string }>).map(
    (cat) => ({ ...cat, productCount: productCounts[cat.id] ?? 0 })
  );

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0f172a]">Categories</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{enriched.length} categories</p>
      </div>
      <CategoriesList categories={enriched} />
    </main>
  );
}
