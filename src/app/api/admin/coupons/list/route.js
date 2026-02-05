import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import getDB from "@/lib/mongodb";
export async function GET() {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const databaseResponse = await getDB();
 
    const db = databaseResponse.db || databaseResponse; 
    
    const coupons = await db.collection("coupons").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(coupons);
  } catch (err) {
    console.error("COUPON_LIST_ERROR:", err); 
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}