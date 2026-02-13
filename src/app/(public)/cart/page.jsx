"use client";

import { useCart } from "@/hooks/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
const router = useRouter();
  // সাবটোটাল ক্যালকুলেশন: কুপন সহ যে প্রাইসটা কার্টে এসেছে সেটার সাথে কোয়ান্টিটি গুণ হচ্ছে
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link href="/products" className="bg-black text-white px-6 py-2 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Your cart ({cart.length})</h1>
          <Link href="/products" className="text-sm underline hover:text-gray-600 transition-colors">
            Continue shopping
          </Link>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 text-xs text-gray-500 border-b pb-4 tracking-widest">
          <div className="col-span-6 uppercase">PRODUCT</div>
          <div className="col-span-3 text-center uppercase">QUANTITY</div>
          <div className="col-span-3 text-right uppercase">TOTAL</div>
        </div>

        {/* Dynamic Cart Items */}
        {cart.map((item) => (
          <div key={item.uniqueId} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b items-center">
            
            {/* Product Info */}
            <div className="md:col-span-6 flex gap-6 items-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg uppercase leading-tight mb-1">{item.title}</p>
                {/* প্রতি ইউনিটের ডিসকাউন্টেড দাম */}
                <p className="text-sm font-semibold text-red-600">Tk {item.price.toLocaleString()}.00</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded uppercase border border-blue-100">
                    {item.duration}
                  </span>
                  {item.storage && (
                    <span className="text-[10px] text-orange-700 font-bold bg-orange-50 px-2 py-1 rounded uppercase border border-orange-100">
                      {item.storage}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="md:col-span-3 flex items-center justify-start md:justify-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
                <button
                  onClick={() => updateQuantity(item.uniqueId, -1, item.id, item.duration, item.quantity)}
                  className="px-4 py-2 hover:bg-gray-200 transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="min-w-[45px] text-center text-sm font-black text-gray-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.uniqueId, 1, item.id, item.duration, item.quantity)}
                  className="px-4 py-2 hover:bg-gray-200 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.uniqueId)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Remove Item"
              >
                <FiTrash2 size={20} />
              </button>
            </div>

            {/* Line Total: Item price (including coupon discount) * quantity */}
            <div className="md:col-span-3 text-right font-black text-gray-900 text-lg">
              Tk {(item.price * item.quantity).toLocaleString()}.00
            </div>
          </div>
        ))}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 pt-8 border-t border-gray-100">
          <div>
            <label className="text-xs font-black uppercase tracking-widest block mb-3 text-gray-500">
              Order special instructions
            </label>
            <textarea
              rows="4"
              className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-black outline-none transition-all bg-gray-50/50"
              placeholder="Add a note for the seller..."
            />
          </div>

          <div className="flex flex-col items-end gap-6 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-right w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                <span className="text-3xl font-black text-gray-900">
                  Tk {subtotal.toLocaleString()}.00
                </span>
              </div>
              <p className="text-gray-400 text-[11px] font-medium">
                Shipping and taxes calculated at checkout. Currencies in BDT.
              </p>
            </div>

            <Link href="/checkouts" className="w-full">
              <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]">
                Proceed to Checkout
              </button>
            </Link>
            
            <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase tracking-wider">
              <FiCheckCircle/> Secure Checkout & Instant Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}