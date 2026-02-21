import getDB from "@/lib/mongodb";
import { getSiteUrl } from "@/lib/site-url";
import { getProductSlug } from "@/lib/product-url";

function toIso(dateValue) {
  const date = dateValue ? new Date(dateValue) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export async function GET() {
  const baseUrl = getSiteUrl();

  try {
    const { db } = await getDB();
    const products = await db
      .collection("products")
      .find({ active: true }, { projection: { _id: 1, slug: 1, title: 1, updatedAt: 1, createdAt: 1 } })
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();

    const urls = products
      .map((product) => {
        const lastmod = toIso(product.updatedAt || product.createdAt);
        return `  <url><loc>${baseUrl}/products/${getProductSlug(product)}</loc><lastmod>${lastmod}</lastmod></url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
      status: 200,
    });
  }
}
