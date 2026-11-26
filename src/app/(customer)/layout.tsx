import { CartDrawer } from "@/components/cart/cart-drawer";
import { FlyToCartHost } from "@/components/motion/fly-to-cart";
import { MotionProvider } from "@/components/motion/motion-provider";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // [--brand:…] = storefront-only deeper orange (white-on-orange 4.98:1); admin keeps #e9411c.
  return (
    <div className="grain bg-bone font-sans [--brand:var(--brand-deep)]">
      <MotionProvider>
      <AnnouncementBar />
      <Navbar />
      {children}
      <SiteFooter />
      <CartDrawer />
      <FlyToCartHost />
      </MotionProvider>
    </div>
  );
}
