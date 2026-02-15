import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/mailer";

export async function PATCH(req, { params }) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status, collection } = await req.json();

    const targetCollection = collection || "orders";
    const { db } = await getDB();

    const order = await db.collection(targetCollection).findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // ১. স্ট্যাটাস আপডেট
    await db.collection(targetCollection).updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status, updatedAt: new Date() } }
    );

    // ২. যদি 'completed' হয়, তবে মেইল পাঠানো
    if (status === "completed" && order.customer?.email) {
      const pricing = order.pricing || {};
      const activeItems = order.items || order.orderItems || [];
      const invoiceDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      const shortId = id.toString().slice(-6).toUpperCase();

      // ডিজিটাল ডাউনলোড লিঙ্ক
      let downloadLink = order.downloadLink || null;
      if (!downloadLink && activeItems?.[0]?.productId) {
        try {
          const product = await db.collection("products").findOne({ _id: new ObjectId(activeItems[0].productId) });
          if (product?.isDownloadable) downloadLink = product.downloadLink;
        } catch (e) { console.log("Product fetch failed"); }
      }

      // টেবিল রো জেনারেট
      const itemRows = activeItems.map(item => `
        <tr>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; color: #374151;">${item.title || "Digital Service"}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151;">${item.quantity || 1}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151;">BDT 0.00</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-weight: bold;">BDT ${item.price || 0}.00</td>
        </tr>
      `).join("");

      // ইমেইল টেমপ্লেট
      const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background: #f1f5f9; padding: 20px; color: #111827; }
          .invoice-container { max-width: 700px; margin: auto; background: #ffffff; padding: 40px; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .top { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
          .status { background: #e0ecff; color: #2563eb; padding: 6px 15px; border-radius: 999px; font-weight: 700; font-size: 12px; }
          .info { margin-top: 30px; font-size: 14px; line-height: 1.6; }
          .table-wrapper { margin-top: 30px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f8fafc; padding: 12px; text-align: left; font-size: 12px; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
          .summary { width: 300px; margin-left: auto; margin-top: 25px; background: #f8fafc; padding: 15px; border-radius: 10px; font-size: 14px; }
          .summary div { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .total { font-weight: 700; border-top: 1px solid #e5e7eb; padding-top: 10px; color: #2563eb; font-size: 16px; }
          .download-box { margin-top: 30px; padding: 20px; background: #eff6ff; border: 2px dashed #bfdbfe; border-radius: 12px; text-align: center; }
          .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 10px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px; }
          .note { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <table width="100%">
            <tr>
              <td>
                <img src="https://subnexit.com/_next/image?url=%2Flogo2.png&w=1920&q=75" height="40" alt="Subnex">
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Invoice #${shortId}</div>
              </td>
              <td align="right">
                <span class="status">PAID</span>
              </td>
            </tr>
          </table>

          <div class="info">
            <strong>Invoice To:</strong><br>
            ${order.customer?.firstName || order.customer?.name || "Customer"} ${order.customer?.lastName || ""}<br>
            ${order.customer?.email}<br>
            ${order.customer?.phone || ""}
          </div>

          <div style="margin-top: 15px; font-size: 14px;">
            <strong>Invoice Date:</strong> ${invoiceDate}
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Discount</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
          </div>

          <div class="summary">
            <div><span>Sub Total</span><span>BDT ${pricing.subtotal || pricing.totalAmount}.00</span></div>
            <div><span>Discount</span><span>BDT ${pricing.discount || 0}.00</span></div>
            ${pricing.tip > 0 ? `<div><span>Tips</span><span>BDT ${pricing.tip}.00</span></div>` : ""}
            <div class="total"><span>Total</span><span>BDT ${pricing.totalAmount}.00</span></div>
          </div>

          ${downloadLink ? `
            <div class="download-box">
              <p style="margin:0; color:#1e40af; font-weight:bold;">Your download is ready!</p>
              <a href="${downloadLink}" class="btn">DOWNLOAD ASSETS</a>
            </div>
          ` : ""}

          <div class="note">
            This is an auto-generated invoice from Subnex. No signature is required.
          </div>
        </div>
      </body>
      </html>`;

      try {
        await sendEmail({
          to: order.customer.email,
          type: "invoice",
          subject: `Invoice #${shortId} - Subnex`,
          html: emailHtml
        });
      } catch (err) { console.error("Email send fail:", err); }
    }

    return NextResponse.json({ ok: true, message: `Status updated to ${status}` });

  } catch (err) {
    console.error("Admin Status Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}