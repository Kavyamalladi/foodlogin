"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

const FALLBACK_IMAGE = "/foodlogin.webp";

type Variant = { id: string; weight: string; price: number; sort_order?: number };
type Product = {
  id: string;
  name: string;
  image_url: string | null;
  category_id: string;
  category: { id: string; name: string } | null;
  variants: Variant[];
};
type Category = { id: string; name: string };

export function AdminProductsList({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filtered = selectedCategoryId
    ? products.filter((p) => p.category_id === selectedCategoryId)
    : products;

  return (
    <div className="space-y-4">
      {/* Category filter pills — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`flex-none px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            selectedCategoryId === null
              ? "bg-brand text-white border-brand"
              : "bg-white border-[#E8D8CC] text-[#0f172a] hover:border-brand/50 hover:text-brand"
          }`}
        >
          All
          <span className={`ml-1.5 text-xs ${selectedCategoryId === null ? "opacity-80" : "opacity-50"}`}>
            {products.length}
          </span>
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category_id === cat.id).length;
          const isActive = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`flex-none px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                isActive
                  ? "bg-brand text-white border-brand"
                  : "bg-white border-[#E8D8CC] text-[#0f172a] hover:border-brand/50 hover:text-brand"
              }`}
            >
              {cat.name}
              <span className={`ml-1.5 text-xs ${isActive ? "opacity-80" : "opacity-50"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E8D8CC] bg-white p-12 text-center">
          <p className="text-sm font-medium text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => {
            const sortedVariants = [...product.variants].sort(
              (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
            );
            return (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-[#E8D8CC] bg-white p-4"
              >
                <Link
                  href={`${ADMIN_BASE_PATH}/products/${product.id}/edit`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <img
                    src={product.image_url ?? FALLBACK_IMAGE}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0f172a] leading-snug">{product.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.category?.name ?? "Uncategorized"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {sortedVariants.map((v) => v.weight).join(" · ")}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" className="h-10 px-4 border-[#E8D8CC] gap-1.5 hidden sm:flex" asChild>
                    <Link href={`${ADMIN_BASE_PATH}/products/${product.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
