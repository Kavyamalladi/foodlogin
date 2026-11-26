"use client";

import { LazyMotion } from "framer-motion";

/** Loads framer-motion's feature bundle after first paint; components use `m.*`. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={() => import("./features").then((f) => f.default)} strict>
      {children}
    </LazyMotion>
  );
}
