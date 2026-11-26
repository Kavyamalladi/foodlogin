/** "250g" or "1kg" -> price per 100g, rounded to the rupee. null when the weight isn't a plain g/kg amount. */
export function pricePer100g(weight: string, price: number): number | null {
  const m = /^(\d+(?:\.\d+)?)\s*(kg|g)$/i.exec(weight.trim());
  if (!m) return null;
  const grams = Number(m[1]) * (m[2].toLowerCase() === "kg" ? 1000 : 1);
  return grams > 0 ? Math.round((price / grams) * 100) : null;
}
