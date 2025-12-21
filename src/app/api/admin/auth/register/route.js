import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import {  hashPassword, signAdminToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password, setupKey } = await req.json();

    // 🔑 Master setup key
    if (setupKey !== process.env.MASTER_ADMIN_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username & password required" },
        { status: 400 }
      );
    }

    const { db } = await getDB();
    const admins = db.collection("admins");

    const exists = await admins.findOne({ username });
    if (exists) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);

    const result = await admins.insertOne({
      username,
      password: hashed,
      role: "admin",
      loginAttempts: 0,
      createdAt: new Date(),
    });

    // 🔐 Short-lived setup token
    const token = signAdminToken({
      sub: result.insertedId.toString(),
      role: "admin",
      aud: "admin-panel",
    });

    const secure = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true });

    res.cookies.set("adminToken", token, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });

    return res;

  } catch (err) {
    console.error("ADMIN REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
