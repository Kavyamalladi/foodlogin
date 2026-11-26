// Run once: npx tsx --env-file=.env.local src/lib/seed.ts

import { createClient } from "@supabase/supabase-js";

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// ---------------------------------------------------------------------------
// Category + variant definitions
// ---------------------------------------------------------------------------

const NEW_CATEGORIES = [
  { name: "Snacks", slug: "snacks", sort_order: 5 },
  { name: "Laddus", slug: "laddus", sort_order: 6 },
  { name: "Dry Mutton", slug: "dry-mutton", sort_order: 7 },
];

type VariantDef = { weight: string; price: number; sort_order: number };
type ProductDef = { name: string; categorySlug: string; sort_order: number; variants: VariantDef[] };

const PRODUCTS: ProductDef[] = [
  // --- NON VEG PICKLES ---
  {
    name: "Chicken Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 1,
    variants: [
      { weight: "250g", price: 249, sort_order: 1 },
      { weight: "500g", price: 499, sort_order: 2 },
      { weight: "1kg", price: 999, sort_order: 3 },
    ],
  },
  {
    name: "Boneless Chicken Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 2,
    variants: [
      { weight: "250g", price: 349, sort_order: 1 },
      { weight: "500g", price: 649, sort_order: 2 },
      { weight: "1kg", price: 1299, sort_order: 3 },
    ],
  },
  {
    name: "Gongura Chicken Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 3,
    variants: [
      { weight: "250g", price: 299, sort_order: 1 },
      { weight: "500g", price: 599, sort_order: 2 },
      { weight: "1kg", price: 1199, sort_order: 3 },
    ],
  },
  {
    name: "Gongura Boneless Chicken Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 4,
    variants: [
      { weight: "250g", price: 375, sort_order: 1 },
      { weight: "500g", price: 749, sort_order: 2 },
      { weight: "1kg", price: 1499, sort_order: 3 },
    ],
  },
  {
    name: "Chicken Lollipop Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 5,
    variants: [
      { weight: "250g", price: 325, sort_order: 1 },
      { weight: "500g", price: 649, sort_order: 2 },
      { weight: "1kg", price: 1199, sort_order: 3 },
    ],
  },
  {
    name: "Mutton Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 6,
    variants: [
      { weight: "250g", price: 449, sort_order: 1 },
      { weight: "500g", price: 899, sort_order: 2 },
      { weight: "1kg", price: 1799, sort_order: 3 },
    ],
  },
  {
    name: "Gongura Mutton Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 7,
    variants: [
      { weight: "250g", price: 525, sort_order: 1 },
      { weight: "500g", price: 1049, sort_order: 2 },
      { weight: "1kg", price: 2099, sort_order: 3 },
    ],
  },
  {
    name: "Prawns Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 8,
    variants: [
      { weight: "250g", price: 449, sort_order: 1 },
      { weight: "500g", price: 899, sort_order: 2 },
      { weight: "1kg", price: 1799, sort_order: 3 },
    ],
  },
  {
    name: "Gongura Prawns Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 9,
    variants: [
      { weight: "250g", price: 525, sort_order: 1 },
      { weight: "500g", price: 1049, sort_order: 2 },
      { weight: "1kg", price: 2099, sort_order: 3 },
    ],
  },
  {
    name: "Fish Pickle",
    categorySlug: "non-veg-pickles",
    sort_order: 10,
    variants: [
      { weight: "250g", price: 399, sort_order: 1 },
      { weight: "500g", price: 799, sort_order: 2 },
      { weight: "1kg", price: 1599, sort_order: 3 },
    ],
  },

  // --- VEG PICKLES ---
  {
    name: "Mango Pickle",
    categorySlug: "veg-pickles",
    sort_order: 1,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 249, sort_order: 2 },
      { weight: "1kg", price: 499, sort_order: 3 },
    ],
  },
  {
    name: "Lemon Pickle",
    categorySlug: "veg-pickles",
    sort_order: 2,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 249, sort_order: 2 },
      { weight: "1kg", price: 499, sort_order: 3 },
    ],
  },
  {
    name: "Pandu Mirchi Pickle",
    categorySlug: "veg-pickles",
    sort_order: 3,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 249, sort_order: 2 },
      { weight: "1kg", price: 499, sort_order: 3 },
    ],
  },
  {
    name: "Tomato Pickle",
    categorySlug: "veg-pickles",
    sort_order: 4,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 249, sort_order: 2 },
      { weight: "1kg", price: 499, sort_order: 3 },
    ],
  },
  {
    name: "Chinthokku Pickle",
    categorySlug: "veg-pickles",
    sort_order: 5,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 259, sort_order: 2 },
      { weight: "1kg", price: 499, sort_order: 3 },
    ],
  },
  {
    name: "Mushroom Pickle",
    categorySlug: "veg-pickles",
    sort_order: 6,
    variants: [
      { weight: "250g", price: 325, sort_order: 1 },
      { weight: "500g", price: 649, sort_order: 2 },
      { weight: "1kg", price: 1299, sort_order: 3 },
    ],
  },

  // --- SNACKS ---
  {
    name: "Karam Gavvalu",
    categorySlug: "snacks",
    sort_order: 1,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 225, sort_order: 2 },
      { weight: "1kg", price: 449, sort_order: 3 },
    ],
  },
  {
    name: "Chekkilalu",
    categorySlug: "snacks",
    sort_order: 2,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 225, sort_order: 2 },
      { weight: "1kg", price: 449, sort_order: 3 },
    ],
  },
  {
    name: "Nippatlu",
    categorySlug: "snacks",
    sort_order: 3,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 225, sort_order: 2 },
      { weight: "1kg", price: 449, sort_order: 3 },
    ],
  },
  {
    name: "Masala Pallilu",
    categorySlug: "snacks",
    sort_order: 4,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 225, sort_order: 2 },
      { weight: "1kg", price: 449, sort_order: 3 },
    ],
  },
  {
    name: "Karam Boondi",
    categorySlug: "snacks",
    sort_order: 5,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 199, sort_order: 2 },
      { weight: "1kg", price: 399, sort_order: 3 },
    ],
  },
  {
    name: "Beetroot Chekkilaalu",
    categorySlug: "snacks",
    sort_order: 6,
    variants: [
      { weight: "250g", price: 149, sort_order: 1 },
      { weight: "500g", price: 299, sort_order: 2 },
      { weight: "1kg", price: 599, sort_order: 3 },
    ],
  },
  {
    name: "Vaamu Kaaralu",
    categorySlug: "snacks",
    sort_order: 7,
    variants: [
      { weight: "250g", price: 149, sort_order: 1 },
      { weight: "500g", price: 299, sort_order: 2 },
      { weight: "1kg", price: 499, sort_order: 3 },
    ],
  },

  // --- SWEETS ---
  {
    name: "Chenikkaya Kajjikayalu",
    categorySlug: "sweets",
    sort_order: 1,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 225, sort_order: 2 },
      { weight: "1kg", price: 449, sort_order: 3 },
    ],
  },
  {
    name: "Pappula Kajjikayalu",
    categorySlug: "sweets",
    sort_order: 2,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 225, sort_order: 2 },
      { weight: "1kg", price: 449, sort_order: 3 },
    ],
  },
  {
    name: "Bellam Gavvalu",
    categorySlug: "sweets",
    sort_order: 3,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 225, sort_order: 2 },
      { weight: "1kg", price: 449, sort_order: 3 },
    ],
  },
  {
    name: "Pakam Pappu",
    categorySlug: "sweets",
    sort_order: 4,
    variants: [
      { weight: "250g", price: 109, sort_order: 1 },
      { weight: "500g", price: 199, sort_order: 2 },
      { weight: "1kg", price: 399, sort_order: 3 },
    ],
  },
  {
    name: "Ariselu",
    categorySlug: "sweets",
    sort_order: 5,
    variants: [
      { weight: "250g", price: 150, sort_order: 1 },
      { weight: "500g", price: 275, sort_order: 2 },
      { weight: "1kg", price: 549, sort_order: 3 },
    ],
  },
  {
    name: "Neyyi Ariselu",
    categorySlug: "sweets",
    sort_order: 6,
    variants: [
      { weight: "250g", price: 199, sort_order: 1 },
      { weight: "500g", price: 399, sort_order: 2 },
      { weight: "1kg", price: 799, sort_order: 3 },
    ],
  },
  {
    name: "Arisela Pakam",
    categorySlug: "sweets",
    sort_order: 7,
    variants: [
      { weight: "250g", price: 125, sort_order: 1 },
      { weight: "500g", price: 249, sort_order: 2 },
      { weight: "1kg", price: 449, sort_order: 3 },
    ],
  },

  // --- PODI ---
  {
    name: "Chenikkaya Podi",
    categorySlug: "podi",
    sort_order: 1,
    variants: [
      { weight: "250g", price: 149, sort_order: 1 },
      { weight: "500g", price: 249, sort_order: 2 },
      { weight: "1kg", price: 499, sort_order: 3 },
    ],
  },
  {
    name: "Rasam Podi",
    categorySlug: "podi",
    sort_order: 2,
    variants: [
      { weight: "250g", price: 199, sort_order: 1 },
      { weight: "500g", price: 399, sort_order: 2 },
      { weight: "1kg", price: 799, sort_order: 3 },
    ],
  },
  {
    name: "Garam Masala",
    categorySlug: "podi",
    sort_order: 3,
    variants: [
      { weight: "250g", price: 199, sort_order: 1 },
      { weight: "500g", price: 399, sort_order: 2 },
      { weight: "1kg", price: 799, sort_order: 3 },
    ],
  },
  {
    name: "Karam Podi",
    categorySlug: "podi",
    sort_order: 4,
    variants: [
      { weight: "250g", price: 199, sort_order: 1 },
      { weight: "500g", price: 399, sort_order: 2 },
      { weight: "1kg", price: 799, sort_order: 3 },
    ],
  },

  // --- LADDUS ---
  {
    name: "Foodlogin Special Laddu",
    categorySlug: "laddus",
    sort_order: 1,
    variants: [{ weight: "500g", price: 0, sort_order: 1 }],
  },
  {
    name: "Boondi Laddu",
    categorySlug: "laddus",
    sort_order: 2,
    variants: [{ weight: "500g", price: 0, sort_order: 1 }],
  },
  {
    name: "Dry Fruit Laddu",
    categorySlug: "laddus",
    sort_order: 3,
    variants: [{ weight: "500g", price: 0, sort_order: 1 }],
  },
  {
    name: "Navvula Laddu",
    categorySlug: "laddus",
    sort_order: 4,
    variants: [{ weight: "500g", price: 0, sort_order: 1 }],
  },
  {
    name: "Ravva Laddu",
    categorySlug: "laddus",
    sort_order: 5,
    variants: [{ weight: "500g", price: 0, sort_order: 1 }],
  },
  {
    name: "Flax Seed Laddu",
    categorySlug: "laddus",
    sort_order: 6,
    variants: [{ weight: "500g", price: 0, sort_order: 1 }],
  },

  // --- DRY MUTTON ---
  {
    name: "Dry Mutton",
    categorySlug: "dry-mutton",
    sort_order: 1,
    variants: [
      { weight: "250g", price: 1125, sort_order: 1 },
      { weight: "500g", price: 2250, sort_order: 2 },
      { weight: "1kg", price: 4499, sort_order: 3 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

async function seed() {
  console.log("=== Foodlogin Seed ===\n");

  // Step 1: Insert new categories (plain insert — skip if slug already exists)
  console.log("Inserting new categories...");
  for (const cat of NEW_CATEGORIES) {
    const { error } = await adminClient.from("categories").insert(cat);
    if (error) {
      if (error.code === "23505") {
        console.log(`  skip  ${cat.name} (already exists)`);
      } else {
        console.error(`  ERROR inserting category ${cat.name}:`, error.message);
        process.exit(1);
      }
    } else {
      console.log(`  ✓ ${cat.name}`);
    }
  }

  // Step 2: Fetch all category IDs
  const ALL_SLUGS = [
    "veg-pickles",
    "non-veg-pickles",
    "sweets",
    "podi",
    "snacks",
    "laddus",
    "dry-mutton",
  ];
  const { data: cats, error: catFetchError } = await adminClient
    .from("categories")
    .select("id, slug")
    .in("slug", ALL_SLUGS);

  if (catFetchError || !cats) {
    console.error("Failed to fetch categories:", catFetchError?.message);
    process.exit(1);
  }

  const catMap: Record<string, string> = {};
  for (const c of cats) catMap[c.slug] = c.id;

  const missingSlugs = ALL_SLUGS.filter((s) => !catMap[s]);
  if (missingSlugs.length > 0) {
    console.error("Missing category slugs in DB:", missingSlugs);
    process.exit(1);
  }

  console.log(`\nFetched ${cats.length} categories. Inserting products...\n`);

  // Step 3: Insert products + variants
  let productCount = 0;
  let variantCount = 0;

  for (const product of PRODUCTS) {
    const categoryId = catMap[product.categorySlug];

    const { data: inserted, error: productError } = await adminClient
      .from("products")
      .insert({
        category_id: categoryId,
        name: product.name,
        description: null,
        image_url: null,
        sort_order: product.sort_order,
      })
      .select("id")
      .single();

    if (productError || !inserted) {
      console.error(`  ERROR inserting product "${product.name}":`, productError?.message);
      process.exit(1);
    }

    const productId = inserted.id;
    const variantRows = product.variants.map((v) => ({
      product_id: productId,
      weight: v.weight,
      price: v.price,
      sort_order: v.sort_order,
    }));

    const { error: variantError } = await adminClient
      .from("product_variants")
      .insert(variantRows);

    if (variantError) {
      console.error(`  ERROR inserting variants for "${product.name}":`, variantError.message);
      process.exit(1);
    }

    productCount++;
    variantCount += variantRows.length;
    console.log(`  ✓ ${product.name} (${variantRows.length} variant${variantRows.length > 1 ? "s" : ""})`);
  }

  console.log(`\n=== Done ===`);
  console.log(`Products inserted: ${productCount}`);
  console.log(`Variants inserted: ${variantCount}`);
}

seed().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
