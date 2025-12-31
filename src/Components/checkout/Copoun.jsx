"use client";

import { useState } from "react";
import { FiTag, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function CouponBox({ subtotal, onApply }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const handleApply = () => {
    setMsg("");
    if (!code) return;

    // 🔗 BACKEND READY (mock logic)
    if (code.toUpperCase() === "SAVE10") {
      onApply(Math.round(subtotal * 0.1));
      setMsg("Coupon 'SAVE10' applied successfully!");
    } else if (code.toUpperCase() === "FLAT200") {
      onApply(200);
      setMsg("Coupon 'FLAT200' applied successfully!");
    } else {
      setMsg("This coupon code isn't valid.");
    }
  };

  const isSuccess = msg.includes("successfully");

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FiTag className="text-gray-400" />
        <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Discount Code</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-grow">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SAVE10"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!code}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            !code 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-black text-white hover:bg-gray-800 active:scale-95"
          }`}
        >
          Apply
        </button>
      </div>

      {msg && (
        <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium animate-in fade-in slide-in-from-top-1 ${
          isSuccess 
          ? "bg-green-50 text-green-700 border border-green-100" 
          : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {isSuccess ? <FiCheckCircle size={14} /> : <FiAlertCircle size={14} />}
          {msg}
        </div>
      )}
    </div>
  );
}