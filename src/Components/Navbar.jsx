// src/components/Navbar.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// আইকন ইম্পোর্ট (Feather Icons & FontAwesome 6)
import {
  FiMenu,
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
  FiX,
} from "react-icons/fi";
import {
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";

// === ডাটা: দেশের তালিকা ===
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

// === ডাটা: সাইডবার মেনু আইটেম ===
const menuItems = [
  { name: "All Products", href: "/products" },
  { name: "Streaming Services", href: "/streaming" },
  { name: "Educational Tools", href: "/education" },
  { name: "Get Netflix Household Code", href: "/netflix-code" },
  { name: "Contact Information", href: "/contact" },
];

const Navbar = () => {
  // === State Management ===
  const [isOpen, setIsOpen] = useState(false); // কান্ট্রি ড্রপডাউন টগল
  const [isMenuOpen, setIsMenuOpen] = useState(false); // সাইডবার মেনু টগল
  const [selected, setSelected] = useState(countryList[0]); // সিলেক্ট করা দেশ
  const [searchTerm, setSearchTerm] = useState(""); // কান্ট্রি সার্চ টেক্সট

  const dropdownRef = useRef(null); // ড্রপডাউন রেফারেস

  // 1. ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // 2. সাইডবার ওপেন থাকলে পেজের স্ক্রল বন্ধ রাখা
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  // 3. কান্ট্রি ফিল্টার লজিক
  const filteredCountries = countryList.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* =========================================
          TOP NAVBAR
      ========================================= */}
      <nav className="w-full bg-white border-b py-1 border-gray-200 sticky top-0 z-40 shadow-sm font-sans">

        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16  ">
            {/* --- বাম পাশ: মেনু ট্রিগার ও সার্চ আইকন --- */}
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

            {/* --- মাঝখান: লোগো (Image + Text) --- */}
            <div className=" lg:pl-42 flex items-center justify-center">
              <Link href="/" className="group flex items-center gap-0.5">
                {/* Logo Image */}
                <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 ease-in-out group-hover:rotate-12">
                  <Image
                    src="/header/header.jpg"
                    alt="S Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                {/* Text: UBNEX */}
                <span
                  className="text-3xl md:text-4xl font-bold -ml-1.5  pt-1.5 tracking-wide
                  font-[var(--font-lobster)] 
                  transition-all duration-300 ease-in-out
                text-cyan-500 
                  group-hover:scale-105"
                >
                  UBNEX
                </span>
              </Link>
            </div>


            {/* --- ডান পাশ: কান্ট্রি সিলেক্টর, ইউজার, কার্ট --- */}
            <div className="flex items-center gap-4 md:gap-6">

              {/* Country Selector (Desktop Only) */}
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity text-sm font-semibold text-gray-800 select-none"
                >
                  <span>
                    {selected.name} | {selected.currency}
                  </span>
                  {isOpen ? (
                    <FiChevronUp className="mt-0.5" />
                  ) : (
                    <FiChevronDown className="mt-0.5" />
                  )}
                </div>

                {/* Dropdown Body */}
                {isOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* Search Input */}
                    <div
                      className="p-3 border-b border-gray-100 bg-white sticky top-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Country List */}
                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country, index) => (
                          <div
                            key={index}
                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center
                              ${
                                selected.name === country.name
                                  ? "bg-gray-100 font-bold text-black"
                                  : "text-gray-600"
                              }
                            `}
                            onClick={() => {
                              setSelected(country);
                              setIsOpen(false);
                              setSearchTerm("");
                            }}
                          >
                            <span>{country.name}</span>
                            <span className="text-xs text-gray-400">
                              {country.currency}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">
                          No result found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User & Cart Icons */}
              <button className="text-gray-700 hover:text-black hover:scale-110 transition p-1">
                <FiUser size={24} />
              </button>
              <button className="text-gray-700 hover:text-black hover:scale-110 transition p-1">
                <FiShoppingBag size={24} />
              </button>
            </div>


          </div>
        </div>


      </nav>

      {/* =========================================
          SIDEBAR MENU (DRAWER)
      ========================================= */}

      {/* 1. Black Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 
        ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* 2. White Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] sm:w-[350px] bg-white z-[60] shadow-2xl 
        transform transition-transform duration-300 ease-in-out 
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full font-sans">
          {/* Header: Close & Search Icon */}
          <div className="flex items-center gap-6 p-6 pt-8">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-black hover:rotate-90 transition-transform duration-300 p-1"
            >
              <FiX size={28} />
            </button>
            <button className="text-black hover:scale-110 transition p-1">
              <FiSearch size={26} />
            </button>
          </div>

          {/* Body: Navigation Links */}
          <div className="flex-1 px-6 py-4 flex flex-col gap-6 overflow-y-auto">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-[17px] text-gray-900 font-medium hover:text-red-600 hover:translate-x-1 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Footer: Social Icons */}
          <div className="bg-gray-50 p-8 border-t border-gray-100">
            <div className="flex items-center gap-6 text-black">
              <a
                href="#"
                className="hover:text-gray-600 hover:-translate-y-1 transition-transform"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-blue-600 hover:-translate-y-1 transition-transform"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                className="hover:text-pink-600 hover:-translate-y-1 transition-transform"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="#"
                className="hover:text-black hover:-translate-y-1 transition-transform"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="#"
                className="hover:text-red-600 hover:-translate-y-1 transition-transform"
              >
                <FaYoutube size={22} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Navbar;
