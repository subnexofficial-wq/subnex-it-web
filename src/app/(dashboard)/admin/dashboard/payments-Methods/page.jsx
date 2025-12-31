"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AdminPaymentSettings() {
  const [methods, setMethods] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const res = await fetch("/api/admin/payment-methods");
        const data = await res.json();
        if (data.ok && data.methods) {
          setMethods(data.methods);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire("Error!", "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchNumbers();
  }, []);

  const handleUpdate = async (key) => {
    const result = await Swal.fire({
      title: `Update ${key.toUpperCase()}?`,
      text: `Are you sure you want to change this number?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      setUpdating(key);
      try {
        const res = await fetch("/api/admin/payment-methods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: key,
            newNumber: methods[key].adminNum,
          }),
        });

        const data = await res.json();
        if (data.ok) {
          Swal.fire({
            title: "Updated!",
            text: `${key.toUpperCase()} number has been updated.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire("Failed!", data.error, "error");
        }
      } catch (err) {
        Swal.fire("Error!", "Something went wrong", "error");
      } finally {
        setUpdating(null);
      }
    }
  };

  const handleInputChange = (key, value) => {
    setMethods({
      ...methods,
      [key]: { ...methods[key], adminNum: value },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Gateways</h1>
              <p className="text-gray-500 text-sm font-medium italic">Configure your admin payment numbers</p>
            </div>
          </div>
          
          <div className="bg-amber-100 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2">
            <span className="text-amber-600 text-lg">⚠️</span>
            <p className="text-[11px] text-amber-800 font-bold leading-tight uppercase">Live Numbers</p>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.keys(methods).map((key) => (
            <div
              key={key}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-blue-100 uppercase group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {key.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{key}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Method</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block tracking-widest">Admin Number</label>
                  <input
                    type="text"
                    value={methods[key].adminNum}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none font-mono font-bold text-gray-700 transition-all text-center"
                    placeholder="017XXXXXXXX"
                  />
                </div>

                <button
                  onClick={() => handleUpdate(key)}
                  disabled={updating === key}
                  className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95 shadow-md ${
                    updating === key
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-900 text-white hover:bg-blue-600 shadow-gray-200"
                  }`}
                >
                  {updating === key ? "SAVING..." : "UPDATE"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}