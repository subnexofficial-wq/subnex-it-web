import { getAllProducts } from "@/actions/productActions";
import DynamicProductSection from "@/Components/DynamicProductSection";
import React from "react";
import Link from "next/link"; // হোম পেজে যাওয়ার লিঙ্কের জন্য

const StreamingPage = async () => {
  const products = await getAllProducts();
  
  const digitalProducts = products.filter((p) => p.category === "digital-product");

  return (
    <div className="pt-6 min-h-[60vh]">
      {digitalProducts.length > 0 ? (
        <DynamicProductSection
          products={digitalProducts}
          sectionTitle="DIGITAL PRODUCTS"
        />
      ) : (
        /* প্রোডাক্ট না থাকলে এই অংশটি দেখাবে */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Products Available</h2>
          <p className="text-gray-500 mb-6">
            Sorry, we couldn't find any products in the Digital Products category right now.
          </p>
          <Link 
            href="/" 
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default StreamingPage;