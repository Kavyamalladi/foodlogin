import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Foodlogin collects, uses, and protects your personal information when you place an order.",
};

const sections = [
  {
    title: "Introduction",
    content:
      "At Foodlogin (foodlog.in), your privacy matters to us. This Privacy Policy explains what information we collect when you place an order, how we use it, and how we keep it safe. We are a homemade food business based in Anantapur, Andhra Pradesh, selling pickles, sweets, snacks, and podis.",
  },
  {
    title: "Information We Collect",
    content: [
      "Your name — to label and ship your order.",
      "Your phone number — to send order updates via WhatsApp.",
      "Your delivery address — to ship your order to you.",
    ],
  },
  {
    title: "Information We Do Not Collect",
    content: [
      "We do not require you to create an account or log in.",
      "We do not collect your email address.",
      "We do not store any payment details (credit card, debit card, UPI, or net banking information). All payments are processed securely through Razorpay, and we never have access to your card or bank details.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To process and deliver your order.",
      "To send you order status updates via WhatsApp.",
      "To contact you if there is an issue with your order.",
    ],
  },
  {
    title: "Local Storage",
    content:
      "Your cart items and delivery address are stored locally in your browser (localStorage) for your convenience. This data never leaves your device and is not sent to our servers unless you place an order. You can clear this data at any time by clearing your browser storage.",
  },
  {
    title: "Payment Security",
    content:
      "All payments are handled by Razorpay, a PCI-DSS compliant payment gateway. We never see, store, or have access to your card numbers, UPI IDs, or banking credentials. For more information, refer to Razorpay's privacy policy at razorpay.com.",
  },
  {
    title: "Data Sharing",
    content:
      "We do not sell, trade, or share your personal information with any third parties, except as necessary to fulfill your order (e.g., sharing your address with our delivery partner).",
  },
  {
    title: "Data Retention",
    content:
      "We retain your order details (name, phone, address) only as long as needed to process and deliver your order, and for any applicable legal or accounting requirements.",
  },
  {
    title: "Your Rights",
    content:
      "You may contact us at foodlogin8@gmail.com to request access to, correction of, or deletion of your personal information associated with any order.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please email us at foodlogin8@gmail.com.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="3 April 2026"
      sections={sections}
    />
  );
}
