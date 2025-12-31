"use client";

import { useState, useEffect } from "react";

export default function ShippingMethod({ address, onMethodChange }) {
  const methods = [
    {
      id: "regular",
      title: "Regular WhatsApp Delivery",
      subtitle: "Delivery Within 4h",
      price: 0,
    },
    {
      id: "express",
      title: "Express WhatsApp Delivery",
      subtitle: "Delivery Within 30min",
      price: 100,
    },
  ];

  const [selectedMethod, setSelectedMethod] = useState(methods[0].id);

  // মেথড সিলেক্ট করলে টাইটেল এবং প্রাইস অবজেক্ট আকারে পাঠানো হবে
  const handleSelect = (method) => {
    setSelectedMethod(method.id);
    if (onMethodChange) {
      onMethodChange({ price: method.price, title: method.title });
    }
  };

  // অ্যাড্রেস ইনপুট হলে ডিফল্ট মেথডটি সেট করে দেওয়া
  useEffect(() => {
    if (address && onMethodChange) {
      onMethodChange({ price: methods[0].price, title: methods[0].title });
    }
  }, [address]);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Shipping method</h2>

      {!address ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-500 italic">
          Enter your shipping address to view available shipping methods.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {methods.map((method, index) => {
            const isSelected = selectedMethod === method.id;
            const isLast = index === methods.length - 1;

            return (
              <label
                key={method.id}
                className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? "bg-blue-50/40 border-2 border-blue-600 -m-[1px] z-10 rounded-xl" 
                    : "bg-white hover:bg-gray-50"
                } ${!isSelected && !isLast ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="shipping-method"
                    className="w-5 h-5 text-blue-600 border-gray-300 cursor-pointer"
                    checked={isSelected}
                    onChange={() => handleSelect(method)}
                  />
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isSelected ? "text-blue-900" : "text-gray-800"}`}>
                      {method.title}
                    </span>
                    <span className="text-[12px] text-gray-500">{method.subtitle}</span>
                  </div>
                </div>
                <div className={`text-sm font-bold ${isSelected ? "text-blue-900" : "text-gray-700"}`}>
                  {method.price === 0 ? "FREE" : `৳${method.price.toFixed(2)}`}
                </div>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}