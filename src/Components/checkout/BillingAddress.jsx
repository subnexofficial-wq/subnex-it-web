"use client";

import { useState } from "react";
import BillingCountrySelect from "../Countries/BillingCoutriesSection";
import { countries } from "../../../data/Country";

export default function BillingAddress() {
  const [sameAsShipping, setSameAsShipping] = useState(true); // Default true করা ভালো UX এর জন্য

  const [billing, setBilling] = useState({
    country: countries[10],
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-bold text-lg text-gray-800">Billing address</h2>
      </div>

      {/* ================= TOGGLE KONTINER ================= */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        
        {/* Option 1: Same as Shipping */}
        <label className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors ${sameAsShipping ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
          <div className="relative flex items-center">
            <input
              type="radio"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              checked={sameAsShipping}
              onChange={() => setSameAsShipping(true)}
            />
          </div>
          <span className={`text-sm font-medium ${sameAsShipping ? 'text-blue-900' : 'text-gray-700'}`}>
            Same as shipping address
          </span>
        </label>

        <div className="h-px bg-gray-100 w-full" />

        {/* Option 2: Different Address */}
        <label className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors ${!sameAsShipping ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
          <div className="relative flex items-center">
            <input
              type="radio"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              checked={!sameAsShipping}
              onChange={() => setSameAsShipping(false)}
            />
          </div>
          <span className={`text-sm font-medium ${!sameAsShipping ? 'text-blue-900' : 'text-gray-700'}`}>
            Use a different billing address
          </span>
        </label>

        {/* ================= BILLING FORM (Expanding Section) ================= */}
        {!sameAsShipping && (
          <div className="p-5 bg-white border-t border-gray-100 space-y-4 animate-in fade-in duration-500">
            
            {/* Country Select */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-gray-500 uppercase ml-1">Country/Region</label>
              <BillingCountrySelect
                value={billing.country}
                onChange={(country) => setBilling({ ...billing, country })}
              />
            </div>

            {/* First + Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                  value={billing.firstName}
                  onChange={(e) => setBilling({ ...billing, firstName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                  value={billing.lastName}
                  onChange={(e) => setBilling({ ...billing, lastName: e.target.value })}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                value={billing.address}
                onChange={(e) => setBilling({ ...billing, address: e.target.value })}
              />
            </div>

            {/* City + Postal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                  value={billing.city}
                  onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Postal code"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                  value={billing.postalCode}
                  onChange={(e) => setBilling({ ...billing, postalCode: e.target.value })}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Phone (optional for notifications)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                value={billing.phone}
                onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 italic px-2">
        * Your billing address must match the address linked to your payment method.
      </p>
    </section>
  );
}