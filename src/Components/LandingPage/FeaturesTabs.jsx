"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";


const FeaturesTabs = ({ activeTab, setActiveTab, tabs, contentData }) => {
    const [openFaq, setOpenFaq] = useState(null);

    // বর্তমানে যে ট্যাব সিলেক্ট করা আছে তার ডাটা
    const current = contentData[activeTab];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    if (!current) return null; 

    return (
        <div className="w-full bg-[#020617] min-h-screen pb-20">
            {/* ১. স্টিকি ট্যাব বার */}
            <section className="sticky top-0 z-40 w-full bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="container mx-auto px-4 flex justify-center overflow-x-auto no-scrollbar">
                    <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setOpenFaq(null);
                                }}
                                className={`relative px-4 md:px-6 py-2 md:py-3 rounded-xl text-[12px] md:text-[14px] font-bold transition-all ${activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-[#00E5FF] rounded-xl z-0" />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {tab.icon} {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-7xl mt-16 md:mt-24">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* ২. হেডার */}
                        <div className="text-center mb-16">
                            <motion.h2 
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter"
                            >
                                {current.engTitle.split(' ')[0]} <span className="text-[#00E5FF]">{current.engTitle.split(' ')[1]}</span>
                            </motion.h2>
                            <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                {current.mainDesc}
                            </p>
                        </div>

                        {/* ৩. ওয়ার্কফ্লো কার্ড */}
                        <div className="bg-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-white/10 mb-24 shadow-2xl">
                            <h3 className="text-center text-xl md:text-2xl font-bold mb-12 text-[#00E5FF]">কিভাবে কাজ করে?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                                {current.steps.map((step, i) => (
                                    <div key={i} className="flex flex-col items-center text-center relative group">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#00E5FF]/20 to-blue-600/20 border border-[#00E5FF]/30 rounded-2xl flex items-center justify-center text-2xl mb-6 text-[#00E5FF] group-hover:scale-110 transition-transform duration-300">
                                            {step.icon}
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed px-4">{step.desc}</p>
                                        
                                        {/* এরো আইকন (শুধুমাত্র বড় স্ক্রিনে) */}
                                        {i < current.steps.length - 1 && (
                                            <div className="hidden md:block absolute top-8 -right-6">
                                                <ArrowRight className="text-gray-700 w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ৪. প্রাইসিং সেকশন */}
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24 items-stretch">
                            {current.pricing.map((plan, i) => {
                                
                                const isHighlighted = i === 1; 
                                return (
                                    <div 
                                        key={i} 
                                        className={`relative p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 border flex flex-col ${
                                            isHighlighted 
                                            ? 'bg-gradient-to-b from-[#0a1628] to-[#020617] border-[#00E5FF] scale-105 shadow-[0_20px_50px_rgba(0,229,255,0.15)] z-10' 
                                            : 'bg-[#050c18] border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        {isHighlighted && (
                                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00E5FF] text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                                                Recommended
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold mb-1 text-white">{plan.name}</h3>
                                        <p className="text-xs text-gray-500 mb-6">{plan.bng}</p>
                                        
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-4xl font-black text-[#00E5FF]">
                                                {plan.price === "Contact" ? "Price" : `৳${plan.price}`}
                                            </span>
                                            {plan.price !== "Contact" && <span className="text-gray-500 text-sm">/মাস</span>}
                                        </div>

                                        <div className="space-y-4 mb-10 flex-grow">
                                            {plan.perks.map((p, pi) => (
                                                <div key={pi} className="flex items-start gap-3 text-sm text-gray-400">
                                                    <CheckCircle2 size={16} className="text-[#00E5FF] mt-0.5 shrink-0" />
                                                    <span className="leading-tight">{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <button className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 ${
                                            isHighlighted 
                                            ? 'bg-[#00E5FF] text-black shadow-[0_10px_20px_rgba(0,229,255,0.3)] hover:brightness-110' 
                                            : 'bg-white/5 text-white hover:bg-white/10'
                                        }`}>
                                            {plan.price === "Contact" ? "যোগাযোগ করুন" : "অর্ডার করুন"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ৫. FAQ (অ্যাকর্ডিয়ন স্টাইল) */}
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-center text-2xl font-bold mb-8 text-white">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h3>
                            <div className="space-y-3">
                                {current.faqs.map((faq, index) => (
                                    <div key={index} className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden">
                                        <button 
                                            onClick={() => toggleFaq(index)}
                                            className="w-full p-5 text-left flex justify-between items-center transition-colors hover:bg-white/[0.07]"
                                        >
                                            <span className="font-bold text-gray-200 text-sm md:text-base">{faq.q}</span>
                                            {openFaq === index ? <ChevronUp className="text-[#00E5FF]" /> : <ChevronDown className="text-gray-500" />}
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === index && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4"
                                                >
                                                    {faq.a}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FeaturesTabs;