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
    { title: "", desc: "", image: "" },
    { title: "", desc: "", image: "" },
    { title: "", desc: "", image: "" }
  ],

  /* ✅ FIX: features added */
  features: [],

  pricing: [
    {
      name: "",
      price: "",
      perks: "",
      pricingType: "price",
      whatsapp: "",
      coupon: {
        code: "",
        type: "",
        value: ""
      }
    }
  ],

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
          formatted[item.category] = {
            ...emptyCategory(item.category),
            ...item
          };
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
     IMAGE UPLOAD
  ======================= */
  const handleWorkflowImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.success) {
        const w = [...current.workflow];
        w[index].image = data.data.url;
        updateField("workflow", w);
      } else {
        Swal.fire("Error", "Image upload failed", "error");
      }
    } catch {
      Swal.fire("Error", "Image upload error", "error");
    }
  };

  /* =======================
     SAVE
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
      <div className="h-screen flex items-center justify-center text-blue-600 font-bold">
        <FiLoader className="animate-spin text-4xl mr-3" />
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
             <div key={i} className="bg-white p-6 rounded-3xl border space-y-3">
  {/* Step Title */}
  <input
    className="w-full p-3 bg-gray-50 rounded-xl font-bold"
    placeholder="Step Title"
    value={step.title}
    onChange={e => {
      const w = [...current.workflow];
      w[i].title = e.target.value;
      updateField("workflow", w);
    }}
  />

  {/* Step Description (textarea থাকবে) */}
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

  {/* Step Image */}
  {step.image ? (
    <div className="relative">
      <img
        src={step.image}
        alt="step"
        className="w-full rounded-xl border object-cover"
      />
      <button
        type="button"
        onClick={() => {
          const w = [...current.workflow];
          w[i].image = "";
          updateField("workflow", w);
        }}
        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
      >
        ✕
      </button>
    </div>
  ) : (
    <label className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl cursor-pointer text-xs font-bold hover:bg-gray-200">
      <FiImage /> Upload Image
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleWorkflowImageUpload(e, i)}
      />
    </label>
  )}
</div>
            ))}
          </div>
        </div>
        {/* ================= FEATURES / INPUT FLOW ================= */}
<div className="bg-white p-8 rounded-3xl border shadow-sm">
  <h3 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
    <FiLayers /> Feature Flow (Public Explain)
  </h3>

  {current.features?.map((item, i) => (
    <div
      key={i}
      className="mb-4 p-4 bg-gray-50 rounded-2xl relative space-y-2"
    >
      {/* DELETE */}
      <button
        className="absolute top-3 right-3 text-red-400"
        onClick={() =>
          updateField(
            "features",
            current.features.filter((_, x) => x !== i)
          )
        }
      >
        <FiTrash2 />
      </button>

      {/* ICON TYPE */}
      <select
        className="w-full p-2 rounded-xl font-bold text-xs"
        value={item.icon}
        onChange={(e) => {
          const f = [...current.features];
          f[i].icon = e.target.value;
          updateField("features", f);
        }}
      >
        <option value="sheet">Google Sheet</option>
        <option value="telegram">Telegram Message</option>
        <option value="ai">AI Generation</option>
        <option value="output">Final Output</option>
      </select>

      {/* TITLE */}
      <input
        className="w-full p-3 rounded-xl font-bold"
        placeholder="Feature Title"
        value={item.title}
        onChange={(e) => {
          const f = [...current.features];
          f[i].title = e.target.value;
          updateField("features", f);
        }}
      />

      {/* DESCRIPTION */}
      <textarea
        rows={3}
        className="w-full p-3 rounded-xl text-sm"
        placeholder="Feature Description"
        value={item.desc}
        onChange={(e) => {
          const f = [...current.features];
          f[i].desc = e.target.value;
          updateField("features", f);
        }}
      />
    </div>
  ))}

  <button
    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black"
    onClick={() =>
      updateField("features", [
        ...(current.features || []),
        { title: "", desc: "", icon: "sheet" },
      ])
    }
  >
    <FiPlus /> Add Feature Step
  </button>
