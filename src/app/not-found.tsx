import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-oxblood px-4 text-center text-bone sm:px-6">
      <Flame className="size-12 text-brand" />
      <p className="mt-4 font-display text-8xl font-extrabold leading-none text-turmeric">404</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Not in our pantry</h1>
      <p className="mt-3 max-w-sm text-bone/70">
        We couldn&apos;t find that page. Let&apos;s get you back to something homemade.
      </p>
      <Button asChild variant="custom" size="lg" className="mt-8 h-12 px-8">
        <Link href="/shop">Back to shop</Link>
      </Button>
    </main>
  );
}
