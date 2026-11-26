import type { CartItem } from "@/store/cart";
import { DELIVERY_CHARGE } from "@/lib/delivery";

/** wa.me link with the cart pre-written, for customers who'd rather order by chat than pay online. */
export function whatsappOrderUrl(items: CartItem[]): string {
  const lines = items.map((i) => `• ${i.productName} ${i.variantWeight} × ${i.quantity} = ₹${i.price * i.quantity}`);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const text = `Hi Foodlogin, I'd like to order:\n${lines.join("\n")}\nSubtotal ₹${subtotal} + ₹${DELIVERY_CHARGE} delivery = ₹${subtotal + DELIVERY_CHARGE}`;
  return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
