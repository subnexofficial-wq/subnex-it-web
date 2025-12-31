"use client"
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

export default function ProductListClient({ initialProducts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  const categories = ["all", ...new Set(initialProducts.map(p => p.category))];


  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-10">
      
      {/* ফিল্টার এবং সার্চ বার */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <h2 className="text-black text-xl md:text-2xl font-bold uppercase tracking-wide">
          Products ({filteredProducts.length})
        </h2>
        
        <div className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentItems.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* নো ডাটা মেসেজ */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium text-lg">No products match your search!</p>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredProducts.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-black hover:text-white transition"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-md border transition ${
                  currentPage === index + 1 ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-black hover:text-white transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}