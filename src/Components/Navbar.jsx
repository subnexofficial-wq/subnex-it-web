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
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { useCart } from "@/hooks/CartContext";
import { useAuth } from "@/hooks/useAuth";

const countryList = [{ name: "Bangladesh", currency: "BDT " }];

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

  // --- সার্চের জন্য নতুন স্টেট ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dropdownRef = useRef(null);

  // Live Search Logic (API থেকে ডাটা কল করা)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 0) {
        try {
          const res = await fetch(`/api/products/search?q=${searchQuery}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Search fetch error:", error);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen, isSearchOpen]);

  return (
    <>
      {/* --- আপনার আগের নেভবার (অপরিবর্তিত) --- */}
      <nav className="w-full bg-white border-b py-0 border-gray-200 sticky top-0 z-40 shadow-sm font-sans">
        <div className=" max-w-[100vw] overflow-x-hidden px-2 sm:px-6 lg:px-8">
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
              {/* সার্চ বাটন: এখন এটিতে ক্লিক করলে ওভারলে খুলবে */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-black transition p-1"
              >
                <FiSearch size={24} />
              </button>
            </div>

            {/* মাঝখান: লোগো */}
         <div className="lg:pl-42 flex items-center justify-center">
  <Link href="/" className="group flex items-center gap-0.5">
 
    <div className="relative w-30 h-10 md:w-30 md:h-16 transition-all duration-300 ease-in-out group-hover:scale-115 active:scale-95">
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
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity text-sm font-semibold text-gray-800 select-none"
                >
                  <span>
                    {selected.name} | {selected.currency}
                  </span>
                </div>
              </div>

              <Link
                href={user ? "/user" : "/login"}
                className="text-gray-700 hover:text-black transition p-1"
              >
                <FiUser size={24} />
              </Link>

              <Link
                href="/cart"
                className="text-gray-700 hover:text-black transition p-1 relative group"
              >
                <FiShoppingBag
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
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

      {/* --- নতুন সার্চ ওভারলে পার্ট (স্ক্রিনশট অনুযায়ী ডিজাইন) --- */}
      <div
        className={`fixed inset-0 bg-black/60 z-[100] transition-all duration-300 ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSearchOpen(false)}
      >
        <div
          className="bg-white w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-transform duration-300 transform"
          onClick={(e) => e.stopPropagation()} // ড্রপডাউনে ক্লিক করলে যাতে বন্ধ না হয়
        >
          <div className="max-w-4xl mx-auto px-4 py-3">
            {/* সার্চ ইনপুট সেকশন */}
            <div className="flex items-center border-b-2 border-gray-100 pb-2">
              <div className="flex flex-col flex-1">
                <label className="text-xs text-gray-400 font-bold ml-1">
                  Search
                </label>
                <div className="flex items-center">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for products..."
                    className="w-full text-xl py-2 outline-none font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 mr-2 text-gray-400"
                    >
                     
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiSearch size={28} className="text-gray-400" />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX size={28} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* রেজাল্ট সেকশন */}
            <div className="py-6">
              {searchResults.length > 0 ? (
                <div>
                  <h3 className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-6 border-b pb-2">
                    Products
                  </h3>
                  <div className="space-y-6">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-5 group"
                      >
                        <div className="w-16 h-16 relative bg-gray-50 border border-gray-100 rounded overflow-hidden">
                          <Image
                            src={product.thumbnail || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-contain p-1 group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition text-[15px]">
                            {product.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Tk{" "}
                            {product.variants?.[0]?.discountPrice
                              ? product.variants[0].discountPrice
                              : product.variants?.[0]?.price || 0}
                            .00 BDT
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div
                   
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between border-t mt-8 pt-4 text-gray-900 font-bold text-sm hover:text-red-600 transition group"
                  >
                    <span>Search for "{searchQuery}"</span>

                  </div>
                 
                </div>
              ) : (
                searchQuery && (
                  <div className="py-20 text-center">
                    <p className="text-gray-400 italic">
                      No products found matching "{searchQuery}"
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- SIDEBAR MENU (design Unchanged) --- */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[300px] sm:w-[350px] bg-white z-[60] shadow-2xl transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full font-sans">
          <div className="flex items-center gap-6 p-6 pt-8">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-black transition-transform duration-300 p-1"
            >
              <FiX size={28} />
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="text-black p-1"
            >
              <FiSearch size={26} />
            </button>
          </div>
          <div className="flex-1 px-6 py-4 flex flex-col gap-6 overflow-y-auto">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-[17px] text-gray-900 font-medium hover:text-red-600 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
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
