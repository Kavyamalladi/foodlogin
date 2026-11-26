"use server";

import crypto from "crypto";
import { createPublicClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { customerSchema } from "@/lib/customer-schema";
import { errInfo, log } from "@/lib/log";

type OrderItem = {
  variantId: string;
  quantity: number;
};

type Customer = {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  pincode: string;
};

export async function createOrder({
  items,
  customer,
}: {
  items: OrderItem[];
  customer: Customer;
}): Promise<{ orderId: string; razorpayOrderId: string; amount: number }> {
  if (!items.length) throw new Error("Cart is empty");

  // Guard against absurd quantities
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      throw new Error("Invalid quantity — max 20 per item");
    }
  }

  const parsed = customerSchema.safeParse(customer);
  if (!parsed.success) {
    log.warn("order_validation_failed", { field: parsed.error.issues[0].path.join("."), message: parsed.error.issues[0].message });
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = createPublicClient();

  // Fetch variant prices + product snapshots from DB — never trust client prices
  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, price, weight, product_id, products(name, image_url)")
    .in("id", variantIds);

  if (variantsError || !variants?.length) {
    log.error("order_variants_fetch_failed", { variantCount: variantIds.length, ...errInfo(variantsError) });
    throw new Error("Failed to fetch product variants");
  }

  // Build a lookup map
  const variantMap = new Map(
    variants.map((v) => {
      const product = Array.isArray(v.products) ? v.products[0] : v.products;
      return [
        v.id,
        {
          price: v.price,
          weight: v.weight,
          productId: v.product_id,
          productName: product?.name ?? "Unknown",
          productImageUrl: product?.image_url ?? null,
        },
      ];
    })
  );

  // Calculate totals
  let subtotal = 0;
  for (const item of items) {
    const variant = variantMap.get(item.variantId);
    if (!variant) {
      log.warn("order_variant_missing", { variantId: item.variantId });
      throw new Error("Product no longer available");
    }
    subtotal += variant.price * item.quantity;
  }
  const deliveryCharge = Number(process.env.DELIVERY_CHARGE) || 100;
  const total = subtotal + deliveryCharge;

  if (total > 50000) throw new Error("Order total exceeds the maximum allowed (₹50,000)");

  // Build address string
  const addressParts = [customer.address1];
  if (customer.address2) addressParts.push(customer.address2);
  addressParts.push(`${customer.city} - ${customer.pincode}`);
  const address = addressParts.join(", ");

  // Generate orderId upfront so it can be sent as Razorpay receipt.
  // This lets the webhook resolve the order by receipt even though
  // Razorpay is called before the DB insert.
  const orderId = crypto.randomUUID();

  const isDemo = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("placeholder");

  let razorpayOrderId = "";

  if (isDemo) {
    razorpayOrderId = "order_demo_" + orderId.slice(0, 14);
  } else {
    // Create Razorpay order FIRST — if this fails, nothing is written to DB
    // and the customer can retry cleanly with no orphaned records.
    const credentials = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: total * 100,
        currency: "INR",
        receipt: orderId.slice(0, 40),
      }),
    });

    if (!razorpayRes.ok) {
      const detail = (await razorpayRes.text().catch(() => "")).slice(0, 300);
      log.error("razorpay_order_create_failed", { orderId, status: razorpayRes.status, detail, total });
      throw new Error("Payment setup failed. Please try again.");
    }

    const razorpayData = await razorpayRes.json();
    razorpayOrderId = razorpayData.id;
  }

  // Insert order with pre-generated id and razorpay_order_id already set
  const { error: orderError } = await adminClient
    .from("orders")
    .insert({
      id: orderId,
      name: customer.name,
      phone: customer.phone,
      address,
      subtotal,
      delivery_charge: deliveryCharge,
      total,
      status: isDemo ? ("paid" as const) : ("pending" as const),
      razorpay_order_id: razorpayOrderId,
    });

  if (orderError) {
    // Razorpay order exists but nothing is in our DB: a payment against it would have no order.
    log.error("order_insert_failed_after_razorpay", { orderId, razorpayOrderId, total, ...errInfo(orderError) });
    throw new Error("Failed to create order");
  }

  // Insert order items with product snapshots
  const orderItems = items.map((item) => {
    const variant = variantMap.get(item.variantId)!;
    return {
      order_id: orderId,
      product_id: variant.productId,
      variant_id: item.variantId,
      product_name: variant.productName,
      variant_weight: variant.weight,
      product_image_url: variant.productImageUrl,
      price: variant.price,
      quantity: item.quantity,
    };
  });

  const { error: itemsError } = await adminClient.from("order_items").insert(orderItems);
  if (itemsError) {
    // Order row exists without items.
    log.error("order_items_insert_failed", { orderId, razorpayOrderId, total, ...errInfo(itemsError) });
    throw new Error("Failed to create order items");
  }

  log.info("order_created", { orderId, razorpayOrderId, total, lines: items.length });
  return { orderId, razorpayOrderId, amount: total * 100 };
}

export async function verifyPayment({
  orderId,
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
}: {
  orderId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<{ success: true }> {
  if (razorpay_order_id?.startsWith("order_demo_")) {
    return { success: true };
  }
  const message = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(message)
    .digest("hex");

  const expectedBuf = Buffer.from(expectedSignature, "hex");
  const givenBuf = Buffer.from(razorpay_signature, "hex");
  // timingSafeEqual throws on unequal lengths, so compare length first.
  const signaturesMatch = expectedBuf.length === givenBuf.length && crypto.timingSafeEqual(expectedBuf, givenBuf);
  if (!signaturesMatch) {
    log.error("payment_verify_signature_mismatch", { orderId, razorpay_order_id, razorpay_payment_id });
    throw new Error("Payment verification failed");
  }

  // Bind payment to this order: only update if order is pending and owns this Razorpay order
  const { data: order, error: fetchError } = await adminClient
    .from("orders")
    .select("id, status, razorpay_order_id")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    log.error("payment_verify_order_not_found", { orderId, razorpay_payment_id, ...errInfo(fetchError) });
    throw new Error("Order not found");
  }
  if (order.razorpay_order_id !== razorpay_order_id) {
    log.error("payment_verify_order_mismatch", { orderId, razorpay_order_id, razorpay_payment_id });
    throw new Error("Payment does not match this order");
  }
  if (order.status === "paid" || order.status === "preparing" || order.status === "delivered") {
    // The webhook got there first (common). The signature above is valid and the order matches, so this is a success.
    log.info("payment_verify_already_processed", { orderId, status: order.status });
    return { success: true };
  }

  // pending, or expired: Razorpay's popup lets the customer retry after a failed attempt, and that earlier failure
  // may already have expired the order. A verified payment is real money, so it wins.
  const { data: updated, error } = await adminClient
    .from("orders")
    .update({ status: "paid", razorpay_payment_id })
    .eq("id", orderId)
    .in("status", ["pending", "expired"])
    .select("id");

  if (error) {
    log.error("payment_verify_update_failed", { orderId, razorpay_payment_id, ...errInfo(error) });
    throw new Error("Failed to update order status");
  }

  // Zero rows means the webhook updated it between our read and write: still a success.
  log.info("payment_verified", { orderId, razorpay_payment_id, updated: updated?.length ?? 0 });
  return { success: true };
}
