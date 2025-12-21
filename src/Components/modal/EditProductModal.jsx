"use client";

import { useState } from "react";
import { X, Loader2, Save, Tag, Clock, AlignLeft, ListPlus, CheckCircle2, Star } from "lucide-react";

export default function EditProductModal({ product, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState("");
  const [form, setForm] = useState({
    title: product.title || "",
    category: product.category || "",
    regularPrice: product.regularPrice || "",
    discountPrice: product.discountPrice || "",
    quantity: product.quantity || "",
    validity: product.validity || "",
    highlights: product.highlights || [],
    fullDescription: product.fullDescription || "",
    active: product.active ?? true,
    featured: product.featured ?? false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
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
      console.error("Update Error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-gray-700";
  const labelClass = "text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50/80 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Product</h2>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              Editing: <span className="text-blue-600 font-medium">{product.title}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-md transition-colors"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Title Section */}
          <div>
            <label className={labelClass}><Tag size={16} className="text-gray-400"/> Product Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="e.g. Netflix Premium"
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}><ListPlus size={16} className="text-gray-400"/> Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option value="streaming">Streaming</option>
                <option value="software">Software</option>
                <option value="gaming">Gaming</option>
                <option value="tools">Tools</option>
              </select>
            </div>

            <div>
              <label className={labelClass}><Clock size={16} className="text-gray-400"/> Validity</label>
              <input name="validity" value={form.validity} onChange={handleChange} className={inputClass} placeholder="e.g. 30 Days" />
            </div>

            <div>
              <label className={labelClass}>Regular Price (৳)</label>
              <input name="regularPrice" type="number" value={form.regularPrice} onChange={handleChange} className={`${inputClass} font-medium`} placeholder="0.00" />
            </div>

            <div>
              <label className={labelClass}>Discount Price (৳)</label>
              <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} className={`${inputClass} font-medium text-blue-600`} placeholder="0.00" />
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className={labelClass}>Key Highlights</label>
            <div className="flex gap-2 mb-3">
              <input 
                value={highlightsInput} 
                onChange={(e) => setHighlightsInput(e.target.value)} 
                className={inputClass} 
                placeholder="Press Enter to add"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              />
              <button 
                type="button" 
                onClick={addHighlight} 
                className="bg-blue-600 text-white px-4 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="bg-white text-gray-700 px-2.5 py-1 rounded border border-gray-200 text-xs flex items-center gap-2">
                  {h} 
                  <X size={14} className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => removeHighlight(i)} />
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}><AlignLeft size={16} className="text-gray-400"/> Full Description</label>
            <textarea 
              name="fullDescription" 
              rows={3} 
              value={form.fullDescription} 
              onChange={handleChange} 
              className={`${inputClass} resize-none`} 
              placeholder="Detailed description..."
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Active Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Featured</span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-black disabled:opacity-50 transition-all shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}