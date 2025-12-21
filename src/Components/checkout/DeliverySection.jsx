"use client";

import CountrySelect from "../Countries/CountrySelect";
import { FiMapPin, FiUser, FiTruck } from "react-icons/fi";

export default function DeliverySection({ data, setData }) {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-blue-50 rounded-lg">
          <FiTruck className="text-blue-600" size={20} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Delivery Address</h2>
      </div>

      <div className="space-y-4">
        {/* Country Select */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-gray-500 uppercase ml-1">Country/Region</label>
          <CountrySelect
            value={data.country}
            onChange={(c) => setData({ ...data, country: c })}
          />
        </div>

        {/* First + Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <FiUser size={16} />
            </div>
            <input
              type="text"
              placeholder="First name"
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <FiUser size={16} />
            </div>
            <input
              type="text"
              placeholder="Last name"
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
            />
          </div>
        </div>

        {/* Full Address */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <FiMapPin size={16} />
          </div>
          <input
            type="text"
            placeholder="Complete address (House, Street, Area)"
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </div>

        {/* City + Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="City"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            value={data.city}
            onChange={(e) => setData({ ...data, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Postal code"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            value={data.postal}
            onChange={(e) => setData({ ...data, postal: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div className="relative group">
          <input
            type="tel"
            placeholder="Phone number for delivery updates"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}