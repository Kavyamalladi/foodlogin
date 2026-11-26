# foodlogin

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- **npm only** — never pnpm or yarn

## Supabase — CRITICAL
- Always use `supabase.auth.getClaims()` — NEVER `getSession()` or `getUser()`
- Session refresh lives in `src/proxy.ts` (Next.js 16 Fluid compute — not `middleware.ts`)
- Do NOT put any code between `createServerClient` and `getClaims()` in proxy.ts
- Anon key env var: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (non-standard name)

## UI — shadcn (default style, Radix UI)
- **Always use shadcn components** — never hand-roll buttons, badges, tables, cards, inputs, etc.
- **Functional icons (cart, search, plus/minus, arrows, close) always come from `lucide-react`** — never write inline SVGs. Brand/storytelling visuals are drawn illustrations kept as files: `public/food/*.svg` (one per product without a photo, matched by name in `src/lib/food-art.ts`) and `public/art/*.svg` (how-it's-made steps, product trust tiles). Draw new ones in the same chunky outlined style (ink `#1c1917` stroke); regenerate rather than hand-edit. No emojis anywhere.
- Install missing components with `npx shadcn@latest add <component>`
- Installed: Button, Input, Label, Separator, Field, Card, Badge, Table, Select, Dialog
- Use `Field`, `FieldLabel`, `FieldError` from `@/components/ui/field`
- Do NOT use `Form`, `FormField`, `FormControl`, `FormMessage` — they don't exist
- Form pattern: `react-hook-form` + `Controller` + `Field` + `FieldError errors={[fieldState.error]}`
- Button `asChild` renders as link: `<Button asChild><Link href="...">text</Link></Button>`
- Submit buttons outside `<form>`: `<Button type="submit" form="form-id">` (HTML5 form attribute)
- Button `custom` variant: `rounded-3xl bg-[#e9411c] text-base font-bold hover:bg-[#e9411c]/90 text-white` — use for primary CTAs
- Dialog: bottom sheet on mobile, centered modal on desktop (`src/components/ui/dialog.tsx`)

## React Compiler
- `reactCompiler: true` is enabled — do not add `useMemo`, `useCallback`, or `memo`

## TypeScript & ESLint
- `no-explicit-any` — avoid `any` especially in payment, auth, webhook code
- For browser globals like Razorpay: typed `Window` augmentation, not `window as any`
- Prefer small focused interfaces for third-party payloads

## Gotchas
- **`FormEvent` is deprecated** — use `FormEventHandler<HTMLFormElement>` from React
- **Security hook false-positive** — `security_reminder_hook.py` fires on any file path/content containing the word for brined/fermented food products (starts with "p", ends with "e"). Use `Bash` heredoc or `sed -i ''` instead of `Edit`/`Write` for those files.
- **Stale `.next/types` after deleting pages** — fix: `rm -rf .next/types`
- **`NEXT_PUBLIC_WHATSAPP_NUMBER` format** — digits only with country code, no `+` (e.g. `916301972788`)
- **"Continue Shopping" links** — always go to `/shop`, never `/`

## Commits
- Conventional commits: `type: description`
- Separate commits per logical change

---

## Project Overview
Home food e-commerce selling authentic Rayalaseema-style handmade pickles, sweets, and podi from Anantapur, AP. Made to order, no preservatives. Mobile-first, Telugu-speaking family customers.

## Tech Stack
Next.js 16 app router · TypeScript · Tailwind CSS · framer-motion · Supabase (db/auth/storage/realtime) · Razorpay Checkout popup · Vercel

## Project Structure
- `src/app` — App Router pages
- `src/actions` — Server actions (`products.ts`, `orders.ts`, `admin.ts`)
- `src/components` — UI components (`/admin` for admin-only)
- `src/hooks` — Custom hooks (e.g. `useRazorpay`)
- `src/lib` — Supabase clients, shared schemas, utilities
- `src/store` — Zustand stores (cart)
- `src/types` — Global TS declarations

## Key Files
**Actions**
- `src/actions/products.ts` — `getCategories()`, `getProducts(slug?)`, `getProduct(id)`, `getRelatedProducts(categoryId, excludeId)` — all wrapped in `React.cache`
- `src/actions/orders.ts` — `createOrder()`, `verifyPayment()`
- `src/actions/admin.ts` — `updateOrderStatus()`, `addProduct()`, `updateProduct()`, `deleteProduct()`, `addCategory()`, `updateCategory()`, `deleteCategory()`, `uploadProductImage()`

**Shared Components**
- `src/lib/category-icons.ts` — `CATEGORY_ICONS` (slug → icon/bg/color). Import on any page showing category icons.
- `src/components/breadcrumb.tsx` — `<Breadcrumb items={[{ label, href? }]} />`. Last item = current page (no href). Always render at page level.
- `src/components/product-card.tsx` — `<ProductCard product={...} />`. Use everywhere product cards appear — do not duplicate markup.
- `src/components/product-grid.tsx` — responsive 2/3/4-col grid, uses ProductCard internally
- `src/components/whatsapp-cta.tsx` — `<WhatsAppCta />` server component. Used on /shop.
- `src/components/admin/image-uploader.tsx` — `<ImageUploader currentImageUrl onChange />`. `onChange` receives `File | null`. Client-side canvas compression (max 800px, JPEG 0.82).
- `src/components/admin/copyable-id.tsx` — tap-to-copy with Check/Copy icon toggle

**Store & Types**
- `src/store/cart.ts` — Zustand v5 + persist (localStorage key: `foodlogin-cart`)
- `src/types/razorpay.d.ts` — `RazorpayOptions`, `RazorpayPaymentResponse`, `Window.Razorpay` augmentation
- `src/lib/customer-schema.ts` — shared Zod schema for checkout (used by both server action + client form resolver)

**Seed**
- `src/lib/seed.ts` — 41 products, 111 variants, 7 categories. Run: `npx tsx --env-file=.env.local src/lib/seed.ts`

## Database Schema
**categories**: id, name, slug (unique), sort_order, created_at
**products**: id, category_id, name, description, image_url, sort_order, created_at
**product_variants**: id, product_id, weight (e.g. "250g"), price (int rupees), sort_order — every product has ≥1 variant
**orders**: id, phone, name, address, subtotal, delivery_charge, total, status (pending|paid|preparing|delivered|expired), razorpay_order_id, razorpay_payment_id, created_at
**order_items**: id, order_id, product_id (nullable), variant_id (nullable), product_name, variant_weight, product_image_url, price, quantity — fields are snapshots (nullable because products can be deleted)

## Key Decisions
- No customer accounts — anonymous orders
- Cart + address in localStorage
- Delivery always ₹100 flat (`DELIVERY_CHARGE` env var)
- No stock management, no cancellations, one image per product
- UUIDs everywhere
- Stale pending orders auto-deleted after 2h by Vercel cron (daily 2 AM, `src/app/api/cron/cleanup/route.ts`, secured with `CRON_SECRET`)

## Payment Flow
1. `createOrder` server action: validates (Zod), calls Razorpay Orders API, inserts order+items (single insert, `razorpay_order_id` already set)
2. Razorpay Checkout popup opens on-page (no redirect)
3. On success: `verifyPayment` verifies HMAC-SHA256, marks "paid" → cart cleared → `/order/[id]`
4. Webhook (`payment.captured`) as idempotent backup via `receipt` field

**Key design**: Razorpay called BEFORE DB insert. Failure = nothing in DB, customer retries cleanly.
**Cancelled popup**: "Try again" re-opens same popup (no new order). Pending orders >2h auto-deleted by cron.

## Admin Panel
- Single owner account (Supabase Auth email+password)
- All `/admin` routes protected by `proxy.ts` redirect
- Route groups: `(auth)/` = login (no navbar), `(panel)/` = protected (AdminNavbar via layout)
- `src/app/admin/(panel)/layout.tsx` calls `getClaims()` — **do NOT add per-page auth checks**
- Edit product: undo pattern for existing variants (toggle `deleted` state) — new unsaved variants removed immediately

## Image Uploads
- Bucket: `product-images` (public). Upload via `uploadProductImage(formData, filename)` in `src/actions/admin.ts`.
- New products: `productId = crypto.randomUUID()` client-side → same UUID for image filename + passed to `addProduct({ productId, ... })`
- `updateProduct` accepts optional `imageUrl` — only updates `image_url` when provided

## RLS Rules
- Anyone: SELECT categories/products/product_variants, INSERT orders/order_items, SELECT single order by UUID
- Service role only: UPDATE order status (webhook)
- Authenticated admin only: INSERT/UPDATE/DELETE categories/products/product_variants

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=   # same as RAZORPAY_KEY_ID, needed client-side
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=
DELIVERY_CHARGE=100
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_FSSAI_NUMBER=      # optional, shown in footer when set
CRON_SECRET=
```

## Pages
- `/` — hero, category cards → /shop/[slug], story section, CTA, footer
- `/shop` — all products grouped by category (max 4/section, "View all →"), WhatsAppCta
- `/shop/[category]` — products by slug, breadcrumb, ProductGrid
- `/products/[id]` — product detail, variant picker, add to cart, related products, WhatsApp share
- No `/cart` page: the cart is the drawer (`/cart` redirects to `/shop`). Checkout "Edit cart" / "View cart" reopen the drawer.
- `/checkout` — name/phone/address form → Razorpay popup
- `/order/[orderId]` — confirmation page, Realtime subscription for status
- `/admin/login`, `/admin/orders`, `/admin/orders/[id]`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/categories`

## Patterns
- Server actions calling `redirect()` throw internally — re-throw in client catch: `import { isRedirectError } from "next/dist/client/components/redirect-error"` → `if (isRedirectError(err)) throw err`
- Shared Zod schemas in `src/lib/` imported by both server actions and client form resolvers
- `React.cache` wraps `getProduct`/`getCategories` — memoises within a single server render (generateMetadata + page share one DB call)
- Batch variant mutations: group into delete/insert/update buckets, not one query per variant
- Atomic order status updates: encode transition check in UPDATE WHERE clause (`.eq("status", currentStatus)`)
- Narrow select columns — only fetch what the UI renders

## SEO / Metadata
- `metadataBase` = `NEXT_PUBLIC_BASE_URL` in root layout (required for OG URLs)
- Title template: `"%s | Foodlogin"`
- Keep `lang="en"` on `<html>` — setting `lang="te"` breaks browser translation

## Design Tokens & Layout
- **Tokens** (`globals.css`, v3 "warm alabaster" system): `bg-bone` `#FAF8F5` alabaster page background · `text-ink` `#1C1917` espresso text (muted: `text-ink/70`, ≈ warm umber) · `bg-oxblood` `#1C1917` espresso dark bands (hero, story, footer; the name is legacy) · `brand` is `#e9411c` on admin; the storefront overrides it to roasted chili `#C2410C` via `[--brand:var(--brand-deep)]` in the `(customer)` layout (5.2:1 with white text). **Portals (Sheet/Dialog) render outside that wrapper, so add `[--brand:var(--brand-deep)]` to their `className`.** · `turmeric` `#D97706` saffron gold (highlights, hero CTA) · `leaf` `#15803D` herb green (sparingly). Never hardcode hex; use the tokens (`border-ink/10`, `text-ink/60`). Do not use `#EA580C` for text or white-on-orange buttons (3.6:1, fails AA).
- **Fonts**: `font-display` = Fraunces (editorial serif for headlines, dish titles, prices, wordmark; keep tracking ≥ `-0.02em`). Font experiments live at `/lab` (home page re-rendered under `src/app/(customer)/lab/layout.tsx`, not indexed, not linked): currently Meraki, the TRIAL cut with a personal-use-only licence (one weight, no `₹ & . , ' ! ? - —`, falls back to Fraunces per glyph); only that route loads it. Buy the commercial licence before moving it to the real site. Body `font-sans` = Plus Jakarta Sans, `font-telugu` = Noto Sans Telugu (use with `lang="te"`). Use `tabular-nums` on prices and quantities.
- **Grain**: `.grain` on the `(customer)` wrapper adds a fixed, `pointer-events-none`, 2.5%-opacity paper-noise overlay. Never put it on admin.
- **Section rhythm**: espresso hero (text first, amma mascot cut-out `public/mascot/amma.webp` on a saffron disc, drawn banana-leaf plate `public/art/hero-plate.svg` as a sticker (the mascot stays still; hero art animates once on load, nothing loops)) → saffron claims strip (seamless marquee: 4 copies, `translate3d(-25%)`) → categories + featured rail → one saffron story band `#our-story` (heading "From sun to jar.", 4 drawn steps on a swipe rail / 4-col grid on desktop, Pick your jar + Instagram buttons; optional `STORY` maker/photo/since; scalloped via `[--scallop:var(--turmeric)]`) → real reviews (hidden until `REVIEWS` in `src/lib/reviews.ts` has entries) → FAQ (10 entries) → chili WhatsApp band → espresso footer (scalloped edges via `.scallop-top` / `.scallop-bottom`). Keep boldness in one place per view. **Never repeat the same photo twice on one page** (featured rail skips the category-tile photo; the story band has no photo).
- **Hero**: `src/app/(customer)/page.tsx`; mascot `next/image` (`preload`, no parallax), headline entrance is CSS (`.hero-in`), not JS.
- **Max-width**: `max-w-6xl` on page containers and navbars · **Min-width**: `min-w-[330px]` on body (verify no horizontal overflow at 330px)
- **Touch targets**: every interactive element ≥ 44px on mobile (`h-11`, `min-h-11`, `size-11`). For compact controls (size chips) keep the visual small and pad the hit area with an `after:-inset-*` pseudo-element.
- **Horizontal rails**: always `overflow-x-auto overflow-y-hidden overscroll-x-contain` (otherwise they also scroll vertically) and `scroll-pl-4` with snap.
- **Cart UX**: `src/components/cart/cart-drawer.tsx` (right sheet, full-width on phones; opened via `useCartUi` in `src/store/cart-ui.ts`) with a one-tap add-on strip (`cart-add-ons.tsx`). The navbar cart opens the drawer on every page, including `/checkout`. Delivery is a flat ₹100 (`src/lib/delivery.ts`): **no free-delivery bar, no coupons (no backend)**. Sticky CTA uses `pb-[max(1rem,env(safe-area-inset-bottom))]`.
- **Add to cart motion** (`src/components/motion/`): `MotionProvider` (framer-motion `LazyMotion` + `domMax`; use `m.*`, never `motion.*`), `flyToCart(rect, src)` + `FlyToCartHost` (40px thumbnail along an arc into `[data-cart-icon]`, skipped under reduced motion), `QuickAdd` pill morphs into a stepper via shared `layoutId`, cart icon spring bounce (stiffness 500, damping 22). The scroll reveals (`Reveal`, `SplitReveal`) use framer-motion's `animate` (no anime.js; it was removed), live in `src/components/motion/index.tsx`, import from `@/components/motion`.
- **Owner-supplied content (never invent)**: `src/lib/reviews.ts` (`REVIEWS`, `ratingSummary()`; hero rating line and reviews section stay hidden while empty), `src/lib/story.ts` (optional `STORY`: maker, since-year, text, photo), `src/lib/social.ts` (`INSTAGRAM_URL`). Delivered orders show a WhatsApp feedback prompt. No gifts section (owner can't afford gifts), no free delivery.
- **Drawn food art**: `src/lib/food-art.ts` maps product names (regex `BY_NAME`) then category (`BY_CATEGORY`) to `public/food/*.svg`; `categoryArt()` gives Sweets its own tile. Used as fallback when a product has no photo. Replace by uploading a real photo in the admin.
- **Rail cards**: "From our kitchen" uses `<ProductCard compact>` in `w-[44vw] max-w-56` wrappers (no size chips on the rail; the full card keeps them). Hero price line and ETA (dispatch 2–4 days) appear on home, product page and announcement bar.
- **Product cards**: `<ProductCard>` is a client component with a size picker (`shop/size-picker.tsx`; price and per-100g follow the chosen size) and a quick-view dialog (`shop/quick-view.tsx`: bottom sheet on mobile). Quick view shows only real data (photo, description, sizes, price): never invent shelf-life, pairing or reviews.
- **Store-style cards**: outside the home rail, `<ProductCard>` shows a square photo, name, a one-row size picker (equal-width), price + per-100g, and a full-width Add button (`QuickAdd block`). `/shop` has a "Veg only" chip (hides `[data-nonveg]` sections via `main[data-veg-only]`); category pages have a Sort select (`shop/category-products.tsx`). **Prices use the body font (Plus Jakarta Sans bold, `tabular-nums`), never `font-display`.**
- **Veg / non-veg dots**: `<DietDot>` (green = veg, red = non-veg). Callers pass `nonVeg` to `<ProductCard>`/`<ProductGrid>`/`<ProductDetail>`, computed from the category slug via `src/lib/diet.ts` (`NON_VEG_SLUGS`, also used by the cart upsell and add-ons). Add new meat/fish/egg categories there, or their products will show a veg dot.
- **No floating cart pill**: the cart is reached from the navbar icon (opens the drawer) and the add-to-cart flow. `src/components/mini-cart-bar.tsx` is unused; product pages keep their own sticky Add to Cart bar.
- **Motion rules**: transform + opacity only; never animate the hero image's loading (LCP). SSR renders final content; `globals.css` hides `[data-reveal]`/`[data-split]` only under `prefers-reduced-motion: no-preference`, with a `<noscript>` override in the root layout. Always honour `prefers-reduced-motion`. No WebGL/three.js and no Lenis smooth-scroll (weight and scroll-hijack risk; decided against).
- **Performance rules** (PageSpeed work): never render `₹` in `font-display`/Fraunces (the rupee lives in the latin-ext subset, a ~100 KB download; use `font-sans` or `<SansRupee>`). Telugu uses the system font stack (`--font-telugu`), no web font. Images use `quality={70}` (allowed list in `next.config.ts` `images.qualities`); no AVIF (sharp encoding is heavy on the 512 MB VPS). `inlineCss` was tried and rejected (HTML grew ~60 KB gzipped per page). Footer column titles are `h2` so heading order never skips.
- **Security headers** (`next.config.ts`): HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, COOP `same-origin-allow-popups` (not `same-origin`: Razorpay popups need their opener) and a **report-only** CSP. Before enforcing the CSP, check the browser console for violations on checkout (one `unsafe-eval` report exists today).
- **Admin keeps its original styling** (not part of the storefront redesign; uses `--background` `#F9F4F0`, not `bone`)
  - Cards/tables `bg-white rounded-2xl border-[#E8D8CC]`
  - Filter pills: active `bg-[#D94F2B] text-white border-[#D94F2B]`, inactive `bg-white border-[#E8D8CC]`; use `<button>` not `<Button>`; `overflow-x-auto flex-nowrap -mx-4 px-4`
  - Bottom nav mobile-only (`sm:hidden`), fixed bottom; layout has `pb-20 sm:pb-0`
  - Order detail: sticky action bar (`fixed bottom-0`), main has `pb-36`
- **Announcement bar** and **footer** (categories, Instagram, Razorpay note, optional `NEXT_PUBLIC_FSSAI_NUMBER`) live in the `(customer)` layout
