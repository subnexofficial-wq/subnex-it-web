import { sendEmail } from "@/lib/mailer";
import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userEmail, orderItems, customer, pricing } = body;

    if (!orderItems || orderItems.length === 0 || !pricing.totalAmount) {
      return NextResponse.json({ error: "Missing order information" }, { status: 400 });
    }

    const { db } = await getDB();
    const digitalProduct = orderItems.find((item) => item.category === "digital-product");

    const newOrder = {
      userEmail,
      customer,
      orderItems,
      downloadLink: digitalProduct?.downloadLink || null,
      pricing: {
        total: Number(pricing.total || (Number(pricing.subtotal || 0) + Number(pricing.discount || 0))),
        subtotal: Number(pricing.subtotal),
        shippingFee: Number(pricing.shippingFee),
        tip: Number(pricing.tip || 0),
        discount: Number(pricing.discount || 0),
        couponCode: pricing.couponCode || "none",
        totalAmount: Number(pricing.totalAmount),
      },
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);

    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const shortId = result.insertedId.toString().slice(-6).toUpperCase();
      const couponCode = pricing.couponCode && pricing.couponCode !== "none" ? pricing.couponCode : "NONE";
      const orderSummary = orderItems
        .map((item) => {
          const qty = Number(item.quantity || 1);
          const lineAmount = Number(item.price || 0) * qty;
          return `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.title || "Item"}</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${qty}</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700;">BDT ${lineAmount.toLocaleString()}</td>
            </tr>
          `;
        })
        .join("");

      await sendEmail({
        to: adminEmail,
        subject: `New Order Received #${shortId} - Subnex`,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 700px; margin: auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 14px;">
              <h2 style="margin: 0; color: #111827;">New Order Notification</h2>
              <span style="background: #eff6ff; color: #1d4ed8; padding: 6px 12px; border-radius: 999px; font-weight: 700; font-size: 12px;">PENDING</span>
            </div>

            <div style="margin-top: 18px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px;">
              <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 8px;">
                <span style="color: #6b7280;">Order ID</span>
                <strong>#${shortId}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 8px;">
                <span style="color: #6b7280;">Transaction ID</span>
                <strong style="color: #b45309;">Pending payment verification</strong>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 10px;">
                <span style="color: #6b7280;">Coupon Code</span>
                <strong style="color: #1d4ed8;">${couponCode}</strong>
              </div>
            </div>

            <div style="margin-top: 22px;">
              <strong style="font-size: 14px;">Customer</strong>
              <p style="margin: 8px 0 0; color: #374151;">${customer.firstName || ""} ${customer.lastName || ""}</p>
              <p style="margin: 4px 0 0; color: #374151;">${customer.email || "-"}</p>
              <p style="margin: 4px 0 0; color: #374151;">${customer.phone || "-"}</p>
              <p style="margin: 4px 0 0; color: #374151;">${customer.address || "-"}, ${customer.city || "-"}</p>
            </div>

            <div style="margin-top: 22px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f8fafc;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; color: #6b7280;">Item</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280;">Amount</th>
                  </tr>
                </thead>
                <tbody>${orderSummary}</tbody>
              </table>
            </div>

            <div style="margin-top: 16px; text-align: right; font-size: 16px;">
              <strong>Total Payable: BDT ${Number(pricing.totalAmount || 0).toLocaleString()}</strong>
            </div>

            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard/orders"
               style="display: inline-block; background: #111827; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 18px;">
               Open Orders Dashboard
            </a>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Mail Sending Failed:", mailError);
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
