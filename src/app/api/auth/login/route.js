
import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email & password required" },
        { status: 400 }
      );
    }

    const { db } = await getDB();
    const users = db.collection("users");

    // Find user
   const user = await users.findOne({ email });
    if (!user) {
      // generic error (security)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Account disabled?
    if (user.isActive === false) {
      return NextResponse.json(
        { error: "Account disabled" },
        { status: 403 }
      );
    }

    // Compare password (your auth.js)
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // JWT
    const token = signToken({
      sub: user._id.toString(),
      role: "user",
    });

    const res = NextResponse.json({ ok: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
