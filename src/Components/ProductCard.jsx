
"use client"
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product._id}`} className="group flex flex-col items-center bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-500 transition-colors duration-300">
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
        <Link href={`/products/${product._id}`} className="w-full">
          <h3 className="text-white text-sm font-bold leading-snug min-h-[40px] mb-2 hover:text-green-400 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

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
            Tk {product.discountPrice || product.regularPrice}.00
          </p>
          {product.discountPrice && (
            <span className="text-[14px] text-gray-400 line-through">
              Tk {product.regularPrice}
            </span>
          )}
        </div>

        <Link href={`/products/${product._id}`} className="mt-auto w-full">
          <button className="w-full border border-gray-500 text-white py-2.5 rounded text-xs font-semibold hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider">
            View Details
          </button>
        </Link>
      </div>
    </Link>
  );
}