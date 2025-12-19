import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { hashPassword, signToken } from "@/lib/auth";

function isValidMobile(mobile) {
  return /^[0-9]{10,15}$/.test(mobile);
}

export async function POST(req) {
  try {
    const { mobile, password, email } = await req.json();

    // Validation
    if (!email && !mobile|| !password) {
      return NextResponse.json(
        { error: "Mobile & password required" },
        { status: 400 }
      );
    }

    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        { error: "Invalid mobile number" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const { db } = await getDB();
    const users = db.collection("users");

    // Duplicate check
    const exists = await users.findOne({ email }, { projection: { isActive: 1 } });
    if (exists) {
      return NextResponse.json(
        { error: "Mobile already registered" },
        { status: 409 }
      );
    }

    // Hash password (your auth.js)
    const hashedPassword = await hashPassword(password);

    const user = {
      mobile,
      email: email,
      password: hashedPassword,

      role: "user",
      isActive: true,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(user);

    // JWT (your auth.js)
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
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
