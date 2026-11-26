"use server";

import { isWhitelistedAdminUser } from "@/lib/admin-whitelist";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import { getClaimsSafely } from "@/lib/supabase/auth";
import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { OrderStatus } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { errInfo, log } from "@/lib/log";

// Maps the desired next status → what the current status must be.
// Used to validate the transition atomically in a single UPDATE query.
const REQUIRED_CURRENT: Partial<Record<OrderStatus, OrderStatus>> = {
  preparing: "paid",
  delivered: "preparing",
};

async function revalidateStorefrontForProduct(productId: string, categoryId: string) {
  const { data: cat } = await adminClient
    .from("categories")
    .select("slug")
    .eq("id", categoryId)
    .single();

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/products/${productId}`);
  revalidatePath("/sitemap.xml");
  if (cat?.slug) revalidatePath(`/shop/${cat.slug}`);
}

export async function updateOrderStatus({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    log.warn("admin_unauthorized", { action: "updateOrderStatus" });
    throw new Error("Unauthorized");
  }

  const currentStatus = REQUIRED_CURRENT[status];
  if (!currentStatus) throw new Error(`Invalid target status: ${status}`);

  // Single atomic query: the WHERE includes .eq("status", currentStatus) so the update
  // only succeeds if the order is still in the expected state — no race condition.
  const { data: updated, error } = await adminClient
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("status", currentStatus)
    .select("id")
    .single();

  if (error || !updated) {
    log.warn("admin_order_status_rejected", { orderId, status, ...errInfo(error) });
    throw new Error("Order not found or invalid status transition");
  }
  log.info("admin_order_status_changed", { orderId, status });

  revalidatePath(`${ADMIN_BASE_PATH}/orders`);
  revalidatePath(`${ADMIN_BASE_PATH}/orders/${orderId}`);
}

export async function updateProduct({
  productId,
  name,
  description,
  categoryId,
  variants,
  imageUrl,
}: {
  productId: string;
  name: string;
  description: string;
  categoryId: string;
  variants: Array<{
    id?: string;
    weight: string;
    price: number;
    deleted?: boolean;
  }>;
  imageUrl?: string;
}) {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    log.warn("admin_unauthorized", { action: "updateProduct" });
    throw new Error("Unauthorized");
  }

  const updatePayload: Record<string, string> = {
    name,
    description,
    category_id: categoryId,
  };
  if (imageUrl !== undefined) updatePayload.image_url = imageUrl;

  const { error: productError } = await adminClient
    .from("products")
    .update(updatePayload)
    .eq("id", productId);

  if (productError) {
    log.error("admin_action_failed", { action: "updateProduct", ...errInfo(productError) });
    throw new Error("Failed to update product");
  }

  // Split variants into three buckets and process each with a batched/parallel query.
  // Old approach: one DB round-trip per variant (N+1). Now: at most 3 queries total.
  const toDelete = variants.filter((v) => v.deleted && v.id).map((v) => v.id!);
  const toInsert = variants.filter((v) => !v.id && !v.deleted);
  const toUpdate = variants.filter((v) => v.id && !v.deleted);

  if (toDelete.length) {
    await adminClient.from("product_variants").delete().in("id", toDelete);
  }
  if (toInsert.length) {
    await adminClient.from("product_variants").insert(
      toInsert.map((v) => ({
        product_id: productId,
        weight: v.weight,
        price: v.price,
        sort_order: 0,
      }))
    );
  }
  // Updates must be per-row (each has different values) — run in parallel, not sequentially.
  if (toUpdate.length) {
    await Promise.all(
      toUpdate.map((v) =>
        adminClient
          .from("product_variants")
          .update({ weight: v.weight, price: v.price })
          .eq("id", v.id!)
      )
    );
  }

  await revalidateStorefrontForProduct(productId, categoryId);
  revalidatePath(`${ADMIN_BASE_PATH}/products`);
  redirect(`${ADMIN_BASE_PATH}/products`);
}

export async function uploadProductImage(
  formData: FormData,
  filename: string
): Promise<string> {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    log.warn("admin_unauthorized", { action: "uploadProductImage" });
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file provided");

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${filename}.${ext}`;

  const { data: upload, error } = await adminClient.storage
    .from("product-images")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error || !upload) {
    log.error("admin_action_failed", { action: "uploadProductImage", ...errInfo(error) });
    throw new Error("Failed to upload image");
  }

  return adminClient.storage.from("product-images").getPublicUrl(upload.path)
    .data.publicUrl;
}

