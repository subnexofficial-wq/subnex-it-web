import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAdminToken } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const { db } = await getDB();
    
    // ডাটাবেস থেকে আইডি অনুযায়ী ডিলিট করা
    const result = await db.collection("coupons").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}