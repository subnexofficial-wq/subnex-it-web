"use client";

import { useCart } from "@/hooks/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const { cart , updateQuantity, removeFromCart } = useCart();

 
  const subtotal = cart.reduce((acc, item) => acc + (item.totalPrice || item.price * item.quantity), 0);

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
          <Link href="/products" className="text-sm underline">
            Continue shopping
          </Link>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 text-xs text-gray-500 border-b pb-2 tracking-widest">
          <div className="col-span-6 uppercase">PRODUCT</div>
          <div className="col-span-3 text-center uppercase">QUANTITY</div>
          <div className="col-span-3 text-right uppercase">TOTAL</div>
        </div>

        {/* Dynamic Cart Items */}
        {cart.map((item) => (
          <div key={item.uniqueId} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 border-b items-center">
            
            {/* Product Info */}
            <div className="md:col-span-6 flex gap-4 items-center">
              <div className="relative w-40 h-40 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900">{item.title}</p>
                {/* প্রতি ইউনিটের দাম সার্ভার থেকে আসা ভ্যালু অনুযায়ী */}
                <p className="text-sm text-gray-600">Tk {item.price}.00</p>
                <p className="text-xs text-blue-600 mt-1 font-medium bg-blue-50 inline-block px-2 py-0.5 rounded">
                  {item.duration}
                </p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="md:col-span-3 flex items-center justify-start md:justify-center gap-2">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.uniqueId, -1, item.id, item.duration, item.quantity)}
                  className="px-3 py-1 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="min-w-[40px] text-center text-sm font-bold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.uniqueId, 1, item.id, item.duration, item.quantity)}
                  className="px-3 py-1 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.uniqueId)}
                className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove Item"
              >
                <FiTrash2 size={18} />
              </button>
            </div>

            {/* Line Total: সরাসরি সার্ভার থেকে আসা totalPrice ব্যবহার করা হচ্ছে */}
            <div className="md:col-span-3 text-right font-bold text-gray-900">
              Tk {(item.totalPrice || item.price * item.quantity).toLocaleString()}.00
            </div>
          </div>
        ))}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          <div className="lg:w-3/4">
            <label className="text-sm font-medium block mb-2">
              Order special instructions
            </label>
            <textarea
              rows="4"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="Add a note for the seller..."
            />
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="text-right">
              <p className="text-gray-500 text-sm mb-1">Estimated total</p>
              <p className="text-2xl font-bold text-gray-900">
                Tk {subtotal.toLocaleString()}.00 BDT
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Taxes and shipping calculated at checkout
              </p>
            </div>

            <Link href="/checkouts" className="w-full md:w-auto">
              <button className="w-full md:w-64 bg-black text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                Check out
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}