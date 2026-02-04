import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      title,
      category,
      quantity,
      thumbnail,
      highlights,
      fullDescription,
      active,
      featured,
      variants,
      storageSize,
      isDownloadable,
      downloadLink,
      couponCode,
    } = await req.json();

    if (
      !title ||
      !category ||
      !thumbnail ||
      !variants ||
      variants.length === 0
    ) {
      return NextResponse.json(
        { error: "Required fields missing or no pricing variants found" },
        { status: 400 }
      );
    }

    const { db } = await getDB();

    const formattedVariants = variants.map((v) => ({
      duration: v.duration || "N/A",
      price: Number(v.price) || 0,
    }));

    await db.collection("products").insertOne({
      title,
      category,
      thumbnail,
      fullDescription: fullDescription || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      variants: formattedVariants,
      storageSize: storageSize || null,
      quantity: quantity ? Number(quantity) : null,
      active: active ?? true,
      featured: featured ?? false,
      totalReviews: 0,
      isDownloadable: isDownloadable ?? false,
      downloadLink: isDownloadable ? (downloadLink || "") : null,
      couponCode: couponCode || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Product Creation Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
