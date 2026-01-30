import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";


export async function POST(req) {
  try {
    const { email } = await req.json();
    const { db } = await getDB();
    const cleanEmail = email.trim().toLowerCase();

    // ১. ইউজার চেক
    const user = await db.collection("users").findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json({ error: "এই ইমেইলটি আমাদের সিস্টেমে নেই!" }, { status: 400 });
    }

    // ২. টোকেন তৈরি ও সেভ
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // ১ ঘণ্টা মেয়াদ

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { resetToken: token, resetTokenExpiry: expiry } }
    );

    // ৩. রিসেট লিঙ্ক তৈরি
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    // ৪. আপনার তৈরি করা sendEmail ফাংশন দিয়ে ইমেইল পাঠানো
    try {
      await sendEmail({
        to: cleanEmail,
        subject: "পাসওয়ার্ড রিসেট করার লিঙ্ক - SubNex",
        type: "security", // আপনি যেহেতু security ইমেইল চাচ্ছেন
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">পাসওয়ার্ড রিসেট অনুরোধ</h2>
            <p>আপনার অ্যাকাউন্টটির পাসওয়ার্ড রিসেট করার জন্য নিচের বাটনে ক্লিক করুন:</p>
            <a href="${resetLink}" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold;">পাসওয়ার্ড পরিবর্তন করুন</a>
            <p style="font-size: 12px; color: #666;">লিঙ্কটি ১ ঘণ্টা পর অকেজো হয়ে যাবে।</p>
          </div>
        `,
      });

      return NextResponse.json({ ok: true, message: "আপনার ইমেইলে রিসেট লিঙ্ক পাঠানো হয়েছে।" });

    } catch (emailError) {
      console.error("Email Service Error:", emailError);
      return NextResponse.json({ error: "ইমেইল সার্ভিসে সমস্যা হয়েছে।" }, { status: 500 });
    }

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json({ error: "সার্ভারে সমস্যা হয়েছে।" }, { status: 500 });
  }
}