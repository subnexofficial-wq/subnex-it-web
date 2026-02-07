"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Package, MessageCircle, MessageSquare, Image as ImageIcon, Film, Zap, FiLoader, User, Phone, Mail, Ticket } from "lucide-react";

const tabs = [
    { id: 'combo', label: 'কম্বো প্ল্যান', icon: <Package size={20} /> },
    { id: 'message', label: 'মেসেজ অটোরিপ্লাই', icon: <MessageSquare size={20} /> },
    { id: 'comment', label: 'কমেন্ট অটোরিপ্লাই', icon: <MessageCircle size={20} /> },
    { id: 'image', label: 'ছবি অটোপোস্ট', icon: <ImageIcon size={20} /> },
    { id: 'reel', label: 'রিল অটোপোস্ট', icon: <Film size={20} /> },
];

export default function LandingAutomation() {
    const [dbContent, setDbContent] = useState(null);
    const [activeTab, setActiveTab] = useState('combo');
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        fetch('/api/automation').then(res => res.json()).then(data => {
            setDbContent(data);
            setLoading(false);
        });
    }, []);

    const current = dbContent?.[activeTab];

    if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#00E5FF] font-black">AI LOADING...</div>;

    if (isSuccess) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
            <div className="text-center p-10 bg-white/5 border border-cyan-500/30 rounded-[3rem] max-w-lg">
                <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                    <CheckCircle2 size={40} className="text-black" />
                </div>
                <h2 className="text-2xl font-black text-white mb-4 italic">পেমেন্ট সফল হয়েছে!</h2>
                <p className="text-gray-400 font-bold">শিগ্রই আপনার সঙ্গে একজন প্রতিনিধি যোগাযোগ করবেন, ধন্যবাদ।</p>
                <button onClick={() => setIsSuccess(false)} className="mt-8 text-cyan-400 font-bold text-sm underline">ফিরে যান</button>
            </div>
        </div>
    );

    return (
        <section className="bg-[#020617] text-white min-h-screen pb-32 font-sans selection:bg-cyan-500 selection:text-black">
            
            {/* ১. স্টিকি ট্যাব বার */}
            <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="container mx-auto px-4 flex justify-center overflow-x-auto no-scrollbar">
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => {setActiveTab(tab.id); setSelectedPlan(null);}}
                                className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-tighter transition-all whitespace-nowrap
                                    ${activeTab === tab.id ? 'bg-[#00E5FF] text-black shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-6 mt-16">
                <AnimatePresence mode="wait">
                    {current && (
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                            
                            {/* ২. ভিডিও সেকশন (যদি থাকে) */}
                            {current.videoUrl && (
                                <div className="relative aspect-video w-full max-w-4xl mx-auto mb-20 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                    <iframe 
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${current.videoUrl}`}
                                        title="Service Overview"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            {/* ৩. টেক্সট ইন্ট্রো */}
                            <div className="text-center mb-20">
                                <h1 className="text-5xl md:text-7xl font-black mb-6 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase">
                                    {current.intro?.engTitle}
                                </h1>
                                <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                                    {current.intro?.mainDesc}
                                </p>
                            </div>

                            {/* ৪. ওয়ার্কফ্লো (অ্যানিমেটেড) */}
                            <div className="grid md:grid-cols-3 gap-6 mb-24">
                                {current.workflow?.map((step, i) => (
                                    <div key={i} className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-500">
                                        <div className="text-cyan-400 text-4xl font-black mb-6 italic opacity-20 group-hover:opacity-100 transition-opacity">০{i+1}</div>
                                        <h4 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{step.title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ৫. প্রাইসিং সেকশন */}
                            <div className="grid md:grid-cols-3 gap-8 mb-24">
                                {current.pricing?.map((plan, i) => (
                                    <div key={i} className={`p-10 rounded-[3.5rem] border transition-all duration-500 
                                        ${selectedPlan?.name === plan.name ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 bg-white/[0.01]'}`}>
                                        <h3 className="text-2xl font-black italic uppercase tracking-widest">{plan.name}</h3>
                                        <div className="text-5xl font-black text-white my-8 tracking-tighter">
                                            {plan.price === "Contact" ? "CUSTOM" : <><span className="text-cyan-400 text-2xl font-bold">৳</span>{plan.price}</>}
                                        </div>
                                        <div className="space-y-4 mb-12">
                                            {plan.perks?.split(',').map((p, pi) => (
                                                <div key={pi} className="flex gap-3 text-sm font-bold text-gray-400">
                                                    {p.includes('নাই') || p.includes('X') ? <XCircle size={18} className="text-red-900 shrink-0" /> : <CheckCircle2 size={18} className="text-cyan-500 shrink-0" />}
                                                    {p.trim()}
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => plan.price === "Contact" ? window.open('https://wa.me/YOUR_NUMBER') : setSelectedPlan(plan)}
                                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all 
                                            ${plan.price === "Contact" ? 'bg-white text-black' : 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 hover:scale-105'}`}
                                        >
                                            {plan.price === "Contact" ? "Contact WhatsApp" : "অর্ডার করুন"}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* ৬. এন্টারপ্রাইজ মেসেজ */}
                            <div className="text-center mb-24 p-10 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                                <h3 className="text-xl font-black mb-2 italic">বড় উদ্যোক্তা?</h3>
                                <p className="text-gray-500 text-sm mb-6">কাস্টমাইজড সেবা পেতে সরাসরি যোগাযোগ করুন।</p>
                                <button onClick={() => window.open('https://wa.me/YOUR_NUMBER')} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase hover:bg-white hover:text-black transition-all">WhatsApp Contact</button>
                            </div>

                            {/* ৭. ডাইনামিক চেকআউট ফরম (প্ল্যান সিলেক্ট করলে দেখা যাবে) */}
                            {selectedPlan && (
                                <motion.div id="checkout" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-24 scroll-mt-32">
                                    <div className="bg-gradient-to-b from-cyan-500/10 to-transparent p-1 border border-cyan-500/20 rounded-[4rem]">
                                        <div className="bg-[#020617] p-8 md:p-16 rounded-[3.8rem]">
                                            <h2 className="text-3xl font-black text-center mb-12 italic tracking-widest uppercase">Contact Details</h2>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                        <input className="w-full p-5 pl-12 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold" placeholder="আপনার নাম লিখুন" />
                                                    </div>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                        <input className="w-full p-5 pl-12 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold" placeholder="আপনার হোয়াটসঅ্যাপ নাম্বার" />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                        <input type="email" className="w-full p-5 pl-12 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold" placeholder="আপনার ইমেইল ঠিকানা" />
                                                    </div>
                                                    <div className="relative">
                                                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                        <input className="w-full p-5 pl-12 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold" placeholder="কুপন কোড (যদি থাকে)" />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 pt-6">
                                                    <button 
                                                        onClick={() => setIsSuccess(true)}
                                                        className="w-full py-6 bg-[#00E5FF] text-black font-black rounded-3xl text-sm uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:scale-[1.02] transition-all"
                                                    >
                                                        Proceed to UddoktaPay
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ৮. FAQ সেকশন */}
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-3xl font-black text-center mb-12 italic tracking-tighter uppercase">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {current.faqs?.map((faq, fi) => (
                                        <div key={fi} className="border border-white/5 rounded-[2rem] overflow-hidden bg-white/[0.01]">
                                            <button onClick={() => setOpenFaq(openFaq === fi ? null : fi)} className="w-full p-7 flex items-center justify-between text-left transition-all hover:bg-white/[0.02]">
                                                <span className="font-bold text-gray-200">{faq.q}</span>
                                                {openFaq === fi ? <ChevronUp className="text-cyan-400" /> : <ChevronDown className="text-gray-500" />}
                                            </button>
                                            <AnimatePresence>
                                                {openFaq === fi && (
                                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                                        <div className="p-7 pt-0 text-gray-500 text-sm leading-relaxed border-t border-white/5 font-medium">
                                                            {faq.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}