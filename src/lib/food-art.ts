// Illustrated fallbacks (public/food/*.svg) for products that don't have a photo yet.
// Specific products first (matched on name), then a generic one per category.
const BY_NAME: [RegExp, string][] = [
  [/honey/i, "honey"],
  [/chinthokku/i, "chinthokku"],
  [/mushroom/i, "mushroom"],
  [/chenikkaya\s+kajji/i, "kajji-peanut"],
  [/pappula\s+kajji/i, "kajji-dal"],
  [/bellam\s+gavvalu/i, "gavvalu-bellam"],
  [/pakam\s+pappu/i, "pakam-pappu"],
  [/neyyi\s+ariselu/i, "ariselu-neyyi"],
  [/arisela?\s+pakam/i, "ariselu-pakam"],
  [/chenikkaya\s+podi/i, "podi-peanut"],
  [/rasam\s+podi/i, "podi-rasam"],
  [/garam\s+masala/i, "garam-masala"],
  [/karam\s+gavvalu/i, "gavvalu-karam"],
  [/beetroot/i, "beetroot-chekkilu"],
  [/chekkil/i, "chekkilalu"],
  [/nippat/i, "nippatlu"],
  [/pallilu/i, "masala-pallilu"],
  [/boondi/i, "karam-boondi"],
  [/vaamu|vamu/i, "vamu-karalu"],
];

const BY_CATEGORY: Record<string, string> = {
  "veg-pickles": "jar",
  "non-veg-pickles": "jar",
  "dry-mutton": "jar",
  sweets: "sweet",
  podi: "podi",
  snacks: "snack",
};

/** Path of the illustration for a product, or null when nothing fits. */
export function foodArt(categorySlug: string | undefined, productName = ""): string | null {
  const byName = BY_NAME.find(([re]) => re.test(productName));
  if (byName) return `/food/${byName[1]}.svg`;
  const name = categorySlug ? BY_CATEGORY[categorySlug] : undefined;
  return name ? `/food/${name}.svg` : null;
}

/** Category tiles that use a drawn asset even when a product photo exists. */
export function categoryArt(slug: string): string | null {
  return slug === "sweets" ? "/food/sweets.svg" : null;
}
