"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Calendar, Package, Loader2, ArrowLeft, Edit3, X, Settings2 } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CouponManagement() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    type: "fixed",
    value: "",
    applicableProducts: [],
    expiryDate: "",
  });

  useEffect(() => {
    fetch("/api/admin/products/list")
      .then((res) => res.json())
      .then((data) => setProducts(data));
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons/list");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      setCoupons([]);
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.applicableProducts.length === 0) {
      return Swal.fire("Error", "Select products", "warning");
    }

    setLoading(true);


    const submissionData = {
      ...form,
      expiryDate: form.expiryDate ? `${form.expiryDate}T23:59:59` : ""
    };

    const url = editingId ? `/api/admin/coupons/${editingId}` : `/api/admin/coupons/create`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData), 
      });

      if (res.ok) {
        Swal.fire({
          title: "Success",
          text: editingId ? "Coupon updated successfully!" : "Coupon created successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        resetForm();
        fetchCoupons();
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.error || "Failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {

    setForm({ 
      code: "", 
      type: "fixed", 
      value: "", 
      applicableProducts: [], 
      expiryDate: "" 
    });
    setEditingId(null);
  };

// edit
  const handleEdit = (coupon) => {
  setEditingId(coupon._id);
  

  const dateObj = new Date(coupon.expiryDate);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  setForm({
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    applicableProducts: coupon.applicableProducts,
    expiryDate: formattedDate,
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
      title: "Delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire("Deleted!", "", "success");
          fetchCoupons();
        }
      } catch (err) {
        Swal.fire("Error", "Failed", "error");
      }
    }
  };

  const showLinkedProducts = (coupon) => {
    const linkedIds = coupon.applicableProducts;
    const linkedItems = products.filter(p => linkedIds.includes(p._id));
    
    const content = linkedItems.map(p => `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; padding: 10px; background: #fff; border-radius: 12px; border: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${p.thumbnail}" style="width: 35px; height: 35px; border-radius: 6px; object-fit: cover;" />
          <div style="text-align: left;">
            <div style="font-size: 10px; font-weight: 800; color: #333; text-transform: uppercase;">${p.title.slice(0,15)}...</div>
          </div>
        </div>
        <button onclick="window.manageCouponProduct('${coupon._id}', '${p._id}')" style="background: #000; color: #fff; border: none; padding: 5px 10px; border-radius: 6px; font-size: 8px; font-weight: 900; cursor: pointer; text-transform: uppercase;">Edit</button>
      </div>
    `).join('');

    window.manageCouponProduct = (cId, pId) => {
      const selectedCoupon = coupons.find(c => c._id === cId);
      if(selectedCoupon) {
          handleEdit(selectedCoupon);
          Swal.close();
      }
    };

    Swal.fire({
      title: '<span style="font-size: 12px; font-weight: 900; text-transform: uppercase;">Products</span>',
      html: `<div style="max-height: 250px; overflow-y: auto; padding: 2px;">${linkedItems.length > 0 ? content : 'Empty'}</div>`,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'rounded-[2rem]' },
      width: '90%' 
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-3 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">Coupon Master</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Offers Management</p>
          </div>
          <Link href="/admin/dashboard" className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 bg-white px-4 py-2 rounded-full w-fit shadow-sm border border-gray-100">
            <ArrowLeft size={12} /> Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create/Update Form - Full width on Mobile, 4 columns on desktop */}
          <div className="lg:col-span-4 order-1 lg:order-1">
            <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm sticky top-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-black text-gray-800 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Tag size={16} className={editingId ? "text-orange-500" : "text-blue-600"} /> 
                  {editingId ? "Update" : "New Coupon"}
                </h2>
                {editingId && (
                  <button onClick={resetForm} className="bg-red-50 text-red-500 p-1.5 rounded-full hover:bg-red-100 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Promo Code</label>
                  <input required type="text" placeholder="SAVE50" className="w-full border border-gray-50 bg-gray-50 rounded-xl p-3.5 text-xs font-bold uppercase focus:ring-2 focus:ring-blue-500 outline-none" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Type</label>
                    <select className="w-full border border-gray-50 bg-gray-50 rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="fixed">৳ Fixed</option>
                      <option value="percentage">% Percent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Value</label>
                    <input required type="number" placeholder="0" className="w-full border border-gray-50 bg-gray-50 rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Expiry Date</label>
                  <input required type="date" className="w-full border border-gray-50 bg-gray-50 rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-1 mb-2 block">Apply to Products</label>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                    {products
                      .map(p => ({ ...p, isSelected: form.applicableProducts.includes(p._id) }))
                      .sort((a, b) => b.isSelected - a.isSelected)
                      .map((p) => (
                      <div key={p._id} onClick={() => toggleProduct(p._id)} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${p.isSelected ? "border-blue-500 bg-blue-50" : "border-gray-50 bg-gray-50 hover:bg-gray-100"}`}>
                        <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img src={p.thumbnail} className="object-cover w-full h-full" alt="" />
                        </div>
                        <span className={`text-[9px] font-black truncate flex-1 ${p.isSelected ? "text-blue-700" : "text-gray-600"}`}>{p.title}</span>
                        {p.isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                      </div>
                    ))}
                  </div>
                </div>

                <button disabled={loading} className={`w-full ${editingId ? "bg-orange-500" : "bg-black"} text-white font-black text-[10px] uppercase tracking-[2px] py-4 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2`}>
                  {loading ? <Loader2 className="animate-spin" size={14} /> : (editingId ? "Update Now" : "Create Coupon")}
                </button>
              </form>
            </div>
          </div>

          {/* List Section - Full width on Mobile, 8 columns on desktop */}
          <div className="lg:col-span-8 order-2 lg:order-2 space-y-4">
            <h2 className="font-black text-gray-800 text-[10px] uppercase tracking-widest flex items-center gap-2 px-2">
              <Package size={16} className="text-orange-500" /> Active Coupons
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div key={c._id} className="bg-white p-4 md:p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-black text-xs tracking-wider uppercase">
                      {c.code}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(c)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                       <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Off</p>
                       <p className="text-sm font-black text-gray-900">{c.type === 'fixed' ? `৳${c.value}` : `${c.value}%`}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl">
                       <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Expiry</p>
                       <p className="text-[10px] font-black text-red-500 truncate">{new Date(c.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => showLinkedProducts(c)}
                    className="w-full text-[9px] font-black text-blue-600 bg-blue-50/50 border border-blue-100/50 py-2.5 rounded-xl uppercase flex justify-center items-center gap-2 hover:bg-blue-100 transition-colors"
                  >
                    <span>{c.applicableProducts?.length || 0} Linked Products</span>
                    <Settings2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {coupons.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                No active coupons
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}