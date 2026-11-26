"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { CartAddOns } from "@/components/cart/cart-add-ons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { DELIVERY_CHARGE } from "@/lib/delivery";
import { foodArt } from "@/lib/food-art";
import { whatsappOrderUrl } from "@/lib/whatsapp-order";
import { useCartStore } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";

/** Slide-over cart (full-width on phones). Quantity changes are local, so they're instant. */
export function CartDrawer() {
  const open = useCartUi((s) => s.open);
  const setOpen = useCartUi((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-bone p-0 [--brand:var(--brand-deep)] sm:max-w-md [&>button.absolute]:right-2 [&>button.absolute]:top-3 [&>button.absolute]:flex [&>button.absolute]:size-11 [&>button.absolute]:items-center [&>button.absolute]:justify-center"
      >
        <div className="border-b border-ink/10 px-4 py-4">
          <SheetTitle className="font-display text-2xl font-extrabold text-ink">
            Your cart{count > 0 && <span className="tabular-nums"> ({count})</span>}
          </SheetTitle>
          <SheetDescription className="sr-only">Review your items, then check out. No account needed.</SheetDescription>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-2xl font-extrabold text-ink">Your cart is empty</p>
            <p className="max-w-xs text-ink/70">Pick a jar or two and they&apos;ll show up here.</p>
            <Button asChild variant="custom" className="h-14 px-8 text-base">
              <Link href="/shop" onClick={close}>Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4">
              <ul className="divide-y divide-ink/10">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-3 py-4 first:pt-0">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-turmeric">
                      {item.productImageUrl ? (
                        <Image src={item.productImageUrl} alt={item.productName} fill sizes="80px" className="object-cover" />
                      ) : foodArt(undefined, item.productName) ? (
                        <Image src={foodArt(undefined, item.productName)!} alt="" fill unoptimized sizes="80px" className="object-contain p-1" />
                      ) : (
                        <Flame aria-hidden className="absolute inset-0 m-auto size-8 text-bone/80" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-display font-bold leading-tight text-ink">{item.productName}</p>
                          <p className="text-sm tabular-nums text-ink/70">{item.variantWeight}{item.quantity > 1 && ` · ₹${item.price} each`}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          aria-label={`Remove ${item.productName} from cart`}
                          className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink/60 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink/15 bg-white">
                          <button
                            onClick={() => decrementItem(item.variantId)}
                            aria-label={`Decrease ${item.productName}`}
                            className="flex size-11 items-center justify-center rounded-full text-brand active:scale-90"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="w-6 text-center font-bold tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => incrementItem(item.variantId)}
                            aria-label={`Increase ${item.productName}`}
                            className="flex size-11 items-center justify-center rounded-full text-brand active:scale-90"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <span className="text-lg font-extrabold tabular-nums text-ink">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {items.length < 4 && <CartAddOns />}
            </div>

            <div className="border-t border-ink/10 bg-bone px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <p className="flex justify-between text-sm text-ink/70">
                <span>Subtotal <span className="tabular-nums text-ink">₹{subtotal}</span></span>
                <span>+ ₹{DELIVERY_CHARGE} delivery per order</span>
              </p>
              <Button asChild variant="custom" className="mt-3 h-14 w-full gap-2 text-base">
                <Link href="/checkout" onClick={close}>
                  Checkout · <span className="tabular-nums">₹{subtotal + DELIVERY_CHARGE}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <a
                href={whatsappOrderUrl(items)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex min-h-11 items-center justify-center gap-1.5 text-sm font-bold text-ink/70 hover:text-brand"
              >
                <MessageCircle className="size-4" />
                Order on WhatsApp instead
              </a>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
