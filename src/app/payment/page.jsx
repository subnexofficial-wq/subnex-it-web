"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { pushToDataLayer } from "@/lib/gtm";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL থেকে সব ডাটা নেওয়া হচ্ছে
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount"); 
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const couponCode = searchParams.get("coupon");

  useEffect(() => {
    const startPayment = async () => {
     
      if (!orderId || !amount) return;

      // ১. 
      pushToDataLayer("InitiateCheckout", { 
        value: amount, 
        currency: "BDT",
        coupon: couponCode || "" 
      });

      try {
        const res = await fetch("/api/uddoktapay/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            orderId, 
            amount, 
            customerName: name, 
            customerEmail: email,
            coupon: couponCode || "" 
          }),
        });

        const data = await res.json();

        if (data.payment_url) {
          window.location.href = data.payment_url; 
        } else {
          alert("পেমেন্ট লিঙ্ক তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
          router.push("/checkout");
        }
      } catch (err) {
        console.error("Payment Error:", err);
        alert("সার্ভার কানেকশন এরর! আপনার ইন্টারনেট বা API সেটিংস চেক করুন।");
      }
    };

    startPayment();
  }, [orderId, amount]); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {/* লোডার এনিমেশন */}
        <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        
        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
          Pay ৳{amount}
        </h2>
        <p className="text-gray-500 mt-2 font-medium">
          {couponCode ? `Coupon "${couponCode}" applied!` : "Securely redirecting to gateway..."}
        </p>
        
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce"></span>
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-bold italic text-gray-400">
        Loading Payment...
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}