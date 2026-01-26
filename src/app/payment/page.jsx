"use client";

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

const RedirectToUddoktaPay = () => {
    const searchParams = useSearchParams();
    
    // URL থেকে ডাটা নেওয়া
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const customerName = searchParams.get('name');
    const customerEmail = searchParams.get('email');

    useEffect(() => {
        const initiatePayment = async () => {
            // ডাটা চেক
            if (!orderId || !amount || !customerEmail) {
                Swal.fire('Error', 'Missing order information!', 'error');
                return;
            }

            Swal.fire({
                title: 'Processing Payment...',
                text: 'Please wait while we redirect you to the secure gateway.',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId,
                        amount,
                        customerName,
                        customerEmail, 
                    }),
                });

                const data = await res.json();
                
                if (data.url) {
                    // সরাসরি UddoktaPay তে পাঠিয়ে দেওয়া
                    window.location.href = data.url;
                } else {
                    Swal.fire('Error', data.error || 'Failed to get payment URL', 'error');
                }
            } catch (err) {
                console.error("Payment Initiation Error:", err);
                Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
            }
        };

        initiatePayment();
    }, [orderId, amount, customerEmail, customerName]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006747] mb-4"></div>
            <p className="text-gray-600 font-medium">Connecting to secure gateway...</p>
        </div>
    );
};

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <RedirectToUddoktaPay />
        </Suspense>
    );
}