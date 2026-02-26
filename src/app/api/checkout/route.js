import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, customerName, customerEmail, customerMobile, orderDetails, isAutomation } = body;
    const originalPrice = Number(orderDetails?.originalPrice || amount || 0);
    const finalAmount = Number(orderDetails?.finalPrice || amount || 0);
    const discountAmount = Math.max(
      0,
      Number(orderDetails?.discountAmount ?? (originalPrice - finalAmount))
    );
    const couponCode = orderDetails?.coupon || "NONE";

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
      orderDetails: orderDetails || null,
      pricing: {
        total: originalPrice,
        subtotal: finalAmount,
        discount: discountAmount,
        couponCode,
        totalAmount: Number(amount),
      },
      items: orderDetails,
      amount: Number(amount),
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    });
    const orderId = order.insertedId.toString();

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
          order_id: orderId,
          collection: collectionName 
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${orderId}&collection=${collectionName}`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${orderId}&collection=${collectionName}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/uddoktapay`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.payment_url) {
      return NextResponse.json({ error: data?.message || "Gateway Error" }, { status: 400 });
    }

    await db.collection(collectionName).updateOne(
      { _id: order.insertedId },
      {
        $set: {
          gatewayTransactionId: data?.transaction_id || data?.transactionId || null,
          gatewayInvoiceId: data?.invoice_id || data?.invoiceId || null,
          paymentInitStatus: "initiated",
          paymentInitPayload: data,
          paymentInitAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ payment_url: data.payment_url });

  } catch (error) {
    console.error("Checkout Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
