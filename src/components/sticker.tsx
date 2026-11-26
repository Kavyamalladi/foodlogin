import type { ReactNode } from "react";

const STAR = "polygon(50.0% 0.0%,59.1% 10.0%,71.7% 5.0%,75.6% 17.9%,89.1% 18.8%,86.9% 32.2%,98.7% 38.9%,91.0% 50.0%,98.7% 61.1%,86.9% 67.8%,89.1% 81.2%,75.6% 82.1%,71.7% 95.0%,59.1% 90.0%,50.0% 100.0%,40.9% 90.0%,28.3% 95.0%,24.4% 82.1%,10.9% 81.2%,13.1% 67.8%,1.3% 61.1%,9.0% 50.0%,1.3% 38.9%,13.1% 32.2%,10.9% 18.8%,24.4% 17.9%,28.3% 5.0%,40.9% 10.0%)";

/** Tilted starburst badge (decorative; the same claim must also exist as real text on the page). */
export function Sticker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ clipPath: STAR }}
      className={`pointer-events-none flex size-24 -rotate-12 items-center justify-center p-4 text-center font-display text-sm font-bold leading-[1.05] sm:size-28 sm:text-base ${className}`}
    >
      {children}
    </span>
  );
}
