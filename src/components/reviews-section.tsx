import { Star } from "lucide-react";
import { Reveal, SplitReveal } from "@/components/motion";
import { ratingSummary, REVIEWS } from "@/lib/reviews";

/** Real reviews only; renders nothing until lib/reviews.ts has entries. */
export function ReviewsSection() {
  const summary = ratingSummary();
  if (!summary) return null;
  return (
    <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
      <SplitReveal className="font-display text-5xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-6xl">Kind words</SplitReveal>
      <p className="mt-3 flex items-center gap-2 text-ink/75">
        <Star aria-hidden className="size-5 fill-turmeric text-turmeric" />
        <span className="font-bold tabular-nums text-ink">{summary.average}</span> from {summary.count} review{summary.count !== 1 ? "s" : ""}
      </p>
      <Reveal each className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure key={r.name + r.text} className="rounded-3xl bg-white p-6 ring-1 ring-ink/10">
            <div className="flex gap-0.5 text-turmeric" role="img" aria-label={`${r.stars} out of 5 stars`}>
              {Array.from({ length: r.stars }, (_, i) => <Star key={i} aria-hidden className="size-5 fill-current" />)}
            </div>
            <blockquote className="mt-3 text-ink/85">{r.text}</blockquote>
            <figcaption className="mt-4 text-sm font-bold text-ink">{r.name}, {r.city}</figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
