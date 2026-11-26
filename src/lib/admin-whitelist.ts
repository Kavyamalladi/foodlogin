/**
 * Admin UI and actions are restricted to the email in ADMIN_EMAIL (must match Supabase Auth JWT).
 */
export function isWhitelistedAdminUser(
  claims: { email?: unknown } | null | undefined
): boolean {
  const expected = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!expected) return false;

  const raw = claims?.email;
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return email !== "" && email === expected;
}
