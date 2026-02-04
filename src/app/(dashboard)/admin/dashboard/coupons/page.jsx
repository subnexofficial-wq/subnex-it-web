"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Calendar, Package, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CouponManagement() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    type: "fixed", // 'fixed' or 'percentage'
    value: "",
    applicableProducts: [],
    expiryDate: "",
  });

  // প্রোডাক্ট লিস্ট আনা (যাতে কুপন অ্যাসাইন করা যায়)
  useEffect(() => {
    fetch("/api/admin/products/list")
      .then((res) => res.json())
      .then((data) => setProducts(data));
    
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await fetch("/api/admin/coupons/list"); 
    const data = await res.json();
    setCoupons(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.applicableProducts.length === 0) return Swal.fire("Error", "Select at least one product", "warning");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        Swal.fire("Success", "Coupon created!", "success");
        setForm({ code: "", type: "fixed", value: "", applicableProducts: [], expiryDate: "" });
        fetchCoupons();
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (id) => {
    const current = [...form.applicableProducts];
    if (current.includes(id)) {
      setForm({ ...form, applicableProducts: current.filter((p) => p !== id) });
    } else {
      setForm({ ...form, applicableProducts: [...current, id] });
    }
  };
  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This coupon will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire("Deleted!", "Coupon has been removed.", "success");
        fetchCoupons(); 
      }
    } catch (err) {
      Swal.fire("Error", "Failed to delete coupon", "error");
    }
  }
};

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Coupon Master</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Manage Discounts & Offers</p>
          </div>
          <Link href="/admin/dashboard" className="flex items-center gap-1 text-xs font-bold uppercase text-gray-500 hover:text-blue-600">
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Coupon Form */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm h-fit">
            <h2 className="font-black text-gray-800 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Tag size={18} className="text-blue-600" /> New Coupon
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Promo Code</label>
                <input required type="text" placeholder="SAVE50" className="w-full border border-gray-100 rounded-2xl p-4 text-sm font-bold uppercase focus:ring-2 focus:ring-blue-500 outline-none" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Type</label>
                  <select className="w-full border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="fixed">Fixed (৳)</option>
                    <option value="percentage">Percent (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Value</label>
                  <input required type="number" placeholder="50" className="w-full border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Expiry Date</label>
                <input required type="date" className="w-full border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-2 block">Apply to Products</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {products.map((p) => (
                    <div key={p._id} onClick={() => toggleProduct(p._id)} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.applicableProducts.includes(p._id) ? "border-blue-500 bg-blue-50" : "border-gray-50 bg-gray-50"}`}>
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={p.thumbnail} className="object-cover w-full h-full" alt="" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 truncate">{p.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button disabled={loading} className="w-full bg-gray-900 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Coupon"}
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          {/* Active Coupons List */}
<div className="lg:col-span-2 space-y-4">
  <h2 className="font-black text-gray-800 text-sm uppercase tracking-widest flex items-center gap-2">
    <Package size={18} className="text-orange-500" /> Active Coupons
  </h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {coupons.map((c) => (
      <div key={c._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative group">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-sm tracking-tighter">
            {c.code}
          </div>
          
          {/* এই বাটনটি ডিলিট কাজ করবে */}
          <button 
            onClick={() => handleDelete(c._id)} 
            className="text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase">
            <span>Discount:</span>
            <span className="text-gray-900">{c.type === 'fixed' ? `৳${c.value}` : `${c.value}%`}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase">
            <span>Expiry:</span>
            <span className="text-red-500 flex items-center gap-1">
              <Calendar size={12} /> {new Date(c.expiryDate).toLocaleDateString()}
            </span>
          </div>
          <div className="pt-3 border-t border-dashed flex gap-1 flex-wrap">
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">
                  {c.applicableProducts?.length} Products Linked
              </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  );
}