import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function verifyPayment({ invoiceId, transactionId }) {
  const payloads = [];
  if (invoiceId) payloads.push({ invoice_id: invoiceId });
  if (transactionId) payloads.push({ transaction_id: transactionId });

  for (const body of payloads) {
    const res = await fetch("https://pay.subnexit.com/api/verify-payment", {
      method: "POST",
      headers: {
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTAPAY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok && data) return data;
  }

  return null;
}

function pickFirst(...vals) {
  return vals.find((v) => v !== undefined && v !== null && v !== "");
}

function extractPaymentState(verifyData) {
  const rawStatus = String(
    pickFirst(
      verifyData?.status,
      verifyData?.payment_status,
      verifyData?.paymentStatus,
      verifyData?.data?.status,
      verifyData?.data?.payment_status,
      verifyData?.data?.paymentStatus,
      verifyData?.result?.status,
      verifyData?.result?.payment_status,
      verifyData?.result?.paymentStatus
    ) || ""
  ).toLowerCase();

  const isPaid = ["completed", "paid", "success", "successful"].includes(rawStatus);

  const resolvedTrxId = pickFirst(
    verifyData?.transaction_id,
    verifyData?.transactionId,
    verifyData?.trx_id,
    verifyData?.txid,
    verifyData?.data?.transaction_id,
    verifyData?.data?.transactionId,
    verifyData?.result?.transaction_id,
    verifyData?.result?.transactionId
  );

  const resolvedInvoiceId = pickFirst(
    verifyData?.invoice_id,
    verifyData?.invoiceId,
    verifyData?.data?.invoice_id,
    verifyData?.data?.invoiceId,
    verifyData?.result?.invoice_id,
    verifyData?.result?.invoiceId
  );

  return { rawStatus, isPaid, resolvedTrxId, resolvedInvoiceId };
}

export async function POST(req) {
  try {
    const { orderId, invoiceId, transactionId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const verifyData = await verifyPayment({ invoiceId, transactionId });
    if (!verifyData) {
      return NextResponse.json({ error: "Unable to verify payment" }, { status: 400 });
    }

    const { isPaid, resolvedTrxId, resolvedInvoiceId } = extractPaymentState(verifyData);

    const { db } = await getDB();
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentStatus: isPaid ? "paid" : "unpaid",
          transactionId: resolvedTrxId || transactionId || null,
          gatewayInvoiceId: resolvedInvoiceId || invoiceId || null,
          paidAt: isPaid ? new Date() : null,
          paymentVerifyPayload: verifyData,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      ok: true,
      paid: isPaid,
      transactionId: resolvedTrxId || transactionId || null,
      invoiceId: resolvedInvoiceId || invoiceId || null,
    });
  } catch (err) {
    console.error("Sync Payment Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
