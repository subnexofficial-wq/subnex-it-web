import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, type = "admin" }) {
  let fromEmail;

  // টাইপ অনুযায়ী .env থেকে ইমেইল সিলেক্ট করা
  if (type === "security") {
    fromEmail = process.env.SECURITY_EMAIL;
  } else if (type === "invoice") {
    fromEmail = process.env.INVOICE_EMAIL;
  } else {
    fromEmail = process.env.ADMIN_EMAIL;
  }

 
  if (!fromEmail) {
    fromEmail = "Subnex <security@subnexit.com>"; 
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail, 
      to: Array.isArray(to) ? to : [to],
      subject,
      html, 
    });
    console.log("Email sent successfully:", data.id);
    return data;
  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
}