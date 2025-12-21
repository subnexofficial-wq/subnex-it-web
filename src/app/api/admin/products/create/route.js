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
      // নতুন ফিল্ডগুলো রিসিভ করা হচ্ছে
      variants, 
      storageSize,
    } = await req.json();

    // ভ্যালিডেশন: টাইটেল, ক্যাটাগরি, থাম্বনেইল এবং অন্তত একটি প্রাইস (variant) থাকতে হবে
    if (!title || !category || !thumbnail || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: "Required fields missing or no pricing variants found" },
        { status: 400 }
      );
    }

    const { db } = await getDB();

    // ডাটাবেসে ইনসার্ট করার আগে variants গুলোকে ফরম্যাট করা
    const formattedVariants = variants.map(v => ({
      duration: v.duration || "N/A",
      price: Number(v.price) || 0
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

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Product Creation Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}