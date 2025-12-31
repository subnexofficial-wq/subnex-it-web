import CheckoutPage from '@/Components/checkout/ClintCheakOut';
import React, { Suspense } from 'react';

// একটি সুন্দর লোডিং স্পিনার বা টেক্সট
const CheckoutLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Loading Checkout...</p>
    </div>
  </div>
);

const page = () => {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutPage />
    </Suspense>
  );
};

export default page;