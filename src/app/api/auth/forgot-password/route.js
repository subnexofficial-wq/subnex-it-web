import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request Body:", body); 

    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "ইমেইল ফিল্ডটি খালি!" }, { status: 400 });
    }

    const { db } = await getDB();
    const cleanEmail = email.trim().toLowerCase();

    // ২. ইউজার খোঁজার আগে লগ
    console.log("Searching for user with email:", cleanEmail);

    const user = await db.collection("users").findOne({ email: cleanEmail });

    if (!user) {
      console.log("User not found in DB!"); // ৩. ইউজার না মিললে এটি দেখাবে
      return NextResponse.json({ error: "এই ইমেইলটি আমাদের সিস্টেমে নেই!" }, { status: 400 });
    }

    // ৪. টোকেন তৈরি
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000;

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { resetToken: token, resetTokenExpiry: expiry } }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    // ৫. ইমেইল পাঠানোর ঠিক আগে লগ
    console.log("Attempting to send email to:", cleanEmail);

    try {
      await sendEmail({
        to: cleanEmail,
        subject: "পাসওয়ার্ড রিসেট করার লিঙ্ক - SubNex",
        type: "security",
        html: `<h1>রিসেট লিঙ্ক: ${resetLink}</h1>`,
      });

      console.log("Email sent successfully!");
      return NextResponse.json({ ok: true, message: "ইমেইল পাঠানো হয়েছে।" });

    } catch (emailError) {
      console.error("Email Error:", emailError);
      return NextResponse.json({ error: "ইমেইল সার্ভিসে সমস্যা।" }, { status: 500 });
    }

  } catch (err) {
    console.error("Main API Error:", err);
    return NextResponse.json({ error: "Server error occurred." }, { status: 500 });
  }
}