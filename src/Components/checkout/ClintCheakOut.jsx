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
import { pushToDataLayer } from "@/lib/gtm";

export default function CheckoutPage() {

const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { cart } = useCart();
  const isBuyNow = searchParams.get("buyNow") === "true";

  /* ================= STATE MANAGEMENT ================= */
  // ১. সব স্টেটগুলো আগে ডিক্লেয়ার করতে হবে
  const [couponCode, setCouponCode] = useState("");
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [contact, setContact] = useState({ email: "", phone: "" });

  const [delivery, setDelivery] = useState({
    country: countries?.[0] || { name: "Bangladesh" },
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postal: "",
  });

  const [shippingData, setShippingData] = useState({
    price: 0,
    title: "Regular WhatsApp Delivery",
  });
  const [tipAmount, setTipAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  /* ================= CALCULATIONS ================= */
  // ২. ক্যালকুলেশনগুলো useEffect-এর আগে রাখতে হবে
  const subtotal = useMemo(() => {
  return checkoutItems.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );
}, [checkoutItems]);

 const total = subtotal + shippingData.price + tipAmount;

  /* ================= EFFECTS ================= */
  // ৩. এখন এই useEffect টি 'total' এবং অন্যান্য ভ্যালু খুঁজে পাবে
  useEffect(() => {
    if (checkoutItems.length > 0) {
      pushToDataLayer("InitiateCheckout", {
        currency: "BDT",
        value: total,
        coupon: couponCode || "",
        items: checkoutItems.map((item) => ({
          item_id: item.productId || item._id,
          item_name: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  }, [checkoutItems.length, total, couponCode]);

  useEffect(() => {
    if (isBuyNow) {
      const savedData = sessionStorage.getItem("directCheckout");
      if (savedData) {
        try {
          const item = JSON.parse(savedData);
            setCheckoutItems([item]);
       
          if (item.appliedCoupon && item.appliedCoupon !== "none") {
            setCouponCode(item.appliedCoupon); 
            setDiscount(item.discountAmount || 0); 
          }

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

  /* ================= HANDLERS ================= */
  const handleCompleteOrder = async () => {
    if (!delivery.address || !contact.email || !contact.phone) {
      alert("Please fill in all information.");
      return;
    }

    const currentTotal = subtotal + shippingData.price + tipAmount - discount;

    const orderItemsForBackend = checkoutItems.map((item) => ({
      productId: item.productId || item._id,
      title: item.title,
      price: Number(item.price),
      quantity: Number(item.quantity),
      category: item.category || "service",
      downloadLink: item.downloadLink || null,
    }));

    const orderData = {
      orderItems: orderItemsForBackend,
      userEmail: user?.email || "guest",
      customer: { ...contact, ...delivery },
      pricing: {
        subtotal,
        shippingFee: shippingData.price,
        tip: tipAmount,
        discount,
        couponCode: couponCode || "none",
        totalAmount: currentTotal,
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
        const fullName = `${delivery.firstName} ${delivery.lastName}`;
        const query = new URLSearchParams({
          orderId: result.orderId,
          amount: currentTotal.toString(),
          name: fullName,
          email: contact.email,
          coupon: couponCode || "",
        }).toString();

        router.push(`/payment?${query}`);
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

          {/* RIGHT SECTION*/}
          <aside className="lg:sticky lg:top-10 space-y-6">
            <OrderSummary
              cart={checkoutItems} 
              subtotal={subtotal}
              shipping={shippingData.price}
              tip={tipAmount}
              discount={discount}
              setDiscount={setDiscount}
              setCouponCode={setCouponCode}
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
         

          </aside>
    
        </div>
      </div>
    </div>
  );
}
