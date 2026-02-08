"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ChevronDown, Loader2 } from "lucide-react";

const tabs = [
  { id: "combo", label: "কম্বো প্ল্যান" },
  { id: "message", label: "মেসেজ অটোরিপ্লাই" },
  { id: "comment", label: "কমেন্ট অটোরিপ্লাই" },
  { id: "image", label: "ছবি অটোপোস্ট" },
  { id: "reel", label: "রিল অটোপোস্ট" },
];

export default function LandingAutomation() {
  const [dbData, setDbData] = useState(null);
  const [activeTab, setActiveTab] = useState("combo");
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetch("/api/automationPublic")
      .then(res => res.json())
      .then(data => {
        setDbData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const current = dbData?.[activeTab];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010409] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
        <p className="text-cyan-400 font-black tracking-widest">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] text-white">

      {/* HERO */}
      <section className="pt-28 pb-20 text-center px-4">
        <motion.h1
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black italic uppercase bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent"
        >
          {current?.intro?.engTitle}
        </motion.h1>
        <p className="max-w-3xl mx-auto mt-6 text-gray-400 text-lg">
          {current?.intro?.mainDesc}
        </p>
      </section>

      {/* STICKY TABS */}
      <nav className="sticky top-0 z-50 bg-[#010409]/90 backdrop-blur border-y border-white/10 py-4">
        <div className="flex gap-3 justify-center overflow-x-auto no-scrollbar px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedPlan(null);
              }}
              className={`px-8 py-3 rounded-2xl font-black text-xs tracking-widest uppercase transition
                ${activeTab === tab.id
                  ? "bg-cyan-400 text-black"
                  : "bg-white/5 text-gray-400 hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* VIDEO */}
      {current?.videoUrl && (
        <section className="my-24">
          <div className="max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden border border-cyan-400/20 shadow-2xl">
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${current.videoUrl}`}
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* HOW IT WORKS (FIXED POSITION) */}
      <section className="py-24">
        <h2 className="text-center text-4xl font-black italic mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {current?.workflow?.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-cyan-400/20 flex items-center justify-center font-black text-cyan-400">
                {i + 1}
              </div>
              <h4 className="font-black text-xl mb-2">{step.title}</h4>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6">
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {current?.pricing?.map((plan, i) => (
            <div
              key={i}
              className={`rounded-[3rem] p-[2px] ${
                i === 1
                  ? "bg-gradient-to-b from-cyan-400 to-transparent scale-105"
                  : "bg-white/10"
              }`}
            >
              <div className="bg-[#0b121d] rounded-[2.9rem] p-10 h-full flex flex-col">
                <h3 className="text-2xl font-black italic uppercase mb-1">
                  {plan.name}
                </h3>

                <div className="flex items-end gap-1 mb-8">
                  <span className="text-5xl font-black">৳{plan.price}</span>
                  <span className="text-gray-500 text-sm">/মাস</span>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.perks?.split(",").map((perk, idx) => (
                    <div key={idx} className="flex gap-3">
                      <CheckCircle2 size={18} className="text-cyan-400 mt-1" />
                      <span className="text-gray-300">{perk.trim()}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full py-5 rounded-2xl bg-cyan-400 text-black font-black uppercase text-xs tracking-widest"
                >
                  Order Now <ArrowRight className="inline ml-2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMBO COMPARISON TABLE */}
      {activeTab === "combo" && current?.comparisonTable && (
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0b121d]">
              <table className="w-full text-sm text-white">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-5 text-left text-gray-400">Feature</th>
                    {current.comparisonTable.headers.map((h, i) => (
                      <th key={i} className="p-5 text-center font-black uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {current.comparisonTable.rows.map((row, i) => (
                    <tr key={i} className="border-t border-white/10">
                      <td className="p-5 font-bold text-gray-300">{row.label}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className="p-5 text-center">
                          {val === true && <span className="text-green-400 font-black">✔</span>}
                          {val === false && <span className="text-red-400 font-black">✖</span>}
                          {typeof val === "string" && (
                            <span className="text-cyan-400 font-bold">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="pb-32 max-w-4xl mx-auto px-6">
        <h2 className="text-center text-4xl font-black italic mb-12">FAQ</h2>
        {current?.faqs?.map((faq, i) => (
          <div key={i} className="border border-white/10 rounded-2xl mb-4">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full p-6 flex justify-between items-center"
            >
              <span className="font-bold">{faq.question}</span>
              <ChevronDown className={`${openFaq === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 text-gray-400"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>
    </div>
  );
}