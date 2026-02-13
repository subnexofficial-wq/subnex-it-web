"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2, Cpu, Database, Send, CheckCircle, HelpCircle, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= TABS ================= */
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
  const [loading, setLoading] = useState(true);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [customer, setCustomer] = useState({
    name: "",
    whatsapp: "",
    email: "",
  });
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("/api/automationPublic")
      .then((res) => res.json())
      .then((data) => {
        setDbData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const current = dbData?.[activeTab];

  /* ================= COUPON LOGIC ================= */
  const handleApplyCoupon = () => {
    if (!selectedPlan) {
      alert("Please select a plan first!");
      return;
    }

    const planCoupon = selectedPlan.coupon;
    
    if (!planCoupon || !planCoupon.code) {
      alert("No coupon available for this specific plan.");
      setAppliedCoupon(null);
      return;
    }

    if (couponInput.trim().toUpperCase() === planCoupon.code.toUpperCase()) {
      setAppliedCoupon(planCoupon);
    } else {
      alert("Invalid coupon code.");
      setAppliedCoupon(null);
    }
  };

  const calculateFinalPrice = (price, coupon) => {
    const p = Number(price) || 0;
    if (!coupon || !coupon.value) return p;
    const discountValue = Number(coupon.value); 
    if (coupon.type === "percent") {
      const discount = Math.round((p * discountValue) / 100);
      return Math.max(p - discount, 0);
    }
    if (coupon.type === "flat") {
      return Math.max(p - discountValue, 0);
    }
    return p;
  };

  /* ================= CHECKOUT HANDLER (FIXED) ================= */
const handleFinalCheckout = async () => {
  if (!customer.name || !customer.whatsapp || !customer.email) {
    alert("দয়া করে সব তথ্য পূরণ করুন!");
    return;
  }

  setIsProcessing(true);
  const finalAmount = calculateFinalPrice(selectedPlan.price, appliedCoupon);

  // পে-লোড ভেরিয়েবলটি আগে তৈরি করে নিতে হবে
  const payload = {
    amount: finalAmount,
    customerName: customer.name,
    customerEmail: customer.email,
    customerMobile: customer.whatsapp,
    orderType: "AUTOMATION_LANDING",
    orderDetails: {
      planName: selectedPlan.name,
      category: activeTab,
      coupon: appliedCoupon?.code || "NONE"
    },
    isAutomation: true
  };

  console.log("Sending to Backend:", payload); 

  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), 
    });

    const data = await response.json();
    if (data.payment_url) {
      window.location.href = data.payment_url;
    } else {
      alert(data.error || "পেমেন্ট লিঙ্ক তৈরি করা যায়নি।");
      setIsProcessing(false);
    }
  } catch (error) {
    console.error("Checkout Error:", error);
    alert("সার্ভার এরর! সম্ভবত API কানেকশনে সমস্যা হচ্ছে।");
    setIsProcessing(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] text-white">

      {/* ================= HERO ================= */}
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

   
    {/* STICKY TABS  */}
<div className="sticky top-0 z-[999] bg-[#010409]/95 backdrop-blur border-y border-white/10">
  <div className="max-w-6xl mx-auto px-4 py-4">
 
    <div className="grid grid-cols-6 md:flex md:justify-center gap-2 md:gap-3">
      {tabs.map((tab, index) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedPlan(null);
              setShowCheckout(false);
              setAppliedCoupon(null);
            }}
            className={`
              py-3 rounded-xl font-black text-[10px] md:text-xs uppercase transition-all border
              ${active 
                ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] border-cyan-400" 
                : "bg-white/5 text-gray-400 hover:text-white border-white/5"
              }
            
              ${index < 3 ? "col-span-2" : "col-span-3"}
             
              md:px-6 md:col-auto
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  </div>
</div>

      {/* ================= VIDEO ================= */}
      {current?.videoUrl && (
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2.5rem] overflow-hidden border border-cyan-400/30"
            >
              <iframe
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/${current.videoUrl}`}
                allowFullScreen
              />
            </motion.div>
          </div>
        </section>
      )}
 {/* ================= WORKFLOW (UI AS PER SCREENSHOT) ================= */}
{current?.workflow?.length > 0 && (
  <section className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-center text-4xl p-5">How it  works ?</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
        {current.workflow.map((step, i) => (
          <React.Fragment key={i}>
            {/* আইকন কার্ড */}
            <div className="flex flex-col items-center group">
              {/* আইকন বক্স উইথ অ্যানিমেশন */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-[#0b121d] border border-cyan-400/20 flex items-center justify-center p-6 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.05)] group-hover:border-cyan-400/50 transition-all duration-500"
              >
                {step.image ? (
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-full object-contain filter brightness-110 group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <Rocket className="text-cyan-400" size={40} />
                )}
              </motion.div>

              {/* টেক্সট সেকশন */}
              <div className="text-center">
                <h4 className="text-lg font-black text-white uppercase tracking-tight">{step.title}</h4>
                <p className="text-xs text-gray-500 mt-1 font-medium">{step.desc}</p>
              </div>
            </div>

            {/* কানেক্টিং অ্যারো (লাস্ট আইটেমের পর দেখাবে না) */}
            {i < current.workflow.length - 1 && (
              <div className="flex items-center justify-center px-4 md:px-8 py-4 md:py-0">
                <ArrowRight 
                  className="text-cyan-400 rotate-90 md:rotate-0 opacity-40 group-hover:opacity-100 transition-opacity" 
                  size={24} 
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
)}

 {/* ================= FEATURES ================= */}
      {current?.features?.length > 0 && (
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-4xl font-black italic mb-16 flex items-center justify-center gap-4">
              <Cpu className="text-cyan-400" /> Platform Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {current.features.map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-[#0b121d] border border-white/5 hover:border-cyan-400/50 transition">
                  <div className="text-cyan-400 mb-4">
                    {item.icon === "sheet" && <Database size={32} />}
                    {item.icon === "telegram" && <Send size={32} />}
                    {item.icon === "ai" && <Cpu size={32} />}
                    {item.icon === "output" && <CheckCircle size={32} />}
                  </div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ==== PRICING SECTION ==== */}
      <section className="py-28 px-6">
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {current?.pricing?.map((plan, i) => {
            const isFeatured = i === 1; 
            return (
              <motion.div
                key={i}
                whileHover={{ scale: isFeatured ? 1.07 : 1.04 }}
                className={`relative rounded-[3rem] p-[2px]
                  ${isFeatured ? "bg-gradient-to-b from-cyan-400" : "bg-white/10"}`}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-xs font-black px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="bg-[#0b121d] rounded-[2.9rem] p-10 h-full flex flex-col">
                  <h3 className="text-2xl font-black italic mb-2">{plan.name}</h3>

                  {plan.pricingType === "price" ? (
                    <div className="text-5xl font-black mb-8">৳{plan.price}</div>
                  ) : (
                    <div className="text-3xl font-black mb-8 text-green-400">Contact Us</div>
                  )}

                  <div className="space-y-4 mb-10 flex-grow">
                    {plan.perks?.split(",").map((perk, idx) => (
                      <div key={idx} className="flex gap-3">
                        <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                        <span className="text-gray-300 text-sm leading-tight">{perk.trim()}</span>
                      </div>
                    ))}
                  </div>

                  {plan.pricingType === "contact" ? (
                    <button
                      onClick={() => window.open(`https://wa.me/${plan.whatsapp}?text=I am interested in ${plan.name}`, "_blank")}
                      className="w-full py-5 rounded-2xl bg-green-500 text-black font-black uppercase text-xs hover:bg-green-400 transition"
                    >
                      Contact on WhatsApp
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowCheckout(true);
                        setAppliedCoupon(null);
                        setCouponInput("");
                      }}
                      className={`w-full py-5 rounded-2xl font-black uppercase text-xs transition ${
                        isFeatured
                          ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      Order Now <ArrowRight size={14} className="inline ml-2" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========== CHECKOUT SECTION (FIXED) ============ */}
      {showCheckout && selectedPlan?.pricingType === "price" && (
        <section className="py-24 px-6 border-t border-white/10">
          <div className="max-w-xl mx-auto bg-[#0b121d] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <h3 className="text-2xl font-black mb-8 text-center italic uppercase tracking-widest">
              Checkout - <span className="text-cyan-400">{selectedPlan.name}</span>
            </h3>

            <div className="space-y-5">
              <input
                placeholder="Your Full Name"
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none transition"
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
              <input
                placeholder="WhatsApp Number"
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none transition"
                onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none transition"
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />

              <div className="flex gap-2">
                <input
                  placeholder="Coupon Code"
                  className="flex-grow p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none transition uppercase font-bold text-sm"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase transition"
                >
                  Apply
                </button>
              </div>

              <div className="bg-black/20 p-6 rounded-3xl border border-dashed border-white/10 text-center space-y-2">
                {appliedCoupon ? (
                  <>
                    <div className="text-sm text-gray-500 line-through">৳{selectedPlan.price}</div>
                    <div className="text-xs text-green-400 font-bold uppercase tracking-widest">Coupon Applied!</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">Total Payable Amount</div>
                )}
                <div className="text-5xl font-black text-cyan-400">
                  ৳{calculateFinalPrice(selectedPlan.price, appliedCoupon)}
                </div>
              </div>

             <button 
  onClick={ handleFinalCheckout}
  disabled={isProcessing}
  className="w-full py-6 bg-cyan-400 hover:bg-cyan-300 text-black font-black rounded-2xl uppercase text-sm shadow-[0_10px_30px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2"
>
  {isProcessing ? (
    <><Loader2 className="animate-spin" size={18} /> Processing...</>
  ) : (
    "Proceed to Payment"
  )}
</button>
            </div>
          </div>
        </section>
      )}

     

      {/* ================= FAQ ================= */}
      {current?.faqs?.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-4xl font-black italic mb-16 flex items-center justify-center gap-4">
              <HelpCircle className="text-cyan-400" /> Frequently Asked
            </h2>
            <div className="space-y-4">
              {current.faqs.map((faq, i) => (
                <details key={i} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <summary className="p-6 cursor-pointer font-bold flex justify-between items-center list-none">
                    {faq.q}
                    <span className="group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <div className="p-6 pt-3 text-gray-400 text-sm border-t border-white/5">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}