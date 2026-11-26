"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary, OrderSummaryCompact, PayBar } from "@/components/checkout/order-summary";
import { useCartStore } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";
import { useRazorpay } from "@/hooks/use-razorpay";
import { createOrder, verifyPayment } from "@/actions/orders";
import { CHECKOUT_RESET_AFTER_ORDER_EXPIRED_KEY } from "@/lib/checkout-expiry-sync";
import { customerSchema } from "@/lib/customer-schema";
import { rememberOrder } from "@/lib/my-orders";
import type { CustomerInput } from "@/lib/customer-schema";

type FormValues = CustomerInput;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [serverError, setServerError] = useState<string | null>(null);
  const { paymentState, setPaymentState, scriptError, openRazorpay } = useRazorpay();

  useEffect(() => {
    function resetPaymentUiFromOrderExpiry() {
      try {
        if (sessionStorage.getItem(CHECKOUT_RESET_AFTER_ORDER_EXPIRED_KEY)) {
          sessionStorage.removeItem(CHECKOUT_RESET_AFTER_ORDER_EXPIRED_KEY);
          setPaymentState({ status: "idle" });
        }
      } catch {
        /* ignore */
      }
    }
    resetPaymentUiFromOrderExpiry();
    function onStorage(e: StorageEvent) {
      if (e.key !== CHECKOUT_RESET_AFTER_ORDER_EXPIRED_KEY || e.newValue !== "1") return;
      setPaymentState({ status: "idle" });
      try {
        sessionStorage.removeItem(CHECKOUT_RESET_AFTER_ORDER_EXPIRED_KEY);
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [setPaymentState]);

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(customerSchema),
    defaultValues: { name: "", phone: "", address1: "", address2: "", city: "", pincode: "" },
  });

  const isDemo =
    !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes("placeholder");

  const isPaymentBusy =
    paymentState.status === "open" ||
    paymentState.status === "verifying" ||
    form.formState.isSubmitting ||
    (!isDemo && scriptError);

  function handlePaymentSuccess(orderId: string) {
    return async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
      setPaymentState({ status: "verifying" });
      try {
        await verifyPayment({
          orderId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      } catch {
        // Razorpay only calls this handler after a successful payment, and the webhook marks the order paid on its
        // own. Never show an error or keep the cart here: the customer has paid and must not pay twice. The order
        // page shows "Confirming your payment" and updates by itself.
      }
      clearCart();
      router.push(`/order/${orderId}`);
    };
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const { orderId, razorpayOrderId, amount } = await createOrder({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        customer: values,
      });
      rememberOrder(orderId); // so /track can find it on this device even if the tab closes mid-payment
      if (razorpayOrderId.startsWith("order_demo_")) {
        clearCart();
        router.push(`/order/${orderId}`);
        return;
      }
      setPaymentState({ status: "open", orderId, razorpayOrderId, amount, phone: values.phone });
      openRazorpay(orderId, razorpayOrderId, amount, values.phone, handlePaymentSuccess(orderId));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (items.length === 0 && paymentState.status === "idle") {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-3 font-display text-4xl font-extrabold text-ink">Your cart is empty</h1>
          <p className="mb-6 text-sm text-ink/70">
            Add some delicious items to your cart before proceeding to checkout.
          </p>
          <Button asChild variant="custom" className="px-8 h-14">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone pb-28 lg:pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6 sm:pt-6">
        {/* Breadcrumb */}
        <div className="mb-2 sm:mb-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Checkout" },
            ]}
          />
        </div>

        {/* Page heading */}
        <div className="mb-4 sm:mb-5">
          <h1 className="font-display text-4xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-5xl">Checkout</h1>
          <p className="mt-2 hidden text-ink/70 sm:block">Two quick steps, then pay.</p>
        </div>

        <div className="mb-5 lg:hidden">
          <OrderSummaryCompact items={items} />
        </div>

        {/* Status banners */}
        {paymentState.status === "cancelled" && (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive mb-3">Payment was cancelled.</p>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="custom"
                onClick={() =>
                  openRazorpay(
                    paymentState.orderId,
                    paymentState.razorpayOrderId,
                    paymentState.amount,
                    paymentState.phone,
                    handlePaymentSuccess(paymentState.orderId)
                  )
                }
              >
                Try again
              </Button>
              <Button size="sm" variant="outline" className="rounded-2xl" onClick={() => useCartUi.getState().setOpen(true)}>
                View cart
              </Button>
            </div>
          </div>
        )}

        {paymentState.status === "verifying" && (
          <div className="mb-6 rounded-2xl border bg-white p-4 text-center shadow-sm">
            <p className="text-sm text-ink/70">Verifying payment…</p>
          </div>
        )}

        {scriptError && (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              Payment system failed to load. Please check your internet connection and refresh the
              page.
            </p>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              control={form.control}
              onSubmit={form.handleSubmit(onSubmit)}
              serverError={serverError}
            />
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} paymentState={paymentState} isPaymentBusy={isPaymentBusy} />
          </div>
        </div>
      </div>
      <PayBar items={items} paymentState={paymentState} isPaymentBusy={isPaymentBusy} />
    </div>
  );
}
