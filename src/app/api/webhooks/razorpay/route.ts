import crypto from "crypto";
import { adminClient } from "@/lib/supabase/admin";
import { errInfo, log } from "@/lib/log";

interface RazorpayPaymentEntity {
  id?: string | null;
  receipt?: string | null;
}

interface RazorpayWebhookPayload {
  event?: string;
  payload?: {
    payment?: {
      entity?: RazorpayPaymentEntity;
    };
  };
}

export async function POST(request: Request) {
  // Read raw body first — must happen before any parsing for signature verification
  let body: string;
  try {
    body = await request.text();
  } catch (err) {
    log.error("webhook_body_unreadable", errInfo(err));
    return new Response("Invalid body", { status: 400 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    log.warn("webhook_missing_signature");
    return new Response("Missing signature", { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  const expectedBuf = Buffer.from(expectedSignature, "hex");
  const givenBuf = Buffer.from(signature, "hex");
  // timingSafeEqual throws on unequal lengths, so compare length first.
  const signaturesMatch = expectedBuf.length === givenBuf.length && crypto.timingSafeEqual(expectedBuf, givenBuf);
  if (!signaturesMatch) {
    log.error("webhook_signature_mismatch");
    return new Response("Invalid signature", { status: 400 });
  }

  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(body) as RazorpayWebhookPayload;
  } catch (err) {
    log.error("webhook_invalid_json", errInfo(err));
    return new Response("Invalid payload", { status: 400 });
  }

  try {
    if (payload.event === "payment.captured") {
      const entity = payload.payload?.payment?.entity;
      const receipt = entity?.receipt;
      const razorpayPaymentId = entity?.id ?? null;

      const orderId =
        typeof receipt === "string" && /^[0-9a-f-]{36}$/i.test(receipt)
          ? receipt
          : null;

      if (orderId) {
        const { data: order, error } = await adminClient
          .from("orders")
          .select("id, status")
          .eq("id", orderId)
          .single();

        if (error) {
          // Money was captured but we can't find the order: needs a manual look.
          log.error("webhook_captured_order_not_found", { orderId, razorpayPaymentId, ...errInfo(error) });
        } else if (order?.status === "pending" || order?.status === "expired") {
          // expired too: an earlier failed attempt in the same popup may have expired it before a retry succeeded.
          const { error: updateError } = await adminClient
            .from("orders")
            .update({ status: "paid", razorpay_payment_id: razorpayPaymentId })
            .eq("id", orderId)
            .in("status", ["pending", "expired"]);

          if (updateError) {
            log.error("webhook_captured_update_failed", { orderId, razorpayPaymentId, ...errInfo(updateError) });
          } else {
            log.info("webhook_payment_captured", { orderId, razorpayPaymentId });
          }
        } else {
          log.info("webhook_captured_already_handled", { orderId, status: order?.status });
        }
      } else {
        log.error("webhook_captured_bad_receipt", { razorpayPaymentId, receipt });
      }
    } else if (payload.event === "payment.failed") {
      const entity = payload.payload?.payment?.entity;
      const receipt = entity?.receipt;

      const orderId =
        typeof receipt === "string" && /^[0-9a-f-]{36}$/i.test(receipt)
          ? receipt
          : null;

      if (orderId) {
        const { data: order, error } = await adminClient
          .from("orders")
          .select("id, status")
          .eq("id", orderId)
          .single();

        if (error) {
          log.error("webhook_failed_order_not_found", { orderId, ...errInfo(error) });
        } else if (order?.status === "pending") {
          const { error: updateError } = await adminClient
            .from("orders")
            .update({ status: "expired" })
            .eq("id", orderId);

          if (updateError) {
            log.error("webhook_failed_update_failed", { orderId, ...errInfo(updateError) });
          } else {
            log.warn("webhook_payment_failed", { orderId, paymentId: entity?.id });
          }
        }
      }
    } else {
      log.info("webhook_event_ignored", { event: payload.event });
    }
  } catch (err) {
    log.error("webhook_handler_error", errInfo(err));
    return new Response("Server error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