</div>

        {/* ================= PRICING ================= */}
      {/* ================= PRICING ================= */}
<div className="bg-white p-8 rounded-3xl border shadow-sm">
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2">
      <FiDollarSign /> Pricing Plans
    </h3>
    <button
      onClick={() =>
        updateField("pricing", [
          ...current.pricing,
          {
            name: "",
            price: "",
            perks: "",
            pricingType: "price",
            whatsapp: "",
            coupon: { code: "", type: "", value: "" }
          }
        ])
      }
      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black"
    >
      <FiPlus /> Add Plan
    </button>
  </div>

  <div className="grid md:grid-cols-2 gap-6">
    {current.pricing.map((plan, i) => (
      <div
        key={i}
        className="bg-gray-50 p-6 rounded-3xl relative space-y-3 border"
      >
        {/* DELETE */}
        <button
          className="absolute top-4 right-4 text-red-400"
          onClick={() =>
            updateField(
              "pricing",
              current.pricing.filter((_, x) => x !== i)
            )
          }
        >
          <FiTrash2 />
        </button>

        {/* PLAN NAME */}
        <input
          className="w-full p-3 rounded-xl bg-white font-black text-lg"
          placeholder="Plan Name"
          value={plan.name}
          onChange={(e) => {
            const p = [...current.pricing];
            p[i].name = e.target.value;
            updateField("pricing", p);
          }}
        />

      {/* ===== PRICING TYPE ===== */}
<select
  className="w-full mb-2 p-3 rounded-xl bg-white font-bold text-xs"
  value={plan.pricingType || "price"}
  onChange={(e) => {
    const p = [...current.pricing];
    p[i].pricingType = e.target.value;
    updateField("pricing", p);
  }}
>
  <option value="price">💰 Fixed Price</option>
  <option value="contact">📞 Contact Us</option>
</select>

{/* ===== FIXED PRICE INPUT ===== */}
{plan.pricingType === "price" && (
  <input
    type="number"
    className="w-full mb-2 p-3 rounded-xl bg-white font-black text-blue-600"
    placeholder="Amount (৳)"
    value={plan.price}
    onChange={(e) => {
      const p = [...current.pricing];
      p[i].price = e.target.value;
      updateField("pricing", p);
    }}
  />
)}

{/* ===== CONTACT US (WHATSAPP LINK / NUMBER) ===== */}
{plan.pricingType === "contact" && (
  <input
    className="w-full mb-2 p-3 rounded-xl bg-white font-bold text-green-600"
    placeholder="WhatsApp Number or Link (8801XXXXXXXXX)"
    value={plan.whatsapp || ""}
    onChange={(e) => {
      const p = [...current.pricing];
      p[i].whatsapp = e.target.value;
      updateField("pricing", p);
    }}
  />
)}

        {/* PERKS */}
        <textarea
          rows={3}
          className="w-full p-3 rounded-xl bg-white text-xs font-bold"
          placeholder="Perks (comma separated)"
          value={plan.perks}
          onChange={(e) => {
            const p = [...current.pricing];
            p[i].perks = e.target.value;
            updateField("pricing", p);
          }}
        />

        {/* COUPON BOX */}
        {plan.pricingType === "price" && (
          <div className="mt-2 p-3 bg-blue-50 rounded-2xl space-y-2">
            <p className="text-xs font-black text-blue-600 uppercase">
              Coupon Settings
            </p>

            <input
              className="w-full p-2 rounded-xl bg-white text-xs font-bold"
              placeholder="Coupon Code (SAVE10)"
              value={plan.coupon?.code || ""}
              onChange={(e) => {
                const p = [...current.pricing];
                p[i].coupon = { ...p[i].coupon, code: e.target.value };
                updateField("pricing", p);
              }}
            />

            <select
              className="w-full p-2 rounded-xl bg-white text-xs font-bold"
              value={plan.coupon?.type || ""}
              onChange={(e) => {
                const p = [...current.pricing];
                p[i].coupon = { ...p[i].coupon, type: e.target.value };
                updateField("pricing", p);
              }}
            >
              <option value="">No Coupon</option>
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat Amount (৳)</option>
            </select>

            {plan.coupon?.type && (
              <input
                type="number"
                min={1}
                className="w-full p-2 rounded-xl bg-white text-xs font-bold"
                placeholder={
                  plan.coupon.type === "percent"
                    ? "Discount %"
                    : "Discount Amount"
                }
                value={plan.coupon?.value || ""}
                onChange={(e) => {
                  const p = [...current.pricing];
                  p[i].coupon = {
                    ...p[i].coupon,
                    value: Number(e.target.value)
                  };
                  updateField("pricing", p);
                }}
              />
            )}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

        {/* ================= COMBO TABLE ================= */}
{activeTab === "combo" && (
  <div className="bg-white p-8 rounded-3xl border shadow-sm overflow-x-auto">
    <h3 className="text-xs font-black text-blue-600 uppercase mb-6">
      Combo Comparison Table
    </h3>

    <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
      {/* HEADER */}
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-3 text-left font-black">Feature</th>
          {current.comparisonTable.headers.map((h, i) => (
            <th key={i} className="border p-3 font-black text-center">
              {h}
            </th>
          ))}
          <th className="border p-3 text-center font-black">Action</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {current.comparisonTable.rows.map((row, r) => (
          <tr key={r} className="odd:bg-white even:bg-gray-50">
            {/* Feature name */}
            <td className="border p-2">
              <input
                className="w-full p-2 bg-transparent outline-none font-bold"
                placeholder="Feature name"
                value={row.label}
                onChange={e => {
                  const rows = [...current.comparisonTable.rows];
                  rows[r].label = e.target.value;
                  updateField("comparisonTable.rows", rows);
                }}
              />
            </td>

            {/* Values */}
            {row.values.map((cell, c) => (
              <td key={c} className="border p-2 text-center space-y-1">
                {/* TYPE SELECT */}
                <select
                  className="p-1 rounded-lg bg-gray-50 font-bold text-xs"
                  value={cell.type}
                  onChange={e => {
                    const rows = [...current.comparisonTable.rows];
                    const type = e.target.value;

                    rows[r].values[c] =
                      type === "number"
                        ? { type: "number", value: 1 }
                        : { type };

                    updateField("comparisonTable.rows", rows);
                  }}
                >
                  <option value="true">✔ Yes</option>
                  <option value="false">✖ No</option>
                  <option value="number">Number</option>
                </select>

                {/* NUMBER INPUT */}
                {cell.type === "number" && (
                  <input
                    type="number"
                    min={1}
                    className="w-20 text-center p-1 rounded-lg border font-bold"
                    value={cell.value}
                    onChange={e => {
                      const rows = [...current.comparisonTable.rows];
                      rows[r].values[c].value = Number(e.target.value);
                      updateField("comparisonTable.rows", rows);
                    }}
                  />
                )}
              </td>
            ))}

            {/* DELETE ROW */}
            <td className="border p-2 text-center">
              <button
                className="text-red-500 font-black"
                onClick={() => {
                  const rows = current.comparisonTable.rows.filter(
                    (_, i) => i !== r
                  );
                  updateField("comparisonTable.rows", rows);
                }}
              >
                ✕
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* ADD ROW */}
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black"
      onClick={() =>
        updateField("comparisonTable.rows", [
          ...current.comparisonTable.rows,
          {
            label: "",
            values: current.comparisonTable.headers.map(() => ({
              type: "false"
            }))
          }
        ])
      }
    >
      + Add Row
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