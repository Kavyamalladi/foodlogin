import type { Catalog, CatalogProduct } from "@/lib/catalog";

// Words customers actually type (Telugu words in English letters or Telugu script) → catalog words.
// Telugu-script entries match the home-page ticker; the owner should confirm them.
const ALIASES: Record<string, string> = {
  avakaya: "mango",
  mamidi: "mango",
  మామిడి: "mango",
  nimmakaya: "lemon",
  నిమ్మకాయ: "lemon",
  టమాటా: "tomato",
  గోంగూర: "gongura",
  కారం: "karam",
  పొడి: "podi",
  బెల్లం: "bellam",
  uragaya: "pickle",
  kodi: "chicken",
  mamsam: "mutton",
};

function expand(token: string): string {
  if (ALIASES[token]) return ALIASES[token];
  if (token.length >= 3) {
    const hit = Object.keys(ALIASES).find((k) => k.startsWith(token));
    if (hit) return ALIASES[hit];
  }
  return token;
}

export function searchProducts(catalog: Catalog, query: string, limit = 8): CatalogProduct[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean).map(expand);
  if (tokens.length === 0) return [];
  const catName = new Map(catalog.categories.map((c) => [c.id, c.name.toLowerCase()]));

  return catalog.products
    .map((p, order) => {
      const name = p.name.toLowerCase();
      const hay = `${name} ${catName.get(p.category_id) ?? ""}`;
      if (!tokens.every((t) => hay.includes(t))) return null;
      const score = tokens.every((t) => name.startsWith(t) || name.includes(` ${t}`)) ? 0 : 1;
      return { p, score, order };
    })
    .filter((x): x is { p: CatalogProduct; score: number; order: number } => x !== null)
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .slice(0, limit)
    .map((x) => x.p);
}
