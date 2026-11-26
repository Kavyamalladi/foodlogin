import type { Metadata } from "next";
import { Clock, Instagram, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { ADDRESS_SHORT, MAPS_URL, STORE_HOURS } from "@/lib/location";
import { INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Contact",
  description: "Message or call Foodlogin in Anantapur, Andhra Pradesh. Ask about a product, an order or what to pick.",
};

export default function ContactPage() {
  const digits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  return (
    <main className="px-4 pb-16 pt-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-6xl">Talk to us.</h1>
        <p className="mt-4 max-w-xl text-lg text-ink/75">
          Message or call us. Ask about a product, an order or what to pick.
        </p>
        <div className="mt-6 space-y-4">
        <div className="flex items-start gap-2">
          <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
          <p className="text-ink">
            <span className="font-bold">{ADDRESS_SHORT}</span>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-bold text-brand underline">Open in Google Maps</a>
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
          <p className="text-ink">
            <span className="font-bold">{STORE_HOURS}</span>
            <span className="block text-ink/75">Walk in and try our pickles before you buy.</span>
          </p>
        </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button variant="custom" className="h-14 px-8 text-lg" asChild>
            <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" /> WhatsApp
            </a>
          </Button>
          {digits && (
            <Button variant="outline" className="h-14 rounded-3xl px-6 text-base font-bold" asChild>
              <a href={`tel:+${digits}`}>
                <Phone className="size-5" /> Call us
              </a>
            </Button>
          )}
          <Button variant="outline" className="h-14 rounded-3xl px-6 text-base font-bold" asChild>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Instagram className="size-5" /> Instagram
            </a>
          </Button>
          <Button variant="outline" className="h-14 rounded-3xl px-6 text-base font-bold" asChild>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              <Youtube className="size-5" /> YouTube
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
