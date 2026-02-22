import getDB from "@/lib/mongodb";
import { getSiteUrl } from "@/lib/site-url";
import { getProductSlug } from "@/lib/product-url";

const staticEntries = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/automation", changeFrequency: "weekly", priority: 0.9 },
  { path: "/digital-product", changeFrequency: "weekly", priority: 0.8 },
  { path: "/subscription", changeFrequency: "monthly", priority: 0.7 },
  { path: "/products", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },

];

export default async function sitemap() {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticUrls = staticEntries.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  try {
    const { db } = await getDB();
    const products = await db
      .collection("products")
      .find({ active: true }, { projection: { _id: 1, slug: 1, title: 1, updatedAt: 1, createdAt: 1 } })
      .toArray();

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${getProductSlug(product)}`,
      lastModified: product.updatedAt || product.createdAt || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticUrls, ...productUrls];
  } catch {
    return staticUrls;
  }
}
