import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      console.log("Token not found in DB:", token);
      return NextResponse.json({ error: "Data not found" }, { status: 400 });
    }

    const { db } = await getDB();
    
    // ১. টোকেনটিকে স্ট্রিং হিসেবে নিশ্চিত করুন এবং ট্রিম করুন
    const searchToken = String(token).trim();

    // ২. শুধুমাত্র টোকেন দিয়ে আগে ইউজার খুঁজুন (টাইমজোন সমস্যা এড়াতে)
    const user = await db.collection("users").findOne({ 

      resetToken: searchToken 
    });

    if (!user) {
      return NextResponse.json({ error: "The link is invalid or already used" }, { status: 400 });
    }

    // ৩. ম্যানুয়ালি মেয়াদ চেক করুন
    if (user.resetTokenExpiry < Date.now()) {
      return NextResponse.json({ error: "The link has expired" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);
    
    // ৪. পাসওয়ার্ড আপডেট এবং টোকেন ক্লিয়ার
    const updateResult = await db.collection("users").updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" } 
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Database update failed");
    }

    return NextResponse.json({ ok: true, message: "successfully updated password" });
  } catch (err) {
    console.error("Reset Error:", err);
    return NextResponse.json({ error: "server error: " + err.message }, { status: 500 });
  }
}