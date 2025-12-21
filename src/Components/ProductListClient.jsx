"use client"
import { useState } from "react";
import ProductCard from "./ProductCard";


export default function ProductListClient({ initialProducts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ইউনিক ক্যাটাগরি লিস্ট
  const categories = ["all", ...new Set(initialProducts.map(p => p.category))];

  // ফিল্টার লজিক
  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      
      {/* ফিল্টার এবং সার্চ বার ডিজাইন */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <h2 className="text-black text-xl md:text-2xl font-bold uppercase tracking-wide shrink-0">
          All Products ({filteredProducts.length})
        </h2>
        
        <div className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white capitalize outline-none"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* প্রোডাক্ট গ্রিড - আপনার ডিজাইন অনুযায়ী */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* নো ডাটা মেসেজ */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium text-lg">No products match your search!</p>
        </div>
      )}
    </div>
  );
}