"use client";

import { FiMail, FiPhone } from "react-icons/fi";

export default function ContactSection({ data, setData }) {
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-800">Contact Information</h2>
        <span className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
          Required
        </span>
      </div>

      <div className="space-y-3">
        {/* Email Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiMail className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          </div>
          <input
            type="email"
            className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="Email Address"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>

        {/* Phone Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiPhone className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          </div>
          <input
            type="tel"
            className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="Phone Number (e.g. +88017...)"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Trust Badge / Info */}
      <p className="text-[11px] text-gray-500 flex items-center gap-1.5 px-1">
        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21.355r1" />
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
        </svg>
        Your contact details are safe with us for order updates.
      </p>
    </section>
  );
}