import { getAllProducts } from "@/actions/productActions";
import DynamicProductSection from "@/Components/DynamicProductSection";
import React from "react";
import Link from "next/link";

const EducationPage = async () => {
  const products = await getAllProducts();
  
  // ক্যাটাগরি অনুযায়ী ফিল্টার করা হচ্ছে
  const subscriptionProducts = products.filter((p) => p.category === "subscription");

  return (
    <div className="pt-6 min-h-[70vh]">
      {subscriptionProducts.length > 0 ? (
        <DynamicProductSection
          products={subscriptionProducts}
          sectionTitle="SUBSCRIPTION"
        />
      ) : (
        /* প্রোডাক্ট না থাকলে এই Empty State টি দেখাবে */
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="bg-emerald-50 p-8 rounded-full mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-emerald-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            No Subscriptions Found
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Currently, there are no active subscription plans available. Please check back later or explore other categories.
          </p>
          <Link 
            href="/" 
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 active:scale-95"
          >
            Explore Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default EducationPage;