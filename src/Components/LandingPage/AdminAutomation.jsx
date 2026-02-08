"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FiSave,
  FiPlus,
  FiTrash2,
  FiVideo,
  FiLayers,
  FiDollarSign,
  FiHelpCircle,
  FiPackage,
  FiMessageCircle,
  FiMessageSquare,
  FiImage,
  FiFilm,
  FiZap,
  FiEdit3,
  FiLoader
} from "react-icons/fi";

/* =======================
   CATEGORY TABS
======================= */
const tabs = [
  { id: "combo", label: "কম্বো প্ল্যান", icon: <FiPackage /> },
  { id: "comment", label: "কমেন্ট অটোরিপ্লাই", icon: <FiMessageCircle /> },
  { id: "message", label: "মেসেজ অটোরিপ্লাই", icon: <FiMessageSquare /> },
  { id: "image", label: "ছবি অটোপোস্ট", icon: <FiImage /> },
  { id: "reel", label: "রিল অটোপোস্ট", icon: <FiFilm /> }
];

/* =======================
   DEFAULT STRUCTURE
======================= */
const emptyCategory = (category) => ({
  category,
  videoUrl: "",
  intro: { engTitle: "", mainDesc: "" },
  workflow: [
    { title: "", desc: "" },
    { title: "", desc: "" },
    { title: "", desc: "" }
  ],
  pricing: [],
  comparisonTable: {
    headers: ["Basic", "Smart", "Viral", "Business", "Ultimate"],
    rows: []
  },
  faqs: []
});

