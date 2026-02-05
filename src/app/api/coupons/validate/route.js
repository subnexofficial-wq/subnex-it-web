import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.toUpperCase().trim();
    const productId = searchParams.get("productId");

    if (!code || !productId) {
      return NextResponse.json({ 
        valid: false, 
        message: "Code and Product ID are required" 
      }, { status: 400 });
    }

    const { db } = await getDB();


    const now = new Date();
    const coupon = await db.collection("coupons").findOne({
      code: code,
      expiryDate: { $gte: now } 
    }); 

    // ২. কুপন না পাওয়া গেলে
    if (!coupon) {
      return NextResponse.json({ 
        valid: false, 
        message: "কুপন কোডটি ভুল অথবা মেয়াদ শেষ হয়ে গেছে!" 
      }, { status: 404 });
    }

   
    const isApplicable = coupon.applicableProducts.includes(productId);

    if (!isApplicable) {
      return NextResponse.json({ 
        valid: false, 
        message: "এই কুপনটি এই প্রোডাক্টের জন্য প্রযোজ্য নয়!" 
      }, { status: 400 });
    }

    
    return NextResponse.json({
      valid: true,
      type: coupon.type, 
      value: Number(coupon.value),
      message: "অভিনন্দন! কুপনটি সফলভাবে কাজ করেছে।"
    });

  } catch (err) {
    console.error("Public Coupon API Error:", err);
    return NextResponse.json({ 
      valid: false, 
      message: "সার্ভার এরর! দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।" 
    }, { status: 500 });
  }
}