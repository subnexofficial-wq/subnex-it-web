import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json(); // একবার রিড
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: "ডাটা পাওয়া যায়নি" }, { status: 400 });
    }

    const { db } = await getDB();
    const user = await db.collection("users").findOne({ 
      resetToken: token, 
      resetTokenExpiry: { $gt: Date.now() } 
    });

    if (!user) return NextResponse.json({ error: "লিঙ্কটি অবৈধ বা মেয়াদ শেষ" }, { status: 400 });

    const hashedPassword = await hashPassword(newPassword);
    await db.collection("users").updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" } 
      }
    );

    return NextResponse.json({ ok: true, message: "সফল হয়েছে" });
  } catch (err) {
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 });
  }
}