
"use server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function priceCalculation(productId, duration, quantity) {
  try {
    const { db } = await getDB();
    const product = await db.collection("products").findOne({ 
      _id: new ObjectId(productId) 
    });

    if (!product) return 0;

    let unitPrice = 0;
    const qty = Number(quantity) || 1;

    // ডিউরেশন অনুযায়ী ভেরিয়েন্ট থেকে ইউনিট প্রাইস বের করা
    const variant = product.variants?.find(v => v.duration === duration);
    if (variant) {
      unitPrice = variant.discountPrice > 0 ? variant.discountPrice : variant.price;
    } else {
      unitPrice = product.discountPrice > 0 ? product.discountPrice : product.regularPrice;
    }

    // সরাসরি সার্ভার থেকে গুণ করে টোটাল রিটার্ন করা
    return unitPrice * qty;

  } catch (error) {
    console.error("Database Error:", error);
    return 0;
  }
}