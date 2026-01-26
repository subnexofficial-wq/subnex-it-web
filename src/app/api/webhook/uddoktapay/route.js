import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const data = await req.json();
    const { db } = await getDB();

    console.log("Webhook Received Data:", data); // ডিবাগ করার জন্য

    // UddoktaPay status 'COMPLETED' পাঠায়। 
    // এটা safe করার জন্য toUpperCase ব্যবহার করছি।
    if (data.status && data.status.toUpperCase() === "COMPLETED") {
      
      // metadata থেকে orderId নেওয়া
      const orderId = data.metadata?.orderId;

      if (!orderId) {
        return NextResponse.json({ error: "Order ID not found in metadata" }, { status: 400 });
      }

      // ডাটাবেস আপডেট
      const updatedOrder = await db.collection("orders").findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        { 
          $set: { 
            paymentStatus: "paid", // আপনার ড্যাশবোর্ড এখন এটা চেক করবে
            transactionId: data.transaction_id,
            updatedAt: new Date(),
            // যদি আপনি চান অটোমেটিক status ও আপডেট হোক:
            // status: "processing" 
          } 
        },
        { returnDocument: "after" }
      );

      if (updatedOrder) {
        console.log(`✅ Order ${orderId} successfully marked as PAID.`);
        return NextResponse.json({ success: true, message: "Order Updated" });
      } else {
        console.log(`❌ Order ${orderId} not found in database.`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ message: "Payment not completed" }, { status: 200 });
  } catch (error) {
    console.error("🚀 Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}