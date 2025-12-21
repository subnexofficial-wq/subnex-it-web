
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMinus, FiPlus, FiShare2, FiStar, FiChevronDown, FiChevronUp, FiX, FiCheckCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

const SingleProductClient = ({ product, relatedProducts }) => {
    const [quantity, setQuantity] = useState(1);
    const [showMoreDesc, setShowMoreDesc] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="w-full min-h-screen bg-white pb-20 font-sans text-black">
            {/* Breadcrumb */}
            <div className="max-w-[1200px] mx-auto px-4 pt-6 pb-2">
                <div className="text-sm text-blue-800 flex items-center gap-1 font-medium">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span className="text-gray-400">›</span>
                    <Link href="/products" className="hover:underline">Products</Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-600 truncate">{product.title}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1200px] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* ইমেজ সেকশন */}
                <div className="w-full sticky top-24">
                    <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        <Image src={product.thumbnail} alt={product.title} fill className="object-cover" />
                    </div>
                </div>

                {/* কন্টেন্ট সেকশন */}
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900">{product.title}</h1>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-red-600">Tk {product.discountPrice || product.regularPrice}.00</span>
                        {product.discountPrice && (
                            <span className="text-lg text-gray-400 line-through">Tk {product.regularPrice}.00</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-red-600 text-sm">
                            {[...Array(5)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">Verified Product</span>
                    </div>

                    {/* Validity Badge */}
                    <div className="mb-6">
                        <p className="font-bold mb-2 text-sm text-gray-700">Validity</p>
                        <button className="border-2 border-black px-4 py-2 text-xs font-bold bg-white text-black">
                            {product.validity || product.duration}
                        </button>
                    </div>

                    {/* Quantity */}
                    <div className="mb-8">
                        <p className="font-bold mb-2 text-sm text-gray-700">Quantity</p>
                        <div className="flex items-center border border-gray-400 w-32 rounded h-10">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-100"><FiMinus /></button>
                            <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-100"><FiPlus /></button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 mb-10">
                        <button className="w-full bg-transparent border-2 border-black text-black py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition">Add to cart</button>
                        <button className="w-full bg-red-600 text-white py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition rounded-sm shadow-md">Buy it now</button>
                    </div>

                    {/* Package Details (Highlights) */}
                    <div className="mt-2">
                        <p className="font-bold text-lg mb-4 border-b pb-2">Highlights:</p>
                        <ul className={`space-y-2 text-sm font-medium text-gray-800 list-disc list-inside transition-all duration-500 overflow-hidden ${showMoreDesc ? 'max-h-[2000px]' : 'max-h-[220px]'}`}>
                            {product.highlights?.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                            {/* Full Description */}
                            {product.fullDescription && (
                                <p className="mt-4 text-gray-600 italic border-t pt-4">
                                    {product.fullDescription}
                                </p>
                            )}
                        </ul>
                        <button onClick={() => setShowMoreDesc(!showMoreDesc)} className="text-blue-600 underline mt-3 text-sm font-bold">
                            {showMoreDesc ? "See Less" : "See More"}
                        </button>
                    </div>

                    <div className="flex items-center gap-6 mt-8 border-t pt-6 text-gray-500">
                        <button className="flex items-center gap-2 hover:text-black transition"><FiShare2 /> Share</button>
                        <div className="flex items-center gap-1 text-teal-600"><FiCheckCircle /> 100% Genuine</div>
                    </div>
                </div>
            </div>

            {/* Related Products - Using DB Category Data */}
            <div className="max-w-[1200px] mx-auto px-4 py-8 mt-10">
                <h2 className="text-2xl font-bold mb-8">Related Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedProducts.map((item) => (
                        <Link key={item._id} href={`/product/${item._id}`} className="group">
                             <div className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition">
                                <div className="relative aspect-square">
                                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover group-hover:scale-105 transition" />
                                </div>
                                <div className="p-3 text-center">
                                    <h3 className="text-xs font-bold line-clamp-2 h-10">{item.title}</h3>
                                    <p className="text-red-600 font-bold mt-2">Tk {item.discountPrice || item.regularPrice}</p>
                                </div>
                             </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* WhatsApp Support */}
            <a href="https://wa.me/YOUR_NUMBER" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg font-bold hover:scale-110 transition">
                <FaWhatsapp size={24} />
                <span>WhatsApp Support</span>
            </a>
        </div>
    );
};

export default SingleProductClient;