import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";
import { getCategories } from "@/actions/products";

import { ADDRESS_SHORT, STORE_HOURS } from "@/lib/location";
import { INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/social";

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/returns", label: "Cancellations & Returns" },
];

export async function SiteFooter() {
  const categories = await getCategories();
  const waDigits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const wa = `https://wa.me/${waDigits}`;
  // 916301972788 -> +91 63019 72788 (falls back to the raw digits for other formats)
  const waLabel = /^91\d{10}$/.test(waDigits) ? `+91 ${waDigits.slice(2, 7)} ${waDigits.slice(7)}` : waDigits ? `+${waDigits}` : "";
  const fssai = process.env.NEXT_PUBLIC_FSSAI_NUMBER;
  const link = "block py-3 hover:text-turmeric sm:py-1.5";
  // On phones the category links become a wrapped row of pills (3 rows instead of 7 stacked links).
  const pill = "inline-flex min-h-11 items-center rounded-full bg-bone/10 px-4 hover:bg-turmeric hover:text-ink sm:block sm:min-h-0 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-1.5 sm:hover:bg-transparent sm:hover:text-turmeric";

  return (
    <footer className="mt-16 [main:has(#closing-cta)+&]:mt-0 [main:has(#closing-cta)+&]:bg-brand">
      <div className="scallop-top" />
      <div className="bg-oxblood px-4 pb-6 pt-6 text-bone sm:px-6 sm:pb-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 sm:gap-10 lg:grid-cols-[1.1fr_1.6fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-2 sm:col-span-1 sm:gap-3">
            <span className="flex items-center gap-1.5 font-display text-2xl font-extrabold text-turmeric">
              <Image src="/logo.png" alt="" width={44} height={44} className="size-11 rounded-full" /> Foodlogin
            </span>
            <p className="max-w-xs text-sm text-bone/70">
              Handmade Rayalaseema food from Anantapur, made to order and delivered fresh.
            </p>
            <p className="text-sm text-bone/85"><span className="font-bold">{ADDRESS_SHORT}</span><br />{STORE_HOURS}</p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h2 className="mb-2 font-display font-bold text-turmeric sm:mb-3">Shop</h2>
            <ul className="flex flex-wrap gap-2 text-sm sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0">
              <li><Link href="/shop" className={pill}>All products</Link></li>
              {categories.map((c) => (
                <li key={c.id}><Link href={`/shop/${c.slug}`} className={pill}>{c.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-1 font-display font-bold text-turmeric sm:mb-3">Help</h2>
            <ul className="flex flex-col text-sm">
              <li><Link href="/track" className={link}>Track order</Link></li>
              <li><Link href="/about" className={link}>About</Link></li>
              <li><Link href="/contact" className={link}>Contact</Link></li>
              <li><Link href="/faq" className={link}>FAQ</Link></li>
              {waDigits && <li><a href={`tel:+${waDigits}`} className={link}>Call us</a></li>}
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className={link}>WhatsApp{waLabel && <span className="block text-bone/70 sm:inline sm:before:content-['_·_']">{waLabel}</span>}</a></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-1 font-display font-bold text-turmeric sm:mb-3">Legal</h2>
            <ul className="flex flex-col text-sm">
              {LEGAL.map((l) => (
                <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl space-y-1 sm:mt-10 sm:space-y-2 border-t border-bone/15 pt-6 text-sm text-bone/70">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            {fssai && <span>FSSAI Lic. No. {fssai}</span>}
            <span>Secure payments by Razorpay: UPI, cards and net banking</span>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Foodlogin on Instagram" className="flex min-h-11 items-center gap-1.5 hover:text-turmeric">
              <Instagram className="size-4" /> Instagram
            </a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="Foodlogin on YouTube" className="flex min-h-11 items-center gap-1.5 hover:text-turmeric">
              <Youtube className="size-4" /> YouTube
            </a>
          </div>
          <p>
            © {new Date().getFullYear()} Foodlogin. All rights reserved.{" "}
            <a href="https://psydevx.app" target="_blank" rel="noopener noreferrer" className="text-bone/60 underline underline-offset-2 hover:text-turmeric">
              Made by PsyDevX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
