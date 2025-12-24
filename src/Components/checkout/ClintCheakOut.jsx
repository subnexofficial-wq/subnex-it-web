"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/CartContext";
import ContactSection from "@/Components/checkout/ContactSection";
import DeliverySection from "@/Components/checkout/DeliverySection";
import ShippingMethod from "@/Components/checkout/ShippingMethod";
import BillingAddress from "@/Components/checkout/BillingAddress";
import AddTip from "@/Components/checkout/TipSection";
import OrderSummary from "@/Components/checkout/OrderSummary";
import { countries } from "../../../data/Country";
import { useAuth } from "@/hooks/useAuth";

export default function CheckoutPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { cart } = useCart();
  const isBuyNow = searchParams.get("buyNow") === "true";

  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    if (isBuyNow) {
      const savedData = sessionStorage.getItem("directCheckout");
      if (savedData) {
        try {
          const item = JSON.parse(savedData);
          setCheckoutItems([item]);
        } catch (e) {
          router.push("/products");
        }
      } else {
        router.push("/products");
      }
    } else {
      if (cart.length > 0) {
        setCheckoutItems(cart);
      } else {
        router.push("/products");
      }
    }
  }, [cart, isBuyNow, router]);

  /* ================= STATE MANAGEMENT ================= */
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [delivery, setDelivery] = useState({
    country: countries?.[0] || { name: "Bangladesh" },
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postal: "",
    phone: "",
  });

  const [shippingData, setShippingData] = useState({
    price: 0,
    title: "Regular WhatsApp Delivery",
  });
  const [tipAmount, setTipAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce(
      (acc, item) => acc + (item.totalPrice || item.price * item.quantity),
      0
    );
  }, [checkoutItems]);

  const total = subtotal + shippingData.price + tipAmount - discount;

  const handleCompleteOrder = async () => {
    if (!delivery.address || !contact.email || !contact.phone) {
      alert("Please fill in all information.");
      return;
    }

    const orderData = {
      orderItems: checkoutItems,
      userEmail: user?.email || "guest",
      customer: { ...contact, ...delivery },
      pricing: {
        subtotal,
        shippingFee: shippingData.price,
        tip: tipAmount,
        discount,
        totalAmount: total, 
      },
      status: "pending",
      paymentStatus: "unpaid",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (res.ok) {
        // শুধু orderId নিয়ে পেমেন্ট পেজে যান
        router.push(`/payment?orderId=${result.orderId}&amount=${total}`);
      }
    } catch (err) {
      console.error("Order Creation Error", err);
    }
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
              cart={checkoutItems} // কার্টের বদলে ডাইনামিক checkoutItems
              subtotal={subtotal}
              shipping={shippingData.price}
              tip={tipAmount}
              discount={discount}
              setDiscount={setDiscount}
              total={total}
            />

            <button
              onClick={handleCompleteOrder}
              disabled={checkoutItems.length === 0}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95"
            >
              Proceed to Payment • ৳{total.toLocaleString()}
            </button>

            <p className="text-[10px] text-center text-gray-400">
              By clicking the button, you agree to our Terms of Service.
            </p>
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-4  grayscale">
              <img src="/bakash.webp" alt="bkash" className="h-6" /> Bkash
              <img src="/nagad.webp" alt="nagad" className="h-6" /> Nagad
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
