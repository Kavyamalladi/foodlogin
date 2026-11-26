"use client";

import { DietDot } from "@/components/diet-dot";
import { foodArt } from "@/lib/food-art";
import { flyToCart } from "@/components/motion/fly-to-cart";
import { parseDescription } from "@/lib/description";
import { pricePer100g } from "@/lib/unit-price";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ShoppingCart, Minus, Plus, Share2, Flame, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { ProductWithVariants, ProductVariant } from "@/lib/supabase/types";

const TRUST = [
  { art: "trust-truck", label: "Delivery", value: "₹100 per order, across India" },
  { art: "trust-kadai", label: "Freshness", value: "Made to order, ships in 2–4 days" },
  { art: "trust-leaf", label: "Ingredients", value: "No preservatives" },
  { art: "trust-heart", label: "Recipe", value: "Rayalaseema family recipe" },
];

const DELIVERY_DETAILS = [
  "Made fresh after you order and dispatched in 2–4 business days.",
  "Delivery takes 3–7 business days after dispatch, depending on your location.",
  "A flat ₹100 delivery per order, however many jars you add.",
  "Orders can't be cancelled once paid, and we don't offer returns, because every order is made for you.",
  "If an item arrives damaged or wrong, contact us within 24 hours with photos.",
];

/** Price per gram for "250g" / "1kg" weights, or null. Used only to flag a genuinely cheaper-per-gram size. */
function perGram(v: ProductVariant): number | null {
  const m = /^(\d+(?:\.\d+)?)\s*(kg|g)$/i.exec(v.weight.trim());
  if (!m) return null;
  const g = Number(m[1]) * (m[2].toLowerCase() === "kg" ? 1000 : 1);
  return g > 0 ? v.price / g : null;
}

