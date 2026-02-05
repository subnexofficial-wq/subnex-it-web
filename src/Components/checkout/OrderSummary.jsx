"use client";

import Image from "next/image";
import { useState } from "react";
import { FiTag, FiTrash2 } from "react-icons/fi";

export default function OrderSummary({
  cart = [], // এখন এখানে cart (Array) আসবে
  subtotal,
  shipping,
  tip,
  discount,
  setDiscount,
  total,
}) {
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");

  const coupons = {
    FAN10: { type: "percent", value: 10 },
    SUBNEX50: { type: "flat", value: 50 },
  };

  const applyCoupon = () => {
    setError("");
    const code = coupon.toUpperCase();
    const data = coupons[code];

    if (!data) {
      setDiscount(0);
      setError("Invalid coupon code");
      return;
    }

    let discountAmount =
      data.type === "percent"
        ? Math.round((subtotal * data.value) / 100)
        : data.value;

    setDiscount(discountAmount);
  };

  const format = (n) => `৳${Number(n).toLocaleString()}`;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800">Order Summary</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* PRODUCT LIST (Looping through Cart) */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.uniqueId} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="relative w-14 h-14 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
                  {/* এখানে এররটি হচ্ছিল, এখন item.image ব্যবহার করা হয়েছে */}
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-xs truncate">{item.title}</p>
                  <p className="text-[10px] text-gray-500 italic">{item.duration}</p>
                  <p className="text-[10px] font-bold text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-800">{format(item.price * item.quantity)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center">No items in cart</p>
          )}
        </div>

      

        {/* PRICING BREAKDOWN */}
        <div className="space-y-3 border-t border-gray-100 pt-5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">{format(subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-medium text-green-600">{shipping === 0 ? "FREE" : format(shipping)}</span>
          </div>

          {tip > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tip</span>
              <span className="font-medium text-gray-900">{format(tip)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-red-600 font-medium">
              <span>Discount</span>
              <span>-{format(discount)}</span>
            </div>
          )}
        </div>

        {/* TOTAL */}
        <div className="border-t-2 border-dashed border-gray-100 pt-5">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <p className="text-2xl font-black text-gray-900">{format(total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}