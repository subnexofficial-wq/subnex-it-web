"use client";

import { useCart } from "@/hooks/CartContext";
import Image from "next/image";
import { FiX, FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function CartPopup({ open, onClose }) {
  const { cart } = useCart();
  const router = useRouter();

  if (!open || cart.length === 0) return null;

  return (
    // Fixed Top-Right positioning
    <div className="fixed top-11 right-0 z-[100] w-full max-w-[360px] md:max-w-[380px] p-4">
      <div className="bg-[#D9D9D9] rounded-sm shadow-2xl border border-gray-400 flex flex-col overflow-hidden">
        
        {/* Success Header - Screenshot er moto Green background */}
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

        {/* Product List Section - Scrollable */}
        <div className="overflow-y-auto p-4 space-y-4 max-h-[50vh] custom-scrollbar bg-white/30">
          {cart.map((product, index) => (
            <div key={index} className="flex gap-3 items-start border-b border-gray-300/50 pb-3 last:border-0">
              {/* Product Image */}
              <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden border border-gray-300 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-1"
                />
              </div>

              {/* Product Info - Title, Duration, Qty, and Price */}
              <div className="flex-1 min-w-0">
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
                {/* Price Display */}
                <p className="text-[13px] font-bold text-black mt-1">
                  Tk {product.totalPrice?.toLocaleString()}.00
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons Section */}
        <div className="p-4 pt-2 space-y-2 bg-[#D9D9D9]">
          <button
            onClick={() => {
              onClose();
              router.push("/cart");
            }}
            className="w-full bg-white text-black border border-gray-400 py-2 rounded-md text-[13px] font-bold hover:bg-gray-50 transition-all"
          >
            View cart ({cart.length})
          </button>

          <button
            onClick={() => {
              onClose();
              router.push("/checkouts");
            }}
            className="w-full bg-black text-white py-2 rounded-md text-[13px] font-bold hover:bg-zinc-800 shadow-md transition-all"
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