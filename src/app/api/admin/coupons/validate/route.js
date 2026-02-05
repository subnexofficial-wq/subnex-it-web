import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.toUpperCase().trim();
    const productId = searchParams.get("productId");

    if (!code || !productId) {
      return NextResponse.json({ error: "Code and Product ID are required" }, { status: 400 });
    }

    const { db } = await getDB();

    
    const now = new Date();
    
    const coupon = await db.collection("coupons").findOne({
      code: code,
      expiryDate: { $gte: now } 
    });

    if (!coupon) {
      return NextResponse.json({ 
        valid: false, 
        message: "কুপনটি সঠিক নয় অথবা মেয়াদ শেষ হয়ে গেছে" 
      }, { status: 404 });
    }

    const isApplicable = coupon.applicableProducts.some(id => id.toString() === productId.toString());

    if (!isApplicable) {
      return NextResponse.json({ 
        valid: false, 
        message: "এই কুপনটি এই প্রোডাক্টের জন্য প্রযোজ্য নয়" 
      }, { status: 400 });
    }
    return NextResponse.json({
      valid: true,
      type: coupon.type, 
      value: Number(coupon.value), 
      message: "কুপন সফলভাবে অ্যাপ্লাই হয়েছে!"
    });

  } catch (err) {
    console.error("Coupon Validate Error:", err);
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 });
  }
}