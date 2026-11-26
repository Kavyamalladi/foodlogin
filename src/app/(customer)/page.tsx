import { SansRupee } from "@/components/sans-rupee";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flame, Instagram, Youtube, MapPin, MessageCircle, Plus, Star } from "lucide-react";
import { getCategories, getProducts } from "@/actions/products";
import { Reveal, SplitReveal } from "@/components/motion";
import { isNonVegSlug } from "@/lib/diet";
import { ratingSummary } from "@/lib/reviews";
import { INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/social";
import { FAQ } from "@/lib/faq";
import { STORY } from "@/lib/story";
import { categoryArt, foodArt } from "@/lib/food-art";
import { ProductCard } from "@/components/product-card";
import { ReviewsSection } from "@/components/reviews-section";
import { Sticker } from "@/components/sticker";
import { Button } from "@/components/ui/button";

/** Cached catalog slice; admin mutations call revalidatePath. */
export const revalidate = 86400; // 24h

const TITLE = "Foodlogin — Homemade Rayalaseema Pickles, Sweets & Podi";
const DESCRIPTION =
  "Handmade Rayalaseema pickles, sweets, podi and snacks from Anantapur. Made to order with no preservatives. Ships in 2–4 days, ₹100 delivery per order.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [
      {
        url: "/foodlogin.webp",
        width: 1024,
        height: 1024,
        alt: "Foodlogin — Rayalaseema food from Anantapur",
      },
    ],
  },
};

const CLAIMS = ["Made to order", "No preservatives", "40+ family recipes", "Flat ₹100 delivery"];

const MAKING = [
  { art: "step-sun", title: "Sun-dried.", text: "Spices are dried in the sun, the way the family recipes always have." },
  { art: "step-oil", title: "Cold-pressed.", text: "Only oil goes in with the spice. Nothing else is added to keep it." },
  { art: "step-hand", title: "Mixed by hand.", text: "Every batch is mixed by hand in Anantapur. No machines, no shortcuts." },
  { art: "step-jar", title: "Made for you.", text: "Your jar is made after you order, then dispatched in 2–4 business days." },
];

const rail =
  "flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-2 sm:scroll-pl-6 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden";

