
import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { slugifyProductTitle } from "@/lib/product-url";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const { db } = await getDB();
    let product = null;

    if (ObjectId.isValid(id)) {
      product = await db.collection("products").findOne({ _id: new ObjectId(id), active: true });
    }

    if (!product) {
      product = await db.collection("products").findOne({ slug: id, active: true });
    }

    if (!product) {
      const candidates = await db
        .collection("products")
        .find({ active: true }, { projection: { _id: 1, title: 1, slug: 1 } })
        .toArray();

      const matched = candidates.find(
        (p) => (p.slug || slugifyProductTitle(p.title)) === id
      );
      if (matched?._id) {
        product = await db.collection("products").findOne({ _id: matched._id, active: true });
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
