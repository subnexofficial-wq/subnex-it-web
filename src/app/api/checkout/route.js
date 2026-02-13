import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, customerName, customerEmail, customerMobile, orderDetails, isAutomation } = body;

    // ১. ডাটাবেস কানেকশন (সেফ লজিক)
    const dbRes = await getDB();
    const db = dbRes.db ? (typeof dbRes.db === 'function' ? dbRes.db() : dbRes.db) : dbRes;

    // ২. আপনার .env ফাইলের নামের সাথে মিল রেখে পরিবর্তন
    const apiKey = process.env.UDDOKTAPAY_API_KEY; 
    const baseUrl = process.env.UDDOKTAPAY_BASE_URL; 

    // কনফিগারেশন চেক
    if (!apiKey || !baseUrl) {
      console.log("Missing Config:", { apiKey: !!apiKey, baseUrl: !!baseUrl });
      return NextResponse.json({ error: "Payment config missing in .env" }, { status: 500 });
    }

    // ৩. কালেকশন সিলেকশন
    const collectionName = isAutomation ? "automation_orders" : "orders";

    // ৪. ডাটাবেসে অর্ডার সেভ
    const order = await db.collection(collectionName).insertOne({
      customer: {
        firstName: customerName || "Customer",
        email: customerEmail,
        phone: customerMobile,
      },
      pricing: { totalAmount: Number(amount) },
      items: orderDetails,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    });

    // ৫. পেমেন্ট গেটওয়ে রিকোয়েস্ট (Uddoktapay)
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": apiKey,
      },
      body: JSON.stringify({
        full_name: customerName,
        email: customerEmail,
        amount: Number(amount),
        metadata: { 
          order_id: order.insertedId.toString(),
          collection: collectionName 
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/uddoktapay`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.payment_url) {
      return NextResponse.json({ error: data?.message || "Gateway Error" }, { status: 400 });
    }

    return NextResponse.json({ payment_url: data.payment_url });

  } catch (error) {
    console.error("Checkout Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}