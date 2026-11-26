# Foodlogin

Home food e-commerce site for a local business selling handmade pickles, sweets, and podi. Mobile-first, anonymous checkout, Razorpay payments.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **Supabase** — database, auth, storage
- **Razorpay** — inline checkout popup (Orders API)
- **Vercel** — hosting + cron jobs

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `RAZORPAY_KEY_ID` | Razorpay key ID (server-only) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key ID (client-side popup) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret |
| `NEXT_PUBLIC_BASE_URL` | Full URL e.g. `http://localhost:3000` |
| `DELIVERY_CHARGE` | Flat delivery fee in rupees (e.g. `100`) |

### 3. Seed the database (first time only)

```bash
npx tsx --env-file=.env.local src/lib/seed.ts
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev        # development server
npm run build      # production build
npm run lint       # ESLint
npx tsc --noEmit   # type check
```

## Project Structure

```
src/
├── app/
│   ├── (customer)/     # Customer-facing pages
│   ├── admin/          # Admin panel (auth-protected)
│   └── api/            # API routes (Razorpay webhook)
├── actions/            # Server actions
├── components/         # Reusable UI components
├── lib/                # Supabase clients, schemas, utilities
└── store/              # Zustand cart store
``` 

## Key Pages

| Route | Description |
|---|---|
| `/` | Home — hero, categories, all products |
| `/shop/[category]` | Products filtered by category |
| `/products/[id]` | Product detail + variant picker |
| `/cart` | Cart with quantity controls |
| `/checkout` | Order form + Razorpay payment |
| `/order/[id]` | Order confirmation |
| `/admin/orders` | Manage orders (admin) |
| `/admin/products` | Manage products (admin) |
| `/admin/categories` | Manage categories (admin) |

## Payment Flow

1. Customer fills checkout form (phone, name, address)
2. Server action creates a Razorpay order and inserts DB record atomically
3. Razorpay popup opens inline — no redirect
4. On payment success, HMAC-SHA256 signature is verified server-side
5. Order marked `paid`, cart cleared, customer redirected to confirmation page
6. Razorpay webhook fires as a backup (idempotent)

## Admin Access

Single owner account via Supabase Auth (email + password). All `/admin` routes are protected via `src/proxy.ts`.
 