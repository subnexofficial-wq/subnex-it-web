"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiDownload, FiHome, FiPrinter } from "react-icons/fi";

const InvoiceContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL থেকে UddoktaPay-এর invoice_id নেওয়া
  const invoiceId = searchParams.get("invoice_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // আমরা আমাদের ডাটাবেস থেকে অর্ডারের রিয়েল ডাটা নিয়ে আসবো
        // আপনার API এন্ডপয়েন্ট অনুযায়ী এখানে কল করতে হবে
        const res = await fetch(`/api/orders/success?invoiceId=${invoiceId}`);
        const data = await res.json();
        
        if (data) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Order Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchOrderDetails();
    }
  }, [invoiceId]);

  const handlePrint = () => window.print();

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-emerald-600 animate-pulse uppercase tracking-widest">Generating Invoice...</div>;

  // যদি অর্ডার না পাওয়া যায়, তবে একটি ডিফোল্ট ভিউ
  if (!order) return <div className="text-center py-20">Order not found. Please contact support.</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] py-10 px-4 font-sans text-[#111827]">
      <div className="max-w-[850px] mx-auto bg-white p-6 md:p-12 rounded-xl shadow-lg border border-gray-100 print:shadow-none print:border-none print:p-0">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-2 border-[#e5e7eb] pb-6">
          <div>
            <div className="logo mb-2">
              <img src="https://subnexit.com/_next/image?url=%2Flogo2.png&w=1920&q=75" alt="Subnex Logo" className="h-10 w-auto" />
            </div>
            <div className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">
              Invoice #{order._id?.toString().slice(-6) || "000"}
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="bg-[#e0ecff] text-[#2563eb] px-5 py-2 rounded-full font-black text-[12px] tracking-widest mb-2">PAID</div>
             <p className="text-[10px] text-gray-400 font-mono">TXN: {invoiceId}</p>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="text-sm leading-relaxed">
            <strong className="text-gray-400 uppercase text-[10px] block mb-2 tracking-widest">Billed To:</strong>
            <p className="font-black text-lg text-gray-800 uppercase">{order.customer?.firstName} {order.customer?.lastName}</p>
            <p className="text-gray-500 font-medium">{order.customer?.email}</p>
            <p className="text-gray-500">{order.customer?.phone}</p>
          </div>
          <div className="md:text-right text-sm">
            <strong className="text-gray-400 uppercase text-[10px] block mb-2 tracking-widest">Invoice Date:</strong>
            <p className="font-bold text-gray-800 text-lg">
              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* TABLE SECTION (Real Products) */}
        <div className="mt-10 border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#f8fafc] text-gray-700 font-black uppercase text-[11px] border-b border-[#e5e7eb] tracking-wider">
              <tr>
                <th className="p-4">Item Description</th>
                <th className="p-4 text-center">Qty</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.cartItems?.map((item, index) => (
                <tr key={index}>
                  <td className="p-4 font-bold text-gray-800">{item.name} <span className="block text-[10px] text-gray-400 font-medium font-mono">{item.variant || 'Standard'}</span></td>
                  <td className="p-4 text-center font-medium">1</td>
                  <td className="p-4 text-right font-bold text-gray-800">৳{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY SECTION */}
        <div className="mt-8 flex justify-end">
          <div className="w-full md:w-80 bg-[#f8fafc] p-6 rounded-2xl space-y-3 border border-gray-100 shadow-inner">
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Sub Total</span>
              <span className="font-bold text-gray-800">৳{order.pricing?.subTotal || order.pricing?.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Shipping / Fee</span>
              <span className="font-bold text-gray-800">৳{order.pricing?.shippingFee || 0}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
              <span className="font-black text-gray-800 uppercase text-xs">Total Amount</span>
              <span className="text-2xl font-black text-[#006747] tracking-tighter">৳{order.pricing?.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-12 pt-8 border-t border-dashed border-gray-200 text-center">
            <p className="text-[11px] text-gray-400 font-medium">Thank you for choosing SubNex. This is an official electronic receipt.</p>
            <p className="text-[10px] text-gray-300 mt-1">Ref ID: {order._id}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 print:hidden">
          <button onClick={handlePrint} className="flex-1 bg-white border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-700 py-3.5 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all">
            <FiPrinter size={18} /> Print Invoice
          </button>
          <button onClick={() => router.push("/")} className="flex-1 bg-[#111827] hover:bg-black text-white py-3.5 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg transition-all">
            <FiHome size={18} /> Back to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SuccessPage() {
  return <Suspense><InvoiceContent /></Suspense>;
}