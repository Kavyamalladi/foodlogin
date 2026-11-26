import { INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/social";

/** Organization + WebSite JSON-LD for rich results eligibility. */
export function SiteJsonLd() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://foodlogin.vercel.app");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Foodlogin",
        url: base,
      },
      {
        "@type": "Organization",
        name: "Foodlogin",
        url: base,
        logo: `${base}/foodlogin.webp`,
        sameAs: [INSTAGRAM_URL, YOUTUBE_URL],
      },
    ],
  };
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {JSON.stringify(data)}
    </script>
  );
}
