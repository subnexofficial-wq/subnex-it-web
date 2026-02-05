// app/api/orders/success/route.js
import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId"); 

    const { db } = await getDB();
    
    // ডাটাবেসে transactionId দিয়ে রিয়েল অর্ডারটি খুঁজছি
    const order = await db.collection("orders").findOne({ 
      transactionId: invoiceId 
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found yet" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}