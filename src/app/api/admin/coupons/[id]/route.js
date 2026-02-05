import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth"; 
import getDB from "@/lib/mongodb"; 
import { ObjectId } from "mongodb";

// ১. কুপন ভিউ করা (GET)
export async function GET(req, { params }) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; 
    const { db } = await getDB();
    
    const coupon = await db.collection("coupons").findOne({ _id: new ObjectId(id) });
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(coupon);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ২. কুপন আপডেট করা (PUT)
export async function PUT(req, { params }) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { code, type, value, applicableProducts, expiryDate } = await req.json();

    const { db } = await getDB();
    
    const result = await db.collection("coupons").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          code: code.toUpperCase(),
          type,
          value: Number(value),
          applicableProducts,
          expiryDate: new Date(expiryDate),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ৩. কুপন ডিলিট করা (DELETE)
export async function DELETE(req, { params }) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { db } = await getDB();
    
    const result = await db.collection("coupons").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}