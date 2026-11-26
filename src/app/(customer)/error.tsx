"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <Flame className="mx-auto size-10 text-brand" />
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink">
          Something went wrong
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-ink/70">
          We hit an unexpected problem. Try again, or go back to the shop.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="custom" className="h-12 px-6" onClick={reset}>
            Try again
          </Button>
          <Button variant="outline" className="h-12 rounded-3xl px-6" asChild>
            <Link href="/shop">Back to shop</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
