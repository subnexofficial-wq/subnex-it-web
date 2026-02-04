import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const data = await req.json();
    const { db } = await getDB();

    const orderId = data?.metadata?.orderId;
    const transactionId = data?.transaction_id;

    // ১. ডাটা চেক
    if (!orderId || !transactionId) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    // ২. UddoktaPay verify
    const verifyRes = await fetch(`${process.env.UDDOKTAPAY_BASE_URL}/verify-payment`, {
      method: "POST",
      headers: {
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTAPAY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction_id: transactionId }),
    });

    const verifyData = await verifyRes.json();

    // ৩. payment status
    if (verifyData.status === "Completed") {
      
      // ৪. database update 
      const result = await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId), paymentStatus: { $ne: "paid" } },
        { 
          $set: { 
            paymentStatus: "paid", 
            status: "completed", 
            transactionId: transactionId,
            paidAt: new Date(),
            updatedAt: new Date() 
          } 
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: "Order already processed or not found" });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, message: "Payment not completed" }, { status: 400 });

  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}