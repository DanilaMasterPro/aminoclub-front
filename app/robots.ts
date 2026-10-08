import type { MetadataRoute } from "next";
import { siteUrl } from "@/utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      // Service pages: carts, checkout, payment results, accounts and the API.
      disallow: ["/admin", "/trainer", "/login", "/cart", "/checkout", "/order/", "/thank-you", "/api/"],
    }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