export default function AdminAutomation() {
  const [dbContent, setDbContent] = useState({});
  const [activeTab, setActiveTab] = useState("combo");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =======================
     LOAD DATA
  ======================= */
  useEffect(() => {
    fetch("/api/admin/automation")
      .then(res => res.json())
      .then(data => {
        const formatted = {};
        data.forEach(item => {
          formatted[item.category] = item;
        });
        setDbContent(formatted);
        setLoading(false);
      });
  }, []);

  const current = dbContent[activeTab] || emptyCategory(activeTab);

  /* =======================
     UPDATE FIELD
  ======================= */
  const updateField = (path, value) => {
    setDbContent(prev => {
      const copy = { ...prev };
      if (!copy[activeTab]) copy[activeTab] = emptyCategory(activeTab);

      const keys = path.split(".");
      let obj = copy[activeTab];
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  /* =======================
     SAVE DATA
  ======================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/automation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current)
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "ডাটা সফলভাবে সেভ হয়েছে",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500
        });
      }
    } catch {
      Swal.fire("Error", "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-blue-600 font-bold">
        <FiLoader className="animate-spin text-4xl mb-3" />
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 p-6 pb-40">

      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-3xl shadow-sm border flex flex-wrap gap-4 justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl">
            <FiZap size={22} />
          </div>
          <div>
            <h1 className="font-black uppercase text-lg">Automation Editor</h1>
            <p className="text-xs text-gray-400 font-bold">
              Editing: {tabs.find(t => t.id === activeTab)?.label}
            </p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2
              ${activeTab === tab.id
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-500 hover:text-black"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= VIDEO ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h3 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
            <FiVideo /> YouTube Video
          </h3>
          <input
            className="w-full bg-gray-50 p-4 rounded-xl font-bold text-sm"
            placeholder="YouTube Video ID"
            value={current.videoUrl}
            onChange={e => updateField("videoUrl", e.target.value)}
          />
        </div>

        {/* ================= INTRO ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
          <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2">
            <FiEdit3 /> Intro Section
          </h3>
          <input
            className="w-full p-4 bg-gray-50 rounded-xl font-black text-lg"
            placeholder="English Title"
            value={current.intro.engTitle}
            onChange={e => updateField("intro.engTitle", e.target.value)}
          />
          <textarea
            rows={4}
            className="w-full p-4 bg-gray-50 rounded-xl"
            placeholder="Bengali Description"
            value={current.intro.mainDesc}
            onChange={e => updateField("intro.mainDesc", e.target.value)}
          />
        </div>

        {/* ================= WORKFLOW ================= */}
        <div>
          <h3 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
            <FiLayers /> How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {current.workflow.map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border">
                <input
                  className="w-full mb-2 p-3 bg-gray-50 rounded-xl font-bold"
                  placeholder="Step Title"
                  value={step.title}
                  onChange={e => {
                    const w = [...current.workflow];
                    w[i].title = e.target.value;
                    updateField("workflow", w);
                  }}
                />
                <textarea
                  rows={3}
                  className="w-full p-3 bg-gray-50 rounded-xl"
                  placeholder="Step Description"
                  value={step.desc}
                  onChange={e => {
                    const w = [...current.workflow];
                    w[i].desc = e.target.value;
                    updateField("workflow", w);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ================= PRICING ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2">
              <FiDollarSign /> Pricing Plans
            </h3>
            <button
              onClick={() =>
                updateField("pricing", [...current.pricing, { name: "", price: "", perks: "" }])
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black"
            >
              <FiPlus /> Add Plan
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {current.pricing.map((plan, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-3xl relative">
                <button
                  className="absolute top-4 right-4 text-red-400"
                  onClick={() =>
                    updateField("pricing", current.pricing.filter((_, x) => x !== i))
                  }
                >
                  <FiTrash2 />
                </button>
                <input
                  className="w-full mb-2 p-3 rounded-xl bg-white font-black"
                  placeholder="Plan Name"
                  value={plan.name}
                  onChange={e => {
                    const p = [...current.pricing];
                    p[i].name = e.target.value;
                    updateField("pricing", p);
                  }}
                />
                <input
                  className="w-full mb-2 p-3 rounded-xl bg-white font-black text-blue-600"
                  placeholder="Price"
                  value={plan.price}
                  onChange={e => {
                    const p = [...current.pricing];
                    p[i].price = e.target.value;
                    updateField("pricing", p);
                  }}
                />
                <textarea
                  rows={3}
                  className="w-full p-3 rounded-xl bg-white text-xs font-bold"
                  placeholder="Perks (comma separated)"
                  value={plan.perks}
                  onChange={e => {
                    const p = [...current.pricing];
                    p[i].perks = e.target.value;
                    updateField("pricing", p);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ================= COMBO TABLE ================= */}
        {activeTab === "combo" && (
          <div className="bg-white p-8 rounded-3xl border shadow-sm">
            <h3 className="text-xs font-black text-blue-600 uppercase mb-4">
              Combo Comparison Table
            </h3>

            {current.comparisonTable.rows.map((row, r) => (
              <div key={r} className="flex gap-2 mb-2">
                <input
                  className="flex-1 p-2 bg-gray-50 rounded-xl"
                  placeholder="Feature"
                  value={row.label}
                  onChange={e => {
                    const rows = [...current.comparisonTable.rows];
                    rows[r].label = e.target.value;
                    updateField("comparisonTable.rows", rows);
                  }}
                />
                {row.values.map((v, c) => (
                  <select
                    key={c}
                    className="p-2 bg-gray-50 rounded-xl"
                    value={v}
                    onChange={e => {
                      const rows = [...current.comparisonTable.rows];
                      rows[r].values[c] =
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value;
                      updateField("comparisonTable.rows", rows);
                    }}
                  >
                    <option value="true">✔</option>
                    <option value="false">✖</option>
                    <option value="Custom">Custom</option>
                  </select>
                ))}
              </div>
            ))}

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black"
              onClick={() =>
                updateField("comparisonTable.rows", [
                  ...current.comparisonTable.rows,
                  {
                    label: "",
                    values: Array(current.comparisonTable.headers.length).fill(false)
                  }
                ])
              }
            >
              + Add Feature
            </button>
          </div>
        )}

        {/* ================= FAQ ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h3 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
            <FiHelpCircle /> FAQ
          </h3>

          {current.faqs.map((faq, i) => (
            <div key={i} className="mb-3">
              <input
                className="w-full mb-1 p-2 bg-gray-50 rounded-xl font-bold"
                placeholder="Question"
                value={faq.q}
                onChange={e => {
                  const f = [...current.faqs];
                  f[i].q = e.target.value;
                  updateField("faqs", f);
                }}
              />
              <textarea
                rows={2}
                className="w-full p-2 bg-gray-50 rounded-xl"
                placeholder="Answer"
                value={faq.a}
                onChange={e => {
                  const f = [...current.faqs];
                  f[i].a = e.target.value;
                  updateField("faqs", f);
                }}
              />
            </div>
          ))}

          <button
            className="mt-4 px-4 py-2 bg-gray-100 rounded-xl text-xs font-black"
            onClick={() =>
              updateField("faqs", [...current.faqs, { q: "", a: "" }])
            }
          >
            <FiPlus /> Add FAQ
          </button>
        </div>
      </div>

      {/* ================= SAVE BUTTON ================= */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-5 bg-blue-600 text-white rounded-full font-black shadow-xl hover:scale-105 transition"
        >
          {saving ? <FiLoader className="animate-spin mx-auto" /> : <FiSave />}
          {saving ? " Saving..." : " Save All Changes"}
        </button>
      </div>
    </section>
  );
}