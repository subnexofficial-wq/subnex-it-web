import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

/* ===============================
   GET: সকল Automation Orders নিয়ে আসা
================================ */
export async function GET() {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await getDB();
    const data = await db
      .collection("automation_orders") // আপনার কালেকশন অনুযায়ী
      .find({})
      .sort({ createdAt: -1 }) // নতুন অর্ডার আগে দেখাবে
      .toArray();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ===============================
   PUT: অর্ডার Approve করা (Status Update)
================================ */
export async function PUT(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { orderId, status, paymentStatus } = data;
    const { db } = await getDB();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const result = await db.collection("automation_orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status: status || "completed", // ডিফল্ট completed
          paymentStatus: paymentStatus || "paid", // ডিফল্ট paid
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // এখানে ইমেইল পাঠানোর ফাংশন বা অন্য লজিক যোগ করতে পারেন

    return NextResponse.json({ ok: true, message: "Order updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

/* ===============================
   DELETE: অর্ডার ডিলিট করা
================================ */
export async function DELETE(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { db } = await getDB();
    const result = await db
      .collection("automation_orders")
      .deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}