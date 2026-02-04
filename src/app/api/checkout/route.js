import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { amount, customerName, customerEmail, customerMobile, orderDetails } = await req.json();
    const { db } = await getDB();

    // ১. ডাটাবেসে 'unpaid' স্ট্যাটাসে অর্ডার সেভ করা
    const order = await db.collection("orders").insertOne({
      customer: { firstName: customerName, email: customerEmail, phone: customerMobile },
      pricing: { totalAmount: amount },
      items: orderDetails,
      status: "pending", // Payment pending
      paymentStatus: "unpaid",
      createdAt: new Date(),
    });

    // ২. UddoktaPay API Call
    const response = await fetch(`${process.env.UDDOKTAPAY_API_URL}/api/checkout-v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTAPAY_API_KEY,
      },
      body: JSON.stringify({
        full_name: customerName,
        email: customerEmail,
        amount: amount,
        metadata: { order_id: order.insertedId.toString() }, // অর্ডার আইডি ট্র্যাকিং এর জন্য
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/uddoktapay`,
      }),
    });

    const result = await response.json();
    return NextResponse.json({ payment_url: result.payment_url });
  } catch (error) {
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}