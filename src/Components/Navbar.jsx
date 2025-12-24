// src/components/Navbar.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// আইকন ইম্পোর্ট
import {
  FiMenu,
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
  FiX,
} from "react-icons/fi";
import { useCart } from "@/hooks/CartContext";
import { useAuth } from "@/hooks/useAuth";

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


const menuItems = [
  { name: "Home", href: "/" },
  { name: "All Products", href: "/products" },
  { name: "Digital product", href: "/digital-product" },
  { name: "Subscription", href: "/subscription" },
  { name: "Automation", href: "/automation" },
  { name: "Contact Information", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

const Navbar = () => {
  const { user } = useAuth();
  const { cart } = useCart(); 
  const [isOpen, setIsOpen] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [selected, setSelected] = useState(countryList[0]); 
  const [searchTerm, setSearchTerm] = useState(""); 

  const dropdownRef = useRef(null); 

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const filteredCountries = countryList.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <nav className="w-full bg-white border-b py-0 border-gray-200 sticky top-0 z-40 shadow-sm font-sans">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* বাম পাশ */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-700 hover:text-black transition p-1"
                aria-label="Open Menu"
              >
                <FiMenu size={24} />
              </button>
              <button className="text-gray-700 hover:text-black transition p-1">
                <FiSearch size={24} />
              </button>
            </div>

            {/* মাঝখান: লোগো */}
            <div className="lg:pl-42 flex items-center justify-center">
              <Link href="/" className="group flex items-center gap-0.5">
                <div className="relative w-30 h-10 md:w-30 md:h-16 transition-transform duration-300 ease-in-out group-hover:rotate-12">
                  <Image
                    src="/logo2.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* ডান পাশ */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Country Selector */}
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity text-sm font-semibold text-gray-800 select-none"
                >
                  <span>{selected.name} | {selected.currency}</span>
                  {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {isOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-white sticky top-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto scrollbar-thin">
                      {filteredCountries.map((country, index) => (
                        <div
                          key={index}
                          className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selected.name === country.name ? "bg-gray-100 font-bold" : ""}`}
                          onClick={() => {
                            setSelected(country);
                            setIsOpen(false);
                            setSearchTerm("");
                          }}
                        >
                          <span>{country.name}</span>
                          <span className="text-xs text-gray-400">{country.currency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User & Cart Icons */}
              <Link
               href={user ? "/user" : "/login"}
               className="text-gray-700 hover:text-black transition p-1">
                <FiUser size={24} />
              </Link>
              
              {/* আপডেটেড কার্ট আইকন ব্যাজ সহ */}
              <Link href="/cart" className="text-gray-700 hover:text-black transition p-1 relative group">
                <FiShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* SIDEBAR MENU (Design Unchanged) */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[300px] sm:w-[350px] bg-white z-[60] shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full font-sans">
          <div className="flex items-center gap-6 p-6 pt-8">
            <button onClick={() => setIsMenuOpen(false)} className="text-black transition-transform duration-300 p-1">
              <FiX size={28} />
            </button>
            <button className="text-black p-1"><FiSearch size={26} /></button>
          </div>
          <div className="flex-1 px-6 py-4 flex flex-col gap-6 overflow-y-auto">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href} className="text-[17px] text-gray-900 font-medium hover:text-red-600 transition-all" onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;