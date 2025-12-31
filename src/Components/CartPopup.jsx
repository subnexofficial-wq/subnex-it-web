"use client";

import { useCart } from "@/hooks/CartContext";
import Image from "next/image";
import { FiX, FiCheck, FiLoader } from "react-icons/fi"; // FiLoader যোগ করা হয়েছে
import { useRouter } from "next/navigation";

export default function CartPopup({ open, onClose }) {
  const { cart } = useCart();
  const router = useRouter();

  // যদি পপআপ ওপেন না থাকে তবেই কেবল রিটার্ন করবে
  if (!open) return null;

  return (
    <div className="fixed top-11 right-0 z-[100] w-full max-w-[360px] md:max-w-[380px] p-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-[#D9D9D9] rounded-sm shadow-2xl border border-gray-400 flex flex-col overflow-hidden">
        
        {/* Success Header */}
        <div className="bg-[#44BD6A] p-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
              <FiCheck className="text-[#44BD6A] stroke-[4px]" size={10} />
            </div>
            <span>Item added to your cart</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* কন্টেন্ট সেকশন - এখানে Fallback লজিক যোগ করা হয়েছে */}
        <div className="overflow-y-auto p-4 space-y-4 max-h-[50vh] custom-scrollbar bg-white/30 min-h-[100px] flex flex-col justify-center">
          {cart.length > 0 ? (
            // যদি কার্টে ডেটা থাকে
            cart.map((product, index) => (
              <div key={index} className="flex gap-3 items-start border-b border-gray-300/50 pb-3 last:border-0">
                <div className="relative w-16 h-16 overflow-hidden border border-gray-300 flex-shrink-0 bg-white">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <p className="font-bold text-gray-900 text-[13px] leading-tight mb-0.5 truncate">
                    {product.title}
                  </p>
                  <div className="text-[11px] text-gray-600">
                    <p>Duration: {product.duration}</p>
                    {product.storage && <p>Storage: {product.storage}</p>}
                    <p className="mt-1 font-medium text-gray-500">
                      Quantity: <span className="text-black">{product.quantity}</span>
                    </p>
                  </div>
                  <p className="text-[13px] font-bold text-black mt-1">
                    Tk {product.totalPrice?.toLocaleString()}.00
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Fallback: যখন কার্ট খালি বা ডেটা আসছে
            <div className="flex flex-col items-center justify-center py-4 text-gray-500 gap-2">
              <FiLoader className="animate-spin text-[#44BD6A]" size={24} />
              <p className="text-[12px] font-medium italic">Updating cart details...</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 pt-2 space-y-2 bg-[#D9D9D9]">
          <button
            onClick={() => {
              onClose();
              router.push("/cart");
            }}
            disabled={cart.length === 0}
            className={`w-full bg-white text-black border border-gray-400 py-2 rounded-md text-[13px] font-bold transition-all ${cart.length === 0 ? 'opacity-50' : 'hover:bg-gray-50'}`}
          >
            View cart ({cart.length})
          </button>

          <button
            onClick={() => {
              onClose();
              router.push("/checkouts");
            }}
            disabled={cart.length === 0}
            className={`w-full bg-black text-white py-2 rounded-md text-[13px] font-bold transition-all ${cart.length === 0 ? 'opacity-50' : 'hover:bg-zinc-800 shadow-md'}`}
          >
            Check out
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-[12px] underline text-gray-600 hover:text-black font-semibold mt-1"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}