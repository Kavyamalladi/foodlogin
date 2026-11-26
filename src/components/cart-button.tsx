"use client";

import { m } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";

const cls = "relative inline-flex items-center justify-center size-11 rounded-lg hover:bg-muted transition-colors";

/** Opens the cart drawer from every page (there is no separate cart page). */
export function CartButton() {
  const items = useCartStore((state) => state.items);
  const bump = useCartUi((s) => s.bump);
  const setOpen = useCartUi((s) => s.setOpen);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const label = totalCount > 0 ? `Cart, ${totalCount} items` : "Cart";

  const inner = (
    // key restarts the spring each time an item lands in the cart
    <m.span
      key={bump}
      data-cart-icon
      initial={bump === 0 ? false : { scale: 1.35 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className="relative flex size-full items-center justify-center"
    >
      <ShoppingCart className="size-5" />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-brand text-xs font-bold tabular-nums text-white">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </m.span>
  );

  return (
    <button type="button" aria-label={label} onClick={() => setOpen(true)} className={cls}>
      {inner}
    </button>
  );
}
