import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://unhirvdlusbujymqervh.supabase.co";
const DEFAULT_SERVICE_KEY = "dummy-service-role-key-for-build";

// Admin client uses the service role key — bypasses RLS.
// Only import this in server actions and API routes, never in client components.
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_KEY,
  { auth: { persistSession: false } }
);
