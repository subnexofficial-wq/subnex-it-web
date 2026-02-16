import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { orderId, amount, customerName, customerEmail, coupon } = await req.json();

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
        amount,
        metadata: {
          order_id: orderId,
          orderId,
          collection: "orders",
          coupon: coupon || "none",
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/uddoktapay`,
      }),
    });

    const rawResponse = await response.text();

    try {
      const result = JSON.parse(rawResponse);

      if (!response.ok || result.status === false) {
        console.error("Gateway Response Error:", result);
        return NextResponse.json({ error: result.message || "UddoktaPay Error" }, { status: 400 });
      }

      try {
        const { db } = await getDB();
        await db.collection("orders").updateOne(
          { _id: new ObjectId(orderId) },
          {
            $set: {
              paymentInitStatus: "initiated",
              paymentInitAt: new Date(),
              gatewayInvoiceId: result?.invoice_id || result?.invoiceId || null,
              gatewayTransactionId: result?.transaction_id || result?.transactionId || null,
              gatewayPaymentUrl: result?.payment_url || null,
              updatedAt: new Date(),
            },
          }
        );
      } catch (persistErr) {
        console.error("Failed to persist gateway init info:", persistErr);
      }

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