export async function addProduct({
  productId,
  name,
  description,
  categoryId,
  variants,
  imageUrl,
}: {
  productId: string;
  name: string;
  description: string;
  categoryId: string;
  variants: Array<{ weight: string; price: number }>;
  imageUrl?: string;
}) {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    log.warn("admin_unauthorized", { action: "addProduct" });
    throw new Error("Unauthorized");
  }

  const id = productId;

  const { error: productError } = await adminClient.from("products").insert({
    id,
    name,
    description,
    category_id: categoryId,
    image_url: imageUrl ?? null,
    sort_order: 0,
  });

  if (productError) {
    log.error("admin_action_failed", { action: "addProduct", ...errInfo(productError) });
    throw new Error("Failed to create product");
  }

  const { error: variantsError } = await adminClient
    .from("product_variants")
    .insert(
      variants.map((v, index) => ({
        product_id: id,
        weight: v.weight,
        price: v.price,
        sort_order: index,
      }))
    );

  if (variantsError) {
    log.error("admin_action_failed", { action: "addProduct", ...errInfo(variantsError) });
    throw new Error("Failed to create variants");
  }

  await revalidateStorefrontForProduct(id, categoryId);
  revalidatePath(`${ADMIN_BASE_PATH}/products`);
  redirect(`${ADMIN_BASE_PATH}/products`);
}

export async function deleteProduct({ productId }: { productId: string }) {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    log.warn("admin_unauthorized", { action: "deleteProduct" });
    throw new Error("Unauthorized");
  }

  const { data: row, error: fetchError } = await adminClient
    .from("products")
    .select("category_id")
    .eq("id", productId)
    .single();

  if (fetchError || !row) {
    log.error("admin_action_failed", { action: "deleteProduct", ...errInfo(fetchError) });
    throw new Error("Failed to delete product");
  }

  const { error } = await adminClient.from("products").delete().eq("id", productId);

  if (error) {
    log.error("admin_action_failed", { action: "deleteProduct", ...errInfo(error) });
    throw new Error("Failed to delete product");
  }

  await revalidateStorefrontForProduct(productId, row.category_id);
  revalidatePath(`${ADMIN_BASE_PATH}/products`);
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function addCategory({ name }: { name: string }) {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    log.warn("admin_unauthorized", { action: "addCategory" });
    throw new Error("Unauthorized");
  }

  const slug = toSlug(name);
  const { error } = await adminClient
    .from("categories")
    .insert({ name: name.trim(), slug, sort_order: 0 });

  if (error) throw new Error(error.message);

  revalidatePath(`${ADMIN_BASE_PATH}/categories`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/sitemap.xml");
}

export async function updateCategory({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    log.warn("admin_unauthorized", { action: "updateCategory" });
    throw new Error("Unauthorized");
  }

  const { error } = await adminClient
    .from("categories")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) {
    log.error("admin_action_failed", { action: "updateCategory", ...errInfo(error) });
    throw new Error("Failed to update category");
  }

  revalidatePath(`${ADMIN_BASE_PATH}/categories`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/sitemap.xml");
}

export async function deleteCategory({ id }: { id: string }) {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) {
    log.warn("admin_unauthorized", { action: "deleteCategory" });
    throw new Error("Unauthorized");
  }

  const { error } = await adminClient
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Cannot delete — category may still have products");

  revalidatePath(`${ADMIN_BASE_PATH}/categories`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/sitemap.xml");
}
