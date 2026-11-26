import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Cancellations and Returns",
  description: "Foodlogin's cancellation, refund and damaged-order policy, in plain words.",
};

const sections = [
  {
    title: "Cancellations",
    content:
      "Every order is made fresh for you after payment, so it cannot be cancelled once payment is confirmed. Please check your cart and address before you pay.",
  },
  {
    title: "Refunds, returns and exchanges",
    content:
      "Because our food is handmade, perishable and made to order, we do not offer refunds, returns or exchanges. All sales are final.",
  },
  {
    title: "If your order arrives damaged or wrong",
    content: [
      "Contact us within 24 hours of delivery.",
      "Send photos of the issue and your order details, on WhatsApp or by email.",
      "We will review your case and do our best to resolve it.",
    ],
  },
  {
    title: "Contact",
    content: "Message or call us from the Contact page, or email foodlogin8@gmail.com.",
  },
];

export default function ReturnsPage() {
  return <LegalLayout title="Cancellations and Returns" lastUpdated="20 November 2026" sections={sections} />;
}
