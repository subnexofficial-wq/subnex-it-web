
// src/components/home/ProductDetails.jsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { FiHeart, FiHelpCircle, FiShare2, FiEye, FiMinus, FiPlus } from "react-icons/fi";

const BuyView = () => {
  // স্টেট ম্যানেজমেন্ট (Quantity এবং Duration এর জন্য)
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState("1 Month");

  // Quantity বাড়ানো কমানোর ফাংশন
  const handleQuantity = (type) => {
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
    if (type === "inc") setQuantity(quantity + 1);
  };

  return (
    <div className="w-full bg-[#121212] text-white  font-sans">
      <div className=" container mx-auto pt-6 2xl:pt-0 px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        
          <div className="relative w-full">
            {/* মেইন ইমেজ */}
            <div className="relative w-full  h-full  md:h-[80vh] aspect-square md:aspect-[4/5] overflow-hidden rounded-lg bg-gray-900 border border-gray-800">
              {/* আপনার দেওয়া ইমেজটি এখানে বসাবেন */}
              <Image
                src="/netflix.jpg" 
                alt="Netflix VIP Plan"
                fill
                className=""
                priority
              />
            </div>
            
          </div>


          {/* =======================
              ডান পাশ: ডিটেইলস
             ======================= */}
          <div className="flex py-10 flex-col h-full">
            
            {/* ছোট টাইটেল */}
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
              The VIP Experience
            </p>
            
            {/* মেইন টাইটেল */}
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: 'sans-serif' }}>
              Netflix VIP Plan
            </h1>

            {/* দাম এবং সোল্ড আউট ব্যাজ */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xl md:text-2xl font-medium">Tk 750.00 BDT</span>
              <span className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide">
                Sold out
              </span>
            </div>

            {/* Duration Selector */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Duration</p>
              <div className="flex gap-3">
                {["1 Month", "3 Month"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setDuration(item)}
                    className={`px-6 py-2 rounded-full text-sm font-medium border transition-all duration-200
                      ${duration === item 
                        ? "bg-white text-black border-white" 
                        : "bg-transparent text-white border-gray-700 hover:border-gray-400"}
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <p className="text-sm text-gray-400 mb-2">Quantity</p>
              <div className="flex items-center w-32 border border-gray-700 rounded bg-transparent">
                <button 
                  onClick={() => handleQuantity("dec")}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition text-gray-400 hover:text-white"
                >
                  <FiMinus size={14} />
                </button>
                <div className="flex-1 text-center font-medium">{quantity}</div>
                <button 
                  onClick={() => handleQuantity("inc")}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition text-gray-400 hover:text-white"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* Buttons (Sold Out & Buy Now) */}
            <div className="flex flex-col gap-3 mb-10">
              {/* Sold Out Button (Disabled style) */}
              <button 
                disabled 
                className="w-full py-3.5 bg-transparent border border-gray-700 text-gray-400 font-medium rounded uppercase tracking-wider cursor-not-allowed"
              >
                Sold out
              </button>
              
              {/* Buy Now Button */}
              <button className="w-full py-3.5 bg-white text-black font-bold rounded uppercase tracking-wider hover:bg-gray-200 transition-colors">
                Buy it now
              </button>
            </div>

            {/* Icons Section (VIP & Household) */}
            <div className="flex items-center justify-center gap-12 md:gap-20 border-t border-gray-800 pt-8 pb-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <FiHeart size={24} className="text-white" />
                <span className="text-sm font-medium">VIP Priority</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <FiHelpCircle size={24} className="text-white" />
                <span className="text-sm font-medium">No HouseHold</span>
              </div>
            </div>

            {/* Footer Actions (Share & View) */}
            <div className="flex items-center justify-between mt-auto pt-4 text-sm text-gray-400">
              <button className="flex items-center gap-2 hover:text-white transition">
                <FiShare2 /> Share
              </button>
              <button className="flex items-center gap-2 underline  hover:text-white transition">
                View details  <FiEye />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyView;