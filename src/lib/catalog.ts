"use client";

import { useEffect, useSyncExternalStore } from "react";

export type CatalogVariant = { id: string; weight: string; price: number };
export type CatalogProduct = {
  id: string;
  name: string;
  image_url: string | null;
  category_id: string;
  variants: CatalogVariant[];
};
export type CatalogCategory = { id: string; name: string; slug: string };
export type Catalog = { categories: CatalogCategory[]; products: CatalogProduct[] };

// One shared fetch for the whole session (search + cart suggestions).
let data: Catalog | null = null;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

export function loadCatalog(): Promise<void> {
  if (data) return Promise.resolve();
  inflight ??= fetch("/api/search-index")
    .then((r) => (r.ok ? (r.json() as Promise<Catalog>) : Promise.reject(new Error(String(r.status)))))
    .then((c) => {
      data = c;
      listeners.forEach((l) => l());
    })
    .catch(() => {
      inflight = null; // allow a retry on next open
    });
  return inflight;
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

/** Catalog once loaded, otherwise null. Pass `eager` to start loading on mount. */
export function useCatalog(eager = false): Catalog | null {
  useEffect(() => {
    if (eager) void loadCatalog();
  }, [eager]);
  return useSyncExternalStore(subscribe, () => data, () => null);
}
