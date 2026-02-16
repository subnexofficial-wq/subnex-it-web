import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/mailer";

export async function GET() {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await getDB();
    const data = await db.collection("automation_orders").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId, status, paymentStatus } = await req.json();
    if (!orderId) return NextResponse.json({ error: "Order ID is required" }, { status: 400 });

    const { db } = await getDB();
    const order = await db.collection("automation_orders").findOne({ _id: new ObjectId(orderId) });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const newStatus = status || "completed";
    const newPaymentStatus = paymentStatus || "paid";

    await db.collection("automation_orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status: newStatus,
          paymentStatus: newPaymentStatus,
          updatedAt: new Date(),
        },
      }
    );

    if (newStatus === "completed" && order.customerEmail) {
      const details = order.orderDetails || order.items || {};
      const planName = details.planName || "Automation Plan";
      const originalPrice = Number(details.originalPrice || order.pricing?.total || order.amount || 0);
      const finalAmount = Number(details.finalPrice || order.pricing?.totalAmount || order.amount || 0);
      const discountAmount = Number(
        details.discountAmount || order.pricing?.discount || Math.max(0, originalPrice - finalAmount)
      );
      const couponCode = details.coupon || order.pricing?.couponCode || "NONE";

      try {
        await sendEmail({
          to: order.customerEmail,
          subject: `Invoice - #${orderId.toString().slice(-6).toUpperCase()} from Subnex Automation`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; background-color: #f8fafc; padding: 20px;">
              <div style="background-color: #ffffff; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0;">
                <div style="text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 25px;">
                  <h1 style="color: #22d3ee; margin: 0; font-size: 24px; text-transform: uppercase;">Subnex Automation</h1>
                  <p style="color: #94a3b8; font-size: 12px; margin-top: 5px;">ORDER ID: #${orderId.toString().slice(-6).toUpperCase()}</p>
                </div>

                <div style="margin-bottom: 20px;">
                  <p style="margin: 0; color: #64748b; font-size: 14px;">Customer Name:</p>
                  <p style="margin: 0; color: #1e293b; font-weight: bold;">${order.customerName || "Customer"}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="border-bottom: 1px solid #f1f5f9; text-align: left;">
                      <th style="padding: 10px; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Service/Plan</th>
                      <th style="padding: 10px; color: #94a3b8; font-size: 12px; text-transform: uppercase; text-align: right;">Original</th>
                      <th style="padding: 10px; color: #94a3b8; font-size: 12px; text-transform: uppercase; text-align: right;">Discount</th>
                      <th style="padding: 10px; color: #94a3b8; font-size: 12px; text-transform: uppercase; text-align: right;">Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="padding: 15px 10px; color: #1e293b; font-weight: 500;">${planName}</td>
                      <td style="padding: 15px 10px; color: #1e293b; font-weight: bold; text-align: right;">৳${originalPrice}.00</td>
                      <td style="padding: 15px 10px; color: #16a34a; font-weight: bold; text-align: right;">-৳${discountAmount}.00</td>
                      <td style="padding: 15px 10px; color: #0891b2; font-weight: bold; text-align: right;">৳${finalAmount}.00</td>
                    </tr>
                  </tbody>
                </table>

                <div style="background-color: #f1f5f9; padding: 15px; border-radius: 12px;">
                  <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
                    <span style="color: #64748b;">Coupon Applied:</span>
                    <span style="color: #1e293b; font-weight: bold;">${couponCode}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 10px;">
                    <span style="font-weight: bold; color: #1e293b;">Total Paid:</span>
                    <span style="font-weight: bold; color: #0891b2; font-size: 18px;">৳${finalAmount}.00</span>
                  </div>
                </div>
              </div>
            </div>
          `,
        });

        await db.collection("automation_orders").updateOne(
          { _id: new ObjectId(orderId) },
          {
            $set: {
              invoiceSent: true,
              invoiceSentAt: new Date(),
              invoiceCouponCode: couponCode || "NONE",
              invoiceDownloadable: false,
              updatedAt: new Date(),
            },
          }
        );
      } catch (emailErr) {
        await db.collection("automation_orders").updateOne(
          { _id: new ObjectId(orderId) },
          {
            $set: {
              invoiceSent: false,
              invoiceError: "send_failed",
              invoiceDownloadable: false,
              updatedAt: new Date(),
            },
          }
        );
        console.error("Invoicing Email Failed:", emailErr);
      }
    }

    return NextResponse.json({ ok: true, message: "Order updated and invoice sent" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { db } = await getDB();
    const result = await db.collection("automation_orders").deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
