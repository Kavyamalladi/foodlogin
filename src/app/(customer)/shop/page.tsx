import { ShopChips } from "@/components/shop-chips";
import { isNonVegSlug } from "@/lib/diet";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getProducts } from "@/actions/products";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductCard } from "@/components/product-card";
import { WhatsAppCta } from "@/components/whatsapp-cta";

/** Cached catalog slice; admin mutations call revalidatePath. */
export const revalidate = 86400; // 24h

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our full range of handmade pickles, sweets, podi, and more. Authentic South Indian recipes crafted fresh.",
};

export default async function ShopPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const groups = categories
    .map((category) => ({ category, products: products.filter((p) => p.category_id === category.id) }))
    .filter((g) => g.products.length > 0);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
        <h1 className="hero-in mt-3 font-display text-4xl font-extrabold leading-none tracking-tight text-ink sm:mt-6 sm:text-6xl">
          Everything we make
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink/70 sm:mt-3 sm:text-base">
          {products.length} handmade products, made to order in Anantapur.
        </p>
      </div>

      {/* Jump chips: stay under the header while scrolling the long page */}
      <nav className="sticky top-14 z-40 mt-4 bg-bone/90 backdrop-blur sm:mt-6">
        <ShopChips items={groups.map(({ category }) => ({ id: category.id, slug: category.slug, name: category.name, nonVeg: isNonVegSlug(category.slug) }))} />
      </nav>

      <div className="mx-auto max-w-6xl space-y-14 px-4 pt-6 sm:px-6">
        {groups.map(({ category, products: items }) => (
          <section key={category.id} id={category.slug} data-nonveg={isNonVegSlug(category.slug) ? "" : undefined} className="scroll-mt-32">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-extrabold leading-none text-brand sm:text-4xl">
                {category.name}
              </h2>
              <Link href={`/shop/${category.slug}`} className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap text-sm font-bold text-ink hover:text-brand">
                See all {items.length}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">
              {items.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} nonVeg={isNonVegSlug(category.slug)} category={category.slug} />
              ))}
            </div>
          </section>
        ))}

        <WhatsAppCta />
      </div>
    </main>
  );
}
