"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const AdminPaymentVerification = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/transactions?status=${filter}`)
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            });
    }, [filter]);

    const handleAction = async (trxId, orderId, action) => {
        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${action} this payment.`,
            icon: action === 'approved' ? 'success' : 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'approved' ? '#059669' : '#dc2626',
            confirmButtonText: `Yes, ${action} it!`
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch('/api/admin/approve-payment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    transactionId: trxId, 
                    orderId: orderId,
                    status: action 
                })
            });

            if (res.ok) {
                Swal.fire('Success!', `Payment has been ${action}.`, 'success');
                setTransactions(transactions.filter(t => t._id !== trxId));
            }
        } catch (err) {
            Swal.fire('Error!', 'Action failed.', 'error');
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto">
                {/* Header & Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Payments</h1>
                        <p className="text-gray-500 text-sm">Verify and manage customer transactions</p>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
                        {['pending', 'approved', 'rejected'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    filter === tab 
                                    ? 'bg-gray-900 text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Layout for Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-3xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {transactions.map((trx) => (
                            <div key={trx._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                                {/* Card Header */}
                                <div className="p-5 border-b border-gray-50 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm uppercase">
                                            {trx.method.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-800 uppercase text-sm leading-tight">{trx.method}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Gateway</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-green-600 leading-tight">৳{trx.amountPaid}</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold">Amount Paid</p>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 space-y-4">
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <div className="mb-3">
                                            <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Sender Number</label>
                                            <p className="text-sm font-bold text-gray-700 font-mono tracking-wider">{trx.senderNumber}</p>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Transaction ID</label>
                                            <p className="text-xs font-black text-blue-600 font-mono break-all">{trx.trxId}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Order Reference</label>
                                        <p className="text-[10px] font-mono text-gray-400 truncate">ID: {trx.orderId}</p>
                                    </div>
                                </div>

                                {/* Card Footer / Actions */}
                                {filter === 'pending' && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                                        <button 
                                            onClick={() => handleAction(trx._id, trx.orderId, 'approved')}
                                            className="flex-1 bg-gray-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors shadow-md active:scale-95"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(trx._id, trx.orderId, 'rejected')}
                                            className="px-4 py-3 bg-white text-red-500 border border-red-100 rounded-2xl text-[10px] font-black uppercase hover:bg-red-50 transition-colors active:scale-95"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {transactions.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <span className="text-4xl mb-4">📂</span>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No {filter} transactions found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPaymentVerification;