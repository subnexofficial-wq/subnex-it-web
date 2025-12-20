"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Package, Clock, Tag, LayoutGrid } from "lucide-react";
import EditProductModal from "@/Components/modal/EditProductModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/list");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products List</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and update your digital inventory</p>
        </div>
        <Link
          href="/admin/dashboard/products/add"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-100"
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 font-bold text-lg">Loading products...</div>
      ) : (
        <>
          {/* --- Desktop Table View (md and up) --- */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-sm text-left border-separate border-spacing-y-3">
              <thead className="text-gray-400 uppercase text-[12px] font-black tracking-wider">
                <tr>
                  <th className="px-6 py-2">Product Details</th>
                  <th className="px-6 py-2">Category</th>
                  <th className="px-6 py-2">Pricing</th>
                  <th className="px-6 py-2">Validity</th>
                  <th className="px-6 py-2">Quantity</th>
                  <th className="px-6 py-2">Status</th>
                  <th className="px-6 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {products.map((p) => (
                  <tr key={p._id} className="shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <td className="px-6 py-4 flex items-center gap-4 border-y border-l rounded-l-2xl">
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed"><Package size={24} className="text-gray-300" /></div>
                      )}
                      <span className="font-bold text-gray-800 text-base">{p.title}</span>
                    </td>
                    <td className="px-6 py-4 border-y">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold capitalize border border-blue-100">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 border-y">
                      <div className="font-black text-gray-900 text-base">৳{p.discountPrice || p.regularPrice}</div>
                      {p.discountPrice && <div className="text-xs text-gray-400 line-through font-medium">৳{p.regularPrice}</div>}
                    </td>
                    <td className="px-6 py-4 border-y text-gray-600 font-bold ">{p.validity || "N/A"}</td>
                     <td className="px-6 py-4 border-y text-gray-600 font-bold">{p.quantity|| "Unlimited"}</td>
                    <td className="px-6 py-4 border-y">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${p.active ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-500 border border-red-100"}`}>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 border-y border-r rounded-r-2xl text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditProduct(p)} className="p-2.5 bg-gray-50 text-blue-600 rounded-xl border border-gray-200 hover:bg-blue-600 hover:text-white transition-all">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="p-2.5 bg-gray-50 text-red-500 rounded-xl border border-gray-200 hover:bg-red-600 hover:text-white transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Mobile Card View (Medium & Small screens) --- */}
          <div className="xl:hidden grid grid-cols-1 gap-6">
            {products.map((p) => (
              <div key={p._id} className="bg-white border-2 border-gray-50 rounded-3xl p-5 shadow-sm active:shadow-md transition-all">
                <div className="flex gap-5">
                  {/* Image */}
                  <div className="shrink-0">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt="" className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-lg" />
                    ) : (
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200"><Package size={32} className="text-gray-300" /></div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 line-clamp-2">{p.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold">
                      <span className="flex items-center gap-1 "><Tag size={14} color="blue" />  {p.category}</span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1 text-gray-500"><Clock size={14} />  {p.validity || "N/A"}</span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1 text-gray-500"> Quantity :  {p.quantity|| "Unlimited"}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xl font-black text-gray-900">৳{p.discountPrice || p.regularPrice}</span>
                      {p.discountPrice && <span className="text-sm text-gray-400 line-through font-bold">৳{p.regularPrice}</span>}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-4 border-t-2 border-gray-50 flex items-center justify-between">
                  <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider ${p.active ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"}`}>
                    {p.active ? "● Active" : "○ Inactive"}
                  </span>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setEditProduct(p)} 
                      className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 active:scale-90 transition-transform"
                    >
                      <Pencil size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p._id)} 
                      className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 active:scale-90 transition-transform"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal Component */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdated={fetchProducts}
        />
      )}
    </div>
  );
}