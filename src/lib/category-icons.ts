import type { LucideIcon } from "lucide-react";
import { Leaf, Wheat, Candy, Cookie, ChefHat } from "lucide-react";

export type CategoryMeta = { icon: LucideIcon; bg: string; color: string };

export const CATEGORY_ICONS: Record<string, CategoryMeta> = {
  pickles: { icon: Leaf, bg: "bg-orange-100", color: "text-brand" },
  podis: { icon: Wheat, bg: "bg-yellow-100", color: "text-yellow-600" },
  podi: { icon: Wheat, bg: "bg-yellow-100", color: "text-yellow-600" },
  sweets: { icon: Candy, bg: "bg-rose-100", color: "text-rose-600" },
  snacks: { icon: Cookie, bg: "bg-amber-100", color: "text-amber-700" },
};

export const DEFAULT_CATEGORY: CategoryMeta = {
  icon: ChefHat,
  bg: "bg-brand/10",
  color: "text-brand",
};
