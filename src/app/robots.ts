import type { MetadataRoute } from "next";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [`${ADMIN_BASE_PATH}/`, "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
