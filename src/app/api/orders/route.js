
import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const body = await req.json();
    const { orderItems, customer, pricing } = body;


    if (!orderItems || orderItems.length === 0 || !pricing.totalAmount) {
      return NextResponse.json({ error: "Missing order information" }, { status: 400 });
    }

    const { db } = await getDB();


    const newOrder = {
      customer,
      orderItems,
      pricing: {
        subtotal: Number(pricing.subtotal),
        shippingFee: Number(pricing.shippingFee),
        tip: Number(pricing.tip || 0),
        discount: Number(pricing.discount || 0),
        totalAmount: Number(pricing.totalAmount),
      },
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);

    return NextResponse.json({
      message: "Order created successfully",
      orderId: result.insertedId, 
    }, { status: 201 });

  } catch (err) {
    console.error("Order API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}