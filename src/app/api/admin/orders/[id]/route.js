
import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    // ১. এডমিন টোকেন ভেরিফাই করা
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json(); 

    // ২. স্ট্যাটাস ভ্যালিডেশন
    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { db } = await getDB();

    // ৩. ডাটাবেসে আপডেট করা
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Order status updated to ${status}` });

  } catch (err) {
    console.error("Admin Status Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}