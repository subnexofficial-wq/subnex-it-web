import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderId, amount, customerName, customerEmail } = await req.json();

    const response = await fetch(process.env.UDDOKTAPAY_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTAPAY_API_KEY,
      },
      body: JSON.stringify({
        full_name: customerName,
        email: customerEmail, // এটাই হবে ইনভয়েস ইমেইল
        amount: amount,
        metadata: { orderId: orderId },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}