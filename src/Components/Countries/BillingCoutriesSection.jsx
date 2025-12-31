
"use client";


import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { countries } from "../../../data/Country";


export default function BillingCountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border px-3 py-2 rounded w-full flex justify-between items-center"
      >
        {value.name}
        <FiChevronDown />
      </button>

      {open && (
        <div className="absolute z-50 bg-white border rounded w-full mt-1 shadow">
          {countries.map((c) => (
            <div
              key={c.iso}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}