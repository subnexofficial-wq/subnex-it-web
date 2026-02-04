"use client";

import { useState } from "react";
import { X, Loader2, Save, Tag, Clock, AlignLeft, ListPlus, Plus,  Database, Percent } from "lucide-react";

export default function EditProductModal({ product, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState("");
  
  const [form, setForm] = useState({
    title: product.title || "",
    category: product.category || "",
    // মেইন প্রাইসগুলো এখন ভেরিয়েন্ট থেকেই হ্যান্ডেল হবে, তবে ব্যাকআপ হিসেবে রাখা হয়েছে
    regularPrice: product.regularPrice || "",
    discountPrice: product.discountPrice || "", 
    quantity: product.quantity || "",
    validity: product.validity || "",
    highlights: product.highlights || [],
    fullDescription: product.fullDescription || "",
    active: product.active ?? true,
    featured: product.featured ?? false,
    storageSize: product.storageSize || "",
    // ভেরিয়েন্টের ভেতর discountPrice যোগ করা হয়েছে
    variants: product.variants || [{ duration: "", price: "", discountPrice: "" }],
    isDownloadable: product.isDownloadable ?? false,
  downloadLink: product.downloadLink || "",
  couponCode: product.couponCode || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // --- Variant Handlers ---
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index][field] = value;
    setForm({ ...form, variants: updatedVariants });
  };

  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { duration: "", price: "", discountPrice: "" }] });
  };

  const removeVariant = (index) => {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) });
  };

  const addHighlight = () => {
    if (highlightsInput.trim()) {
      setForm({ ...form, highlights: [...form.highlights, highlightsInput.trim()] });
      setHighlightsInput("");
    }
  };

  const removeHighlight = (index) => {
    setForm({ ...form, highlights: form.highlights.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalData = {
      ...form,
      regularPrice: Number(form.regularPrice),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
      // ভেরিয়েন্টের প্রাইসগুলোকেও নাম্বার ফরম্যাটে পাঠানো হচ্ছে
      variants: form.variants.map(v => ({
        duration: v.duration,
        price: Number(v.price),
        discountPrice: v.discountPrice ? Number(v.discountPrice) : 0
      }))
    };

    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        onUpdated();
        onClose();
      } else {
        const errData = await res.json();
        alert(errData.error || "Update failed");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-700";
  const labelClass = "text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50/80 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Product</h2>
            <p className="text-xs text-gray-500 mt-0.5 tracking-wide uppercase font-bold">New Version: Multi-Pricing Support</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-md transition-colors"><X size={20}/></button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}><Tag size={16}/> Product Title</label>
              <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}><ListPlus size={16}/> Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                 <option value="digital-product">Digital product</option>
                <option value="service">Service</option>
                <option value="subscription">Subscription</option>
                <option value="course">Course</option>
                <option value="automation">Automation</option>
                <option value="custom-solution">Custom solution</option>
              </select>
            </div>
          </div>

          {/* DURATION & PRICING ARRAY (With Discount) */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-blue-800 flex items-center gap-2 uppercase">
                <Clock size={16}/> Subscription Plans
              </label>
              <button type="button" onClick={addVariant} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-blue-700 font-bold uppercase transition-all shadow-sm">
                <Plus size={14}/> Add New Plan
              </button>
            </div>
            
            {form.variants.map((v, i) => (
              <div key={i} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm relative space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Duration</span>
                    <input placeholder="e.g. 1 Month" className={inputClass} value={v.duration} onChange={(e) => handleVariantChange(i, "duration", e.target.value)} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Regular Price (৳)</span>
                    <input placeholder="Price" type="number" className={inputClass} value={v.price} onChange={(e) => handleVariantChange(i, "price", e.target.value)} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">Offer Price (৳) </span>
                    <input placeholder="Discounted" type="number" className={`${inputClass} border-red-100 focus:border-red-500`} value={v.discountPrice} onChange={(e) => handleVariantChange(i, "discountPrice", e.target.value)} />
                  </div>
                </div>
                {form.variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-all"><X size={14}/></button>
                )}
              </div>
            ))}
          </div>

          {/* Storage Size & Other Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.category === "google-drive" && (
              <div>
                <label className={labelClass}><Database size={16}/> Storage Size</label>
                <input name="storageSize" value={form.storageSize} onChange={handleChange} className={inputClass} placeholder="e.g. 100GB" />
              </div>
            )}
            <div>
              <label className={labelClass}><Clock size={16}/> Global Validity (Backup)</label>
              <input name="validity" value={form.validity} onChange={handleChange} className={inputClass} placeholder="e.g. 30 Days" />
            </div>
          </div>

          {/* Highlights & Description */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Key Features</label>
              <div className="flex gap-2 mb-2">
                <input value={highlightsInput} onChange={(e) => setHighlightsInput(e.target.value)} className={inputClass} placeholder="Type feature and press Enter" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())} />
                <button type="button" onClick={addHighlight} className="bg-gray-800 text-white px-4 rounded-lg text-sm font-bold">ADD</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.highlights.map((h, i) => (
                  <span key={i} className="bg-gray-100 border px-2 py-1 rounded text-xs flex items-center gap-1 font-medium">
                    {h} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeHighlight(i)} />
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}><AlignLeft size={16}/> Full Description</label>
              <textarea name="fullDescription" rows={2} value={form.fullDescription} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="flex gap-6 border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm"><input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> Active</label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured</label>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Downloadable Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-700 mb-2">
              <input 
                type="checkbox" 
                name="isDownloadable" 
                checked={form.isDownloadable} 
                onChange={handleChange} 
                className="w-4 h-4 text-blue-600"
              /> 
              Is Downloadable Product?
            </label>
            {form.isDownloadable && (
              <input 
                name="downloadLink" 
                value={form.downloadLink} 
                onChange={handleChange} 
                className={inputClass} 
                placeholder="Paste Download Link Here" 
              />
            )}
          </div>

          {/* Coupon Code */}
          <div>
            <label className={labelClass}><Percent size={16}/> Secret Coupon (Optional)</label>
            <input 
              name="couponCode" 
              value={form.couponCode} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="e.g. SAVE50" 
            />
          </div>
        </div>
      </div>
              </form>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 uppercase">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-black flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md uppercase">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update Product
          </button>
        </div>
      </div>
    </div>
  );
}