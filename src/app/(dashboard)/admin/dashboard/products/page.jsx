"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Plus,
  Package,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import EditProductModal from "@/Components/modal/EditProductModal";
import Swal from "sweetalert2";

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
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      Swal.fire("Deleted!", "Product removed.", "success");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">
              Products
            </h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
              Inventory Management
            </p>
          </div>
          <Link
            href="/admin/dashboard/products/add"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Add New
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 animate-pulse rounded-2xl"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => {
              const hasVariants = p.variants?.length > 0;
              const mainVariant = hasVariants ? p.variants[0] : null;

              const regularPrice = hasVariants
                ? mainVariant.price
                : p.regularPrice;
              const discountPrice = hasVariants
                ? mainVariant.discountPrice
                : p.discountPrice;

              // Jodi discount thake, tobe discount price-i hobe "minPrice"
              const displayPrice = discountPrice || regularPrice;
              const hasDiscount = discountPrice && discountPrice < regularPrice;
              return (
                <div
                  key={p._id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
                >
                  <div className="absolute top-2 right-2 z-10">
                    {p.active ? (
                      <CheckCircle2
                        size={14}
                        className="text-green-500 bg-white rounded-full"
                      />
                    ) : (
                      <XCircle
                        size={14}
                        className="text-red-400 bg-white rounded-full"
                      />
                    )}
                  </div>

                  {/* Slim Product Image */}
                  <div className="relative h-62 overflow-hidden bg-gray-50">
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Package size={32} />
                      </div>
                    )}
                  </div>

                  {/* Product Details - Compact */}
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-1">
                      <Tag size={10} className="text-blue-500" />
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter truncate max-w-[80px]">
                        {p.category}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-gray-800 leading-tight mb-2 line-clamp-1 group-hover:text-blue-600">
                      {p.title}
                    </h3>

                    <div className="mt-auto">
                      <div className="flex flex-col">
                        {/* Discount Price & Label */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-black text-gray-900">
                            ৳ {displayPrice}
                          </span>
                        </div>

                        {/* Regular Price (Strike-through) */}
                        <div className="flex items-center gap-2">
                          {hasDiscount && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ৳ {regularPrice}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            {hasVariants ? "Starting At" : "Price"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons - Minimal */}
                      <div className="mt-3 flex gap-2 border-t pt-2">
                        <button
                          onClick={() => setEditProduct(p)}
                          className="flex-1 bg-blue-500  py-1.5 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Pencil size={20} color="white" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="flex-1 bg-red-500  py-1.5 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Trash2 size={20} color="white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Empty Inventory
            </p>
          </div>
        )}
      </div>

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
