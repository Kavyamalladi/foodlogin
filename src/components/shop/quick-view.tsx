"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, ShoppingCart } from "lucide-react";
import { DietDot } from "@/components/diet-dot";
import { flyToCart } from "@/components/motion/fly-to-cart";
import { SizePicker } from "@/components/shop/size-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { parseDescription } from "@/lib/description";
import { pricePer100g } from "@/lib/unit-price";
import { useCartStore } from "@/store/cart";

type Variant = { id: string; weight: string; price: number };

export type QuickViewProduct = {
  id: string;
  name: string;
  image_url: string | null;
  description?: string | null;
  variants: Variant[];
};

/** Zero-reload product peek: bottom sheet on phones, centred modal on desktop. */
export function QuickView({
  product,
  nonVeg,
  art,
  selectedId,
  onSelect,
  open,
  onOpenChange,
}: {
  product: QuickViewProduct;
  nonVeg?: boolean;
  /** Illustration shown when the product has no photo. */
  art?: string | null;
  selectedId: string;
  onSelect: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const variant = product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
  const inCart = useCartStore((s) => s.items.find((i) => i.variantId === variant.id)?.quantity ?? 0);
  const addItem = useCartStore((s) => s.addItem);
  const per100 = pricePer100g(variant.weight, variant.price);
  const blurb = parseDescription(product.description).paragraphs[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] gap-0 overflow-y-auto bg-bone p-0 [--brand:var(--brand-deep)] sm:max-w-md [&>button.absolute]:right-3 [&>button.absolute]:top-3 [&>button.absolute]:flex [&>button.absolute]:size-11 [&>button.absolute]:items-center [&>button.absolute]:justify-center [&>button.absolute]:rounded-full [&>button.absolute]:bg-bone [&>button.absolute]:text-ink [&>button.absolute]:opacity-100">
        <div className="relative aspect-square bg-turmeric">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill sizes="(min-width: 640px) 448px, 100vw" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-turmeric/30">
              {art ? (
                <Image src={art} alt={product.name} width={400} height={500} unoptimized className="size-full object-contain p-6" />
              ) : (
                <Flame aria-hidden className="size-20 text-turmeric" />
              )}
            </div>
          )}
        </div>
        <div className="space-y-4 p-5">
          <div>
            {nonVeg !== undefined && <DietDot nonVeg={nonVeg} label className="mb-2" />}
            <DialogTitle className="font-display text-3xl font-extrabold leading-none tracking-tight text-ink">
              {product.name}
            </DialogTitle>
            <DialogDescription className={blurb ? "mt-2 leading-relaxed text-ink/70" : "sr-only"}>
              {blurb || `${product.name}, made to order in Anantapur.`}
            </DialogDescription>
          </div>

          <SizePicker variants={product.variants} selectedId={variant.id} onSelect={onSelect} label="Choose size" />

          <p className="text-3xl font-extrabold tabular-nums text-brand">
            ₹{variant.price}
            {per100 !== null && <span className="ml-2 font-sans text-sm font-semibold text-ink/70">₹{per100} / 100g</span>}
          </p>

          <Button
            variant="custom"
            className="h-14 w-full text-base"
            onClick={(e) => {
              flyToCart(e.currentTarget.getBoundingClientRect(), product.image_url);
              addItem({
                productId: product.id,
                variantId: variant.id,
                productName: product.name,
                variantWeight: variant.weight,
                productImageUrl: product.image_url,
                price: variant.price,
              });
            }}
          >
            <ShoppingCart className="mr-2 size-5" />
            {inCart > 0 ? `Add another (${inCart} in cart)` : "Add to cart"}
          </Button>
          <Link
            href={`/products/${product.id}`}
            className="flex min-h-11 items-center justify-center text-sm font-bold text-ink/70 hover:text-brand"
          >
            See full details
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
