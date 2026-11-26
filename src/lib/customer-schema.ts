import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  address1: z.string().min(1, "Address is required").max(500, "Address is too long"),
  address2: z.string().max(500, "Address is too long").optional(),
  city: z.string().min(1, "City is required").max(100, "City name is too long"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

export type CustomerInput = z.infer<typeof customerSchema>;
