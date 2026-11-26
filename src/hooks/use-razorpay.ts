"use client";

import { useState, useEffect, useRef } from "react";
import type { RazorpayPaymentResponse } from "@/types/razorpay";

export type PaymentState =
  | { status: "idle" }
  | { status: "open"; orderId: string; razorpayOrderId: string; amount: number; phone: string }
  | { status: "cancelled"; orderId: string; razorpayOrderId: string; amount: number; phone: string }
  | { status: "verifying" };

interface UseRazorpayReturn {
  paymentState: PaymentState;
  setPaymentState: (state: PaymentState) => void;
  scriptError: boolean;
  openRazorpay: (
    orderId: string,
    razorpayOrderId: string,
    amount: number,
    phone: string,
    onSuccess: (response: RazorpayPaymentResponse) => void
  ) => void;
}

export function useRazorpay(): UseRazorpayReturn {
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: "idle" });
  const [scriptError, setScriptError] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => setScriptError(true);
    document.head.appendChild(script);
  }, []);

  function openRazorpay(
    orderId: string,
    razorpayOrderId: string,
    amount: number,
    phone: string,
    onSuccess: (response: RazorpayPaymentResponse) => void
  ) {
    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      order_id: razorpayOrderId,
      name: "Foodlogin",
      description: "Your homemade order",
      prefill: { contact: phone },
      theme: { color: "#C2410C" },
      handler: onSuccess,
      modal: {
        ondismiss: () =>
          setPaymentState({ status: "cancelled", orderId, razorpayOrderId, amount, phone }),
      },
    });
    rzp.open();
  }

  return { paymentState, setPaymentState, scriptError, openRazorpay };
}
