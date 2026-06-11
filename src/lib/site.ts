/** Canonical site origin — override with NEXT_PUBLIC_SITE_URL at deploy time. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://charter.vercel.app").replace(/\/$/, "");

/** Routes exposed to crawlers / sitemap. */
export const PUBLIC_ROUTES = ["", "/dashboard", "/templates", "/pricing", "/docs"];