const h2 = "font-display text-5xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-6xl";
const heroDelay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  // First product photo per category doubles as the category tile image.
  const tileImage = new Map<string, string>();
  for (const p of products) {
    if (p.image_url && !tileImage.has(p.category_id)) tileImage.set(p.category_id, p.image_url);
  }
  // Up to two photographed products per category, so the rail isn't one category.
  const perCat = new Map<string, number>();
  const featured = products
    .filter((p) => {
      if (!p.image_url || p.image_url === tileImage.get(p.category_id)) return false; // tile already shows this photo
      const n = perCat.get(p.category_id) ?? 0;
      perCat.set(p.category_id, n + 1);
      return n < 2;
    })
    .slice(0, 8);

  const rating = ratingSummary();
  const fromPrice = Math.min(...products.flatMap((p) => p.variants.map((v) => v.price)));
  const nonVegCats = new Set(categories.filter((c) => isNonVegSlug(c.slug)).map((c) => c.id));
  const whatsapp = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`;

  return (
    <main>
      {/* Hero: oxblood, text first, big arched photo */}
      <section className="bg-oxblood text-bone">
        <div className="mx-auto grid max-w-6xl items-end gap-2 px-4 pt-6 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-16">
          <div className="lg:pb-20">
            <p lang="te" className="hero-in font-telugu text-xl font-bold text-turmeric sm:text-2xl">
              రాయలసీమ రుచులు
            </p>
            <h1
              style={heroDelay(120)}
              className="hero-in mt-3 font-display text-[clamp(2.4rem,12vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em] lg:text-8xl"
            >
              Rayalaseema, <span className="text-turmeric">jar by jar.</span>
            </h1>
            <p style={heroDelay(260)} className="hero-in mt-5 max-w-md text-base text-bone/85 sm:text-lg">
              Family-recipe pickles, sweets, podi and snacks, made to order in Anantapur. No preservatives.
            </p>
            <div style={heroDelay(380)} className="hero-in mt-5 flex flex-wrap gap-3 sm:mt-7">
              <Button variant="custom" className="h-14 flex-1 bg-turmeric! px-6 text-lg text-oxblood! hover:bg-turmeric/90! sm:flex-none sm:px-8" asChild>
                <Link href="/shop">Shop the pickles</Link>
              </Button>
              <Button variant="outline" className="hidden h-14 flex-1 rounded-3xl sm:inline-flex border-bone/40 bg-transparent px-6 text-base font-bold text-bone hover:bg-bone/10 hover:text-bone sm:flex-none" asChild>
                <a href="#how">See how it&apos;s made</a>
              </Button>
            </div>
            {Number.isFinite(fromPrice) && (
              <p style={heroDelay(480)} className="hero-in mt-3 text-balance text-sm text-bone/75">
                From ₹{fromPrice} · Ships in 2–4 days · Pay by UPI, card or net banking
              </p>
            )}
            {rating && (
              <p style={heroDelay(560)} className="hero-in mt-2 flex items-center gap-1.5 text-sm text-bone/85">
                <Star aria-hidden className="size-4 fill-turmeric text-turmeric" />
                <span className="font-bold tabular-nums">{rating.average}</span> from {rating.count} review{rating.count !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="relative mx-auto w-full max-w-sm pt-2 lg:max-w-md lg:pt-0">
            <div aria-hidden className="hero-disc absolute inset-x-[6%] bottom-0 top-[18%] rounded-full bg-turmeric" />
            <Sticker className="hero-pop [--d:650ms] absolute -top-1 right-0 z-10 bg-bone text-oxblood">Made to order</Sticker>
            <div className="relative">
              <Image
                src="/mascot/amma.webp"
                alt="Amma from Anantapur holding a jar of homemade pickle and a ladle"
                width={625}
                height={870}
                preload
                fetchPriority="high"
                quality={70}
                sizes="(min-width: 1024px) 448px, 88vw"
                className="relative mx-auto block h-auto w-[88%]"
              />
            </div>
            <Image src="/art/hero-plate.svg" alt="A banana-leaf plate with rice, mango pickle, gongura, karam podi and chekkalu" width={144} height={144} unoptimized className="hero-pop [--d:800ms] absolute -left-3 bottom-4 size-32 sm:size-36" />
            <span className="hero-pop [--d:950ms] absolute bottom-4 right-0 inline-flex items-center gap-1.5 rounded-full bg-bone px-3.5 py-2 text-sm font-bold text-oxblood">
              <MapPin className="size-4" /> Handmade in Anantapur, AP
            </span>
          </div>
        </div>
      </section>

      {/* Claims strip */}
      <div aria-hidden className="overflow-hidden bg-turmeric py-3.5 text-oxblood">
        <div className="marquee-track">
          {[0, 1, 2, 3].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {CLAIMS.map((c) => (
                <span key={c} className="flex items-center gap-5 pr-5">
                  <span className="font-display text-xl font-extrabold tracking-tight sm:text-2xl"><SansRupee>{c}</SansRupee></span>
                  <span className="size-2 rounded-full bg-oxblood" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Categories: round icon row (photos double as the category images) */}
      <section className="mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SplitReveal className={h2}>Find your flavor</SplitReveal>
        </div>
        <div className="mx-auto mt-6 max-w-6xl">
          <Reveal each className={`${rail} gap-5 sm:gap-8`}>
            {categories.map((c) => {
              const drawn = categoryArt(c.slug);
              const img = drawn ? undefined : tileImage.get(c.id);
              const art = drawn ?? foodArt(c.slug);
              return (
                <Link key={c.id} href={`/shop/${c.slug}`} className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2 text-center lg:w-32">
                  <span className={`relative flex size-24 items-center justify-center overflow-hidden rounded-full ring-2 ring-ink/10 transition-transform duration-300 group-hover:scale-105 lg:size-32 ${img ? "bg-oxblood" : "bg-turmeric/30"}`}>
                    {img ? (
                      <Image src={img} alt="" fill sizes="128px" className="object-cover" />
                    ) : art ? (
                      <Image src={art} alt="" width={400} height={500} unoptimized className="size-full -translate-y-2 scale-[1.3] object-cover object-[50%_100%]" />
                    ) : (
                      <Flame aria-hidden className="size-8 text-turmeric" />
                    )}
                  </span>
                  <span className="font-display text-sm font-bold leading-tight text-ink group-hover:text-brand lg:text-base">{c.name}</span>
                </Link>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="relative mt-16">
          <div className="relative mx-auto flex max-w-6xl items-end justify-between px-4 sm:px-6">
            <SplitReveal className={h2}>From our kitchen</SplitReveal>
            <Link href="/shop" className="inline-flex min-h-11 items-center whitespace-nowrap pl-4 text-sm font-bold text-ink hover:text-brand">See all</Link>
          </div>
          <div className="mx-auto mt-6 max-w-6xl">
            <Reveal each className={`${rail} lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-6 lg:[&>*:nth-child(n+5)]:hidden`}>
              {featured.map((p) => (
                <div key={p.id} className="w-[44vw] max-w-56 shrink-0 snap-start lg:w-auto lg:max-w-none">
                  <ProductCard product={p} nonVeg={nonVegCats.has(p.category_id)} compact />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Story: one saffron band in the hero's language. Four drawn steps on a swipe rail (grid on desktop), then the maker's facts. */}
      <div id="how" className="scallop-top mt-20 [--scallop:var(--turmeric)]" />
      <section id="our-story" className="scroll-mt-20 bg-turmeric pb-12 pt-4 text-ink sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {STORY.photo && (
            <Image src={STORY.photo} alt={STORY.maker ? `${STORY.maker}, who makes Foodlogin` : "The maker behind Foodlogin"} width={160} height={160} className="mb-5 size-32 rounded-full border-4 border-ink object-cover sm:size-40" />
          )}
          {STORY.since && <p className="mb-2 font-bold">Making these recipes since {STORY.since}</p>}
          <SplitReveal className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.02em] sm:text-7xl">From sun to jar.</SplitReveal>
          <p className="mt-4 max-w-lg text-lg font-medium text-ink/85">
            {STORY.text ?? "Made by hand in Anantapur, from spices dried in the sun to a jar packed after you order."}
          </p>
          {STORY.maker && <p className="mt-2 font-bold">{STORY.maker}</p>}
        </div>

        <Reveal as="ul" each className="mt-8 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-2 [scrollbar-width:none] sm:px-6 lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {MAKING.map((m) => (
            <li key={m.title} className="w-[68vw] max-w-72 shrink-0 snap-start rounded-3xl bg-bone p-5 lg:w-auto lg:max-w-none">
              <Image src={`/art/${m.art}.svg`} alt="" width={160} height={160} unoptimized className="mx-auto size-32 sm:size-36" />
              <h3 className="mt-3 font-display text-2xl font-extrabold leading-none tracking-[-0.02em]">{m.title}</h3>
              <p className="mt-2 text-sm text-ink/75">{m.text}</p>
            </li>
          ))}
        </Reveal>

        <div className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-3 px-4 sm:px-6">
          <Button variant="custom" className="h-14 flex-1 bg-ink! px-8 text-lg hover:bg-ink/90! sm:flex-none" asChild>
            <Link href="/shop">Pick your jar</Link>
          </Button>
        </div>
      </section>
      <div className="scallop-bottom [--scallop:var(--turmeric)]" />

      <ReviewsSection />

      {/* The vlogs: where many customers first met us */}
      <section id="vlogs" className="mx-auto mt-16 max-w-3xl px-4 sm:px-6">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/10 sm:p-8">
          <Instagram aria-hidden className="size-9 text-brand" />
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.02] tracking-[-0.02em] text-ink sm:text-4xl">Found us through our videos?</h2>
          <p className="mt-3 text-ink/75">
            FoodLogin is also a Telugu food vlog: cooking, street food and restaurant visits across Anantapur. Follow us on Instagram, or watch the longer videos on YouTube.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button variant="custom" className="h-14 px-8 text-lg" asChild>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><Instagram className="size-5" /> Follow on Instagram</a>
            </Button>
            <Button variant="outline" className="h-14 rounded-3xl px-6 text-base font-bold" asChild>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"><Youtube className="size-5" /> Watch on YouTube</a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-16 max-w-3xl px-4 sm:px-6">
        <SplitReveal className={h2}>Good to know</SplitReveal>
        <Reveal className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {FAQ.slice(0, 5).map((f) => (
            <details key={f.q} className="faq group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-bold text-ink">
                {f.q}
                <Plus className="size-5 shrink-0 text-brand transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-4 leading-relaxed text-ink/75">{f.a}</p>
            </details>
          ))}
        </Reveal>
        <Link href="/faq" className="mt-4 inline-flex min-h-11 items-center font-bold text-brand hover:underline">More questions</Link>
      </section>

      {/* WhatsApp band */}
      <div className="scallop-top mt-20 [--scallop:var(--brand)]" />
      <section id="closing-cta" className="bg-brand pb-14 pt-4 text-white sm:pb-20">
        <div className="mx-auto grid max-w-5xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:gap-14">
          <div aria-hidden className="mx-auto flex size-36 items-center justify-center rounded-full bg-turmeric sm:size-44 lg:order-2 lg:size-64">
            <Image src="/food/jar.svg" alt="" width={200} height={250} unoptimized className="h-4/5 w-auto -rotate-6" />
          </div>
          <div className="text-center lg:text-left">
            <SplitReveal className="font-display text-[clamp(2.2rem,10vw,3.5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] sm:text-6xl">
              Not sure what to pick? Chat with us.
            </SplitReveal>
            <Reveal as="p" delay={300} className="mx-auto mt-4 max-w-md text-lg text-white/90 lg:mx-0">
              Tell us what you like and we&apos;ll suggest a jar. Made to order in Anantapur.
            </Reveal>
            <Reveal delay={450} className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button variant="custom" className="h-14 bg-turmeric! px-8 text-lg text-oxblood! hover:bg-turmeric/90!" asChild>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="size-5" /> Chat on WhatsApp</a>
              </Button>
              <Button variant="outline" className="h-14 rounded-3xl border-white/60 bg-transparent px-8 text-lg font-bold text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/shop">Browse the shop</Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
