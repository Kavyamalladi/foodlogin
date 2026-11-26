import { adminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatus } from "@/lib/supabase/types";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { CopyableId } from "@/components/admin/copyable-id";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/actions/admin";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  preparing: "Preparing",
  delivered: "Delivered",
  expired: "Expired",
};

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  expired: "bg-red-100 text-red-800 border-red-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const FALLBACK_IMAGE = "/foodlogin.webp";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const { data: order } = await adminClient
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (!order) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
  const customerOrderUrl = baseUrl
    ? `${baseUrl}/order/${orderId}`
    : `/order/${orderId}`;

  const status = order.status as OrderStatus;
  const items = order.order_items as Array<{
    id: string;
    product_name: string;
    variant_weight: string;
    quantity: number;
    price: number;
    product_image_url: string | null;
  }>;

  const hasAction = status === "paid" || status === "preparing";

  const updateToPreparingAction = updateOrderStatus.bind(null, {
    orderId,
    status: "preparing",
  });
  const updateToDeliveredAction = updateOrderStatus.bind(null, {
    orderId,
    status: "delivered",
  });

const message = `Hi ${order.name},\n\nYour order is confirmed and we are getting it ready for you.\n\nTrack your order here:\n${customerOrderUrl}\n\nThank you for ordering with us!`;

const waText = encodeURIComponent(message);

  return (
    <main
      className={`max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-4 ${hasAction ? "pb-44 sm:pb-36" : ""}`}
    >
      {/* Back button */}
      <Link
        href={`${ADMIN_BASE_PATH}/orders`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Orders
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-[#0f172a]">{order.name}</h1>
        <Badge className={STATUS_BADGE_CLASS[status]}>
          {STATUS_LABELS[status]}
        </Badge>
      </div>

      {/* Customer info */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Customer</p>
        <div className="space-y-3">
          <a
            href={`https://wa.me/${order.phone}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f172a] group-hover:text-green-600 transition-colors">
                {order.phone}
              </p>
              <p className="text-xs text-muted-foreground">Tap to WhatsApp</p>
            </div>
          </a>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F9F4F0] border border-[#E8D8CC] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-brand" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">Delivery address</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{order.address}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-1 border-t border-[#E8D8CC]">
          {formatDate(order.created_at)}
        </p>
      </div>

      {/* Order items */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8D8CC]">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Items</p>
        </div>
        <div className="divide-y divide-[#E8D8CC]">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-4">
              <img
                src={item.product_image_url ?? FALLBACK_IMAGE}
                alt={item.product_name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#0f172a] truncate">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">{item.variant_weight} × {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm text-[#0f172a] shrink-0">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-4 bg-white space-y-2 border-t border-[#E8D8CC]">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span>₹{order.delivery_charge}</span>
          </div>
          <Separator className="bg-[#E8D8CC]" />
          <div className="flex justify-between font-bold text-[#0f172a]">
            <span>Total</span>
            <span className="text-brand">₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">References</p>
        <CopyableId label="Order ID" value={orderId} />
        {order.razorpay_order_id && (
          <CopyableId label="Razorpay Order ID" value={order.razorpay_order_id} />
        )}
        {order.razorpay_payment_id && (
          <CopyableId label="Razorpay Payment ID" value={order.razorpay_payment_id} />
        )}
      </div>

      {/* Sticky action bar */}
      {status === "paid" && (
        <div className="fixed bottom-18 left-0 right-0 sm:bottom-0 p-4 bg-white border-t border-[#E8D8CC] shadow-lg z-50">
          <div className="max-w-2xl mx-auto">
            <form action={updateToPreparingAction}>
              <Button
                type="submit"
                className="w-full h-14 text-base font-bold rounded-2xl bg-orange-500 hover:bg-orange-600 text-white"
              >
                Start Preparing →
              </Button>
            </form>
          </div>
        </div>
      )}
      {status === "preparing" && (
        <div className="fixed bottom-18 left-0 right-0 sm:bottom-0 p-4 bg-white border-t border-[#E8D8CC] shadow-lg z-50">
          <div className="max-w-2xl mx-auto">
            <form action={updateToDeliveredAction}>
              <Button
                type="submit"
                className="w-full h-14 text-base font-bold rounded-2xl bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Delivered ✓
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
