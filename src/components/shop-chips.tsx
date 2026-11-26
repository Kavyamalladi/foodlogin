"use client";

import { useEffect, useRef, useState } from "react";

/** Sticky jump chips for /shop. The chip for the section you're reading lights up and scrolls into view. */
export function ShopChips({ items }: { items: { id: string; slug: string; name: string; nonVeg: boolean }[] }) {
  const [active, setActive] = useState(items[0]?.slug);
  const [vegOnly, setVegOnly] = useState(false);
  const shown = vegOnly ? items.filter((i) => !i.nonVeg) : items;

  useEffect(() => {
    // Hides the non-veg sections (CSS in globals.css keyed on this attribute).
    document.querySelector("main")?.toggleAttribute("data-veg-only", vegOnly);
  }, [vegOnly]);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.slug)).filter((e): e is HTMLElement => !!e);
    // A section is "current" while its top is within the band just under the sticky header + chips.
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-130px 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    // Keep the active chip visible in the horizontal bar without moving the page.
    const chip = bar.current?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    const el = bar.current;
    if (chip && el) el.scrollTo({ left: chip.offsetLeft - el.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div ref={bar} className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        aria-pressed={vegOnly}
        onClick={() => setVegOnly((v) => !v)}
        className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors ${
          vegOnly ? "border-leaf bg-leaf text-white" : "border-leaf/40 bg-white text-ink"
        }`}
      >
        <span aria-hidden className={`size-3 rounded-full ${vegOnly ? "bg-white" : "bg-leaf"}`} />
        Veg only
      </button>
      {shown.map((c) => (
        <a
          key={c.id}
          href={`#${c.slug}`}
          data-slug={c.slug}
          aria-current={active === c.slug ? "true" : undefined}
          className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-bold transition-colors ${
            active === c.slug ? "bg-brand text-white" : "bg-ink/5 text-ink hover:bg-brand hover:text-white"
          }`}
        >
          {c.name}
        </a>
      ))}
    </div>
  );
}
