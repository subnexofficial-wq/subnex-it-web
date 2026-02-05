import { verifyAdminToken } from "@/lib/auth";
import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { code, type, value, applicableProducts, expiryDate } = await req.json();

    const { db } = await getDB();
    await db.collection("coupons").insertOne({
      code: code.toUpperCase(),
      type, 
      value: Number(value),
      applicableProducts, 
      expiryDate: new Date(expiryDate),
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}