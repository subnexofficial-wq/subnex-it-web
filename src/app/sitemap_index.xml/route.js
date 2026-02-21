import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();

  const items = [
    `${baseUrl}/sitemap-pages.xml`,
    `${baseUrl}/sitemap-products.xml`,
    `${baseUrl}/sitemap.xml`,
  ]
    .map((loc) => `  <sitemap><loc>${loc}</loc><lastmod>${now}</lastmod></sitemap>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
