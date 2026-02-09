import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderId, amount, customerName, customerEmail } = await req.json();

    const apiKey = process.env.UDDOKTAPAY_API_KEY;
    const apiUrl = process.env.UDDOKTAPAY_BASE_URL; 

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ error: "API Credentials Missing" }, { status: 500 });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": apiKey,
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

    // রেসপন্সটি টেক্সট হিসেবে নিয়ে চেক করা (যাতে ক্রাশ না করে)
    const rawResponse = await response.text();
    
    try {
      const result = JSON.parse(rawResponse);
      
      if (!response.ok || result.status === false) {
        console.error("Gateway Response Error:", result);
        return NextResponse.json({ error: result.message || "UddoktaPay Error" }, { status: 400 });
      }

      // যদি সফল হয়, তবে পেমেন্ট লিঙ্কটি রিটার্ন করবে
      return NextResponse.json(result);
      
    } catch (jsonErr) {
      console.error("The Gateway returned HTML instead of JSON. Check your BASE_URL.");
      return NextResponse.json({ error: "Invalid API URL or Gateway Error" }, { status: 502 });
    }

  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}