"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { 
  FiSave, FiPlus, FiTrash2, FiVideo, FiLayers, FiDollarSign, 
  FiHelpCircle, FiPackage, FiMessageCircle, FiMessageSquare, 
  FiImage, FiFilm, FiZap, FiEdit3 
} from "react-icons/fi";

const tabs = [
    { id: 'combo', label: 'কম্বো প্ল্যান', icon: <FiPackage size={18} /> },
    { id: 'comment', label: 'কমেন্ট অটোরিপ্লাই', icon: <FiMessageCircle size={18} /> },
    { id: 'message', label: 'মেসেজ অটোরিপ্লাই', icon: <FiMessageSquare size={18} /> },
    { id: 'image', label: 'ছবি অটোপোস্ট', icon: <FiImage size={18} /> },
    { id: 'reel', label: 'রিল অটোপোস্ট', icon: <FiFilm size={18} /> },
];

const AdminAutomation = () => {
    const [dbContent, setDbContent] = useState(null);
    const [activeTab, setActiveTab] = useState('combo');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ১. ডাটা লোড করা
    useEffect(() => {
        fetch('/api/admin/automation').then(res => res.json()).then(data => {
            // ডাটাবেস থেকে পাওয়া অ্যারে-কে অবজেক্টে রূপান্তর
            const formattedData = data.reduce((acc, item) => {
                acc[item.category] = item;
                return acc;
            }, {});
            setDbContent(formattedData);
            setLoading(false);
        });
    }, []);

    // ২. স্টেট আপডেট হ্যান্ডলার (ডাইনামিক এডিটিং)
    const updateField = (path, value) => {
        const newData = { ...dbContent };
        if (!newData[activeTab]) {
            newData[activeTab] = { category: activeTab, intro: {}, workflow: [{},{},{}], pricing: [], faqs: [] };
        }
        
        // পাথ অনুযায়ী ডাটা সেট করা (উদা: intro.engTitle)
        const keys = path.split('.');
        let current = newData[activeTab];
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        
        setDbContent(newData);
    };

    // ৩. ডাটা সেভ করা (PUT Method)
    const handleSave = async () => {
        setSaving(true);
        const res = await fetch('/api/admin/automation', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbContent[activeTab]),
        });

        if (res.ok) {
            Swal.fire({ title: "Updated!", text: "আপনার পরিবর্তনগুলো সেভ হয়েছে।", icon: "success", timer: 2000, showConfirmButton: false });
        }
        setSaving(false);
    };

    if (loading) return <div className="p-20 text-center font-bold text-blue-600">Loading Editor...</div>;

    const current = dbContent?.[activeTab] || { category: activeTab, intro: {}, workflow: [{},{},{}], pricing: [], faqs: [] };

    return (
        <section className="p-4 md:p-8 bg-gray-50 min-h-screen pb-32">
            
            {/* হেডার ও ক্যাটাগরি সিলেক্টর */}
            <div className="max-w-6xl mx-auto mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-3  text-white rounded-2xl shadow-lg shadow-blue-200"><FiZap size={24}/></div>
                    <h1 className="text-xl font-black uppercase tracking-tight text-gray-800">Automation Content Editor</h1>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap
                                ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container mx-auto max-w-6xl space-y-8">
                
                {/* ১. ভিডিও আইডি এডিটর */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FiVideo /> YouTube Video Configuration
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1 w-full">
                            <label className="text-[10px] font-black text-gray-400 ml-2">YOUTUBE VIDEO ID</label>
                            <input 
                                className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 ring-blue-500 outline-none"
                                value={current.videoUrl || ""}
                                onChange={(e) => updateField('videoUrl', e.target.value)}
                                placeholder="উদা: dQw4w9WgXcQ (ফাঁকা রাখলে ভিডিও দেখাবে না)"
                            />
                        </div>
                        {current.videoUrl && (
                            <div className="w-full md:w-64 aspect-video rounded-2xl bg-black overflow-hidden shadow-lg">
                                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${current.videoUrl}`} title="Preview"></iframe>
                            </div>
                        )}
                    </div>
                </div>

                {/* ২. ইন্ট্রো এডিটর */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <FiEdit3 /> Introduction Text
                    </h3>
                    <div className="space-y-4">
                        <input 
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-xl"
                            value={current.intro?.engTitle || ""}
                            onChange={(e) => updateField('intro.engTitle', e.target.value)}
                            placeholder="English Title (Heading)"
                        />
                        <textarea 
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-medium"
                            rows={3}
                            value={current.intro?.mainDesc || ""}
                            onChange={(e) => updateField('intro.mainDesc', e.target.value)}
                            placeholder="Bengali Description (Main Content)"
                        />
                    </div>
                </div>

                {/* ৩. ওয়ার্কফ্লো এডিটর */}
                <div className="grid md:grid-cols-3 gap-6">
                    {current.workflow?.map((step, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <div className="text-blue-600 font-black text-xs mb-4 flex items-center gap-2"><FiLayers/> STEP 0{i+1}</div>
                            <input 
                                className="w-full mb-2 bg-gray-50 p-3 rounded-xl font-bold text-sm border-none outline-none"
                                value={step.title || ""}
                                onChange={(e) => {
                                    const newW = [...current.workflow];
                                    newW[i].title = e.target.value;
                                    updateField('workflow', newW);
                                }}
                                placeholder="Step Title"
                            />
                            <textarea 
                                className="w-full bg-gray-50 p-3 rounded-xl text-xs text-gray-500 border-none outline-none"
                                value={step.desc || ""}
                                onChange={(e) => {
                                    const newW = [...current.workflow];
                                    newW[i].desc = e.target.value;
                                    updateField('workflow', newW);
                                }}
                                placeholder="Step Description"
                            />
                        </div>
                    ))}
                </div>

                {/* ৪. প্রাইসিং এডিটর */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><FiDollarSign /> Pricing Plans</h3>
                        <button 
                            onClick={() => updateField('pricing', [...current.pricing, { name: "", price: "", perks: "" }])}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        ><FiPlus/></button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {current.pricing?.map((plan, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-[2rem] relative group border border-transparent hover:border-blue-200">
                                <button onClick={() => updateField('pricing', current.pricing.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><FiTrash2/></button>
                                <input className="w-full bg-transparent font-black text-lg outline-none mb-1" placeholder="Plan Name" value={plan.name} onChange={(e) => {
                                    const newP = [...current.pricing]; newP[i].name = e.target.value; updateField('pricing', newP);
                                }} />
                                <input className="w-full bg-transparent font-black text-blue-600 text-2xl outline-none mb-4" placeholder="Price (৳)" value={plan.price} onChange={(e) => {
                                    const newP = [...current.pricing]; newP[i].price = e.target.value; updateField('pricing', newP);
                                }} />
                                <textarea className="w-full bg-white p-3 rounded-xl text-[10px] font-bold h-24 border-none outline-none" placeholder="Perks (Comma separated)" value={plan.perks} onChange={(e) => {
                                    const newP = [...current.pricing]; newP[i].perks = e.target.value; updateField('pricing', newP);
                                }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ৫. FAQ এডিটর */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><FiHelpCircle /> FAQs</h3>
                        <button 
                            onClick={() => updateField('faqs', [...current.faqs, { q: "", a: "" }])}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        ><FiPlus/></button>
                    </div>
                    <div className="space-y-4">
                        {current.faqs?.map((faq, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-2xl relative">
                                <button onClick={() => updateField('faqs', current.faqs.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-300 hover:text-red-500"><FiTrash2 size={14}/></button>
                                <input className="w-full bg-transparent font-bold text-sm mb-2 outline-none border-b border-gray-200" placeholder="Question?" value={faq.q} onChange={(e) => {
                                    const newF = [...current.faqs]; newF[i].q = e.target.value; updateField('faqs', newF);
                                }} />
                                <textarea className="w-full bg-transparent text-xs text-gray-500 outline-none" placeholder="Answer..." value={faq.a} onChange={(e) => {
                                    const newF = [...current.faqs]; newF[i].a = e.target.value; updateField('faqs', newF);
                                }} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* সেভ বাটন (Floating) */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full font-black shadow-2xl shadow-blue-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? <><Loader2 className="animate-spin" /> SAVING...</> : <><FiSave size={20}/> SAVE ALL CHANGES</>}
                </button>
            </div>
        </section>
    );
};

export default AdminAutomation;