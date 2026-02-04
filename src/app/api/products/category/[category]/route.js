import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    // ✅ সমাধান: Next.js 15 এ params কে await করতে হয়
    const resolvedParams = await params;
    const category = resolvedParams.category;

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 12);

    const { db } = await getDB();

    const products = await db
      .collection("products")
      .find(
        { category: category, active: true }, // ডাটাবেসের ফিল্ডের সাথে মিল রাখুন
        {
          projection: {
            title: 1,
            regularPrice: 1,
            discountPrice: 1,
            thumbnail: 1,
            duration: 1,
            category: 1,       
              downloadLink: 1,   
               isDownloadable: 1  
          },
        }
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(products);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}