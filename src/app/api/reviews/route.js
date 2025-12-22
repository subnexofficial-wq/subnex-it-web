import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* ================= GET REVIEWS ================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json([], { status: 200 });
    }

    const { db } = await getDB();

    const reviews = await db
      .collection("reviews")
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

/* ================= POST REVIEW ================= */
export async function POST(req) {
  try {
    const body = await req.json();
    
    const { productId, rating, comment, email, userName, title, image } = body;

    if (!productId || !rating || !comment || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { db } = await getDB();

    // ১. রিভিউ অবজেক্ট তৈরি
    const review = {
      productId,
      rating: Number(rating),
      title: title || "",
      comment,
      userName: userName || "Anonymous",
      email,
      image: image || "", 
      verified: true, 
      createdAt: new Date(),
    };

 
    await db.collection("reviews").insertOne(review);


    await db.collection("products").updateOne(
      { _id: new ObjectId(productId) }, 
      { 
        $inc: { totalReviews: 1 }, 
        $set: { updatedAt: new Date() } 
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Database Error:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}