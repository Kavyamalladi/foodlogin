"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Storefront scroll reveals, built on framer-motion's `animate` (already loaded for the cart animations). Rules:
 * - transform + opacity only (no layout work), so Core Web Vitals stay clean
 * - SSR renders final content; globals.css hides [data-reveal]/[data-split] only when motion is allowed,
 *   and a <noscript> rule in the root layout reveals everything without JS
 * - nothing here touches the hero image's loading, so LCP is unaffected
 */

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type Motion = typeof import("framer-motion");
let lib: Promise<Motion> | undefined;

/**
 * Load framer-motion only after the page's `load` event + an idle moment, so it never competes with the hero image
 * (Lighthouse LCP). If it fails to load, [data-motion=off] reveals everything. Returns cleanup.
 */
function withMotion(run: (m: Motion) => void | (() => void)): () => void {
  let cancelled = false;
  let cleanup: void | (() => void);
  let cancelWait: () => void = () => {};
  const start = () => {
    lib ??= import("framer-motion");
    lib
      .then((m) => {
        if (!cancelled) cleanup = run(m);
      })
      .catch(() => {
        document.documentElement.dataset.motion = "off";
      });
  };
  const schedule = () => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 2000 });
      cancelWait = () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(start, 200);
      cancelWait = () => clearTimeout(id);
    }
  };
  if (document.readyState === "complete") schedule();
  else {
    addEventListener("load", schedule, { once: true });
    cancelWait = () => removeEventListener("load", schedule);
  }
  return () => {
    cancelled = true;
    cancelWait();
    if (typeof cleanup === "function") cleanup();
  };
}

/** Run `fn` once when `el` is ~10% inside the viewport. Returns cleanup. */
function onceInView(el: Element, fn: () => void, margin = "0px 0px -8% 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    },
    { rootMargin: margin, threshold: 0.12 },
  );
  io.observe(el);
  return () => io.disconnect();
}

type Tagged = { as?: ElementType; className?: string; children: ReactNode };

/** Fade + rise on enter. `each` staggers the direct children instead of the wrapper. `delay` is in ms. */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  delay = 0,
  each = false,
}: Tagged & { delay?: number; each?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const targets = each ? Array.from(el.children) : [el];
    return withMotion(({ animate, stagger }) =>
      onceInView(el, () => {
        animate(
          targets,
          { opacity: [0, 1], y: [28, 0] },
          { duration: 0.8, ease: EASE_OUT, delay: each ? stagger(0.09, { startDelay: delay / 1000 }) : delay / 1000 },
        );
      }),
    );
  }, [each, delay]);
  return (
    <Tag ref={ref} data-reveal={each ? "each" : ""} className={className}>
      {children}
    </Tag>
  );
}

/** Headline whose words rise out of a clip mask (below the fold only; above-the-fold text uses the CSS `hero-in`). */
export function SplitReveal({
  as: Tag = "h2",
  className,
  children,
  delay = 0,
}: Tagged & { delay?: number; children: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    return withMotion(({ animate, stagger }) => {
      const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
      for (const w of words) w.style.transform = "translateY(105%)";
      el.style.opacity = "1";
      return onceInView(el, () => {
        animate(words, { y: ["105%", "0%"] }, { duration: 0.9, ease: EASE_OUT, delay: stagger(0.07, { startDelay: delay / 1000 }) });
      });
    });
  }, [delay]);
  return (
    <Tag ref={ref} data-split aria-label={children} className={className}>
      {children.split(" ").map((word, i) => (
        <span key={i} aria-hidden>
          <span className="split-clip">
            <span data-w className="inline-block">{word}</span>
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}
