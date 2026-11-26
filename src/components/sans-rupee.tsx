/**
 * Renders "₹" in the body font. The rupee sign lives in the fonts' latin-ext subset, so using it in
 * Fraunces makes every visitor download a ~100 KB font file just for that one glyph.
 */
export function SansRupee({ children }: { children: string }) {
  return children.split("₹").flatMap((part, i) => (i ? [<span key={i} className="font-sans">₹</span>, part] : [part]));
}
