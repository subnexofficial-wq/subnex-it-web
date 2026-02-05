import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) return NextResponse.json({ error: "ইমেইল দিন" }, { status: 400 });

    const { db } = await getDB();
    const user = await db.collection("users").findOne({ email: email.toLowerCase().trim() });

    if (!user) return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 400 });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1800000; 

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { resetToken: token, resetTokenExpiry: expiry } }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    
    // প্রফেশনাল ইমেইল টেম্পলেট
    const htmlTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #1a1a1a;">Hello,</h2>
        <p>We received a request to reset your account on our website.</p>
        <p>To proceed, please use the secure link below. Once you open the link, you will be able to set a new password for your <strong>Subnex IT</strong> account.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>

        <p style="font-size: 14px; color: #666;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 13px; color: #0070f3; word-break: break-all;">${resetLink}</p>

        <p style="margin-top: 25px; font-size: 13px; color: #888; border-top: 1px solid #eee; pt: 20px;">
          For security reasons, this link will expire in 30 minutes and can only be used once.
        </p>
        <p style="font-size: 13px; color: #888;">
          If you did not request this action, please ignore this email. No changes will be made to your account.
        </p>
        
        <div style="margin-top: 30px;">
          <p style="margin: 0; font-weight: bold;">Best regards,</p>
          <p style="margin: 0; color: #000;">Subnex IT</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Reset your Subnex IT account password",
      type: "security", 
      html: htmlTemplate
    });

    return NextResponse.json({ ok: true, message: "Email has been sent" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}