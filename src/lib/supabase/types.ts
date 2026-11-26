export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  weight: string;
  price: number;
  sort_order: number;
};

export type OrderStatus = "pending" | "paid" | "preparing" | "delivered" | "expired";

export type Order = {
  id: string;
  phone: string;
  name: string;
  address: string;
  subtotal: number;
  delivery_charge: number;
  total: number;
  status: OrderStatus;
  razorpay_link_id: string | null;
  razorpay_link_url: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_weight: string;
  product_image_url: string | null;
  price: number;
  quantity: number;
};

export type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

// Subset of Order used by the orders list page — only the columns actually fetched.
export type OrderListItem = Pick<Order, "id" | "name" | "phone" | "total" | "status" | "created_at">;
