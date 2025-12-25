"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2'; // ১. SweetAlert2 ইমপোর্ট করুন

const PaymentContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const orderId = searchParams.get('orderId') || "0";
    const amount = searchParams.get('amount') || "0.00";

    const [activeTab, setActiveTab] = useState('MFS/WALLET');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [lang, setLang] = useState('en');
    const [isVisible, setIsVisible] = useState(true);

    const translations = {
        en: {
            support: 'Support',
            faq: 'FAQ',
            offers: 'Offers',
            login: 'Login',
            card: 'CARD',
            mfs: 'WALLET',
            internetBank: 'INTERNET BANK',
            pay: `PAY BDT ${amount}`, 
            terms: 'By clicking this pay button you agree our terms and conditions which is limited to facilitating your payment to the merchant mentioned above',
            tos: 'Terms of Service',
            verified: 'Verified by',
            pso: 'PSO Licensed',
            pci: 'PCI DSS Compliant',
            selectMethodError: 'Please select a payment method' // এরর মেসেজ
        },
        bn: {
            support: 'সাপোর্ট',
            faq: 'জিজ্ঞাসাবাদ',
            offers: 'অফার সমূহ',
            login: 'লগইন',
            card: 'কার্ড',
            mfs: 'ওয়ালেট',
            internetBank: 'ইন্টারনেট ব্যাংক',
            pay: `${amount} টাকা প্রদান করুন`,
            terms: 'এই পে বাটনে ক্লিক করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন যা উপরে উল্লিখিত মার্চেন্টের কাছে আপনার পেমেন্ট সহজতর করার মধ্যে সীমাবদ্ধ',
            tos: 'পরিষেবার শর্তাবলী',
            verified: 'ভেরিফাইড বাই',
            pso: 'পিএসও লাইসেন্সপ্রাপ্ত',
            pci: 'পিসিআই ডিএসএস কমপ্লায়েন্ট',
            selectMethodError: 'দয়া করে একটি পেমেন্ট পদ্ধতি নির্বাচন করুন' // এরর মেসেজ
        }
    };

    const t = translations[lang];

    // ... কার্ড, এমএফএস এবং ব্যাংক মেথড লিস্ট আগের মতোই থাকবে ...
    const cardMethods = [
        { name: 'Visa', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/visa.png' },
        { name: 'MasterCard', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/master.png' },
        { name: 'MTB Card', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/mta.webp' },
        { name: 'Nexus', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/naged.png' },
        { name: 'DBBL Visa', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/visa.png' },
        { name: 'DBBL Master', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/master.png' },
        { name: 'Southeast', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/ok.png' },
    ];

    const mfsMethods = [
        { name: 'bKash', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/bkash.png' },
        { name: 'Nagad', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/naged.png' },
        { name: 'Upay', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/upay.png' },
        { name: 'Rocket', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/roket.png' },
        { name: 'OK', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/ok.png' },
        { name: 'mCash', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/mck.png' },
    ];

    const bankMethods = [
        { name: 'Islami Bank', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/islim.png' },
        { name: 'City Touch', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/city.png' },
        { name: 'MTB', logo: 'https://raw.githubusercontent.com/mdabdullahm/video/main/img/mta.webp' }
    ];

    const handlePay = () => {
        // ২. SweetAlert2 ওয়ার্নিং
        if (!selectedMethod) {
            Swal.fire({
                title: lang === 'bn' ? 'পদ্ধতি নির্বাচন করুন' : 'Selection Required',
                text: t.selectMethodError,
                icon: 'warning',
                confirmButtonColor: '#006747',
                confirmButtonText: lang === 'bn' ? 'ঠিক আছে' : 'OK'
            });
            return;
        }

        const methodName = selectedMethod.toLowerCase().replace(/\s+/g, '');
        router.push(`/payment/${methodName}?orderId=${orderId}&amount=${amount}`);
    };

    if (!isVisible) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <button
                    onClick={() => setIsVisible(true)}
                    className="bg-[#006747] text-white px-4 py-2 rounded-md shadow-md"
                >
                    Open Payment Gateway
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-900">
            {/* UI কোড সব আগের মতোই থাকবে */}
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-300 relative">

                {/* Header Section */}
                <div className="p-4 border-b relative">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute right-1 -top-1 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner">S</div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 leading-tight uppercase">SubNex</h1>
                            <p className="text-[10px] text-gray-400 font-medium">MID: EM255109371807F4D</p>
                        </div>

                        <div className="ml-auto flex border rounded-md overflow-hidden text-[10px] font-bold">
                            <span onClick={() => setLang('en')} className={`px-2 py-1 cursor-pointer transition-colors ${lang === 'en' ? 'bg-[#006747] text-white' : 'bg-gray-100 text-gray-500'}`}>En</span>
                            <span onClick={() => setLang('bn')} className={`px-2 py-1 cursor-pointer border-l transition-colors ${lang === 'bn' ? 'bg-[#006747] text-white' : 'bg-gray-100 text-gray-500'}`}>Bn</span>
                        </div>
                    </div>
                </div>

                {/* Support Row */}
                <div className="grid grid-cols-4 py-3 border-b text-center text-[#006747]">
                    {[
                        { label: t.support, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg> },
                        { label: t.faq, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
                        { label: t.offers, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M12 12V3" /><path d="M7 5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0" /></svg> },
                        { label: t.login, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center cursor-pointer border-r last:border-r-0 border-gray-100 transition-colors hover:bg-gray-50">
                            <div className="mb-1">{item.icon}</div>
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-50 border-b">
                    {[{ id: 'CARD', label: t.card }, { id: 'MFS/WALLET', label: t.mfs }, { id: 'INTERNET BANK', label: t.internetBank }].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSelectedMethod(''); }}
                            className={`flex-1 py-3 text-[10px] font-black tracking-wider transition-all duration-300 ${activeTab === tab.id ? 'bg-[#006747] text-white shadow-inner' : 'text-[#006747] bg-white hover:bg-gray-50'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="p-6 grid grid-cols-3 gap-4 min-h-[250px] bg-white content-start">
                    {(activeTab === 'CARD' ? cardMethods : activeTab === 'MFS/WALLET' ? mfsMethods : bankMethods).map((method) => (
                        <div
                            key={method.name}
                            onClick={() => setSelectedMethod(method.name)}
                            className={`relative flex items-center justify-center p-2 h-16 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedMethod === method.name ? 'border-[#006747] bg-emerald-50/30' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            {selectedMethod === method.name && (
                                <div className="absolute -top-2 -right-2 bg-white rounded-full text-green-600 shadow-sm">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                </div>
                            )}
                            <img src={method.logo} alt={method.name} className={`max-w-full max-h-full object-contain ${selectedMethod === method.name ? 'grayscale-0' : 'grayscale opacity-60'}`} />
                        </div>
                    ))}
                </div>

                {/* Button */}
                <div className="px-6 pb-4 bg-white">
                    <button onClick={handlePay} className="w-full bg-[#006747] text-white py-3.5 rounded-md flex items-center justify-center gap-3 font-bold text-lg hover:bg-[#004d35] active:scale-[0.98] transition-all shadow-md">
                        {t.pay}
                    </button>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t flex flex-col items-center gap-4">
                    <div className="flex justify-between w-full px-4">
                        <div className="flex items-center gap-1.5 opacity-80">
                            <div className="w-5 h-5 bg-green-700 rounded-full flex items-center justify-center shadow-sm">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                            </div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{t.pso}</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-80">
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{t.pci}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PaymentContent />
        </Suspense>
    );
}