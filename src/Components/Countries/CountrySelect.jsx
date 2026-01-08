
"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { countries } from "../../../data/Country";


export default function CountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="border px-3 py-2 rounded w-full flex justify-between items-center"
      >
        {value?.name || "Select country"}
        <FiChevronDown />
      </button>

      {open && (
        <div className="absolute z-50 bg-white border rounded w-full mt-1 max-h-60 overflow-y-auto shadow">
          {countries.map((c) => (
            <button
             key={c.name}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}