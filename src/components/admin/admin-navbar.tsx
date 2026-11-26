import Link from "next/link";
import { Flame, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { ADMIN_DASHBOARD_PATH } from "@/lib/admin-route";
import { getClaimsSafely } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AdminNavLinks } from "./admin-nav-links";

export async function AdminNavbar() {
  const supabase = await createClient();
  const claims = await getClaimsSafely(supabase);
  const email = typeof claims?.email === "string" ? claims.email : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8D8CC] bg-[#F9F4F0]/95 backdrop-blur shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={ADMIN_DASHBOARD_PATH} className="flex items-center gap-1.5 font-bold text-lg text-brand">
            <Flame className="w-5 h-5" />
            Foodlogin
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand/60 border border-brand/30 rounded-full px-2 py-0.5 hidden sm:block">
            Admin
          </span>
          <AdminNavLinks />
        </div>
        <div className="flex items-center gap-3">
          {email && (
            <span className="text-xs text-muted-foreground hidden md:block truncate max-w-[180px]">
              {email}
            </span>
          )}
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm" className="gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
