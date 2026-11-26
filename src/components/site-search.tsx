"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Flame, Search } from "lucide-react";
import { loadCatalog, useCatalog } from "@/lib/catalog";
import { searchProducts } from "@/lib/search";

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const catalog = useCatalog();

  const results = catalog ? searchProducts(catalog, query) : [];
  const searching = query.trim().length > 0;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) void loadCatalog();
        else setQuery("");
      }}
    >
      <Dialog.Trigger
        aria-label="Search products"
        onPointerEnter={() => void loadCatalog()}
        className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-ink/5"
      >
        <Search className="size-5" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[60] flex flex-col bg-bone [--brand:var(--brand-deep)] sm:inset-auto sm:left-1/2 sm:top-20 sm:max-h-[70vh] sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:rounded-3xl sm:shadow-2xl"
        >
          <Dialog.Title className="sr-only">Search products</Dialog.Title>
          <div className="flex items-center gap-2 border-b border-ink/10 p-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pickles, podi, sweets…"
                aria-label="Search products"
                autoComplete="off"
                enterKeyHint="search"
                className="h-12 w-full rounded-2xl border border-ink/20 bg-white pl-12 pr-4 text-base text-ink placeholder:text-ink/40 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
              />
            </div>
            <Dialog.Close className="min-h-11 px-3 text-sm font-bold text-ink hover:text-brand">Cancel</Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-3" aria-live="polite">
            {!searching && (
              <div>
                <p className="px-1 pb-2 text-sm font-bold text-ink/70">Browse by category</p>
                <div className="flex flex-wrap gap-2">
                  {(catalog?.categories ?? []).map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="inline-flex min-h-11 items-center rounded-full bg-ink/5 px-4 text-sm font-bold text-ink hover:bg-brand hover:text-white"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searching && !catalog && <p className="px-1 py-6 text-center text-ink/70">Searching…</p>}

            {searching && catalog && results.length === 0 && (
              <div className="px-1 py-6 text-center">
                <p className="font-display text-xl font-bold text-ink">No match for “{query.trim()}”</p>
                <p className="mt-1 text-sm text-ink/70">Try “mango”, “podi” or “sweets”, or browse the shop.</p>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand px-6 text-sm font-bold text-white"
                >
                  Browse all products
                </Link>
              </div>
            )}

            {results.length > 0 && (
              <ul>
                {results.map((p) => {
                  const base = p.variants.reduce((a, b) => (a.price <= b.price ? a : b), p.variants[0]);
                  const category = catalog?.categories.find((c) => c.id === p.category_id)?.name;
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.id}`}
                        onClick={() => setOpen(false)}
                        className="flex min-h-16 items-center gap-3 rounded-2xl p-2 hover:bg-ink/5"
                      >
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-turmeric">
                          {p.image_url ? (
                            <Image src={p.image_url} alt="" fill sizes="56px" className="object-cover" />
                          ) : (
                            <Flame aria-hidden className="absolute inset-0 m-auto size-6 opacity-40" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display font-bold text-ink">{p.name}</span>
                          <span className="block truncate text-sm text-ink/70">
                            {category}
                            {base && ` · ${base.weight}`}
                          </span>
                        </span>
                        {base && <span className="shrink-0 font-bold text-brand-deep">₹{base.price}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
