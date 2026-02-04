import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await getDB();
    const coupons = await db.collection("coupons").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(coupons);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}