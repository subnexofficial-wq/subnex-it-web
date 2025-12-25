"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react"; // ১. এখানে useEffect ইমপোর্ট করতে হবে (আগে মিসিং ছিল)
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
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // --- Tracking: ViewContent (পেজ লোড হলে) ---
  useEffect(() => {
    if (product) {
      pushToDataLayer("ViewContent", {
        item_id: product._id,
        item_name: product.title,
        price: product.discountPrice || product.regularPrice, // সঠিক প্রাইস ফিল্ড
        currency: "BDT"
      });
    }
  }, [product]);

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

  // --- Tracking: AddToCart ---
  const handleAddToCart = async () => {
    await addToCart(product, mainPrice, parseInt(quantity), selectedVariant);
    setIsPopupOpen(true);
    
    pushToDataLayer("AddToCart", {
      item_id: product._id,
      item_name: product.title,
      price: mainPrice, // ভেরিয়েন্ট অনুযায়ী সঠিক প্রাইস পাঠানো হচ্ছে
      quantity: parseInt(quantity),
      currency: "BDT"
    });
  };

// --- Tracking: InitiateCheckout (Buy Now বাটনের জন্য) ---
  const handleBuyNow = async () => {
    try {
      const totalPrice = await priceCalculation(
        product._id,
        selectedVariant ? selectedVariant.duration : null,
        quantity
      );

      const buyNowData = {
        productId: product._id,
        title: product.title,
        image: product.thumbnail,
        price: mainPrice,
        quantity: parseInt(quantity),
        duration: selectedVariant ? selectedVariant.duration : null,
        totalPrice: totalPrice,
        isBuyNow: true,
      };

      // ইভেন্ট ট্র্যাক করা হচ্ছে
      pushToDataLayer("InitiateCheckout", {
        item_id: product._id,
        item_name: product.title,
        value: totalPrice,
        currency: "BDT"
      });

      sessionStorage.setItem("directCheckout", JSON.stringify(buyNowData));
      router.push("/checkouts?buyNow=true");
    } catch (error) {
      console.error("Checkout Error:", error);
      // এখানে আপনি একটি ছোট টোস্ট বা এলার্ট দিতে পারেন
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20 font-sans text-black">
      {/* Cart Popup Component */}
      <CartPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* Breadcrumb */}
      <div className="container mx-auto px-8 pt-6 pb-2">
        <div className="text-sm text-blue-800 flex items-center gap-1 font-medium">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="text-gray-400">›</span>
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600 truncate">{product.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* ইমেজ সেকশন */}
        <div className="w-full   md:sticky md:top-24">
          <div className="relative lg:w-9/10 mx-auto aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* কন্টেন্ট সেকশন */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900 uppercase">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            {/* মেইন প্রাইস */}
            <span className="text-3xl font-black text-red-600">
              Tk {mainPrice * quantity}.00
            </span>

            {/* কাটা প্রাইস (যদি ডিসকাউন্ট থাকে) */}
            {oldPrice && (
              <span className="text-xl text-gray-400 line-through">
                Tk {oldPrice * quantity}.00
              </span>
            )}

            {/* স্টোরেজ ব্যাজ */}
            {product.storageSize && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase ml-2">
                {product.storageSize} Storage
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">
              Excellent Service (Verified)
            </span>
          </div>

          <hr className="mb-6 border-gray-100" />

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <p className="font-bold mb-3 text-sm text-gray-700 uppercase tracking-wider">
                Select Duration:
              </p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all border-2 flex flex-col items-center ${
                      selectedVariant?.duration === v.duration
                        ? "border-black bg-black text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-600 hover:border-black"
                    }`}
                  >
                    <span>{v.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <p className="font-bold mb-3 text-sm text-gray-700 uppercase tracking-wider">
              Quantity:
            </p>
            <div className="flex items-center border-2 border-gray-200 w-36 rounded-xl h-12 overflow-hidden bg-gray-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FiMinus />
              </button>
              <span className="flex-1 text-center font-bold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 lg:w-2/3 gap-3 mb-10">
            <button
              onClick={handleAddToCart}
              className="w-full border border-black text-black py-4 font-black uppercase tracking-widest text-sm hover:text-white hover:bg-gray-800 transition rounded-xl shadow-lg"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full bg-red-600 text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-red-700 transition rounded-xl shadow-lg"
            >
              Buy it now
            </button>
          </div>

          {/* Features/Highlights */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-black rounded-full"></span>{" "}
              Features:
            </p>
            <div
              className={`space-y-3 transition-all duration-500 overflow-hidden ${
                showMoreDesc ? "max-h-[1000px]" : "max-h-[250px]"
              }`}
            >
              {product.highlights?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <FiCheckCircle className="text-green-500 shrink-0" />
                  {item}
                </div>
              ))}

              {product.fullDescription && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.fullDescription}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowMoreDesc(!showMoreDesc)}
              className="text-blue-600 font-bold text-xs mt-4 uppercase hover:underline"
            >
              {showMoreDesc ? "Show Less" : "Read Full Details"}
            </button>
          </div>

          <div className="flex items-center gap-6 mt-8 text-gray-400 text-xs font-bold ">
            <div className="flex items-center gap-1 text-gray-500 font-bold">
              <FaStar size={16} color="red" />
              <FaStar size={16} color="red" />
              <FaStar size={16} color="red" />
              {product.totalReviews} Reviews
            </div>
            <div className="flex items-center gap-1 text-green-600 font-bold">
              <FiCheckCircle size={16} /> Instant Delivery
            </div>
            <button className="flex items-center gap-2 text-black transition">
              <FiShare2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <DynamicProductSection
        products={relatedProducts}
        sectionTitle="Related Products"
      />

      <ReviewSection productId={product._id} />
    </div>
  );
};

export default SingleProductClient;
