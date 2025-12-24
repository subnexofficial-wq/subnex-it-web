import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function GET(req, { params }) { 
  try {

    const resolvedParams = await params; 
    const category = resolvedParams.category;

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);
    const skip = (page - 1) * limit;

    const { db } = await getDB();

    const products = await db
      .collection("products")
      .find(
        { category, active: true },
        {
          projection: {
            title: 1,
            regularPrice: 1,
            discountPrice: 1,
            thumbnail: 1,
            duration: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(products);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}