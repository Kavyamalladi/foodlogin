"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { updateProduct, uploadProductImage } from "@/actions/admin";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import { ImageUploader } from "@/components/admin/image-uploader";

const variantSchema = z.object({
  id: z.string().optional(),
  weight: z.string().min(1, "Weight is required"),
  price: z.coerce.number().int().positive("Price must be a positive number"),
  deleted: z.boolean().optional(),
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  variants: z
    .array(variantSchema)
    .refine(
      (variants) => variants.some((v) => !v.deleted),
      "At least one variant is required"
    ),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  productId: string;
  defaultValues: {
    name: string;
    description: string;
    categoryId: string;
    imageUrl?: string | null;
    variants: Array<{ id: string; weight: string; price: number }>;
  };
  categories: Array<{ id: string; name: string }>;
};

export function EditProductForm({ productId, defaultValues, categories }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description,
      categoryId: defaultValues.categoryId,
      variants: defaultValues.variants,
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  function handleDeleteVariant(index: number) {
    const field = fields[index];
    if (field.id) {
      // Existing variant — toggle deleted state (allows undo before submit)
      update(index, { ...field, deleted: !field.deleted });
    } else {
      // New unsaved variant — just remove
      remove(index);
    }
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const productName = values.name.toLowerCase().replace(/\s+/g, "-");
      let imageUrl: string | undefined;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        imageUrl = await uploadProductImage(formData, productName);
      }

      await updateProduct({
        productId,
        name: values.name,
        description: values.description ?? "",
        categoryId: values.categoryId,
        variants: values.variants,
        imageUrl,
      });
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const activeVariantCount = fields.filter((f) => !f.deleted).length;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Product details */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product details</p>

        <div>
          <p className="text-sm font-medium mb-2">Image</p>
          <ImageUploader
            currentImageUrl={defaultValues.imageUrl}
            onChange={setImageFile}
          />
        </div>

        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" aria-invalid={fieldState.invalid} {...field} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                id="description"
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 aria-invalid:border-destructive resize-none"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Category</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      {/* Variants */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Variants</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-[#E8D8CC]"
            onClick={() => append({ weight: "", price: 0 })}
          >
            + Add
          </Button>
        </div>

        {form.formState.errors.variants?.root && (
          <p className="text-sm text-destructive">{form.formState.errors.variants.root.message}</p>
        )}

        {activeVariantCount === 0 && (
          <p className="text-sm text-muted-foreground">No variants. Add at least one.</p>
        )}

        <div className="space-y-3">
          {fields.map((fieldItem, index) => {
            const isDeleted = fieldItem.deleted;
            return (
              <div
                key={fieldItem.id ?? index}
                className={`rounded-xl p-3 space-y-3 transition-opacity ${isDeleted ? "bg-red-50 border border-red-200 opacity-60" : "bg-[#F9F4F0]"}`}
              >
                <div className="flex items-center justify-between">
                  {isDeleted ? (
                    <p className="text-xs font-semibold text-destructive line-through">
                      {fieldItem.weight} — ₹{fieldItem.price} · will be removed
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-muted-foreground">Variant {index + 1}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteVariant(index)}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                      isDeleted
                        ? "text-green-700 hover:bg-green-100"
                        : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    }`}
                  >
                    {isDeleted ? "Undo" : <X className="w-4 h-4" />}
                  </button>
                </div>
                {!isDeleted && (
                  <div className="grid grid-cols-2 gap-3">
                    <Controller
                      control={form.control}
                      name={`variants.${index}.weight`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`weight-${index}`}>Weight</FieldLabel>
                          <Input
                            id={`weight-${index}`}
                            placeholder="e.g. 250g"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`variants.${index}.price`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`price-${index}`}>Price (₹)</FieldLabel>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {serverError && (
        <div className="rounded-xl bg-destructive/5 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive">{serverError}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button variant="custom" type="submit" disabled={form.formState.isSubmitting} className="w-full h-11">
          {form.formState.isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        <button
          type="button"
          onClick={() => router.push(`${ADMIN_BASE_PATH}/products`)}
          className="w-full text-sm text-muted-foreground hover:text-brand transition-colors py-1"
        >
          Discard changes
        </button>
      </div>
    </form>
  );
}
