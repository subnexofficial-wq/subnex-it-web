import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, type = "admin" }) {
  // টাইপ অনুযায়ী সেন্ডার ইমেইল সিলেক্ট হবে
  let fromEmail = process.env.EMAIL_FROM; // ডিফল্ট

  if (type === "security") {
    fromEmail = "SubNex Security <security@subnexit.com>";
  } else if (type === "invoice") {
    fromEmail = "SubNex Billing <billing@subnexit.com>";
  } else if (type === "admin") {
    fromEmail = "SubNex Order <order@subnexit.com>";
  }

  await resend.emails.send({
    from: fromEmail, 
    to: Array.isArray(to) ? to : [to],
    subject,
    html, 
  });
}