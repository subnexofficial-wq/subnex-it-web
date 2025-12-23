
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const PaymentDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const method = params.method; 
    
    const [userNumber, setUserNumber] = useState('');
    const [trxId, setTrxId] = useState(''); // ট্রানজেকশন আইডির জন্য স্টেট
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // মেথড অনুযায়ী লোগো, কালার এবং এডমিন নাম্বার কনফিগারেশন
    const methodConfig = {
        bkash: { 
            name: 'bKash', 
            color: 'bg-[#E2136E]', 
            adminNum: '01700000000', // এডমিনের বিকাশ নাম্বার
            logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/bkash.png' 
        },
        nagad: { 
            name: 'Nagad', 
            color: 'bg-[#F7941D]', 
            adminNum: '01800000000', // এডমিনের নগদ নাম্বার
            logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/naged.png' 
        },
        upay: { 
            name: 'Upay', 
            color: 'bg-[#FFC40C]', 
            adminNum: '01900000000', 
            logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/upay.png' 
        },
        roket: { 
            name: 'Rocket', 
            color: 'bg-[#8C3494]', 
            adminNum: '01600000000', 
            logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/roket.png' 
        },
        islim: { 
            name: 'Islami Bank', 
            color: 'bg-[#006747]', 
            adminNum: '1234567890', 
            logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/islim.png' 
        },
        visa: { 
            name: 'Visa Card', 
            color: 'bg-[#1A1F71]', 
            adminNum: '4455-6677-8899', 
            logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/visa.png' 
        },
    };

    const currentMethod = methodConfig[method] || { name: method.toUpperCase(), color: 'bg-[#006747]', adminNum: 'Contact Admin', logo: '' };

    // নাম্বার কপি করার ফাংশন
    const handleCopy = () => {
        navigator.clipboard.writeText(currentMethod.adminNum);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // এখানে পেমেন্ট ডাটা আপনার ডাটাবেজে পাঠানোর লজিক হবে
        console.log({
            method: currentMethod.name,
            sender: userNumber,
            transactionId: trxId,
            amount: 50.00
        });

        setTimeout(() => {
            alert(`Payment submitted! Please wait for admin verification. TrxID: ${trxId}`);
            setIsLoading(false);
            router.push('/'); 
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                
                {/* Branding Header */}
                <div className={`${currentMethod.color} p-6 text-white flex flex-col items-center gap-3 relative`}>
                    <button onClick={() => router.back()} className="absolute left-4 top-4 hover:bg-white/20 p-2 rounded-full transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    
                    <div className="bg-white p-2 rounded-xl shadow-lg w-16 h-16 flex items-center justify-center mt-2">
                        <img src={currentMethod.logo} alt={currentMethod.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <h2 className="text-lg font-black tracking-tight uppercase">Pay with {currentMethod.name}</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Step 1: Admin Number Display */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Step 1: Send Money to (Personal)</p>
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <span className="text-xl font-mono font-black text-gray-800 tracking-tighter">
                                {currentMethod.adminNum}
                            </span>
                            <button 
                                onClick={handleCopy}
                                className={`${currentMethod.color} text-white px-3 py-1.5 rounded-md text-[10px] font-bold active:scale-95 transition-all`}
                            >
                                {copied ? "COPIED!" : "COPY"}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 italic">* Please send exactly <span className="font-bold text-gray-800 underline">BDT 50.00</span> via Cash In/Send Money.</p>
                    </div>

                    {/* Step 2: Payment Form */}
                    <form onSubmit={handleConfirm} className="space-y-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Step 2: Submit Details</p>
                        
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase">Your {currentMethod.name} Number</label>
                            <input 
                                required
                                type="text" 
                                placeholder="01XXXXXXXXX"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-gray-700 transition-all"
                                value={userNumber}
                                onChange={(e) => setUserNumber(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase">Transaction ID (TrxID)</label>
                            <input 
                                required
                                type="text" 
                                placeholder="8N7X6W5V4"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-gray-700 tracking-widest transition-all"
                                value={trxId}
                                onChange={(e) => setTrxId(e.target.value)}
                            />
                        </div>

                        <button 
                            disabled={isLoading}
                            type="submit"
                            className={`w-full ${currentMethod.color} text-white py-4 rounded-xl font-black text-lg shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4`}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "VERIFY PAYMENT"
                            )}
                        </button>
                    </form>
                </div>

                {/* Safety Footer */}
                <div className="bg-gray-50 p-4 border-t flex items-center justify-center gap-4 opacity-60">
                    <div className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                        <span className="text-[9px] font-bold uppercase tracking-tighter">Secure SSL Verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsPage;