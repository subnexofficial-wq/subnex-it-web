import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { unstable_noStore as noStore } from "next/cache";
import { slugifyProductTitle } from "@/lib/product-url";

export async function getAllProducts() {
  noStore();

  try {
    const { db } = await getDB();
    const data = await db
      .collection("products")
      .find({ active: true })
      .sort({ createdAt: -1 })
      .toArray();

    return data.map((p) => ({
      ...p,
      _id: p._id.toString(),
      slug: p.slug || slugifyProductTitle(p.title),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id) {
  noStore();

  try {
    const { db } = await getDB();
    let product = null;

    if (ObjectId.isValid(id)) {
      product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    }

    if (!product) {
      product = await db.collection("products").findOne({ slug: id });
    }

    // Fallback for old docs without stored slug
    if (!product) {
      const candidates = await db
        .collection("products")
        .find({ active: true }, { projection: { title: 1, slug: 1 } })
        .toArray();

      const matched = candidates.find(
        (p) => (p.slug || slugifyProductTitle(p.title)) === id
      );

      if (matched?._id) {
        product = await db.collection("products").findOne({ _id: matched._id });
      }
    }

    if (!product) return null;

    return {
      ...product,
      _id: product._id.toString(),
      slug: product.slug || slugifyProductTitle(product.title),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getRelatedProducts(category, currentId) {
  noStore();

  try {
    const { db } = await getDB();
    const filter = {
      category,
      active: true,
    };

    if (ObjectId.isValid(currentId)) {
      filter._id = { $ne: new ObjectId(currentId) };
    }

    const related = await db.collection("products").find(filter).limit(10).toArray();

    return related.map((p) => ({
      ...p,
      _id: p._id.toString(),
      slug: p.slug || slugifyProductTitle(p.title),
    }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function searchProducts(query) {
  noStore();
  if (!query) return [];

  try {
    const { db } = await getDB();
    const products = await db
      .collection("products")
      .find({
        active: true,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
      .limit(8)
      .toArray();

    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      slug: p.slug || slugifyProductTitle(p.title),
    }));
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}
