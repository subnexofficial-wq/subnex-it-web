import { NextResponse } from "next/server";
import { hashPassword, signToken } from "@/lib/auth";
import getDB from "@/lib/mongodb";

function isValidMobile(mobile) {
  return /^[0-9]{10,15}$/.test(mobile);
}

export async function POST(req) {
  try {
    const { mobile, password, email } = await req.json();

    // Validation
    if (!email || !mobile || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        { error: "Invalid mobile number" },
        { status: 400 }
      );
    }

    // Connect to DB
    const { db } = await getDB(); 
    const users = db.collection("users");

    // Check for existing user
    const exists = await users.findOne({ $or: [{ email }, { mobile }] });
    if (exists) {
      return NextResponse.json(
        { error: "Email or Mobile already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = {
      mobile,
      email,
      password: hashedPassword,
      role: "user",
      isActive: true,
      createdAt: new Date(),
    };

    const result = await users.insertOne(user);

    const token = signToken({
      sub: result.insertedId.toString(),
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

  } catch (err) {
    console.error("Auth Register Error:", err);
    // This now works because NextResponse is imported at the top
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}