import { adminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditProductForm } from "@/components/admin/edit-product-form";

const FALLBACK_IMAGE = "/foodlogin.webp";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const [{ data: product }, { data: categories }] = await Promise.all([
    adminClient
      .from("products")
      .select("id, name, description, category_id, image_url, variants:product_variants(id, weight, price, sort_order)")
      .eq("id", productId)
      .single(),
    adminClient
      .from("categories")
      .select("id, name")
      .order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();

  const variants = ((product.variants ?? []) as Array<{
    id: string;
    weight: string;
    price: number;
    sort_order: number;
  }>).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-6">
      <Link
        href={`${ADMIN_BASE_PATH}/products`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Products
      </Link>

      <div className="flex items-center gap-4">
        <img
          src={product.image_url ?? FALLBACK_IMAGE}
          alt={product.name}
          width={72}
          height={72}
          className="w-18 h-18 rounded-2xl object-cover border border-[#E8D8CC] shrink-0"
        />
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] leading-tight">{product.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.image_url ? "Product image" : "Placeholder image"}
          </p>
        </div>
      </div>

      <EditProductForm
        productId={productId}
        defaultValues={{
          name: product.name,
          description: product.description ?? "",
          categoryId: product.category_id,
          imageUrl: product.image_url,
          variants: variants.map((v) => ({
            id: v.id,
            weight: v.weight,
            price: v.price,
          })),
        }}
        categories={(categories ?? []) as Array<{ id: string; name: string }>}
      />
    </main>
  );
}
