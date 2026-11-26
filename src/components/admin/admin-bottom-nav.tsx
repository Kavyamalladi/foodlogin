"use client";

import { ADMIN_BASE_PATH, ADMIN_DASHBOARD_PATH } from "@/lib/admin-route";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Package, LayoutGrid, LayoutDashboard } from "lucide-react";

const links = [
  { label: "Dashboard", href: ADMIN_DASHBOARD_PATH, icon: LayoutDashboard },
  { label: "Orders", href: `${ADMIN_BASE_PATH}/orders`, icon: ClipboardList },
  { label: "Products", href: `${ADMIN_BASE_PATH}/products`, icon: Package },
  { label: "Categories", href: `${ADMIN_BASE_PATH}/categories`, icon: LayoutGrid },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8D8CC] flex">
      {links.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
              isActive ? "text-brand" : "text-muted-foreground"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-brand" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
