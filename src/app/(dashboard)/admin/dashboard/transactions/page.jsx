"use client";

import React, { useEffect, useState } from 'react';
import { FiSearch, FiCalendar, FiRotateCcw, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import Swal from 'sweetalert2';

const AdminPaymentVerification = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState("");

    const fetchTransactions = () => {
        setLoading(true);
        fetch(`/api/admin/transactions?status=${filter}`)
            .then(res => res.json())
            .then(data => {
                const results = Array.isArray(data) ? data : [];
                setTransactions(results);
                setFilteredTransactions(results);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchTransactions();
    }, [filter]);

    // Error-free Filtering Logic using 'submittedAt'
    useEffect(() => {
        let result = transactions;

        if (searchTerm) {
            result = result.filter(trx => 
                trx.senderNumber?.includes(searchTerm) || 
                trx.trxId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (searchDate) {
            result = result.filter(trx => {
                if (!trx.submittedAt) return false;
                try {
                    const dateObj = new Date(trx.submittedAt);
                    if (isNaN(dateObj.getTime())) return false;
                    
                    const trxDate = dateObj.toISOString().split('T')[0];
                    return trxDate === searchDate;
                } catch (e) {
                    return false;
                }
            });
        }

        setFilteredTransactions(result);
    }, [searchTerm, searchDate, transactions]);

    const handleAction = async (trxId, orderId, senderEmail, action) => {
        const result = await Swal.fire({
            title: `Confirm ${action}?`,
            text: `Are you sure you want to mark this as ${action}?`,
            icon: action === 'approved' ? 'success' : 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'approved' ? '#059669' : '#dc2626',
            confirmButtonText: `Yes, ${action}`,
            borderRadius: '24px'
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch('/api/admin/approve-payment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    transactionId: trxId, 
                    orderId: orderId,
                    status: action,
                    senderEmail: senderEmail || null

                })
            });

            if (res.ok) {
                Swal.fire({ title: 'Success!', icon: 'success', timer: 1500, showConfirmButton: false });
                // Filter out the item locally to avoid full refresh
                setTransactions(prev => prev.filter(t => t._id !== trxId));
            }
        } catch (err) {
            Swal.fire('Error!', 'Action failed.', 'error');
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSearchDate("");
    };

    return (
        <div className="p-4 sm:p-8 bg-slate-50 min-h-screen font-sans">
            <div className="container mx-auto ">
                
                {/* --- COMPACT HEADER & FILTER ROW --- */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-8">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">
                            Payment <span className="text-indigo-600">Verification</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review incoming transactions</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Switcher */}
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm"
                        >
                            {['pending', 'approved', 'rejected'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        {/* Search Field */}
                        <div className="relative group">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search Mobile / TrxID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 w-44 md:w-56 transition-all shadow-sm"
                            />
                        </div>

                        {/* Date Picker */}
                        <div className="relative group">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={14} />
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-600 shadow-sm"
                            />
                        </div>

                        {/* Reset Filters */}
                        {(searchTerm || searchDate) && (
                            <button 
                                onClick={resetFilters}
                                className="flex items-center gap-1 px-3 py-2 bg-white text-red-500 border border-red-100 rounded-xl text-[10px] font-bold uppercase hover:bg-red-50 transition-all active:scale-95 shadow-sm"
                            >
                                <FiRotateCcw size={12} /> Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* --- GRID LAYOUT --- */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-[32px]"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTransactions.map((trx) => (
                            <div key={trx._id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full group">
                                {/* Card Header */}
                                <div className="p-5 border-b border-slate-50 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-[10px] uppercase shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                            {trx.method?.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 uppercase text-[12px] leading-tight">{trx.method}</h3>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider italic">
                                                {trx.submittedAt ? new Date(trx.submittedAt).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-emerald-600 leading-tight">৳{trx.amountPaid}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold">Amount</p>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 space-y-4">
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:border-indigo-100 transition-colors">
                                        <div className="mb-3">
                                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Sender Number</label>
                                            <p className="text-sm font-bold text-slate-700 font-mono">{trx.senderNumber}</p>
                                            <p className="text-sm font-bold text-slate-700 font-mono">{trx.senderEmail}</p>

                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Transaction ID</label>
                                            <p className="text-[11px] font-black text-indigo-600 font-mono break-all bg-indigo-50/50 p-1 rounded-md">{trx.trxId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FiInfo className="text-slate-300" size={14} />
                                        <p className="text-[10px] font-mono text-slate-400 truncate">Ref: {trx.orderId}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {filter === 'pending' && (
                                    <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex gap-3">
                                        <button 
                                            onClick={() => handleAction(trx._id, trx.orderId, trx.senderEmail, 'approved')}
                                            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
                                        >
                                            <FiCheck size={14} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(trx._id, trx.orderId, 'rejected')}
                                            className="px-4 py-3 bg-white text-red-500 border border-red-100 rounded-2xl text-[10px] font-black uppercase hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-1"
                                        >
                                            <FiX size={14} /> Reject
                                        </button>
                                    </div>
                                )}

                                {/* Status Badge for Approved/Rejected */}
                                {filter !== 'pending' && (
                                    <div className="p-4 border-t border-slate-50">
                                        <div className={`text-center py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            filter === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            Status: {filter}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredTransactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <FiSearch className="text-slate-200" size={30} />
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching transactions found</p>
                        <button onClick={resetFilters} className="mt-4 text-indigo-600 text-[10px] font-black uppercase border-b border-indigo-600 pb-0.5">Clear all filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPaymentVerification;