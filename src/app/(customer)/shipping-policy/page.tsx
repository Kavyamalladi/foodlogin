import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "Learn about Foodlogin's shipping process, delivery charges, timelines, and what to do if you have a delivery issue.",
};

const sections = [
  {
    title: "Overview",
    content:
      "Foodlogin ships handmade pickles, sweets, snacks, and podis from Anantapur, Andhra Pradesh to locations across India. All products are made fresh to order, so please allow adequate preparation and shipping time.",
  },
  {
    title: "Delivery Charges",
    content:
      "A flat delivery fee of ₹100 is applied to all orders, regardless of order size or delivery destination within India.",
  },
  {
    title: "Processing Time",
    content:
      "Since every product is handmade to order, processing typically takes 2–4 business days before your order is dispatched. You will receive updates on your order status via WhatsApp.",
  },
  {
    title: "Shipping & Delivery Time",
    content: [
      "Once dispatched, delivery usually takes 3–7 business days depending on your location.",
      "Remote areas may take slightly longer.",
      "We use trusted courier partners to ensure your order reaches you safely.",
    ],
  },
  {
    title: "Order Tracking",
    content:
      "Once your order is dispatched, you can track your order status on the order confirmation page. We may also reach out via WhatsApp if needed.",
  },
  {
    title: "Packaging",
    content:
      "All products are carefully packaged to prevent damage and spillage during transit. We use food-safe, tamper-evident packaging to ensure your order arrives fresh and intact.",
  },
  {
    title: "Delivery Issues",
    content:
      "If your order arrives damaged, opened, or with missing items, please contact us at foodlogin8@gmail.com within 24 hours of delivery with photos of the issue. We will review your case and do our best to resolve it.",
  },
  {
    title: "Incorrect Address",
    content:
      "Please double-check your delivery address before placing an order. We are not responsible for orders delivered to an incorrect address provided by the customer. Re-shipping charges may apply for re-delivery.",
  },
  {
    title: "No Cancellations or Refunds on Shipped Orders",
    content:
      "Once an order has been placed and payment is confirmed, it cannot be cancelled or refunded. Please review your order carefully before completing payment. For full details, see our Terms & Conditions.",
  },
  {
    title: "Contact Us",
    content:
      "For any shipping or delivery-related queries, please email us at foodlogin8@gmail.com or reach out via WhatsApp.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title="Shipping & Delivery Policy"
      lastUpdated="3 April 2026"
      sections={sections}
    />
  );
}
