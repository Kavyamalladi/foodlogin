-- Security fix: close public access to customer data and stop "any signed-in user" from editing the catalog.
--
-- Before this, anyone holding the public site key could list every order (name, phone, address) and, once customer
-- accounts exist, any customer could change prices. The app only ever touches these tables through the service role
-- (server actions, webhook, admin pages, order page), which bypasses RLS, so none of these policies are needed.
--
-- DEPLOY ORDER: ship the code that reads orders on the server (order page + /api/orders/[orderId]/status) FIRST,
-- then run this file. Running it earlier breaks the live order page.

-- Orders and order items: no public reads, no public inserts.
DROP POLICY IF EXISTS "orders_select_by_id" ON orders;
DROP POLICY IF EXISTS "orders_insert_public" ON orders;
DROP POLICY IF EXISTS "order_items_select_by_order_id" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_public" ON order_items;

-- Catalog: public can still read (storefront); writes only via the service role.
DROP POLICY IF EXISTS "categories_insert_auth" ON categories;
DROP POLICY IF EXISTS "categories_update_auth" ON categories;
DROP POLICY IF EXISTS "categories_delete_auth" ON categories;
DROP POLICY IF EXISTS "products_insert_auth" ON products;
DROP POLICY IF EXISTS "products_update_auth" ON products;
DROP POLICY IF EXISTS "products_delete_auth" ON products;
DROP POLICY IF EXISTS "product_variants_insert_auth" ON product_variants;
DROP POLICY IF EXISTS "product_variants_update_auth" ON product_variants;
DROP POLICY IF EXISTS "product_variants_delete_auth" ON product_variants;

-- Product image bucket: public can still read; uploads/overwrites/deletes only via the service role.
DROP POLICY IF EXISTS "product_images_insert_auth" ON storage.objects;
DROP POLICY IF EXISTS "product_images_update_auth" ON storage.objects;
DROP POLICY IF EXISTS "product_images_delete_auth" ON storage.objects;

-- Make sure RLS stays on (no-ops if already enabled).
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
