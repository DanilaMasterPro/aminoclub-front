/** Public origin of the site (canonical URLs, sitemap, structured data). Set NEXT_PUBLIC_SITE_URL in prod. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
