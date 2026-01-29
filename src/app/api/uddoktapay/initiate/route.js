import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderId, amount, customerName, customerEmail } = await req.json();

    // সরাসরি .env থেকে URL টি নেওয়া হচ্ছে (যেহেতু আপনি সেখানে checkout-v2 সহ দিয়েছেন)
    const apiUrl = process.env.UDDOKTAPAY_BASE_URL;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTAPAY_API_KEY,
      },
      body: JSON.stringify({
        full_name: customerName,
        email: customerEmail,
        amount: amount,
        metadata: { orderId: orderId },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/uddoktapay`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Initiate Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}