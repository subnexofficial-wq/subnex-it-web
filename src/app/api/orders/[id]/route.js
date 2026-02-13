import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
   
    const { id } = await params; 
    
    const { db } = await getDB();

    // ID চেক করে ডাটা খুঁজে আনা
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ডাটা সাকসেসফুলি রিটার্ন করা
    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("Single Order Fetch Error:", err);
    return NextResponse.json({ error: "Invalid Order ID or Server Error" }, { status: 400 });
  }
}