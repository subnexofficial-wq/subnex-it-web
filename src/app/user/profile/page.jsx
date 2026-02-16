"use client";

import { useEffect, useState } from "react";
import { FiCamera, FiMapPin, FiMail, FiUser, FiX, FiTrash2, FiEdit3 } from "react-icons/fi";
import { countries } from "../../../../data/Country";
import { useAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2"; // SweetAlert ইম্পোর্ট করা হয়েছে
import Image from "next/image";

export default function UserProfilePage() {
  const { user, refreshUser } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    country: "Bangladesh",
    phoneCode: "+880",
    currency: { code: "BDT", symbol: "৳" },
    firstName: "",
    lastName: "",
    addressLine: "",
    city: "",
    postalCode: "",
    phone: "",
  };

  const [form, setForm] = useState(emptyForm);

  // SweetAlert Toast Configuration (বারবার ব্যবহারের জন্য)
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setAddress(user.address || null);
      setPhoto(user.photo || null);
    }
  }, [user]);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.success ? data.data.url : null;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    setPhoto(URL.createObjectURL(file));

    const uploadedUrl = await uploadToImgBB(file);
    if (uploadedUrl) {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: uploadedUrl }),
      });
      if (res.ok) {
        await refreshUser();
        Toast.fire({ icon: 'success', title: 'Photo updated!' });
      }
    } else {
      Toast.fire({ icon: 'error', title: 'Image upload failed' });
    }
    setSaving(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email }),
    });
    if (res.ok) {
      await refreshUser();
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your personal info has been saved!',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-[32px]' }
      });
    }
    setSaving(false);
  };

  const handleSaveAddress = async () => {
    setSaving(true);
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: form }),
    });
    if (res.ok) {
      setAddress(form);
      setOpen(false);
      await refreshUser();
      Toast.fire({ icon: 'success', title: 'Address saved successfully!' });
    }
    setSaving(false);
  };

  const deleteAddress = async () => {
    Swal.fire({
      title: 'Remove Address?',
      text: "You will have to re-enter your shipping details.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      customClass: { popup: 'rounded-[32px]' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch("/api/auth/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: null }),
        });
        if (res.ok) {
          setAddress(null);
          await refreshUser();
          Toast.fire({ icon: 'success', title: 'Address deleted.' });
        }
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
          My <span className="text-indigo-600">Profile</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Update your personal details and address.</p>
      </div>

      <div className="space-y-8">
        
        {/* ================= PROFILE PHOTO ================= */}
        <section className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm flex flex-col items-center">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-[40px] bg-slate-100 overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100 flex items-center justify-center ${saving ? 'opacity-50' : ''}`}>
              {photo ? (
                <Image src={photo} width={128} height={128} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Profile" />
              ) : (
                <span className="text-3xl font-black text-slate-300 uppercase italic">
                  {firstName?.[0]}{lastName?.[0]}
                </span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl cursor-pointer shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-110">
              <FiCamera size={18} />
              <input type="file" accept="image/*" hidden onChange={handleImage} disabled={saving} />
            </label>
          </div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {saving ? "Uploading..." : "Profile Identity"}
          </p>
        </section>

        {/* ================= BASIC INFO ================= */}
        <section className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FiUser className="text-indigo-600" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Basic Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-none pl-12 pr-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              />
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {saving ? "Processing..." : "Save Changes"}
          </button>
        </section>

        {/* ================= ADDRESS ================= */}
        <section className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Shipping Address</h3>
            </div>
            {!address && (
              <button onClick={() => {setForm(emptyForm); setOpen(true)}} className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                + Add New
              </button>
            )}
          </div>

          {!address ? (
            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-sm font-bold text-slate-400">No address saved yet.</p>
            </div>
          ) : (
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 relative group">
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900">{address.firstName} {address.lastName}</p>
                <p className="text-sm text-slate-500 font-medium">{address.addressLine}</p>
                <p className="text-sm text-slate-500 font-medium">{address.city}, {address.postalCode}</p>
                <p className="text-sm text-indigo-600 font-black italic">{address.country}</p>
                <p className="text-xs text-slate-400 font-bold mt-2">{address.phoneCode} {address.phone}</p>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={() => {setForm(address); setOpen(true)}} className="flex items-center gap-1.5 text-[11px] font-black uppercase text-indigo-600 tracking-wider">
                  <FiEdit3 /> Edit
                </button>
                <button onClick={deleteAddress} className="flex items-center gap-1.5 text-[11px] font-black uppercase text-red-500 tracking-wider">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ================= ADDRESS MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] px-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[40px] w-full max-w-lg shadow-2xl space-y-5 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Manage Address</h2>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><FiX /></button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => {
                    const c = countries.find(ct => ct.name === e.target.value);
                    setForm({ ...form, country: c.name, phoneCode: c.phoneCode, currency: c.currency });
                  }}
                  className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  {countries.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />
                <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>

              <input placeholder="Street Address" value={form.addressLine} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />
                <input placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-100 px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-400 flex items-center justify-center">{form.phoneCode}</div>
                <input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-50 border-none px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 col-span-2 outline-none" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setOpen(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors">Discard</button>
              <button onClick={handleSaveAddress} className="flex-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}