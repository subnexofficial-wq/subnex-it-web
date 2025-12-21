"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/CartContext";
import ContactSection from "@/Components/checkout/ContactSection";
import DeliverySection from "@/Components/checkout/DeliverySection";
import ShippingMethod from "@/Components/checkout/ShippingMethod";
import BillingAddress from "@/Components/checkout/BillingAddress";
import AddTip from "@/Components/checkout/TipSection"; 
import OrderSummary from "@/Components/checkout/OrderSummary";
import { countries } from "../../../../data/Country";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();

  /* ================= STATE MANAGEMENT ================= */
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [delivery, setDelivery] = useState({
    country: countries?.[0] || { name: "Bangladesh" },
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postal: "",
    phone: ""
  });
  
  const [shippingData, setShippingData] = useState({ price: 0, title: "Regular WhatsApp Delivery" });
  const [tipAmount, setTipAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  /* ================= PRICING CALCULATION ================= */
  // সার্ভার থেকে আসা ভেরিফাইড totalPrice ব্যবহার করে সাবটোটাল বের করা
  const subtotal = cart.reduce((acc, item) => acc + (item.totalPrice || (item.price * item.quantity)), 0);
  const total = subtotal + shippingData.price + tipAmount - discount;

  // কার্ট খালি থাকলে সুরক্ষার জন্য রিডাইরেক্ট
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/products");
    }
  }, [cart, router]);

  /* ================= HANDLE PROCEED TO PAYMENT ================= */
  const handleCompleteOrder = async () => {
    // ফর্ম ভ্যালিডেশন
    if (!delivery.address || !contact.email || !contact.phone) {
      alert("Please fill in all required contact and delivery information.");
      return;
    }

    // পেমেন্ট পেজে পাঠানোর জন্য ডাটা তৈরি (SessionStorage এ রাখা নিরাপদ)
    const pendingOrderData = {
      orderItems: cart, // এতে অলরেডি সার্ভার ভেরিফাইড প্রাইস আছে
      customer: { ...contact, ...delivery },
      pricing: {
        subtotal,
        shippingFee: shippingData.price, 
        shippingTitle: shippingData.title,
        tip: tipAmount,
        discount: discount,
        totalAmount: total
      }
    };

    // ডাটা সেভ করে পেমেন্ট ভেরিফিকেশন পেজে পাঠানো
    sessionStorage.setItem("pendingOrder", JSON.stringify(pendingOrderData));
    
    // ইউজারকে এখন পেমেন্ট ইনস্ট্রাকশন ও ট্রানজেকশন আইডি দেওয়ার পেজে নিয়ে যাওয়া হবে
    router.push("/payment/verify");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
          
          {/* LEFT SECTION */}
          <div className="space-y-8 pb-20">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <ContactSection data={contact} setData={setContact} />
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <DeliverySection data={delivery} setData={setDelivery} />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <ShippingMethod 
                address={delivery.address} 
                onMethodChange={(data) => setShippingData(data)} 
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-8">
              <BillingAddress />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <AddTip 
                subtotal={subtotal} 
                onTipChange={(amount) => setTipAmount(amount)} 
              />
            </div>
          </div>

          {/* RIGHT SECTION (Order Summary & Pay Button) */}
          <aside className="lg:sticky lg:top-10 space-y-6">
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              shipping={shippingData.price}
              tip={tipAmount}
              discount={discount}
              setDiscount={setDiscount}
              total={total}
            />
            
            <button
              onClick={handleCompleteOrder}
              disabled={cart.length === 0}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95"
            >
              Proceed to Payment • ৳{total.toLocaleString()}
            </button>
            
            <p className="text-[10px] text-center text-gray-400">
              By clicking the button, you agree to our Terms of Service.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}