"use client";

import { pricePer100g } from "@/lib/unit-price";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Flame } from "lucide-react";
import { DietDot } from "@/components/diet-dot";
import { foodArt } from "@/lib/food-art";
import { QuickAdd } from "@/components/quick-add";
import { QuickView } from "@/components/shop/quick-view";
import { SizePicker } from "@/components/shop/size-picker";
import type { ProductWithVariants } from "@/lib/supabase/types";

// Only what the card renders, so both full products and the lightweight catalog fit.
type CardProduct = Pick<ProductWithVariants, "id" | "name" | "image_url"> & {
  description?: string | null;
  variants: { id: string; weight: string; price: number }[];
};

/** `nonVeg` comes from the caller (it knows the category); omit it to show no dot. */
export function ProductCard({ product, nonVeg, category, compact = false }: { product: CardProduct; nonVeg?: boolean; category?: string; compact?: boolean }) {
  const cheapest = product.variants.length
    ? product.variants.reduce((a, b) => (a.price <= b.price ? a : b))
    : null;
  const [selectedId, setSelectedId] = useState(cheapest?.id ?? "");
  const [peek, setPeek] = useState(false);
  const base = product.variants.find((v) => v.id === selectedId) ?? cheapest;
  const per100 = base ? pricePer100g(base.weight, base.price) : null;
  const art = foodArt(category, product.name);
  const href = `/products/${product.id}`;

  if (!compact) {
    return (
      <div data-card className="flex flex-col">
        <div className="relative">
          <Link href={href} aria-hidden tabIndex={-1} className="relative block aspect-square overflow-hidden rounded-2xl bg-ink/5">
            {product.image_url ? (
              <Image src={product.image_url} alt="" fill quality={70} sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 45vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-turmeric/30">
                {art ? (
                  <Image src={art} alt="" width={400} height={500} unoptimized className={`size-full object-contain p-3 ${product.id.charCodeAt(1) % 2 ? "-scale-x-100" : ""}`} />
                ) : (
                  <Flame aria-hidden className="size-14 text-turmeric" />
                )}
              </div>
            )}
          </Link>
          {nonVeg !== undefined && <DietDot nonVeg={nonVeg} className="pointer-events-none absolute left-2 top-2" />}
          {base && (
            <button
              type="button"
              onClick={() => setPeek(true)}
              aria-label={`Quick view ${product.name}`}
              className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-full text-white active:scale-90"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-ink/45 backdrop-blur-sm">
                <Eye className="size-4" />
              </span>
            </button>
          )}
        </div>

        <Link href={href} className="mt-3 block flex-1">
          <p className="line-clamp-2 font-display font-bold leading-tight text-ink">{product.name}</p>
        </Link>

        <div className="mt-2 min-h-8">
          {product.variants.length > 1 ? (
            <SizePicker variants={product.variants} selectedId={base?.id ?? ""} onSelect={setSelectedId} label={`Size for ${product.name}`} />
          ) : (
            base && <p className="text-sm tabular-nums text-ink/70">{base.weight}</p>
          )}
        </div>

        {base && (
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold tabular-nums text-brand-deep">₹{base.price}</span>
            {per100 !== null && <span className="text-xs tabular-nums text-ink/70">₹{per100} / 100g</span>}
          </p>
        )}

        {base && (
          <QuickAdd
            productId={product.id}
            productName={product.name}
            productImageUrl={product.image_url}
            variant={base}
            block
            className="mt-3"
          />
        )}

        {peek && base && (
          <QuickView product={product} nonVeg={nonVeg} art={art} selectedId={base.id} onSelect={setSelectedId} open={peek} onOpenChange={setPeek} />
        )}
      </div>
    );
  }

  return (
    <div data-card>
      {/* The button can't live inside a link, so the photo link and the buttons are siblings. */}
      <div className="relative">
        <Link
          href={href}
          aria-hidden
          tabIndex={-1}
          className="relative block aspect-4/5 overflow-hidden rounded-2xl bg-ink/5"
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt=""
              fill
              quality={70}
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 45vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-turmeric/30">
              {art ? (
                <Image src={art} alt="" width={400} height={500} unoptimized className={`size-full object-contain p-3 ${product.id.charCodeAt(1) % 2 ? "-scale-x-100" : ""}`} />
              ) : (
                <Flame aria-hidden className="size-14 text-turmeric" />
              )}
            </div>
          )}
        </Link>
        {nonVeg !== undefined && <DietDot nonVeg={nonVeg} className="pointer-events-none absolute left-2 top-2" />}
        {base && (
          <>
            <button
              type="button"
              onClick={() => setPeek(true)}
              aria-label={`Quick view ${product.name}`}
              className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-full text-white active:scale-90"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-ink/45 backdrop-blur-sm">
                <Eye className="size-4" />
              </span>
            </button>
            <QuickAdd
              productId={product.id}
              productName={product.name}
              productImageUrl={product.image_url}
              variant={base}
              className="absolute bottom-2 right-2"
            />
          </>
        )}
      </div>

      <Link href={href} className="mt-3 block">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 font-display font-bold leading-tight text-ink">{product.name}</p>
          {base && <p className="shrink-0 font-bold tabular-nums text-brand-deep">₹{base.price}</p>}
        </div>
        {base && <p className="text-sm tabular-nums text-ink/70">{base.weight}</p>}
        {base && per100 !== null && <p className="text-sm tabular-nums text-ink/70">₹{per100} / 100g</p>}
      </Link>

      {peek && base && (
        <QuickView
          product={product}
          nonVeg={nonVeg}
          art={art}
          selectedId={base.id}
          onSelect={setSelectedId}
          open={peek}
          onOpenChange={setPeek}
        />
      )}
    </div>
  );
}
