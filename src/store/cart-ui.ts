import { create } from "zustand";

type CartUi = {
  open: boolean;
  /** Incremented when something lands in the cart; the navbar icon bounces on change. */
  bump: number;
  setOpen: (open: boolean) => void;
  landed: () => void;
};

export const useCartUi = create<CartUi>()((set) => ({
  open: false,
  bump: 0,
  setOpen: (open) => set({ open }),
  landed: () => set((s) => ({ bump: s.bump + 1 })),
}));
