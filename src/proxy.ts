import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Only admin routes need Supabase session refresh and auth redirects.
// Storefront is anonymous — running getClaims() on every public hit wastes Fluid/edge quota.
export const config = {
  matcher: ["/console-7k3f", "/console-7k3f/:path*"],
};
