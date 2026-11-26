import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for placing orders on Foodlogin, including our no refund and no cancellation policy.",
};

const sections = [
  {
    title: "Overview",
    content:
      "These Terms & Conditions govern your use of the Foodlogin website (foodlog.in) and any orders you place through it. By placing an order, you agree to be bound by these terms. Foodlogin is a homemade food business based in Anantapur, Andhra Pradesh.",
  },
  {
    title: "Products",
    content: [
      "All products listed on Foodlogin — including pickles, sweets, snacks, and podis — are handmade to order using traditional recipes.",
      "Product images are for illustration purposes. Actual products may vary slightly in appearance.",
      "We reserve the right to update product listings, prices, and availability at any time without prior notice.",
    ],
  },
  {
    title: "Orders & Payments",
    content: [
      "All orders are placed through our website and payments are processed securely via Razorpay.",
      "We accept UPI, credit cards, debit cards, net banking, and other methods supported by Razorpay.",
      "An order is confirmed only after successful payment. You will receive order updates via WhatsApp on the phone number you provide.",
      "We do not store any payment or banking details. All payment data is handled entirely by Razorpay.",
    ],
  },
  {
    title: "Pricing & Delivery Charges",
    content: [
      "All prices listed on the website are in Indian Rupees (₹) and are inclusive of applicable taxes.",
      "A flat delivery charge of ₹100 applies to all orders, regardless of order value or delivery location.",
    ],
  },
  {
    title: "No Cancellations",
    content:
      "Once an order is placed and payment is confirmed, it cannot be cancelled. Since all our products are made fresh to order specifically for you, we are unable to accept cancellations under any circumstances. Please review your order carefully before completing payment.",
  },
  {
    title: "No Refunds or Returns",
    content:
      "All sales are final. We do not offer refunds, returns, or exchanges on any orders. Because our products are handmade, perishable, and prepared specifically for each order, we cannot accept returns. If you receive a damaged or incorrect item, please contact us at foodlogin8@gmail.com within 24 hours of delivery with photos, and we will do our best to resolve the issue.",
  },
  {
    title: "Delivery",
    content: [
      "We deliver across India. Delivery timelines may vary depending on your location and product preparation time.",
      "We are not responsible for delays caused by courier services, weather conditions, or circumstances beyond our control.",
      "Please ensure your delivery address and phone number are accurate. We are not responsible for failed deliveries due to incorrect information.",
    ],
  },
  {
    title: "Account & Privacy",
    content:
      "Foodlogin does not require you to create an account. Orders are placed anonymously with only your name, phone number, and address. For more details on how we handle your information, please refer to our Privacy Policy.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content on foodlog.in — including text, images, logos, and design — is the property of Foodlogin and may not be reproduced without written permission.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Foodlogin shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or the consumption of our products. Our total liability is limited to the amount paid for the specific order in question.",
  },
  {
    title: "Changes to These Terms",
    content:
      "We reserve the right to modify these Terms & Conditions at any time. Changes will take effect immediately upon being posted on this page. Continued use of the website after any changes constitutes acceptance of the revised terms.",
  },
  {
    title: "Contact Us",
    content:
      "For any questions regarding these terms, please reach out to us at foodlogin8@gmail.com.",
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      lastUpdated="3 April 2026"
      sections={sections}
    />
  );
}
