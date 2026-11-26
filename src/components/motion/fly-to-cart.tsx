"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { m } from "framer-motion";
import { useCartUi } from "@/store/cart-ui";

type Flight = { id: number; src: string | null; x: number; y: number; dx: number; dy: number };

const SIZE = 40;
let nextId = 1;
const listeners = new Set<(f: Flight) => void>();

/** Fly a 40px thumbnail from `from` into the navbar cart icon, then bounce the icon. */
export function flyToCart(from: DOMRect, src: string | null) {
  const target = document.querySelector("[data-cart-icon]")?.getBoundingClientRect();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!target || reduced || listeners.size === 0) {
    useCartUi.getState().landed();
    return;
  }
  const x = from.left + from.width / 2 - SIZE / 2;
  const y = from.top + from.height / 2 - SIZE / 2;
  const dx = target.left + target.width / 2 - SIZE / 2 - x;
  const dy = target.top + target.height / 2 - SIZE / 2 - y;
  listeners.forEach((l) => l({ id: nextId++, src, x, y, dx, dy }));
}

const subscribe = () => () => {};

export function FlyToCartHost() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const add = (f: Flight) => setFlights((fs) => [...fs, f]);
    listeners.add(add);
    return () => {
      listeners.delete(add);
    };
  }, []);

  if (!mounted) return null;

  function done(id: number) {
    setFlights((fs) => fs.filter((f) => f.id !== id));
    useCartUi.getState().landed();
  }

  return createPortal(
    <>
      {flights.map((f) => {
        const peak = Math.min(0, f.dy) - 90; // arc up before dropping into the cart
        return (
          <m.div
            key={f.id}
            aria-hidden
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={{ x: [0, f.dx], y: [0, peak, f.dy], scale: [1, 1, 0.5] }}
            transition={{
              x: { duration: 0.75, ease: [0.33, 0, 0.67, 1] },
              y: { duration: 0.75, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] },
              scale: { duration: 0.75, times: [0, 0.4, 1] },
            }}
            onAnimationComplete={() => done(f.id)}
            style={{ left: f.x, top: f.y, width: SIZE, height: SIZE }}
            className="pointer-events-none fixed z-[100] overflow-hidden rounded-full border-2 border-white bg-turmeric shadow-lg"
          >
            {f.src && <Image src={f.src} alt="" fill sizes="40px" className="object-cover" />}
          </m.div>
        );
      })}
    </>,
    document.body,
  );
}
