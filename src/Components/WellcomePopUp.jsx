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
    const newPetals = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      delay: Math.random() * 5 + "s",
      duration: Math.random() * 4 + 5 + "s",
      size: Math.random() * 12 + 8 + "px",
      rotation: Math.random() * 360 + "deg",
      color: ["#FFD1DC", "#FFB7C5", "#FFFFFF", "#FADADD"][Math.floor(Math.random() * 4)]
    }));
    setPetals(newPetals);
  };

  const closePopup = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* ১. ব্যাকগ্রাউন্ড ওভারলে (ডার্ক অ্যান্ড ব্লার) */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-700 z-10"
        onClick={closePopup}
      ></div>

      {/* ২. মেইন পপআপ কার্ড */}
      <div className="relative z-20 w-full max-w-3xl bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row animate-popup border border-white/40">
        
        {/* ক্লোজ বাটন */}
        <button 
          onClick={closePopup}
          className="absolute top-5 right-5 z-50 p-2.5 bg-white/80 backdrop-blur-xl text-slate-500 hover:text-red-500 hover:rotate-90 rounded-full shadow-lg transition-all duration-300 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* বাম পাশ: ইমেজ সেকশন */}
        <div className="relative w-full md:w-5/12 h-56 md:h-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent z-10"></div>
          <img 
            src={imageUrl} 
            alt="Welcome" 
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[3000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20"></div>
          <div className="absolute bottom-6 left-6 z-30">
             <p className="text-white/70 text-xs font-medium tracking-widest uppercase">Premium Experience</p>
             <h3 className="text-white text-xl font-bold italic">Exclusive Access</h3>
          </div>
        </div>

        {/* ডান পাশ: কন্টেন্ট সেকশন */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50 relative">
          
          {/* ব্র্যান্ডিং */}
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-200">
               W
             </div>
             <div className="h-8 w-[2px] bg-slate-100"></div>
             <span className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">Subnex Portal</span>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Digital Potential</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Experience the safest and fastest checkout system designed for your convenience.
            </p>
          </div>

          {/* পেমেন্ট অপশন গ্রিড */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {['bKash', 'Nagad', 'Visa', 'MasterCard'].map((item, idx) => (
              <button 
                key={idx} 
                className="group flex flex-col items-center justify-center py-4 px-2 bg-white border border-slate-100 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50"
              >
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-emerald-700 uppercase tracking-wider">{item}</span>
                <span className="text-[8px] font-medium text-slate-300 group-hover:text-emerald-400 mt-1 uppercase">Instant Pay</span>
              </button>
            ))}
          </div>

          {/* ফুটার সিকিউরিটি */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
             <div className="flex items-center gap-3">
                <div className="px-2 py-1 bg-slate-900 text-white text-[10px] font-black rounded italic">EPS</div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Merchant</span>
             </div>
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
             </div>
          </div>
        </div>
      </div>

      {/* ৩. এনিমেটেড পাপড়ি লেয়ার */}
      <div className="absolute inset-0 pointer-events-none z-30">
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
              boxShadow: `0 0 10px ${petal.color}66`,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              transform: `rotate(${petal.rotation})`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes popupShow {
          0% { opacity: 0; transform: scale(0.9) translateY(30px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .animate-popup {
          animation: popupShow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(540deg) translateX(80px); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WellcomePopUp;