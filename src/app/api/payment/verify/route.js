import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { invoiceId } = await req.json();

    const response = await fetch("https://pay.subnexit.com/api/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTAPAY_API_KEY,
      },
      body: JSON.stringify({ invoice_id: invoiceId }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
  }
}