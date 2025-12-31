"use client";
import { useCart } from "@/hooks/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react"; // useState ইমপোর্ট করা হয়েছে
import { FaStar } from "react-icons/fa";
import CartPopup from "./CartPopup"; // পপআপ ইমপোর্ট করুন

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ভেরিয়েন্ট এবং প্রাইস লজিক
  const hasVariants = product.variants && product.variants.length > 0;
  const defaultVariant = hasVariants ? product.variants[0] : null;

  const displayPrice = hasVariants 
    ? (defaultVariant.discountPrice > 0 ? defaultVariant.discountPrice : defaultVariant.price)
    : (product.discountPrice || product.regularPrice);

  const oldPrice = hasVariants
    ? (defaultVariant.discountPrice > 0 ? defaultVariant.price : null)
    : (product.discountPrice ? product.regularPrice : null);

  const storageInfo = product.storageSize ? `(${product.storageSize})` : "";

  // হ্যান্ডেল অ্যাড টু কার্ট
  const handleAddToCart = async (e) => {
    // লিংকে ক্লিক হওয়া থেকে আটকানোর জন্য (যেহেতু কার্ডটি একটি Link এর ভেতরে)
    e.preventDefault(); 
    e.stopPropagation();

    // addToCart(product, mainPrice, quantity, variant)
    await addToCart(product, displayPrice, 1, defaultVariant);
    setIsPopupOpen(true); 
  };

  return (
    <>
      {/* পপআপ সরাসরি কনটেক্সট থেকে ডাটা দেখাবে */}
      <CartPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      <Link 
        href={`/products/${product._id}`} 
        className="group flex flex-col items-center bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-500 transition-colors duration-300"
      >
        {/* ইমেজ */}
        <div className="relative w-full aspect-square bg-gray-900">
          <Image
            src={product.thumbnail || "/placeholder.jpg"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* কন্টেন্ট */}
        <div className="w-full p-4 flex flex-col items-center text-center flex-grow">
          <div className="w-full">
            <h3 className="text-white text-sm font-bold leading-snug min-h-[40px] mb-2 hover:text-green-400 transition-colors line-clamp-2">
              {product.title} {storageInfo}
            </h3>
          </div>

          <div className="h-5 mb-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={13} className="text-white" />
              ))}
              <span className="text-gray-400 text-[10px] ml-1">( {product.totalReviews} )</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-white font-medium text-[17px]">
              Tk {displayPrice}.00
            </p>
            {oldPrice && (
              <span className="text-[14px] text-gray-400 line-through">
                Tk {oldPrice}.00
              </span>
            )}
          </div>

          <div className="mt-auto  w-full">
            <button 
              onClick={handleAddToCart}
              className="w-full border-2  border-gray-300 text-white py-3 rounded-xl text-xs font-semibold hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider relative z-10"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}