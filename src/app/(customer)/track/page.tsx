import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { TrackClient } from "./track-client";

export const metadata: Metadata = {
  title: "Track your order",
  description: "See where your Foodlogin order is.",
  robots: { index: false, follow: true },
};

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-bone px-4 pb-16 pt-3 sm:px-6 sm:pt-6">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Track order" }]} />
        <h1 className="mt-2 font-display text-4xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-5xl">Track your order</h1>
        <p className="mt-3 text-ink/70">Orders placed on this phone show up below. On a different phone, enter your mobile number.</p>
        <TrackClient />
      </div>
    </main>
  );
}
