import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/mailer";

export async function PATCH(req, { params }) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json(); 

    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { db } = await getDB();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ১. স্ট্যাটাস আপডেট
    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status, updatedAt: new Date() } }
    );

    // ২. যদি 'completed' হয়, তবে কাস্টমারকে ইনভয়েস পাঠানো
    if (status === "completed" && order.customer?.email) {
      const isLanding = order.orderSource === "landing_page";
      const brandName = isLanding ? "Subnex Automation" : "Subnex Store";
      
      // ডিজিটাল প্রোডাক্টের জন্য ডাউনলোড লিঙ্ক চেক
      let downloadLink = order.downloadLink || null;
      if (!downloadLink && order.orderItems?.[0]?.productId) {
         const product = await db.collection("products").findOne({ _id: new ObjectId(order.orderItems[0].productId) });
         if (product?.isDownloadable) downloadLink = product.downloadLink;
      }

      const itemRows = order.orderItems.map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #334155;">${item.title}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #334155;">${item.quantity || 1}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: bold;">৳${item.price}.00</td>
        </tr>
      `).join("");

      try {
        await sendEmail({
          to: order.customer.email,
          subject: `Invoice - #${order._id.toString().slice(-6).toUpperCase()} from ${brandName}`,
          html: `
            <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; background-color: #f8fafc; padding: 20px;">
              <div style="background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                
                <div style="text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px;">
                  <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase;">${brandName}</h1>
                  <p style="color: #94a3b8; font-size: 12px; font-weight: bold; letter-spacing: 2px; margin-top: 10px;">INVOICE: #${order._id.toString().slice(-6).toUpperCase()}</p>
                </div>

                <div style="margin-bottom: 30px;">
                  <h3 style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Invoice To:</h3>
                  <p style="margin: 0; color: #1e293b; font-weight: bold; font-size: 16px;">${order.customer.firstName || order.customer.name} ${order.customer.lastName || ""}</p>
                  <p style="margin: 2px 0; color: #64748b; font-size: 14px;">${order.customer.email}</p>
                  <p style="margin: 2px 0; color: #64748b; font-size: 14px;">Source: ${isLanding ? 'Landing Page' : 'Main Website'}</p>
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
                    <span style="color: #1e293b; font-weight: bold;">৳${order.pricing?.subtotal || order.pricing?.totalAmount}.00</span>
                  </div>
                  ${order.pricing?.discount > 0 ? `
                  <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #ef4444;">
                    <span>Discount:</span>
                    <span>-৳${order.pricing.discount}.00</span>
                  </div>` : ''}
                  ${order.pricing?.tip > 0 ? `
                  <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #10b981;">
                    <span>Tips:</span>
                    <span>+৳${order.pricing.tip}.00</span>
                  </div>` : ''}
                  <div style="display: flex; justify-content: space-between; border-top: 2px solid #f1f5f9; pt: 15px; margin-top: 15px;">
                    <span style="font-weight: 900; color: #1e293b;">TOTAL PAID:</span>
                    <span style="font-weight: 900; color: #2563eb; font-size: 20px;">৳${order.pricing?.totalAmount}.00</span>
                  </div>
                </div>

                ${downloadLink ? `
                <div style="margin-top: 40px; padding: 25px; background-color: #eff6ff; border: 2px dashed #bfdbfe; border-radius: 16px; text-align: center;">
                  <p style="color: #1e40af; font-weight: bold; margin-bottom: 15px;">Your Digital Product is Ready!</p>
                  <a href="${downloadLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">DOWNLOAD ASSETS</a>
                </div>` : ''}

                <div style="margin-top: 40px; text-align: center; border-top: 1px solid #f1f5f9; pt: 20px;">
                   <p style="color: #94a3b8; font-size: 12px;">Thank you for choosing Subnex!</p>
                </div>
              </div>
            </div>
          `
        });
      } catch (err) { console.error("Email send fail:", err); }
    }

    return NextResponse.json({ message: `Order status updated to ${status}` });

  } catch (err) {
    console.error("Admin Status Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}