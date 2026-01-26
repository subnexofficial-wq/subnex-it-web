import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";


export async function PATCH(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    console.log("--- রিসিভড ডাটা ---", body);

    // আপনার রিকোয়েস্ট থেকে senderEmail আসছে
    const { transactionId, orderId, status, senderEmail } = await req.json(); 
    const { db } = await getDB();

    // ১. ট্রানজ্যাকশন স্ট্যাটাস আপডেট করা
    await db.collection("transactions").updateOne(
      { _id: new ObjectId(transactionId) },
      { $set: { status: status, processedAt: new Date() } }
    );

    const newPaymentStatus = status === 'approved' ? 'paid' : 'unpaid';

    // ২. অর্ডার স্ট্যাটাস আপডেট এবং অর্ডারের ডিটেইলস নিয়ে আসা
    const updatedOrder = await db.collection("orders").findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: { paymentStatus: newPaymentStatus } },
      { returnDocument: "after" }
    );

    const order = updatedOrder.value || updatedOrder;

    // ৩. যদি পেমেন্ট approved হয় এবং senderEmail থাকে, তবে ইনভয়েস পাঠানো হবে
    if (status === 'approved' && senderEmail && order) {
      console.log("ইমেল পাঠানোর চেষ্টা করা হচ্ছে:", order.customer.email);
      await sendEmail({
        to: senderEmail, 
        subject: `Payment Confirmed - Order #${order._id.toString().slice(-6)}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #006747; padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">Payment Invoice</h1>
              <p style="margin-top: 10px; opacity: 0.9;">Thank you for your purchase!</p>
            </div>
            
            <div style="padding: 30px; color: #334155;">
              <p>Hello,</p>
              <p>Your payment for order <strong>#${order._id.toString().slice(-6)}</strong> has been successfully verified and approved.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Amount Paid:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #006747;">৳${order.pricing?.totalAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Transaction Status:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #10b981;">SUCCESSFUL</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Date:</td>
                    <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleDateString()}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 14px; line-height: 1.6;">
                Our team is now processing your order. You will receive further updates soon.
              </p>
              
              <div style="text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 5px;">This is an automated payment confirmation email.</p>
                <p style="font-size: 12px; font-weight: bold; color: #006747;">Team Subnex</p>
              </div>
            </div>
          </div>
        `
      });
    }

    return NextResponse.json({ 
      message: `Transaction ${status} successfully. Invoice sent to ${senderEmail}` 
    }, { status: 200 });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}