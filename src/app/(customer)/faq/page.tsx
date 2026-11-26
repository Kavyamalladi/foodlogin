import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about ordering, delivery time, delivery charges, payment and cancellations at Foodlogin.",
};

export default function FaqPage() {
  return (
    <main className="px-4 pb-16 pt-6 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <div className="mx-auto max-w-3xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-6xl">Good to know</h1>
        <p className="mt-3 text-ink/75">Quick answers before you order.</p>

        <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          {FAQ.map((f) => (
            <details key={f.q} className="faq group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-bold text-ink">
                {f.q}
                <Plus className="size-5 shrink-0 text-brand transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-4 leading-relaxed text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-ink/75">
          Still not sure? <Link href="/contact" className="font-bold text-brand underline">Message or call us</Link>.
        </p>
      </div>
    </main>
  );
}
