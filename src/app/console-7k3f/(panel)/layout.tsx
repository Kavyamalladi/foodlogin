import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-route";
import { isWhitelistedAdminUser } from "@/lib/admin-whitelist";
import { getClaimsSafely } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  if (!isWhitelistedAdminUser(claims)) redirect(ADMIN_LOGIN_PATH);

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <AdminNavbar />
      {children}
      <AdminBottomNav />
    </div>
  );
}
