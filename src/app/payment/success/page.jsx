"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#010409] text-white flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0b121d] border border-white/10 p-10 rounded-[3rem] text-center shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 p-4 rounded-full">
            <CheckCircle2 size={64} className="text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase mb-4 tracking-tight">
          পেমেন্ট সফল হয়েছে!
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          শিগ্রই আপনার সঙ্গে একজন প্রতিনিধি যোগাযোগ করবেন, ধন্যবাদ।
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition font-bold"
          >
            <ArrowLeft size={18} /> ব্যাক টু হোম
          </Link>
          
          <a 
            href="https://wa.me/8801979554344" 
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-600 text-black rounded-2xl transition font-bold"
          >
            <MessageSquare size={18} /> সরাসরি হোয়াটস্যাপ করুন
          </a>
        </div>
      </motion.div>
    </div>
  );
}