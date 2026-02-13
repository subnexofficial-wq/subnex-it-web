"use client";

import Image from "next/image";

export default function OrderSummary({
  cart = [], 
  shipping = 0, 
  tip = 0,
}) {
  // কার্ট পেজের মতো হুবহু একই সাবটোটাল ক্যালকুলেশন
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // ফাইনাল টোটাল ক্যালকুলেশন
  const total = subtotal + Number(shipping) + Number(tip);

  const format = (n) => `৳${Number(n).toLocaleString()}`;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 uppercase tracking-tighter">Order Summary</h2>
        <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">
          {cart.length} ITEMS
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* PRODUCT LIST */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.uniqueId} className="flex gap-4 items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                <div className="relative w-14 h-14 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0 shadow-sm">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-xs truncate uppercase tracking-tighter">{item.title}</p>
                  <p className="text-[9px] text-blue-600 font-bold uppercase">{item.duration}</p>
                  <p className="text-[10px] font-bold text-gray-400">Qty: {item.quantity}</p>
                </div>
                {/* কার্ট পেজের মতো একই প্রাইস লজিক */}
                <p className="text-sm font-black text-gray-800">{format(item.price * item.quantity)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4 italic">No items in cart</p>
          )}
        </div>

        {/* PRICING BREAKDOWN */}
        <div className="space-y-3 border-t border-gray-100 pt-5 text-sm">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">{format(subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-500 font-medium">
            <span>Shipping</span>
            <span className="font-bold text-green-600">
              {shipping === 0 ? "FREE" : format(shipping)}
            </span>
          </div>

          {tip > 0 && (
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Processing Fee / Tip</span>
              <span className="font-bold text-gray-900">{format(tip)}</span>
            </div>
          )}
        </div>

        {/* TOTAL */}
        <div className="border-t-2 border-dashed border-gray-100 pt-5">
          <div className="flex justify-between items-center">
            <span className="text-lg font-black text-gray-900 uppercase">Total</span>
            <div className="text-right">
              <p className="text-2xl font-black text-red-600 leading-none">{format(total)}</p>
              <p className="text-[9px] text-gray-400 font-bold mt-1 tracking-widest uppercase">Inclusive of VAT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}