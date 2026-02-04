import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const body = await req.json(); // একবার রিড
    const { email } = body;

    if (!email) return NextResponse.json({ error: "ইমেইল দিন" }, { status: 400 });

    const { db } = await getDB();
    const user = await db.collection("users").findOne({ email: email.toLowerCase().trim() });

    if (!user) return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 400 });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000;

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { resetToken: token, resetTokenExpiry: expiry } }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    
    await sendEmail({
  to: email,
  subject: "Password Reset",
  type: "security", 
  html: `<h1> Hello,
  </h1>
  <p> We received a request to reset your account on our website.</p><br>
  <p>To proceed, please use the secure link below. Once you open the link, you will be able to set a new password for your Subnex IT account.</p><br>

  <p>Reset your account on our website: <a href="${resetLink}">${resetLink}</a></p><br>
  <p>
For security reasons, this link will expire in 30 minutes and can only be used once.</p><br>
<p>If you did not request this action, please ignore this email. No changes will be made to your account</p><br>
<p>Best regards, <br>
Subnex IT</p>
  
  `
});

    return NextResponse.json({ ok: true, message: "ইমেইল পাঠানো হয়েছে" });
  } catch (err) {
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 });
  }
}