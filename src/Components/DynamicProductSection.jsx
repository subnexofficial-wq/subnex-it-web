"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useCart } from "@/hooks/CartContext";
import CartPopup from "@/Components/CartPopup"; 

const DynamicProductSection = ({ products, sectionTitle }) => {
  const { addToCart } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (!products || products.length === 0) return null;


  const handleAddToCart = async (e, product, price, variant) => {
    e.preventDefault();
    e.stopPropagation(); 
    await addToCart(product, price, 1, variant);
    setIsPopupOpen(true);
  };

  return (
    <div className="w-full bg-white py-10">
      {/* কার্ট পপআপ */}
      <CartPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      <div className="px-4 sm:px-6 container mx-auto">
        <h2 className="text-black text-xl md:text-2xl font-bold mb-8 uppercase tracking-wide">
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => {
            const hasVariants = product.variants && product.variants.length > 0;
            const defaultVariant = hasVariants ? product.variants[0] : null;
            
            const mainPrice = hasVariants 
              ? (defaultVariant.discountPrice > 0 ? defaultVariant.discountPrice : defaultVariant.price)
              : (product.discountPrice || product.regularPrice);

            const oldPrice = hasVariants
              ? (defaultVariant.discountPrice > 0 ? defaultVariant.price : null)
              : (product.discountPrice ? product.regularPrice : null);

            const storageInfo = product.storageSize ? `(${product.storageSize})` : "";

            return (
              <Link 
                href={`/products/${product._id}`} 
                key={product._id} 
                className="group flex flex-col items-center bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-500 transition-colors duration-300 shadow-sm"
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
                        <FaStar key={i} size={10} className="text-white" />
                      ))}
                      <span className="text-gray-400 text-[10px] ml-1">(Verified)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-white font-medium text-[17px]">
                      Tk {mainPrice}.00
                    </p>
                    {oldPrice && (
                      <span className="text-[14px] text-gray-400 line-through">Tk {oldPrice}.00</span>
                    )}
                  </div>

                  <div className="mt-auto w-full relative z-10">
                    <button 
                      onClick={(e) => handleAddToCart(e, product, mainPrice, defaultVariant)}
                      className="w-full border-2 border-gray-300 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DynamicProductSection;