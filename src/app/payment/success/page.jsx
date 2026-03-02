"use client";
import React, { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/CartContext";
import { useSearchParams } from "next/navigation";
import { pushToDataLayer } from "@/lib/gtm";

function PaymentSuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // useEffect(() => {
  //   const syncPayment = async () => {
  //     const orderId = searchParams.get("orderId");
  //     const collection = searchParams.get("collection");
  //     const invoiceId =
  //       searchParams.get("invoice_id") ||
  //       searchParams.get("invoiceId") ||
  //       searchParams.get("invoice");
  //     const transactionId =
  //       searchParams.get("transaction_id") ||
  //       searchParams.get("transactionId") ||
  //       searchParams.get("trx_id");
  //     const amountRaw = searchParams.get("amount") || "0";
  //     const amount = Number(String(amountRaw).replace(/[^\d.]/g, "")) || 0;

  //     if (!orderId) return;
  //     const purchaseEventId = transactionId || invoiceId || orderId;

  //     pushToDataLayer("Purchase", {
  //       transaction_id: purchaseEventId,
  //       content_ids: [orderId],
  //       content_type: "product",
  //       num_items: 1,
  //       value: amount,
  //       currency: "BDT",
  //       page_type: "automation_success",
  //       order_id: orderId,
  //     });

  //     try {
  //       await fetch("/api/orders/sync-payment", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ orderId, invoiceId, transactionId, collection }),
  //       });
  //     } catch (err) {
  //       console.error("Payment sync failed:", err);
  //     }
  //   };

  //   syncPayment();
  // }, [searchParams]);
 // PaymentSuccessContent এর ভেতরে আপডেট করুন
useEffect(() => {
  const syncPayment = async () => {
    const orderId = searchParams.get("orderId");
    if (!orderId) return;

    // ১. ডুপ্লিকেট ট্র্যাকিং রোধ (SessionStorage)
    const firedOrders = JSON.parse(sessionStorage.getItem("fired_purchases") || "[]");
    if (firedOrders.includes(orderId)) return; 

    const amountRaw = searchParams.get("amount") || "0";
    const amount = Number(String(amountRaw).replace(/[^\d.]/g, "")) || 0;
    const transactionId = searchParams.get("transaction_id") || searchParams.get("trx_id") || orderId;
    
    
    const isAutomation = searchParams.get("isAutomation") === "true";

    // ৩. মেটা পিক্সেল পারচেজ ইভেন্ট
    pushToDataLayer("Purchase", {
      transaction_id: transactionId,
      content_ids: [orderId],
      content_type: "product",
      content_category: isAutomation ? "Automation" : "General_Ecom",
      value: amount,
      currency: "BDT",
      order_id: orderId,
    });

    firedOrders.push(orderId);
    sessionStorage.setItem("fired_purchases", JSON.stringify(firedOrders));

    
    try {
      await fetch("/api/orders/sync-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId, 
          transactionId, 
          collection: isAutomation ? "automation" : "orders" 
        }),
      });
    } catch (err) {
      console.error("Sync error:", err);
    }
  };

  syncPayment();
}, [searchParams]);
  return (
    <div className="min-h-screen bg-[#010409] text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0b121d] border border-white/10 p-10 rounded-[3rem] text-center shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 p-4 rounded-full">
            <CheckCircle2 size={64} className="text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase mb-4 tracking-tight">
          অর্ডার সফল হয়েছে!
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          অর্ডারটি গ্রহণ করা হয়েছে। শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition font-bold"
          >
            <ArrowLeft size={18} /> ব্যাক টু হোম
          </Link>

          <a
            href="https://wa.me/8801323019182"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-600 text-black rounded-2xl transition font-bold"
          >
            <MessageSquare size={18} /> সরাসরি হোয়াটসঅ্যাপ করুন
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#010409] text-white flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-[#0b121d] border border-white/10 p-10 rounded-[3rem] text-center shadow-2xl">
            Loading payment status...
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
