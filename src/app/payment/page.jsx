"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { pushToDataLayer } from "@/lib/gtm";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  useEffect(() => {
    const startPayment = async () => {
      if (!orderId) return;

      // ১. পিক্সেল ইভেন্ট (Initiate Checkout)
      pushToDataLayer("InitiateCheckout", { value: amount, currency: "BDT" });

      try {
        const res = await fetch("/api/uddoktapay/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, amount, customerName: name, customerEmail: email }),
        });

        const data = await res.json();

        if (data.payment_url) {
          window.location.href = data.payment_url; // সরাসরি গেটওয়েতে রিডাইরেক্ট
        } else {
          alert("পেমেন্ট লিঙ্ক তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
          router.push("/checkout");
        }
      } catch (err) {
        console.error("Payment Error:", err);
        alert("সার্ভার কানেকশন এরর! আপনার ইন্টারনেট বা API সেটিংস চেক করুন।");
      }
    };

    startPayment();
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-gray-800">Redirecting to Secure Payment</h2>
        <p className="text-gray-500 mt-2">দয়া করে অপেক্ষা করুন, আপনাকে পেমেন্ট গেটওয়েতে নিয়ে যাওয়া হচ্ছে...</p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return <Suspense fallback={<div>Loading...</div>}><PaymentContent /></Suspense>;
}