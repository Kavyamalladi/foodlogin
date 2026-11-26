-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  weight text NOT NULL,
  price int NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  subtotal int NOT NULL,
  delivery_charge int NOT NULL DEFAULT 100,
  total int NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','preparing','delivered','expired')),
  razorpay_link_id text,
  razorpay_link_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  variant_weight text NOT NULL,
  product_image_url text,
  price int NOT NULL,
  quantity int NOT NULL DEFAULT 1
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- categories
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "categories_insert_auth"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "categories_update_auth"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "categories_delete_auth"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- products
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "products_insert_auth"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "products_update_auth"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "products_delete_auth"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- product_variants
CREATE POLICY "product_variants_select_public"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "product_variants_insert_auth"
  ON product_variants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "product_variants_update_auth"
  ON product_variants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "product_variants_delete_auth"
  ON product_variants FOR DELETE
  TO authenticated
  USING (true);

-- orders: anyone can INSERT, anyone can SELECT by id, only service_role can UPDATE
CREATE POLICY "orders_insert_public"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "orders_select_by_id"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "orders_update_service_role"
  ON orders FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- order_items: anyone can INSERT, anyone can SELECT by order_id
CREATE POLICY "order_items_insert_public"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "order_items_select_by_order_id"
  ON order_items FOR SELECT
  USING (true);

-- ============================================================
-- STORAGE
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-images', 'product-images', true);

CREATE POLICY "product_images_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "product_images_update_auth"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "product_images_delete_auth"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Veg Pickles',     'veg-pickles',     1),
  ('Non-Veg Pickles', 'non-veg-pickles', 2),
  ('Sweets',          'sweets',          3),
  ('Podi',            'podi',            4);
