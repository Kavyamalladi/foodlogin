import { isNonVegSlug } from "@/lib/diet";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategories, getProducts } from "@/actions/products";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { CategoryProducts } from "@/components/shop/category-products";

type Props = {
  params: Promise<{ category: string }>;
};

/** Cached catalog slice; admin mutations call revalidatePath. */
export const revalidate = 86400; // 24h

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  const description = `Browse our handmade ${category.name.toLowerCase()} — authentic Rayalaseema recipes, made fresh to order.`;
  return {
    title: category.name,
    description,
    openGraph: {
      title: category.name,
      description,
      type: "website",
      images: [
        {
          url: "/foodlogin.webp",
          width: 1024,
          height: 1024,
          alt: `${category.name} — Foodlogin`,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(slug),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <main className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { name: "Shop", item: `${process.env.NEXT_PUBLIC_BASE_URL}/shop` },
            { name: category.name, item: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/${category.slug}` },
          ].map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-4 sm:px-6">
        {/* Breadcrumb */}
        <div>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: category.name },
            ]}
          />
        </div>

        <h1 className="hero-in mt-3 font-display text-4xl font-extrabold leading-none tracking-tight text-ink sm:mt-6 sm:text-6xl">
          {category.name}
        </h1>

        {/* Other categories */}
        <div className="-mx-4 mt-4 mb-6 flex gap-2 sm:mt-6 sm:mb-8 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-bold ${
                c.id === category.id ? "bg-brand text-white" : "bg-ink/5 text-ink hover:bg-brand hover:text-white"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Product grid */}
        <CategoryProducts products={products} nonVeg={isNonVegSlug(category.slug)} category={category.slug} />

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-brand"
          >
            <ArrowLeft className="size-4" />
            Back to all products
          </Link>
        </div>
      </div>
    </main>
  );
}
