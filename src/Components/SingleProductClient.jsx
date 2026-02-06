"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiMinus,
  FiPlus,
  FiShare2,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";
import DynamicProductSection from "./DynamicProductSection";
import { useCart } from "@/hooks/CartContext";
import CartPopup from "@/Components/CartPopup";
import ReviewSection from "./review/ReviewSection";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { priceCalculation } from "@/actions/priceAction";
import { pushToDataLayer } from "@/lib/gtm";

const SingleProductClient = ({ product, relatedProducts }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  
  // States
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Coupon States
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Default Price Logic
  const mainPrice = selectedVariant
    ? selectedVariant.discountPrice > 0
      ? selectedVariant.discountPrice
      : selectedVariant.price
    : product.discountPrice || product.regularPrice;

  const oldPrice = selectedVariant
    ? selectedVariant.discountPrice > 0
      ? selectedVariant.price
      : null
    : product.discountPrice
    ? product.regularPrice
    : null;

  // Variant Change হলে কুপন রিসেট
  useEffect(() => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
    sessionStorage.removeItem(`used_coupon_${product._id}`);
  }, [selectedVariant, product._id]);

  // Tracking: ViewContent
  useEffect(() => {
    if (product) {
      pushToDataLayer("ViewContent", {
        item_id: product._id,
        item_name: product.title,
        price: mainPrice,
        currency: "BDT"
      });
    }
  }, [product, mainPrice]);

  // Coupon Application Logic
  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    try {
      const res = await fetch(`/api/coupons/validate?code=${couponInput.toUpperCase().trim()}&productId=${product._id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid Coupon");
        return;
      }

      let discount = 0;
      if (data.type === "percentage") {
        discount = (mainPrice * data.value) / 100;
      } else {
        discount = data.value;
      }

      setDiscountAmount(discount);
      setAppliedCoupon(data);
      sessionStorage.setItem(`used_coupon_${product._id}`, "true");
    } catch (error) {
      console.error("Coupon Error:", error);
    }
  };

  // Add to Cart Logic (Price Fix)
  const handleAddToCart = async () => {
    const finalUnitPrice = mainPrice - (discountAmount || 0);

    // কার্ট কনটেক্সট যেন সঠিক প্রাইস পায় তার জন্য প্রোডাক্ট অবজেক্ট আপডেট
    const productWithDiscount = {
      ...product,
      price: finalUnitPrice, 
      discountPrice: 0 // কুপন অ্যাপ্লাইড প্রাইসটাই এখন মেইন প্রাইস
    };

    await addToCart(productWithDiscount, finalUnitPrice, parseInt(quantity), selectedVariant);
    setIsPopupOpen(true);
    
    pushToDataLayer("AddToCart", {
      item_id: product._id,
      item_name: product.title,
      price: finalUnitPrice,
      quantity: parseInt(quantity),
      currency: "BDT"
    });
  };

  // Buy Now Logic (Price Fix)
  const handleBuyNow = async () => {
    try {
      const baseTotalPrice = await priceCalculation(
        product._id,
        selectedVariant ? selectedVariant.duration : null,
        quantity
      );

      const finalDiscountTotal = (discountAmount || 0) * quantity;
      const finalTotalPrice = baseTotalPrice - finalDiscountTotal;
      const finalUnitPrice = mainPrice - (discountAmount || 0);

      const buyNowData = {
        productId: product._id,
        title: product.title,
        image: product.thumbnail,
        price: finalUnitPrice,
        quantity: parseInt(quantity),
        duration: selectedVariant ? selectedVariant.duration : null,
        totalPrice: finalTotalPrice,
        category: product.category,
        isBuyNow: true,
        appliedCoupon: appliedCoupon?.code || null,
      };

      pushToDataLayer("InitiateCheckout", {
        item_id: product._id,
        item_name: product.title,
        value: finalTotalPrice,
        currency: "BDT"
      });

      sessionStorage.setItem("directCheckout", JSON.stringify(buyNowData));
      router.push("/checkouts?buyNow=true");
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20 font-sans text-black">
      <CartPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* Breadcrumb */}
      <div className="container mx-auto px-8 pt-6 pb-2">
        <div className="text-sm text-blue-800 flex items-center gap-1 font-medium">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600 truncate">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Image Section */}
        <div className="w-full md:sticky md:top-24">
          <div className="relative lg:w-9/10 mx-auto aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <Image src={product.thumbnail} alt={product.title} fill className="object-cover" priority />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase leading-tight text-gray-900">{product.title}</h1>

          {/* Pricing UI */}
          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            <span className="text-3xl font-black text-red-600">
              Tk {Math.round((mainPrice - (discountAmount || 0)) * quantity)}.00
            </span>
            {(oldPrice || discountAmount > 0) && (
              <span className="text-xl text-gray-400 line-through">
                Tk {Math.round((oldPrice || mainPrice) * quantity)}.00
              </span>
            )}
            {product.storageSize && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase ml-2">
                {product.storageSize} Storage
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-500 text-sm">
              {[...Array(5)].map((_, i) => (<FiStar key={i} fill="currentColor" />))}
            </div>
            <span className="text-sm text-gray-500 font-medium">Verified Product</span>
          </div>

          <hr className="mb-6 border-gray-100" />

          {/* Variant Selection */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <p className="font-bold mb-3 text-sm text-gray-700 uppercase tracking-wider">Select Duration:</p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-5 py-2.5 text-sm font-bold rounded-xl border-2 transition-all ${
                      selectedVariant?.duration === v.duration
                        ? "border-black bg-black text-white shadow-md"
                        : "border-gray-200 bg-white hover:border-black text-gray-600"
                    }`}
                  >
                    {v.duration}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <p className="font-bold mb-3 text-sm text-gray-700 uppercase tracking-wider">Quantity:</p>
            <div className="flex items-center border-2 border-gray-200 w-36 rounded-xl h-12 overflow-hidden bg-gray-50">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors"><FiMinus /></button>
              <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors"><FiPlus /></button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 lg:w-2/3 gap-3 mb-8">
            <button onClick={handleAddToCart} className="w-full border border-black text-black py-4 font-black uppercase tracking-widest text-sm hover:text-white hover:bg-gray-800 transition rounded-xl shadow-sm">
              Add to cart
            </button>
            <button onClick={handleBuyNow} className="w-full bg-red-600 text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-red-700 transition rounded-xl shadow-lg">
              Buy it now
            </button>
          </div>

          {/* Coupon Section */}
          <div className="mb-10 p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 lg:w-2/3">
            <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-500">
                {appliedCoupon ? "Coupon Applied" : "Have a coupon?"}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Code"
                className={`flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-black uppercase font-bold text-sm transition-all ${appliedCoupon ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <button 
                  onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); setCouponInput(""); }} 
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-xs uppercase hover:bg-red-100 border border-red-100 transition"
                >
                  Remove
                </button>
              ) : (
                <button 
                  onClick={handleApplyCoupon} 
                  className="bg-black text-white px-6 py-2 rounded-xl font-bold text-xs uppercase hover:bg-gray-800 transition shadow-sm"
                >
                  Apply
                </button>
              )}
            </div>
            {appliedCoupon && (
              <div className="mt-3 p-2 bg-green-50 text-green-600 text-[11px] font-bold rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-1">
                <span className="flex items-center gap-1"><FiCheckCircle /> {appliedCoupon.code} Applied!</span>
                <span className="bg-green-600 text-white px-2 py-0.5 rounded">- ৳{Math.round(discountAmount * quantity)} OFF</span>
              </div>
            )}
          </div>

          {/* Features Highlights */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-5 bg-black rounded-full"></span> Features:
            </p>
            <div className={`space-y-3 transition-all duration-500 overflow-hidden ${showMoreDesc ? "max-h-[1000px]" : "max-h-[250px]"}`}>
              {product.highlights?.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiCheckCircle className="text-green-500 shrink-0" /> {item}
                </div>
              ))}
              {product.fullDescription && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.fullDescription}
                </div>
              )}
            </div>
            <button onClick={() => setShowMoreDesc(!showMoreDesc)} className="text-blue-600 font-bold text-[10px] mt-4 uppercase hover:underline">
              {showMoreDesc ? "Show Less" : "Read Full Details"}
            </button>
          </div>
        </div>
      </div>
      <DynamicProductSection products={relatedProducts} sectionTitle="Related Products" />
      <ReviewSection productId={product._id} />
    </div>
  );
};

export default SingleProductClient;