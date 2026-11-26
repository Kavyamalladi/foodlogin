import { adminClient } from "@/lib/supabase/admin";
import { AddProductForm } from "@/components/admin/add-product-form";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const { data: categories } = await adminClient
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-6">
      <Link
        href={`${ADMIN_BASE_PATH}/products`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Products
      </Link>
      <h1 className="text-2xl font-black text-[#0f172a]">Add Product</h1>
      <AddProductForm
        categories={(categories ?? []) as Array<{ id: string; name: string }>}
      />
    </main>
  );
}
