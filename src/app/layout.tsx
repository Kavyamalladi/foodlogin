import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Fraunces, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SiteJsonLd } from "@/components/site-json-ld";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#1c1917",
};

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://foodlogin.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Foodlogin — Homemade Pickles, Sweets & Podi",
    template: "%s | Foodlogin",
  },
  description:
    "Order fresh homemade pickles, sweets, and podi. Made with love, delivered to your door.",
};

const showVercelAnalytics =
  process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${jakarta.variable} ${geistMono.variable} ${fraunces.variable} antialiased min-w-[330px]`}
      >
        <noscript>
          <style>{`[data-reveal],[data-reveal]>*,[data-split]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <SiteJsonLd />
        {children}
        {showVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  );
}
