"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    regularPrice: "",
    discountPrice: "",
    quantity: "",
    validity: "",
    thumbnail: "",
    highlights: [],
    fullDescription: "",
    active: true,
    featured: false,
  });

  // --- ImgBB Image Upload Logic ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = "2a7b43ffea25ada6231fbb6c2fa5820b"; 
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, thumbnail: data.data.url });
      } else {
        alert("Upload failed!");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const addHighlight = () => {
    if (highlightsInput.trim()) {
      setForm({
        ...form,
        highlights: [...form.highlights, highlightsInput.trim()],
      });
      setHighlightsInput("");
    }
  };

  const removeHighlight = (index) => {
    setForm({
      ...form,
      highlights: form.highlights.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.title) return alert("Please add a title");
    if (!form.thumbnail) return alert("Please upload a thumbnail first");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product added successfully!");
        // Reset form after success if needed
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-800";
  const labelStyle = "block text-sm font-semibold text-gray-600 mb-1.5";

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      {/* --- Header Section --- */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link  href={"/admin/dashboard/products"}
             className="text-gray-500 flex items-center gap-1 text-sm hover:text-blue-600 transition-colors mb-1">
              <ArrowLeft size={16} /> Back to Products
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Essential Info */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                General Information
              </h2>
              
              <div>
                <label className={labelStyle}>Product Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Adobe Creative Cloud Premium"
                  className={inputStyle}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className={labelStyle}>Full Description</label>
                <textarea
                  rows={6}
                  placeholder="Provide a detailed breakdown of the product..."
                  className={inputStyle}
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                />
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-5">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelStyle}>Regular Price (৳)</label>
                  <input
                    required
                    type="number"
                    value={form.regularPrice}
                    className={inputStyle}
                    onChange={(e) => setForm({ ...form, regularPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Discount Price (৳)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    className={inputStyle}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Stock Quantity</label>
                  <input
                    type="number"
                    value={form.quantity}
                    placeholder="Unlimited if empty"
                    className={inputStyle}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Validity Period</label>
                  <input
                    type="text"
                    value={form.validity}
                    placeholder="e.g. Lifetime / 1 Year"
                    className={inputStyle}
                    onChange={(e) => setForm({ ...form, validity: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-5">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Key Highlights
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={highlightsInput}
                  placeholder="e.g. 4K Ultra HD Streaming"
                  className={inputStyle}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="bg-gray-900 text-white px-5 rounded-xl hover:bg-black transition-all flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {form.highlights.map((h, i) => (
                  <div key={i} className="bg-blue-50/50 text-blue-700 px-4 py-2.5 rounded-xl text-sm flex items-center justify-between border border-blue-100 group">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0" /> {h}
                    </span>
                    <button type="button" onClick={() => removeHighlight(i)} className="shrink-0">
                      <X size={16} className="text-blue-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Thumbnail</h2>
              <div className={`relative border-2 border-dashed rounded-2xl transition-all ${form.thumbnail ? 'border-blue-200 bg-blue-50/10' : 'border-gray-200 hover:border-blue-400'}`}>
                {uploading ? (
                  <div className="py-12 flex flex-col items-center">
                    <Loader2 className="animate-spin text-blue-500 mb-2" />
                    <p className="text-sm text-gray-500 italic">Processing...</p>
                  </div>
                ) : form.thumbnail ? (
                  <div className="p-2">
                    <img src={form.thumbnail} alt="Preview" className="rounded-xl w-full h-auto object-cover border shadow-sm" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, thumbnail: "" })}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer py-12 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                      <ImageIcon size={24} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Choose Image</span>
                    <span className="text-xs text-gray-400 mt-1">Recommended 600x600px</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <label className={labelStyle}>Category *</label>
              <select
                required
                className={inputStyle}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="streaming">Streaming</option>
                <option value="software">Software</option>
                <option value="gaming">Gaming</option>
                <option value="tools">Tools</option>
              </select>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="font-bold text-gray-800 mb-2">Visibility</h2>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Active Status</span>
                <input
                  type="checkbox"
                  checked={form.active}
                  className="w-5 h-5 accent-blue-600 rounded"
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Featured Product</span>
                <input
                  type="checkbox"
                  checked={form.featured}
                  className="w-5 h-5 accent-blue-600 rounded"
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}