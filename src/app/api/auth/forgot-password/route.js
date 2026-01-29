import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
    }

    const { db } = await getDB();

    // টোকেন এবং এক্সপায়ারি চেক
    const user = await db.collection("users").findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // ডাটাবেসের সময় বর্তমান সময়ের চেয়ে বেশি হতে হবে
    });

    if (!user) {
      return NextResponse.json(
        { error: "লিঙ্কটি কাজ করছে না অথবা মেয়াদ শেষ হয়ে গেছে।" }, 
        { status: 400 }
      );
    }

    // নতুন পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await hashPassword(newPassword);

    // ডাটাবেস আপডেট এবং টোকেন ক্লিনআপ (unset ব্যবহার করা হয়েছে যা পারফেক্ট)
    const result = await db.collection("users").updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date() // আপডেট হওয়ার সময় ট্র্যাক রাখা ভালো
        },
        $unset: { resetToken: "", resetTokenExpiry: "" } 
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ ok: true, message: "Password updated successfully" });
    } else {
      return NextResponse.json({ error: "পাসওয়ার্ড আপডেট করা সম্ভব হয়নি।" }, { status: 500 });
    }

  } catch (err) {
    console.error("Reset Password API Error:", err.message);
    return NextResponse.json({ error: "Reset failed", details: err.message }, { status: 500 });
  }
}