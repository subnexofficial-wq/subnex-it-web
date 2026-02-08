"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

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

  /* ================= COUPON ================= */
  const handleApplyCoupon = () => {
    if (
      selectedPlan?.coupon &&
      couponInput.trim().toUpperCase() ===
        selectedPlan.coupon.code.toUpperCase()
    ) {
      setAppliedCoupon(selectedPlan.coupon);
    } else {
      alert("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const calculateFinalPrice = (price, coupon) => {
    const p = Number(price);
    if (!coupon) return p;
    if (coupon.type === "percent")
      return Math.max(p - Math.round((p * coupon.value) / 100), 0);
    if (coupon.type === "flat") return Math.max(p - coupon.value, 0);
    return p;
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

      {/* ================= TABS ================= */}
      <div className="sticky top-0 z-[999] bg-[#010409]/95 backdrop-blur border-y border-white/10">
        <div className="flex justify-center gap-3 px-4 py-6 overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedPlan(null);
                  setShowCheckout(false);
                  setAppliedCoupon(null);
                  setCouponInput("");
                }}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase transition
                  ${
                    active
                      ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,.6)]"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
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

      {/* ================= HOW IT WORKS ================= */}
      {current?.workflow?.length > 0 && (
        <section className="py-24">
          <h2 className="text-center text-4xl font-black italic mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
            {current.workflow.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
              >
                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center font-black">
                  {i + 1}
                </div>
                <h4 className="font-black text-xl mb-2">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ================= PRICING ================= */}
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
                    <div className="text-3xl font-black mb-8 text-green-400">
                      Contact Us
                    </div>
                  )}

                  <div className="space-y-4 mb-10 flex-grow">
                    {plan.perks?.split(",").map((perk, idx) => (
                      <div key={idx} className="flex gap-3">
                        <CheckCircle2 size={18} className="text-cyan-400" />
                        <span className="text-gray-300">{perk.trim()}</span>
                      </div>
                    ))}
                  </div>

                  {plan.pricingType === "contact" ? (
                    <button
                      onClick={() =>
                        window.open(`https://wa.me/${plan.whatsapp}`, "_blank")
                      }
                      className="w-full py-5 rounded-2xl bg-green-500 text-black font-black uppercase text-xs"
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
                      className={`w-full py-5 rounded-2xl font-black uppercase text-xs ${
                        isFeatured
                          ? "bg-cyan-400 text-black"
                          : "bg-white/10"
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
<tbody>
  {current.comparisonTable.headers.map((planName, planIndex) => {
    const pricingPlan = current.pricing?.[planIndex];
    if (!pricingPlan) return null;

    return (
      <tr
        key={planIndex}
        className="border-t border-white/10 hover:bg-white/5 transition"
      >
        {/* PLAN NAME */}
        <td className="p-5 font-black text-cyan-400 whitespace-nowrap">
          {planName}
        </td>

        {/* FEATURE VALUES */}
        {current.comparisonTable.rows.map((feature, fIndex) => {
          const cell = feature.values?.[planIndex];

          return (
            <td
              key={fIndex}
              className="p-5 text-center font-black whitespace-nowrap"
            >
              {cell?.type === "true" && "✔"}
              {cell?.type === "false" && "✖"}
              {cell?.type === "number" && `${cell.value} টি`}
              {cell?.type === "custom" && "Custom"}
            </td>
          );
        })}

        {/* ACTION */}
        <td className="p-5 text-center whitespace-nowrap">
          {pricingPlan.pricingType === "contact" ? (
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${pricingPlan.whatsapp}?text=I am interested in ${pricingPlan.name}`,
                  "_blank"
                )
              }
              className="px-6 py-3 rounded-xl bg-green-500 text-black font-black text-xs uppercase"
            >
              Contact Us
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedPlan({
                  ...pricingPlan,
                  price: Number(pricingPlan.price),
                });
                setShowCheckout(true);
                setAppliedCoupon(null);
                setCouponInput("");
              }}
              className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-black text-xs uppercase"
            >
              Order Now
            </button>
          )}
        </td>
      </tr>
    );
  })}
</tbody>
      {/* ================= CHECKOUT ================= */}
      {showCheckout && selectedPlan?.pricingType === "price" && (
        <section className="py-24 px-6">
          <div className="max-w-xl mx-auto bg-white/5 rounded-3xl p-8">
            <h3 className="text-xl font-black mb-6 text-center">
              Contact Details
            </h3>

            <div className="space-y-4">
              <input
                placeholder="Your Name"
                className="w-full p-4 rounded-xl bg-black/40"
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <input
                placeholder="WhatsApp Number"
                className="w-full p-4 rounded-xl bg-black/40"
                onChange={(e) =>
                  setCustomer({ ...customer, whatsapp: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 rounded-xl bg-black/40"
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
              />

              <input
                placeholder="Coupon Code"
                className="w-full p-4 rounded-xl bg-black/40"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />

              <button
                onClick={handleApplyCoupon}
                className="w-full py-3 bg-white/10 rounded-xl font-bold"
              >
                Apply Coupon
              </button>

              {appliedCoupon && (
                <div className="text-center text-sm text-red-400 line-through">
                  ৳{selectedPlan.price}
                </div>
              )}

              <div className="text-center text-3xl font-black text-cyan-400">
                ৳{calculateFinalPrice(selectedPlan.price, appliedCoupon)}
              </div>

              <button className="w-full py-5 bg-cyan-400 text-black font-black rounded-2xl">
                Pay ৳{calculateFinalPrice(selectedPlan.price, appliedCoupon)}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}