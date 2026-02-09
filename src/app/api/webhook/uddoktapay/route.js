import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const data = await req.json();
    const { db } = await getDB();

    // ১. মেটাডেটা থেকে কালেকশন এবং অর্ডার আইডি বের করা
 
    const orderId = data?.metadata?.order_id || data?.metadata?.orderId;
    const collectionName = data?.metadata?.collection || "orders"; 
    const transactionId = data?.transaction_id;

    if (!orderId || !transactionId) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    // ২. UddoktaPay verify (পেমেন্ট নিশ্চিত করা)
    const verifyRes = await fetch(`${process.env.SUBNEXIT_PAY_BASE}/verify-payment`, {
      method: "POST",
      headers: {
        "RT-UDDOKTAPAY-API-KEY": process.env.SUBNEXIT_PAY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction_id: transactionId }),
    });

    const verifyData = await verifyRes.json();

    // ৩. পেমেন্ট সাকসেস হলে ডাটাবেস আপডেট
    if (verifyData.status === "Completed") {
      
     
      const result = await db.collection(collectionName).updateOne(
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
        return NextResponse.json({ message: "Order already processed or not found in " + collectionName });
      }

      console.log(`Success: Order ${orderId} updated in ${collectionName}`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, message: "Payment not completed" }, { status: 400 });

  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}