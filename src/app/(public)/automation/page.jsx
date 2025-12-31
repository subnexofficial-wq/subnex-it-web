import { getAllProducts } from "@/actions/productActions";
import DynamicProductSection from "@/Components/DynamicProductSection";
import React from "react";
import Link from "next/link";

const StreamingPage = async () => {
  const products = await getAllProducts();
  
  // automation ক্যাটাগরি ফিল্টার করা হচ্ছে
  const automationProducts = products.filter((p) => p.category === "automation");

  return (
    <div className="pt-6 min-h-[70vh]">
      {automationProducts.length > 0 ? (
        <DynamicProductSection
          products={automationProducts}
          sectionTitle="AUTOMATION"
        />
      ) : (
        /* প্রোডাক্ট না থাকলে এই UI টি দেখাবে */
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="bg-blue-50 p-8 rounded-full mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            No Automation Tools Found
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            We are currently updating our automation collection. Please check back soon or browse our other premium services.
          </p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default StreamingPage;