import { NextResponse } from "next/server";

import { verifyAdminToken } from "@/lib/auth"; 
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { code, type, value, applicableProducts, expiryDate } = await req.json();


    if (!code || !value || !expiryDate) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { db } = await getDB();
    
 
    const existing = await db.collection("coupons").findOne({ code: code.toUpperCase() });
    if (existing) return NextResponse.json({ error: "Coupon already exists" }, { status: 400 });

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
    console.error("Coupon Create Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}