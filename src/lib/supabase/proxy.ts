import {
  ADMIN_BASE_PATH,
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
} from "@/lib/admin-route";
import { isWhitelistedAdminUser } from "@/lib/admin-whitelist";
import { getClaimsSafely } from "@/lib/supabase/auth";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function clearSupabaseAuthCookies(
  request: NextRequest,
  response: NextResponse
) {
  request.cookies
    .getAll()
    .filter(({ name }) => name.startsWith("sb-"))
    .forEach(({ name }) => response.cookies.delete(name));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // With Fluid compute, don't put this client in a global variable.
  // Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and getClaims().
  // IMPORTANT: removing getClaims() may cause users to be randomly logged out.
  const user = await getClaimsSafely(supabase);

  const isAdminLoginPath = request.nextUrl.pathname.startsWith(ADMIN_LOGIN_PATH);
  const isProtectedAdminPath =
    request.nextUrl.pathname.startsWith(ADMIN_BASE_PATH) && !isAdminLoginPath;

  if (isProtectedAdminPath && !isWhitelistedAdminUser(user)) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    const response = NextResponse.redirect(url);
    clearSupabaseAuthCookies(request, response);
    return response;
  }

  if (
    (request.nextUrl.pathname === ADMIN_LOGIN_PATH ||
      request.nextUrl.pathname === ADMIN_BASE_PATH) &&
    isWhitelistedAdminUser(user)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_DASHBOARD_PATH;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
