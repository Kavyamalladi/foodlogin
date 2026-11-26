"use client";

import { ADMIN_BASE_PATH, ADMIN_DASHBOARD_PATH } from "@/lib/admin-route";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: ADMIN_DASHBOARD_PATH },
  { label: "Orders", href: `${ADMIN_BASE_PATH}/orders` },
  { label: "Products", href: `${ADMIN_BASE_PATH}/products` },
  { label: "Categories", href: `${ADMIN_BASE_PATH}/categories` },
];

export function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex items-center gap-1">
      {links.map(({ label, href }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand/10 text-brand"
                : "text-foreground hover:bg-brand/5 hover:text-brand"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
