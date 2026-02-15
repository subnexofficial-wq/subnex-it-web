"use client";
import React from 'react';
import { SmoothCounter } from './SmoothCounter'; 

const Hero = ({ onDemoClick, activeBtn }) => {
    return (
        <section className="relative z-10 pt-5 md:pt-10 pb-10 container mx-auto px-6 text-center">
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/25 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute -bottom-30 -right-40 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
            
            <h1 className="text-5xl md:text-8xl font-black mb-2 md:mb-8 tracking-tighter">
                সোশ্যাল মিডিয়া <br /> <span className="text-[#00E5FF]">অটোমেশন</span>
            </h1>
            <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-8 font-medium opacity-80">
                AI দিয়ে আপনার ফেসবুক ও ইন্সটাগ্রাম বিজনেস অটোমেট করুন। <br className="hidden md:block" />
                সময় বাঁচান, আপনার বিক্রি কয়েক গুণ বাড়িয়ে নিন।
            </p>
            
         
            <div className="max-w-5xl mx-auto border-t border-white/5 pt-2 grid grid-cols-2 md:grid-cols-4 text-center">
                <div className="py-4"><div className="text-3xl md:text-5xl font-black text-[#00E5FF]"><SmoothCounter target={1000} suffix="+" /></div><p className="text-gray-500 font-bold uppercase text-[10px]">ব্যবহারকারী</p></div>
                <div className="py-4 border-l border-white/5"><div className="text-3xl md:text-5xl font-black text-[#00E5FF]"><SmoothCounter target={50} suffix="K+" /></div><p className="text-gray-500 font-bold uppercase text-[10px]">অটো রেসপন্স</p></div>
                <div className="py-4 border-l border-white/5"><div className="text-3xl md:text-5xl font-black text-[#00E5FF]"><SmoothCounter target={99} suffix=".9%" /></div><p className="text-gray-500 font-bold uppercase text-[10px]">আপটাইম</p></div>
                <div className="py-4 border-l border-white/5"><div className="text-3xl md:text-5xl font-black text-[#00E5FF]"><SmoothCounter target={24} suffix="/7" /></div><p className="text-gray-500 font-bold uppercase text-[10px]">সাপোর্ট</p></div>
            </div>
        </section>
    );
};

export default Hero;