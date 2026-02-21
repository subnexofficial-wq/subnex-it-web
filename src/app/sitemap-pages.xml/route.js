import { getSiteUrl } from "@/lib/site-url";

const staticPages = [
  "",
  "/automation",
  "/digital-product",
  "/subscription",
  "/products",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
];

export async function GET() {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();

  const urls = staticPages
    .map((path) => {
      const url = `${baseUrl}${path}`;
      return `  <url><loc>${url}</loc><lastmod>${now}</lastmod></url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
