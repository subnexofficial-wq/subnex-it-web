import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { amount, customerName, customerEmail, customerMobile, orderDetails } = await req.json();
    const { db } = await getDB();

    // আপনার .env ফাইলের নামের সাথে মিল রেখে এখানে পরিবর্তন করা হয়েছে
    const apiKey = process.env.SUBNEXIT_PAY_API_KEY; 
    const baseUrl = `${process.env.SUBNEXIT_PAY_BASE}/checkout-v2`; // শেষে ভিউ যোগ করা হলো

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
        metadata: { order_id: order.insertedId.toString() }, // অর্ডার আইডি ট্র্যাকিং এর জন্য
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/uddoktapay`,
      }),
    });

    const data = await response.json();
    
    if (data.status) {
      return NextResponse.json({ url: data.payment_url });
    } else {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}