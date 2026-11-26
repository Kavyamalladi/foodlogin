"use client";

import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { FormEventHandler } from "react";
import { ShieldCheck } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CustomerInput } from "@/lib/customer-schema";

const inputClass =
  "h-14 rounded-2xl border border-ink/20 bg-white px-4 text-base text-ink placeholder:text-ink/40 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30";

interface FieldDef {
  name: keyof CustomerInput;
  label: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
  inputMode?: "numeric";
  optional?: boolean;
  prefix?: string;
  maxLength?: number;
}

function TextField({ control, def }: { control: Control<CustomerInput>; def: FieldDef }) {
  return (
    <Controller
      control={control}
      name={def.name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={def.name} className="text-sm font-bold text-ink">
            {def.label}
            {def.optional && <span className="font-normal text-ink/50"> (optional)</span>}
          </FieldLabel>
          <div className="relative">
            {def.prefix && (
              <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base font-bold text-ink/70">
                {def.prefix}
              </span>
            )}
            <Input
              id={def.name}
              type={def.type ?? "text"}
              inputMode={def.inputMode}
              autoComplete={def.autoComplete}
              placeholder={def.placeholder}
              maxLength={def.maxLength}
              aria-invalid={fieldState.invalid}
              className={`${inputClass} ${def.prefix ? "pl-14" : ""}`}
              {...field}
            />
          </div>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

const NAME: FieldDef = { name: "name", label: "Full name", placeholder: "Your full name", autoComplete: "name" };
const PHONE: FieldDef = { name: "phone", label: "WhatsApp number", placeholder: "10-digit mobile number", autoComplete: "tel", type: "tel", inputMode: "numeric", prefix: "+91", maxLength: 10 };
const ADDRESS1: FieldDef = { name: "address1", label: "Delivery address", placeholder: "House / flat / street", autoComplete: "address-line1" };
const ADDRESS2: FieldDef = { name: "address2", label: "Address line 2", placeholder: "Landmark, apartment, etc.", autoComplete: "address-line2", optional: true };
const CITY: FieldDef = { name: "city", label: "City", placeholder: "City", autoComplete: "address-level2" };
const PINCODE: FieldDef = { name: "pincode", label: "Pincode", placeholder: "6 digits", autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 };

interface Props {
  control: Control<CustomerInput>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  serverError: string | null;
}

export function CheckoutForm({ control, onSubmit, serverError }: Props) {
  return (
    <form id="checkout-form" onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Who is it for?</h2>
        <TextField control={control} def={NAME} />
        <TextField control={control} def={PHONE} />
        <p className="-mt-2 text-sm text-ink/70">Order updates come on WhatsApp.</p>
      </section>

      <section className="space-y-4 border-t border-ink/10 pt-6">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Where should we send it?</h2>
        <TextField control={control} def={ADDRESS1} />
        <TextField control={control} def={ADDRESS2} />
        <div className="grid grid-cols-2 gap-3">
          <TextField control={control} def={PINCODE} />
          <TextField control={control} def={CITY} />
        </div>
      </section>

      <section className="border-t border-ink/10 pt-6">
        <div className="flex items-start gap-3 rounded-2xl bg-ink/5 p-4">
          <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
          <div>
            <p className="text-sm font-bold text-ink">Pay securely on the next step</p>
            <p className="text-sm text-ink/70">UPI, cards or net banking through Razorpay. Orders can&apos;t be cancelled once paid, so please check your cart first.</p>
          </div>
        </div>
        {serverError && <p role="alert" className="mt-4 text-sm font-medium text-destructive">{serverError}</p>}
      </section>
    </form>
  );
}