export function ProductDetail({ product, nonVeg, category }: { product: ProductWithVariants; nonVeg?: boolean; category?: string }) {
  const art = foodArt(category, product.name);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const { addItem, incrementItem, decrementItem, getItemQuantity } = useCartStore();

  const quantity = getItemQuantity(selectedVariant.id);
  const desc = parseDescription(product.description);

  // "Best value" only when a size is at least 3% cheaper per gram than the smallest one.
  const grams = product.variants.map(perGram);
  const valid = grams.filter((g): g is number => g !== null);
  const smallest = grams[0];
  const bestRate = valid.length > 1 ? Math.min(...valid) : null;
  const bestId =
    bestRate !== null && smallest !== null && bestRate < smallest * 0.97
      ? product.variants.find((v) => perGram(v) === bestRate)?.id
      : undefined;

  function handleAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
    const photo = e.currentTarget.closest("main")?.querySelector("img");
    flyToCart((photo ?? e.currentTarget).getBoundingClientRect(), product.image_url);
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      variantWeight: selectedVariant.weight,
      productImageUrl: product.image_url,
      price: selectedVariant.price,
    });
  }

  function handleShare() {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const text = `Check out ${product.name} on Foodlogin: ${base}/products/${product.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  const askUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Foodlogin, I have a question about ${product.name} (${selectedVariant.weight}).`,
  )}`;

  return (
    <div className="grid items-start gap-0 sm:gap-8 lg:grid-cols-2 lg:gap-14">
      {/* Image: full-bleed on mobile */}
      <div className="relative -mx-4 aspect-5/4 overflow-hidden bg-ink/5 sm:mx-0 sm:aspect-4/5 sm:rounded-3xl lg:sticky lg:top-24 lg:aspect-square">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            preload
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-turmeric/30">
            {art ? (
              <Image src={art} alt={product.name} width={400} height={500} unoptimized preload className="size-full object-contain px-6 pb-14 pt-6" />
            ) : (
              <Flame aria-hidden className="size-24 text-turmeric" />
            )}
          </div>
        )}
      </div>

      {/* Mobile: details slide over the photo as a rounded sheet */}
      <div className="relative -mx-4 -mt-7 space-y-6 rounded-t-3xl bg-bone px-4 pt-7 sm:mx-0 sm:mt-0 sm:rounded-none sm:bg-transparent sm:px-0 sm:pt-0">
        <div>
          {nonVeg !== undefined && <DietDot nonVeg={nonVeg} label className="mb-3" />}
          <h1 className="wrap-break-word font-display text-4xl font-extrabold leading-none tracking-tight text-ink sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-ink">
            <span className="rounded-full bg-turmeric/25 px-3 py-1.5">Made to order</span>
            <span className="rounded-full bg-turmeric/25 px-3 py-1.5">No preservatives</span>
            <span className="rounded-full bg-turmeric/25 px-3 py-1.5">Made in Anantapur</span>
          </p>
          {desc.paragraphs.map((para) => (
            <p key={para} className="mt-4 wrap-break-word leading-relaxed text-ink/75">{para}</p>
          ))}
          {desc.facts.length > 0 && (
            <dl className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white text-sm">
              {desc.facts.map((f) => (
                <div key={f.label} className="flex gap-4 px-4 py-3">
                  <dt className="w-28 shrink-0 font-bold text-ink">{f.label}</dt>
                  <dd className="text-ink/75">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-ink">Choose size</p>
          <div role="radiogroup" aria-label="Size" className={`grid gap-2 ${product.variants.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {product.variants.map((variant) => {
              const on = selectedVariant.id === variant.id;
              const per100 = pricePer100g(variant.weight, variant.price);
              return (
                <button
                  key={variant.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setSelectedVariant(variant)}
                  className={`relative flex min-h-24 flex-col items-center justify-center rounded-2xl border-2 px-2 py-3 text-center transition-colors ${
                    on ? "border-brand bg-brand/10" : "border-ink/15 bg-white hover:border-brand"
                  }`}
                >
                  {variant.id === bestId && (
                    <span className="absolute -top-2.5 rounded-full bg-turmeric px-2 py-0.5 text-[11px] font-extrabold text-ink">Best value</span>
                  )}
                  <span className="text-sm font-bold text-ink">{variant.weight}</span>
                  <span className="mt-0.5 text-xl font-extrabold tabular-nums text-ink">₹{variant.price}</span>
                  {per100 !== null && <span className="text-xs tabular-nums text-ink/70">₹{per100} / 100g</span>}
                </button>
              );
            })}
          </div>
        </div>

        <p className="flex items-start gap-2 text-sm text-ink/75">
          <Truck aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
          <span>
            Dispatched in 2–4 business days, then 3–7 days to reach you. Delivery is ₹100 per order, so extra jars ship at no extra delivery.
          </span>
        </p>

        {/* Sticky to the bottom of the screen on mobile, inline on desktop */}
        <div className="sticky bottom-0 z-40 -mx-4 flex items-center gap-4 border-t border-ink/10 bg-bone/95 px-4 py-3 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <p className="text-3xl font-extrabold tabular-nums text-brand">₹{selectedVariant.price}</p>
          {quantity === 0 ? (
            <Button variant="custom" className="h-14 flex-1 text-base" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 size-5" />
              Add to cart
            </Button>
          ) : (
            <div className="flex h-14 flex-1 items-center justify-between rounded-full border-2 border-brand/30 bg-brand/5 px-4">
              <span className="text-sm font-bold text-brand-deep">₹{selectedVariant.price * quantity} in cart</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decrementItem(selectedVariant.id)}
                  aria-label="Decrease quantity"
                  className="flex size-11 items-center justify-center rounded-full border-2 border-brand/40 text-brand hover:bg-brand/10"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-5 text-center font-bold text-brand">{quantity}</span>
                <button
                  onClick={() => incrementItem(selectedVariant.id)}
                  aria-label="Increase quantity"
                  className="flex size-11 items-center justify-center rounded-full border-2 border-brand/40 text-brand hover:bg-brand/10"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="h-12 flex-1 rounded-2xl font-bold" asChild>
            <a href={askUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 size-4" />
              Ask on WhatsApp
            </a>
          </Button>
          <Button variant="outline" className="size-12 shrink-0 rounded-2xl" onClick={handleShare} aria-label="Share on WhatsApp">
            <Share2 className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {TRUST.map(({ art, label, value }) => (
            <div key={label} className="flex items-start gap-3 rounded-2xl bg-ink/5 p-4">
              <Image src={`/art/${art}.svg`} alt="" width={40} height={40} unoptimized className="size-10 shrink-0" />
              <div>
                <p className="text-xs text-ink/70">{label}</p>
                <p className="text-sm font-bold leading-snug text-ink">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <details className="faq group rounded-2xl border border-ink/10 bg-white">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 font-display text-lg font-bold text-ink [&::-webkit-details-marker]:hidden">
            Delivery and returns
            <ChevronDown aria-hidden className="size-5 shrink-0 text-brand transition-transform group-open:rotate-180" />
          </summary>
          <ul className="list-disc space-y-2 px-4 pb-4 pl-9 text-sm leading-relaxed text-ink/75">
            {DELIVERY_DETAILS.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
