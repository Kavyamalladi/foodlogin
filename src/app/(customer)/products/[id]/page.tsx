import { isNonVegSlug } from "@/lib/diet";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getCategories, getRelatedProducts } from "@/actions/products";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { ProductDetail } from "@/components/product-detail";
import { parseDescription } from "@/lib/description";

type Props = {
  params: Promise<{ id: string }>;
};

/** Cached catalog slice; admin mutations call revalidatePath. */
export const revalidate = 86400; // 24h

const FALLBACK_IMAGE = "/foodlogin.webp";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};
  const description =
    parseDescription(product.description).paragraphs.join(" ") || `Order ${product.name} — handmade by Foodlogin`;
  const ogUrl = product.image_url ?? FALLBACK_IMAGE;
  const isFallbackOg = !product.image_url;
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: [
        {
          url: ogUrl,
          width: isFallbackOg ? 1024 : 800,
          height: isFallbackOg ? 1024 : 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  // getProduct is memoised via React.cache — generateMetadata already called it,
  // so this resolves instantly from cache with no extra DB query.
  const product = await getProduct(id);
  if (!product) notFound();

  // Now that we have product.category_id, fetch categories + related in parallel.
  // getRelatedProducts uses categoryId directly — no slug lookup needed.
  const [categories, related] = await Promise.all([
    getCategories(),
    getRelatedProducts(product.category_id, product.id),
  ]);

  const category = categories.find((c) => c.id === product.category_id);

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://foodlogin.vercel.app");
  const url = `${base}/products/${product.id}`;
  const prices = product.variants.map((v) => v.price);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: parseDescription(product.description).paragraphs.join(" ") || `${product.name}, handmade by Foodlogin in Anantapur. Made to order, no preservatives.`,
    image: [product.image_url ?? `${base}/foodlogin.webp`],
    sku: product.id,
    brand: { "@type": "Brand", name: "Foodlogin" },
    ...(category && { category: category.name }),
    ...(prices.length > 0 && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        availability: "https://schema.org/InStock",
        url,
        offers: product.variants.map((v) => ({
          "@type": "Offer",
          name: `${product.name} ${v.weight}`,
          price: v.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url,
        })),
      },
    }),
  };
  const crumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Shop", item: `${base}/shop` },
      ...(category ? [{ name: category.name, item: `${base}/shop/${category.slug}` }] : []),
      { name: product.name, item: url },
    ].map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
  };

  return (
    <main className="mx-auto max-w-6xl space-y-16 px-4 pt-6 sm:px-6">
      <JsonLd data={productLd} />
      <JsonLd data={crumbsLd} />
      <div>
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: "Shop", href: "/shop" },
              ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
              { label: product.name },
            ]}
          />
        </div>
        <ProductDetail product={product} nonVeg={category ? isNonVegSlug(category.slug) : undefined} category={category?.slug} />
      </div>

      {related.length > 0 && (
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-extrabold leading-none text-brand">
              More from {category?.name}
            </h2>
            {category && (
              <Link
                href={`/shop/${category.slug}`}
                className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap text-sm font-bold text-ink hover:text-brand"
              >
                See all
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-x-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} nonVeg={category ? isNonVegSlug(category.slug) : undefined} category={category?.slug} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
