import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const data = await req.json();
    const { db } = await getDB();

    // ১. মেটাডেটা থেকে ডাটা বের করা (অর্ডার আইডি এবং ট্রানজেকশন আইডি)
    const orderId = data?.metadata?.orderId || data?.metadata?.order_id;
    const transactionId = data?.transaction_id; 
    const collectionName = data?.metadata?.collection || "orders"; 

    // ডাটা না থাকলে এরর রিটার্ন করবে
    if (!orderId || !transactionId) {
      console.log("Missing Data:", { orderId, transactionId });
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    // ২. UddoktaPay থেকে পেমেন্ট ভেরিফাই করা

    const verifyRes = await fetch(`${process.env.UDDOKTAPAY_BASE_URL}/verify-payment`, {
      method: "POST",
      headers: {
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTAPAY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction_id: transactionId }),
    });

    const verifyData = await verifyRes.json();

    // ৩. পেমেন্ট সাকসেস (Completed) হলে ডাটাবেস আপডেট
    if (verifyData.status === "Completed") {
      const result = await db.collection(collectionName).updateOne(
        { _id: new ObjectId(orderId) }, 
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
        return NextResponse.json({ message: "Order not found" });
      }

      console.log(`✅ Success: Order ${orderId} updated with TrxID: ${transactionId}`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, message: "Payment not completed" }, { status: 400 });

  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}