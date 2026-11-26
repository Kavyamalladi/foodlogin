import Link from "next/link";
import Image from "next/image";
import { CartButton } from "./cart-button";
import { SiteSearch } from "./site-search";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-bone/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-1.5 font-display text-xl font-extrabold tracking-tight text-brand">
          <Image src="/logo.png" alt="" width={40} height={40} className="size-9 rounded-full" />
          Foodlogin
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/shop" className="px-3 py-3 text-sm font-bold text-ink hover:text-brand">
            Shop
          </Link>
          <Link href="/#our-story" className="hidden px-3 py-3 text-sm font-bold text-ink hover:text-brand sm:block">
            Our Story
          </Link>
          <SiteSearch />
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
