"use client";

import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";


const countryList = [
  { name: "Bangladesh", currency: "BDT ৳" },
  { name: "India", currency: "INR ₹" },
  { name: "United States", currency: "USD $" },
  { name: "United Kingdom", currency: "GBP £" },
  { name: "Canada", currency: "CAD $" },
  { name: "Australia", currency: "AUD $" },
  { name: "Germany", currency: "EUR €" },
  { name: "France", currency: "EUR €" },
  { name: "Japan", currency: "JPY ¥" },
  { name: "China", currency: "CNY ¥" },
  { name: "Saudi Arabia", currency: "SAR ﷼" },
  { name: "UAE", currency: "AED د.إ" },
  { name: "Pakistan", currency: "PKR ₨" },
  { name: "Nepal", currency: "NPR ₨" },
  { name: "Sri Lanka", currency: "LKR ₨" },
  { name: "Malaysia", currency: "MYR RM" },
  { name: "Singapore", currency: "SGD $" },
  { name: "Italy", currency: "EUR €" },
  { name: "Spain", currency: "EUR €" },
];

export default function FooterCountrySelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(countryList[0]);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = countryList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative text-sm" ref={ref}>
      <p className="mb-2 text-gray-400 text-center md:text-start">Country / region</p>

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 px-4 py-2 border border-gray-600 rounded-md bg-black text-white min-w-[200px]"
      >
        <span>{selected.name} | {selected.currency}</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full mb-2 w-64 bg-white text-black rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search country..."
              className="w-full px-3 py-2 border rounded text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length ? (
              filtered.map((c, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelected(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`px-4 py-2 cursor-pointer flex justify-between hover:bg-gray-100
                    ${selected.name === c.name ? "bg-gray-100 font-semibold" : ""}`}
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-gray-500">{c.currency}</span>
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-gray-400 text-center">
                No result found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}