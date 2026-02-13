import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/mailer";

export async function PATCH(req, { params }) {
  try {
    // ১. অ্যাডমিন ভেরিফিকেশন (ইমপোর্ট ঠিক থাকলে এটি এখন কাজ করবে)
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status, collection } = await req.json(); 

    const targetCollection = collection || "orders"; 
    const { db } = await getDB();
    
    // ২. ডাটাবেস থেকে অর্ডার খুঁজে বের করা
    const order = await db.collection(targetCollection).findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // ৩. প্রাইসিং এবং কুপন ডাটা প্রিপেয়ার করা
    const pricing = order.pricing || {};
    const couponCode = pricing.couponCode ; 

    // ৪. অর্ডারের স্ট্যাটাস আপডেট করা
    await db.collection(targetCollection).updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status, updatedAt: new Date() } }
    );

    // ৫. যদি 'completed' হয়, তবে ইনভয়েস মেইল পাঠানো
    if (status === "completed" && order.customer?.email) {
      
      const activeItems = order.items || order.orderItems || [];
      const isLanding = targetCollection === "automation_orders" || !!order.items;
      const brandName = isLanding ? "Subnex Automation" : "Subnex Store";

      // প্রাইসিং ক্যালকুলেশন
      const subtotal = pricing.subtotal || pricing.totalAmount || 0;
      const discount = pricing.discount || 0;
      const tip = pricing.tip || 0;
      const totalPaid = pricing.totalAmount || (subtotal - discount + tip);

      // ডিজিটাল ডাউনলোড লিঙ্ক লজিক
      let downloadLink = order.downloadLink || null;
      if (!downloadLink && activeItems?.[0]?.productId) {
        try {
            const product = await db.collection("products").findOne({ _id: new ObjectId(activeItems[0].productId) });
            if (product?.isDownloadable) downloadLink = product.downloadLink;
        } catch (e) { console.log("Product fetch failed"); }
      }

      // আইটেম টেবিল জেনারেট করা
      const itemRows = activeItems.map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #334155;">${item.title || "Digital Service"}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #334155;">${item.quantity || 1}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: bold;">৳${item.price || 0}.00</td>
        </tr>
      `).join("");

      try {
        await sendEmail({
          to: order.customer.email,
          type: "invoice", 
          subject: `Invoice - #${id.toString().slice(-6).toUpperCase()} from ${brandName}`,
          html: `
            <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; background-color: #f8fafc; padding: 20px;">
              <div style="background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                
                <div style="text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px;">
                  <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase;">${brandName}</h1>
                  <p style="color: #94a3b8; font-size: 12px; font-weight: bold; letter-spacing: 2px; margin-top: 10px;">INVOICE: #${id.toString().slice(-6).toUpperCase()}</p>
                </div>

                <div style="margin-bottom: 30px;">
                  <h3 style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Invoice To:</h3>
                  <p style="margin: 0; color: #1e293b; font-weight: bold; font-size: 16px;">${order.customer?.firstName || order.customer?.name || "Customer"} ${order.customer?.lastName || ""}</p>
                  <p style="margin: 2px 0; color: #64748b; font-size: 14px;">${order.customer?.email}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th style="padding: 12px; text-align: left; font-size: 10px; color: #94a3b8; text-transform: uppercase;">Description</th>
                      <th style="padding: 12px; text-align: center; font-size: 10px; color: #94a3b8; text-transform: uppercase;">Qty</th>
                      <th style="padding: 12px; text-align: right; font-size: 10px; color: #94a3b8; text-transform: uppercase;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>${itemRows}</tbody>
                </table>

                <div style="margin-left: auto; width: 250px;">
                  <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                    <span style="color: #94a3b8;">Subtotal:</span>
                    <span style="color: #1e293b; font-weight: bold;">৳${subtotal}.00</span>
                  </div>

                  ${discount > 0 ? `
                  <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #ef4444;">
                    <span>Discount ${couponCode && couponCode !== "none" ? `(${couponCode})` : ''}:</span>
                    <span>-৳${discount}.00</span>
                  </div>` : ''}

                  ${tip > 0 ? `
                  <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #10b981;">
                    <span>Tips:</span>
                    <span>+৳${tip}.00</span>
                  </div>` : ''}

                  <div style="display: flex; justify-content: space-between; border-top: 2px solid #f1f5f9; padding-top: 15px; margin-top: 15px;">
                    <span style="font-weight: 900; color: #1e293b;">TOTAL PAID:</span>
                    <span style="font-weight: 900; color: #2563eb; font-size: 20px;">৳${totalPaid}.00</span>
                  </div>
                </div>

                ${downloadLink ? `
                <div style="margin-top: 40px; padding: 25px; background-color: #eff6ff; border: 2px dashed #bfdbfe; border-radius: 16px; text-align: center;">
                  <p style="color: #1e40af; font-weight: bold; margin-bottom: 15px;">Your Digital Product is Ready!</p>
                  <a href="${downloadLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">DOWNLOAD ASSETS</a>
                </div>` : ''}

                <div style="margin-top: 40px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                  <p style="color: #94a3b8; font-size: 12px;">Thank you for choosing Subnex!</p>
                </div>
              </div>
            </div>
          `
        });
      } catch (err) { console.error("Email send fail:", err); }
    }

    return NextResponse.json({ ok: true, message: `Status updated to ${status}` });

  } catch (err) {
    console.error("Admin Status Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}