import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { compareAdminPassword, signAdminToken } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username & password required" },
        { status: 400 }
      );
    }

    const { db } = await getDB();
    const admins = db.collection("admins");

    const admin = await admins.findOne({ username });

    // ❌ Do not reveal which one is wrong
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔒 Account locked check
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      return NextResponse.json(
        { error: "Account temporarily locked" },
        { status: 423 }
      );
    }

    const valid = await compareAdminPassword(password, admin.password);

    if (!valid) {
      const attempts = (admin.loginAttempts || 0) + 1;

      const update = {
        loginAttempts: attempts,
      };

      if (attempts >= MAX_ATTEMPTS) {
        update.lockUntil = Date.now() + LOCK_TIME;
        update.loginAttempts = 0;
      }

      await admins.updateOne(
        { _id: admin._id },
        { $set: update }
      );

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Reset attempts on success
    await admins.updateOne(
      { _id: admin._id },
      {
        $unset: { lockUntil: "" },
        $set: { loginAttempts: 0, lastLogin: new Date() },
      }
    );

    // 🔐 Minimal & safe JWT payload
    const token = signAdminToken({
      sub: admin._id.toString(),
      role: "admin",
      aud: "admin-panel",
    });

    const secure = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true });

    res.cookies.set("adminToken", token, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/admin",
      maxAge: 60 * 15, // ⏱️ 15 minutes
    });

    return res;

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
