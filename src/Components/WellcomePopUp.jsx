"use client";

import React, { useState, useEffect } from 'react';

const WellcomePopUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [petals, setPetals] = useState([]);

  const imageUrl = "https://raw.githubusercontent.com/mdabdullahm/video/main/hero3.jpg"; 

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('wellcome_popup_shown');

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        generatePetals();
        sessionStorage.setItem('wellcome_popup_shown', 'true');
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const generatePetals = () => {
    const newPetals = Array.from({ length: 25 }).map((_, i) => ({ 
      id: i,
      left: Math.random() * 100 + "%",
      delay: Math.random() * 5 + "s",
      duration: Math.random() * 4 + 5 + "s",
      size: Math.random() * 8 + 6 + "px",
      rotation: Math.random() * 360 + "deg",
      color: ["#FFD1DC", "#FFB7C5", "#FFFFFF", "#FADADD"][Math.floor(Math.random() * 4)]
    }));
    setPetals(newPetals);
  };

  const closePopup = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center  p-4 sm:p-6 overflow-hidden font-sans">
      
      {/* ১. ব্যাকড্রপ */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-700 z-10"
        onClick={closePopup}
      ></div>

      {/* ২. মেইন পপআপ কার্ড */}
      <div className="relative z-20  w-[92%] sm:w-full max-w-3xl bg-white rounded-[25px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-popup mx-auto">
        
        {/* ক্লোজ বাটন */}
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-xl text-slate-500 hover:text-red-500 rounded-full shadow-lg transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* বাম পাশ: ইমেজ সেকশন */}
        <div className="relative w-full md:w-5/12 h-40 sm:h-48 md:h-auto overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Welcome" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20"></div>
          <div className="absolute bottom-4 left-4 z-30">
             <p className="text-white/70 text-[10px] font-medium tracking-widest uppercase">Premium Experience</p>
             <h3 className="text-white text-lg font-bold italic">Exclusive Access</h3>
          </div>
        </div>

        {/* ডান পাশ: কন্টেন্ট সেকশন */}
        <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50 relative">
          
          {/* ব্র্যান্ডিং */}
          <div className="flex items-center gap-3 mb-4 md:mb-6">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-lg md:rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg">
               W
             </div>
             <span className="text-[10px] md:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">Subnex Portal</span>
          </div>

          <div className="space-y-2 md:space-y-4 mb-6">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Digital Potential</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xs">
              Safe and fastest checkout system for your convenience.
            </p>
          </div>

          {/* পেমেন্ট অপশন গ্রিড */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6">
            {['bKash', 'Nagad', 'Visa', 'MasterCard'].map((item, idx) => (
              <button 
                key={idx} 
                className="group flex flex-col items-center justify-center py-2 md:py-4 px-2 bg-white border border-slate-100 rounded-xl md:rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300 shadow-sm"
              >
                <span className="text-[9px] md:text-[11px] font-bold text-slate-600 uppercase tracking-wider">{item}</span>
                <span className="hidden sm:block text-[7px] md:text-[8px] font-medium text-slate-300 mt-1 uppercase">Instant Pay</span>
              </button>
            ))}
          </div>

          {/* ফুটার সিকিউরিটি */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
             <div className="flex items-center gap-2">
                <div className="px-1.5 py-0.5 bg-slate-900 text-white text-[8px] md:text-[10px] font-black rounded italic"></div>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Verified Merchant</span>
             </div>
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
             </div>
          </div>
        </div>
      </div>

      {/* ৩. পাপড়ি লেয়ার (মোবাইলের জন্য অপ্টিমাইজড) */}
      <div className="absolute inset-0 pointer-events-none z-30 hidden sm:block">
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute top-[-20px] animate-fall"
            style={{
              left: petal.left,
              width: petal.size,
              height: petal.size,
              backgroundColor: petal.color,
              borderRadius: "50% 2% 50% 50%",
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              transform: `rotate(${petal.rotation})`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes popupShow {
          0% { opacity: 0; transform: scale(0.95) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popup {
          animation: popupShow 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WellcomePopUp;