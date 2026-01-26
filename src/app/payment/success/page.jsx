"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiCheckCircle, FiDownload, FiHome, FiUser } from "react-icons/fi";

const InvoiceContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // UddoktaPay থেকে আসা ডাটা এবং আপনার পাঠানো কুয়েরি প্যারামস
  const invoiceId = searchParams.get("invoice_id");
  const [customerName, setCustomerName] = useState("Valued Customer");

  useEffect(() => {
    // ১. পেমেন্ট পেজ থেকে রিডাইরেক্ট হওয়ার সময় আমরা নাম পাঠাতে পারি 
    // অথবা লোকাল স্টোরেজ থেকে নিতে পারি (সবচেয়ে সহজ উপায়)
    const savedName = localStorage.getItem("last_customer_name");
    if (savedName) {
      setCustomerName(savedName);
    }
  }, [searchParams]);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
        
        {/* Header */}
        <div className="bg-[#006747] p-8 text-center text-white print:bg-white print:text-black border-b">
          <FiCheckCircle className="mx-auto mb-4 print:hidden" size={50} />
          <h1 className="text-2xl font-bold uppercase tracking-tight">Payment Receipt</h1>
          <p className="opacity-90 mt-1">Transaction Successful</p>
        </div>

        <div className="p-8">
          {/* Invoice Info */}
          <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-50">
            <div>
              <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Billed To</p>
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-400 print:hidden" />
                <h2 className="text-xl font-bold text-gray-800">{customerName}</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Invoice ID</p>
              <p className="font-mono text-sm text-gray-700">{invoiceId || "N/A"}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-500 text-sm">Merchant</span>
              <span className="font-bold text-gray-800">SubNex Limited</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-500 text-sm">Payment Status</span>
              <span className="text-green-600 font-bold text-sm uppercase">Paid via MFS</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-50 text-lg">
              <span className="font-bold text-gray-800">Total Amount Paid</span>
              <span className="font-black text-[#006747]">৳ Verified</span>
            </div>
          </div>

          <div className="mt-10 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
            <p className="text-xs text-emerald-800 font-medium">
              আপনার পেমেন্টটি সফলভাবে সম্পন্ন হয়েছে। অর্ডারের বিস্তারিত মেইল করে পাঠানো হয়েছে।
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-8 bg-gray-50 flex gap-4 print:hidden">
          <button onClick={handlePrint} className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
            <FiDownload /> Print Invoice
          </button>
          <button onClick={() => router.push("/")} className="flex-1 bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
            <FiHome /> Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SuccessPage() {
  return <Suspense><InvoiceContent /></Suspense>;
}