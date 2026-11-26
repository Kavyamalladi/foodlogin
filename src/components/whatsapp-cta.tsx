import { Button } from "@/components/ui/button";

export function WhatsAppCta() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return (
    <div className="rounded-3xl bg-ink p-8 text-center text-bone sm:p-12">
      <h3 className="font-display text-3xl font-extrabold text-turmeric sm:text-4xl">
        Need something custom?
      </h3>
      <p className="mx-auto mt-3 max-w-md text-bone/70">
        Chat with us on WhatsApp for bulk orders, gifting or help choosing.
      </p>
      <Button variant="custom" className="mt-6 h-12 px-8" asChild>
        <a href={number ? `https://wa.me/${number}` : "#"} target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp
        </a>
      </Button>
    </div>
  );
}
