"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import Swal from "sweetalert2"; // ১. SweetAlert2 ইমপোর্ট করুন
import { pushToDataLayer } from '@/lib/gtm';
import { useAuth } from '@/hooks/useAuth';

const DetailsContent = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { user } = useAuth();
    
    const method = params.method ? params.method.toLowerCase() : ""; 
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount') || "0.00";

    const [userNumber, setUserNumber] = useState('');
    const [trxId, setTrxId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [dynamicAdminNum, setDynamicAdminNum] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchAdminNumber = async () => {
            try {
                const res = await fetch('/api/admin/payment-methods');
                const data = await res.json();
                if (data.ok && data.methods) {
                    const dbKey = (method === 'rocket') ? 'rocket' : method;
                    setDynamicAdminNum(data.methods[dbKey]?.adminNum || "Not Found");
                }
            } catch (err) { setDynamicAdminNum("Errror"); }
            finally { setIsFetching(false); }
        };
        fetchAdminNumber();
    }, [method]);

    const methodConfig = {
        bkash: { name: 'bKash', color: 'bg-[#E2136E]', logo: "/bkash.jpeg" },
        nagad: { name: 'Nagad', color: 'bg-[#F7941D]', logo: '/nagad.jpeg' },
        upay: { name: 'Upay', color: 'bg-[#FFC40C]', logo: '/upay.jpeg' },
        rocket: { name: 'Rocket', color: 'bg-[#8C3494]', logo: '/rocket.jpeg' },
        
    };

    const currentMethod = methodConfig[method] || { name: method.toUpperCase(), color: 'bg-gray-600', logo: '' };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const paymentData = {
            orderId,
            senderEmail: user?.email || "Guest",
            method: currentMethod.name,
            sender: userNumber,
            transactionId: trxId,
            amount: amount
        };

        try {
            const res = await fetch('/api/orders/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            if (res.ok) {
                // Tracking: Purchase Event
                pushToDataLayer("Purchase", {
                    transaction_id: trxId,
                    value: parseFloat(amount),
                    currency: "BDT",
                    payment_method: currentMethod.name,
                    order_id: orderId
                });

                // ২. SweetAlert Success
                Swal.fire({
                    title: "Success!",
                    text: "Payment submitted! Admin will verify soon.",
                    icon: "success",
                    confirmButtonColor: "#10b981", // Green color
                    confirmButtonText: "Return Home"
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push('/'); 
                    }
                });
            } else {
                throw new Error("Failed");
            }
        } catch (err) { 
            // ৩. SweetAlert Error
            Swal.fire({
                title: "Error!",
                text: "Submission failed! Please try again.",
                icon: "error",
                confirmButtonColor: "#ef4444" // Red color
            });
        }
        finally { setIsLoading(false); }
    };

    return (
        // ... আপনার আগের রিটার্ন UI কোড সব একই থাকবে ...
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className={`${currentMethod.color} p-6 text-white flex flex-col items-center gap-3 relative`}>
                    <button onClick={() => router.back()} className="absolute left-4 top-4 hover:bg-white/20 p-2 rounded-full"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg></button>
                    <div className="bg-white p-2 rounded-xl w-16 h-16 flex items-center justify-center"><img src={currentMethod.logo} className="max-h-full object-contain" /></div>
                    <h2 className="text-lg font-black uppercase">Pay with {currentMethod.name}</h2>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase text-center mb-2">Step 1: Payment(Merchant) </p>
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                            <span className="text-xl font-mono font-black">{isFetching ? "..." : dynamicAdminNum}</span>
                            <button onClick={() => {navigator.clipboard.writeText(dynamicAdminNum); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className={`${currentMethod.color} text-white px-3 py-1.5 rounded-md text-[10px] font-bold`}>{copied ? "COPIED!" : "COPY"}</button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 text-center">* Please send exactly <span className="font-bold text-gray-800 underline text-sm">BDT {amount}</span></p>
                    </div>

                    <form onSubmit={handleConfirm} className="space-y-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase text-center">Step 2: Submit Details</p>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase">Your {currentMethod.name} Number</label>
                            <input required type="text" placeholder="01XXXXXXXXX" className="w-full p-3 bg-gray-50 border rounded-lg font-bold" value={userNumber} onChange={(e) => setUserNumber(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase">Transaction ID (TrxID)</label>
                            <input required type="text" placeholder="TrxID" className="w-full p-3 bg-gray-50 border rounded-lg font-bold uppercase" value={trxId} onChange={(e) => setTrxId(e.target.value.toUpperCase())} />
                        </div>
                        <button disabled={isLoading || isFetching} type="submit" className={`w-full ${currentMethod.color} text-white py-4 rounded-xl font-black text-lg shadow-xl`}>
                            {isLoading ? "Verifying..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default function PaymentDetailsPage() {
    return <Suspense fallback={<div>Loading...</div>}><DetailsContent /></Suspense>;
}
