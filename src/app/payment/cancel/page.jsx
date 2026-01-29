"use client";
import { useRouter } from "next/navigation";

export default function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-md">
        <div className="text-red-500 text-6xl mb-4">×</div>
        <h1 className="text-2xl font-bold">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">Your transaction was not completed.</p>
        <button 
          onClick={() => router.push("/")}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}