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
    // await db.collection(targetCollection).updateOne(
    //   { _id: new ObjectId(id) },
    //   { $set: { status: status, updatedAt: new Date() } }
    // );
    const updateResult = await db.collection(targetCollection).updateOne(
  { _id: new ObjectId(id) },
  { $set: { status: status, updatedAt: new Date() } }
);

if (updateResult.modifiedCount === 0) {
  return NextResponse.json(
    { error: "Status update failed" },
    { status: 400 }
  );
}

    
 if (status === "completed" && order.customer?.email) {
  const pricing = order.pricing || {};
  const activeItems = order.items || order.orderItems || [];
  const shortId = id.toString().slice(-6).toUpperCase();
  const invoiceDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
    
  const itemCouponCode = activeItems.find((item) => item.appliedCoupon && item.appliedCoupon !== "none")?.appliedCoupon;
  const couponCode =
    pricing.couponCode && pricing.couponCode !== "none"
      ? pricing.couponCode
      : itemCouponCode || null;
  const discountVal = pricing.discount || 0;
  const totalVal = pricing.total || ((pricing.subtotal || pricing.totalAmount || 0) + discountVal);
  const subTotalVal = pricing.subtotal || Math.max(0, totalVal - discountVal);
  const finalPayable = pricing.totalAmount || (subTotalVal + (pricing.shippingFee || 0) + (pricing.tip || 0));
  const transactionId = order.transactionId || order.gatewayTransactionId || order.trxId || order.customer?.transactionId || null;
  const paymentRef = transactionId || order.gatewayInvoiceId || order.invoiceId || "PENDING";

      // ডিজিটাল ডাউনলোড লিঙ্ক
      // let downloadLink = order.downloadLink || null;
      // if (!downloadLink && activeItems?.[0]?.productId) {
      //   try {
      //     const product = await db.collection("products").findOne({ _id: new ObjectId(activeItems[0].productId) });
      //     if (product?.isDownloadable) downloadLink = product.downloadLink;
      //   } catch (e) { console.log("Product fetch failed"); }
      // }
let downloadLinks = [];
const normalizeDownloadLink = (value) => {
  if (!value || typeof value !== "string") return null;
  const link = value.trim();
  if (!link) return null;

  const isAutomationLink = /(^|\/\/[^/]+)?\/automation([/?#]|$)/i.test(link);
  if (isAutomationLink && !link.includes("#")) {
    return `${link}#workflow`;
  }

  return link;
};
  for (const item of activeItems) {
    try {
      const normalizedLink = normalizeDownloadLink(item.downloadLink);
      if (normalizedLink) {
        downloadLinks.push({
          title: item.title || "Digital Product",
          link: normalizedLink,
        });
      }
    } catch (e) {
      console.log("Product fetch failed");
    }
  }


      // টেবিল রো জেনারেট
    const itemRows = activeItems.map(item => {
      const qty = Number(item.quantity || 1);
      const perUnitOriginal = Number(item.originalPrice || item.price || 0);
      const perUnitDiscounted = Number(item.price || 0);
      const lineOriginal = perUnitOriginal * qty;
      const lineDiscount = Number(item.lineDiscount || Math.max(0, (perUnitOriginal - perUnitDiscounted) * qty));
      const lineAmount = Math.max(0, lineOriginal - lineDiscount);

      return `
        <tr>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px;">${item.title || "Digital Service"}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151; font-size: 14px;">${qty}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #10b981; font-weight: bold; font-size: 14px;">- ৳${lineDiscount.toLocaleString()}</td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827; font-weight: bold; font-size: 14px;">৳${lineAmount.toLocaleString()}</td>
        </tr>
      `;
    }).join("");

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
          .meta-box { margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f8fafc; padding: 12px; }
          .meta-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .meta-row:last-child { margin-bottom: 0; }
          .meta-label { color: #6b7280; }
          .meta-value { font-weight: 800; color: #0f172a; }
          .meta-coupon { color: #1d4ed8; font-weight: 800; }
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

          <div class="meta-box">
            <div class="meta-row">
              <span class="meta-label">Transaction ID :</span>
              <span class="meta-value">  ${paymentRef}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Coupon Code :</span>
              <span class="${couponCode ? "meta-coupon" : "meta-value"}"> ${couponCode || "NONE"}</span>
            </div>
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
            <div>
               <span>Total (Before Coupon)</span>
               <span> BDT ${Number(totalVal).toLocaleString()}.00</span>
            </div>

            <div>
               <span>Subtotal (After Coupon)</span>
               <span>  BDT ${Number(subTotalVal).toLocaleString()}</span>
            </div>
          

            ${Number(pricing.shippingFee || 0) > 0 ? `
            <div>
               <span>Shipping</span>
               <span> BDT ${Number(pricing.shippingFee).toLocaleString()}</span>
            </div>` : ""}

            ${Number(pricing.tip || 0) > 0 ? `
            <div>
               <span>Tips</span>
               <span>BDT ${Number(pricing.tip).toLocaleString()}</span>
            </div>` : ""}

            <div class="total">
               <span>Payable</span>
               <span> BDT ${Number(finalPayable).toLocaleString()}</span>
            </div>
          </div>

${downloadLinks.length > 0 ? `
  <div class="download-box">
    <p style="margin:0 0 15px 0; color:#1e40af; font-weight:bold;">
      Your Downloadable Products:
    </p>

    ${downloadLinks.map(product => `
      <div style="margin-bottom:15px;">
        <div style="font-weight:bold; margin-bottom:6px;">
          ${product.title}
        </div>
        <a href="${product.link}" class="btn">
          Download
        </a>
      </div>
    `).join("")}
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
    to: [
    order.customer.email,
    process.env.ADMIN_EMAIL || "order@subnexit.com"
  ],
          type: "invoice",
          subject: `Invoice #${shortId} - Subnex`,
          html: emailHtml
        });

        await db.collection(targetCollection).updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              invoiceSent: true,
              invoiceSentAt: new Date(),
              invoiceCouponCode: couponCode || "none",
              invoiceDownloadable: false,
              updatedAt: new Date(),
            },
          }
        );
      } catch (err) {
        await db.collection(targetCollection).updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              invoiceSent: false,
              invoiceError: "send_failed",
              invoiceDownloadable: false,
              updatedAt: new Date(),
            },
          }
        );
        console.error("Email send fail:", err);
      }
    }

    return NextResponse.json({ ok: true, message: `Status updated to ${status}` });

  } catch (err) {
    console.error("Admin Status Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
