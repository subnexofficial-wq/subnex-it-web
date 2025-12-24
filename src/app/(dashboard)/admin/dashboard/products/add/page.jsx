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
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    category: "",
    quantity: "",
    thumbnail: "",
    highlights: [],
    fullDescription: "",
    active: true,
    featured: false,
    variants: [{ duration: "", price: "" }], 
    storageSize: "", 
  });

  // --- Variant Handlers ---
  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { duration: "", price: "" }],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = form.variants.filter((_, i) => i !== index);
    setForm({ ...form, variants: updatedVariants });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index][field] = value;
    setForm({ ...form, variants: updatedVariants });
  };

  // --- ImgBB Image Upload Logic ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, thumbnail: data.data.url });
      } else {
        Swal.fire("Error", "Image upload failed!", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Error uploading image", "error");
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
    if (!form.title) return Swal.fire("Required", "Please add a title", "warning");
    if (!form.thumbnail) return Swal.fire("Required", "Please upload a thumbnail", "warning");
    if (!form.category) return Swal.fire("Required", "Please select a category", "warning");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", "Product added successfully!", "success");
        // ফর্ম রিসেট করতে চাইলে এখানে করতে পারেন
      } else {
        Swal.fire("Error", data.error || "Something went wrong", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-800 text-sm";
  const labelStyle = "block text-sm font-semibold text-gray-600 mb-1.5";

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href={"/admin/dashboard/products"} className="text-gray-500 flex items-center gap-1 text-xs hover:text-blue-600 transition-colors mb-1 uppercase font-bold tracking-widest">
              <ArrowLeft size={14} /> Back
            </Link>
            <h1 className="text-xl font-black text-gray-900 uppercase">Create Product</h1>
          </div>
          <button onClick={handleSubmit} disabled={loading || uploading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Publish
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Information */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <h2 className="font-black text-gray-800 text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                Basic Info
              </h2>
              <div>
                <label className={labelStyle}>Product Title *</label>
                <input required type="text" placeholder="e.g. Netflix Premium Shared" className={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div>
                <label className={labelStyle}>Full Description</label>
                <textarea rows={4} placeholder="Product details and terms..." className={inputStyle} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} />
              </div>
            </div>

            {/* Variants Section - API REQUIRED */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="font-black text-gray-800 text-sm uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  Pricing Plans *
                </h2>
                <button type="button" onClick={addVariant} className="text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all">
                  + Add Plan
                </button>
              </div>
              
              <div className="space-y-3">
                {form.variants.map((variant, index) => (
                  <div key={index} className="flex gap-3 items-end p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Duration</label>
                      <input required type="text" placeholder="1 Month" className={inputStyle} value={variant.duration} onChange={(e) => handleVariantChange(index, "duration", e.target.value)} />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Price (৳)</label>
                      <input required type="number" placeholder="500" className={inputStyle} value={variant.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)} />
                    </div>
                    {form.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(index)} className="p-3 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-black text-gray-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-5">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                Highlights
              </h2>
              <div className="flex gap-2 mb-4">
                <input type="text" value={highlightsInput} placeholder="e.g. Ultra HD 4K" className={inputStyle} onChange={(e) => setHighlightsInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())} />
                <button type="button" onClick={addHighlight} className="bg-gray-900 text-white px-4 rounded-xl hover:bg-black transition-all">
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.highlights.map((h, i) => (
                  <div key={i} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-gray-100">
                    <CheckCircle2 size={14} className="text-green-500" /> {h}
                    <button type="button" onClick={() => removeHighlight(i)}><X size={14} className="text-gray-400 hover:text-red-500" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-black text-gray-800 text-sm uppercase tracking-widest mb-4">Thumbnail</h2>
              <div className={`relative border-2 border-dashed rounded-2xl transition-all ${form.thumbnail ? 'border-blue-100 bg-blue-50/20' : 'border-gray-100 hover:border-blue-200'}`}>
                {uploading ? (
                  <div className="py-10 flex flex-col items-center"><Loader2 className="animate-spin text-blue-500 mb-2" /><p className="text-[10px] font-bold text-gray-400 uppercase">Uploading...</p></div>
                ) : form.thumbnail ? (
                  <div className="p-2">
                    <img src={form.thumbnail} alt="Preview" className="rounded-xl w-full h-auto object-cover border" />
                    <button type="button" onClick={() => setForm({ ...form, thumbnail: "" })} className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"><X size={14} /></button>
                  </div>
                ) : (
                  <label className="cursor-pointer py-10 flex flex-col items-center">
                    <ImageIcon size={24} className="text-blue-500 mb-2" />
                    <span className="text-[10px] font-black text-gray-400 uppercase">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <label className={labelStyle}>Category *</label>
              <select required className={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select</option>
                <option value="streaming">Streaming</option>
                <option value="google-drive">Google Drive</option>
                <option value="software">Software</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>

            {/* Conditional Google Drive Field */}
            {form.category === "google-drive" && (
              <div className="bg-orange-50/30 p-6 rounded-3xl border border-orange-100 shadow-sm">
                <label className="block text-xs font-black text-orange-600 uppercase mb-2 tracking-widest">Storage Size</label>
                <input type="text" placeholder="e.g. 100GB" className={inputStyle} value={form.storageSize} onChange={(e) => setForm({ ...form, storageSize: e.target.value })} />
              </div>
            )}

            {/* Inventory & Status */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className={labelStyle}>Stock Quantity</label>
                <input type="number" value={form.quantity} placeholder="Unlimited" className={inputStyle} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              
              <div className="pt-2 space-y-2">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <span className="text-xs font-bold text-gray-600 uppercase">Active</span>
                  <input type="checkbox" checked={form.active} className="w-4 h-4 accent-blue-600" onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <span className="text-xs font-bold text-gray-600 uppercase">Featured</span>
                  <input type="checkbox" checked={form.featured} className="w-4 h-4 accent-blue-600" onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}