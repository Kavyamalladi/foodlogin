import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/social";
import { STORY } from "@/lib/story";

export const metadata: Metadata = {
  title: "About",
  description:
    "Foodlogin makes Rayalaseema pickles, sweets, podi and snacks by hand in Anantapur, Andhra Pradesh. Made to order, no preservatives. Message us on WhatsApp.",
};

const FACTS = [
  "Made by hand in Anantapur, Andhra Pradesh, to family recipes.",
  "Every order is made fresh after you place it, with no preservatives.",
  "Dispatched in 2–4 business days, then 3–7 business days to reach you.",
  "A flat ₹100 delivery per order, anywhere in India.",
];

export default function AboutPage() {

  return (
    <main className="px-4 pb-16 pt-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

        <h1 className="mt-6 font-display text-5xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-6xl">
          Made by hand in Anantapur.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink/75">
          Foodlogin sells Rayalaseema pickles, sweets, podi and snacks, made to order for families who miss the taste of home.
        </p>

        {(STORY.photo || STORY.text) && (
          <div className="mt-8 flex items-center gap-5">
            {STORY.photo && (
              <Image src={STORY.photo} alt={STORY.maker ?? "The maker behind Foodlogin"} width={128} height={128} className="size-28 shrink-0 rounded-full border-4 border-turmeric object-cover" />
            )}
            <div>
              {STORY.text && <p className="text-lg text-ink/85">{STORY.text}</p>}
              {(STORY.maker || STORY.since) && (
                <p className="mt-1 text-sm font-bold text-ink">
                  {STORY.maker}
                  {STORY.maker && STORY.since && ", "}
                  {STORY.since && `making these recipes since ${STORY.since}`}
                </p>
              )}
            </div>
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {FACTS.map((f) => (
            <li key={f} className="rounded-2xl bg-ink/5 px-4 py-3 text-ink/85">{f}</li>
          ))}
        </ul>

        <p className="mt-8 text-ink/85">
          Many of you first met us through our Telugu food vlogs. Follow us on{" "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand underline">Instagram</a>, or watch on{" "}
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand underline">YouTube</a>.
        </p>

        <div className="mt-10">
          <Button variant="custom" className="h-14 px-8 text-lg" asChild>
            <Link href="/contact">Talk to us</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
