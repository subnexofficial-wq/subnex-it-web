"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function AddTip({ subtotal = 710, onTipChange }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedTip, setSelectedTip] = useState(null);
  const [customValue, setCustomValue] = useState(0);

  const tipOptions = [
    { label: "10%", percent: 0.1 },
    { label: "15%", percent: 0.15 },
    { label: "20%", percent: 0.2 },
  ];

  const handleSelectTip = (amount) => {
    setSelectedTip(amount);
    onTipChange?.(amount);
  };

  const handleCustomAdjust = (type) => {
    const newVal = type === "add" ? customValue + 10 : Math.max(0, customValue - 10);
    setCustomValue(newVal);
    // যদি কাস্টম টিপ দেওয়া হয় তবে প্রেসেট টিপ সিলেক্ট তুলে দেওয়া হবে
    setSelectedTip(null);
    onTipChange?.(newVal);
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Add tip</h2>
      
      <div className="bg-[#F9F9F9] border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Checkbox Header */}
        <div className="p-4 bg-white border-b border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => {
                setIsEnabled(e.target.checked);
                if(!e.target.checked) onTipChange?.(0);
              }}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
            />
            <span className="text-[13px] md:text-sm font-medium text-gray-800">
              Show your support for the team at <span className="text-blue-600">SUBNEX</span> - OTT SUBSCRIPTIONS BD
            </span>
          </label>
        </div>

        {/* Inner Content */}
        {isEnabled && (
          <div className="p-4 space-y-4 animate-in fade-in duration-300">
            {/* Percentage Grid */}
            <div className="grid grid-cols-3 bg-white border border-gray-200 rounded-xl overflow-hidden">
              {tipOptions.map((tip, index) => {
                const amount = Math.round(subtotal * tip.percent);
                const isSelected = selectedTip === amount;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectTip(amount)}
                    className={`flex flex-col items-center justify-center py-3 border-r last:border-r-0 border-gray-200 transition-all ${
                      isSelected ? "bg-blue-50/50 ring-2 ring-inset ring-blue-600 z-10" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-[13px] font-bold text-gray-800">{tip.label}</span>
                    <span className="text-[11px] text-gray-500 font-medium tracking-tighter">
                       ৳{amount.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Tip & Submit */}
            <div className="flex gap-3">
              <div className="flex-1 flex items-center justify-between border border-gray-200 bg-white rounded-xl px-4 py-3">
                <span className="text-sm text-gray-400 font-medium">Custom tip</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleCustomAdjust("sub")} className="text-gray-400 hover:text-black transition-colors">
                    <FiMinus size={16} />
                  </button>
                  <span className="text-sm font-bold text-gray-800 min-w-[30px] text-center">
                    ৳{customValue}
                  </span>
                  <button onClick={() => handleCustomAdjust("add")} className="text-gray-400 hover:text-black transition-colors">
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => onTipChange?.(customValue)}
                className="bg-[#F5F5F5] hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-bold transition-all"
              >
                Add tip
              </button>
            </div>

            {/* Footer Text */}
            <p className="text-[13px] text-gray-600 font-medium pt-1">
              Thank you, we appreciate it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}