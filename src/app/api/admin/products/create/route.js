
import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function POST(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      title,
      category,
      regularPrice,
      discountPrice,
      quantity,
      duration,
      validity,
      thumbnail,
      highlights,
      fullDescription,
      active,
      featured,
    } = await req.json();

    if (!title || !category || regularPrice == null || !thumbnail) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    const { db } = await getDB();

    await db.collection("products").insertOne({
      title,
      category,

      regularPrice: Number(regularPrice),
      discountPrice: discountPrice ? Number(discountPrice) : null,

      quantity: quantity ?? null,
      duration: duration || "",
      validity: validity || "",

      thumbnail,
      highlights: Array.isArray(highlights) ? highlights : [],
      fullDescription: fullDescription || "",

      active: active ?? true,
      featured: featured ?? false,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
