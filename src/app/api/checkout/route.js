import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { amount, customerName, customerEmail, customerMobile, orderDetails } = await req.json();
    const { db } = await getDB();

    // ENV
    const apiKey = process.env.SUBNEXIT_PAY_API_KEY;
    const baseUrl = `${process.env.SUBNEXIT_PAY_BASE}`;

    if (!apiKey || !baseUrl) {
      return NextResponse.json({ error: "Payment configuration missing" }, { status: 500 });
    }

    // 1️⃣ Create Order
    const order = await db.collection("orders").insertOne({
      customer: {
        firstName: customerName,
        email: customerEmail,
        phone: customerMobile,
      },
      pricing: { totalAmount: amount },
      items: orderDetails,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    });

    // 2️⃣ Payment Request
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": apiKey,
      },
      body: JSON.stringify({
        full_name: customerName,
        email: customerEmail,
        amount: amount,
        metadata: { order_id: order.insertedId.toString() },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/uddoktapay`,
      }),
    });

    // যদি payment API fail করে
    if (!response.ok) {
      await db.collection("orders").updateOne(
        { _id: order.insertedId },
        { $set: { status: "failed", paymentStatus: "failed" } }
      );

      return NextResponse.json({ error: "Payment gateway error" }, { status: 500 });
    }

    const data = await response.json();

    if (!data?.payment_url) {
      return NextResponse.json({ error: "Invalid payment response" }, { status: 400 });
    }

    return NextResponse.json({ payment_url: data.payment_url });

  } catch (error) {
    console.error("Checkout Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
