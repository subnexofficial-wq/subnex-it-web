// src/components/home/StreamingSection.jsx
import Image from "next/image";
import { FaStar } from "react-icons/fa";

// ১০টি স্ট্রিমিং প্রোডাক্টের ডাটা
const products = [
  { id: 1, title: "Zee5 Subscription", image: "/products2/s1.jpg", rating: 5, reviews: 2, price: "Tk 1,800.00 BDT", buttonText: "Add to cart" },
  { id: 2, title: "Disney+ Hotstar (JioHotstar) Original", image: "/products2/s2.jpg", rating: 5, reviews: 1, price: "From Tk 2,500.00 BDT", buttonText: "Choose options" },
  { id: 3, title: "SonyLiv Subscription", image: "/products2/s3.jpg", rating: 0, reviews: 0, price: "Tk 2,800.00 BDT", buttonText: "Add to cart" },
  { id: 4, title: "Hulu Subscription [VPN REQUIRED]", image: "/products2/s4.jpg", rating: 0, reviews: 0, price: "From Tk 340.00 BDT", buttonText: "Choose options" },
  { id: 5, title: "Crunchyroll Premium", image: "/products2/s5.jpg", rating: 5, reviews: 4, price: "From Tk 290.00 BDT", buttonText: "Choose options" },
  { id: 6, title: "iQIYI VIP Subscription", image: "/products2/s6.jpg", rating: 5, reviews: 5, price: "From Tk 360.00 BDT", buttonText: "Choose options" },
  { id: 7, title: "DisneyPlus Premium", image: "/products2/s7.jpg", rating: 0, reviews: 0, price: "Tk 350.00 BDT", buttonText: "Add to cart" },
  { id: 8, title: "Amazon Prime Video", image: "/products2/s8.jpg", rating: 4, reviews: 10, price: "From Tk 250.00 BDT", buttonText: "Choose options" },
  { id: 9, title: "Netflix 4K UHD", image: "/products2/s9.jpg", rating: 5, reviews: 50, price: "Tk 390.00 BDT", buttonText: "Add to cart" },
  { id: 10, title: "Discovery+ Premium", image: "/products2/s10.jpg", rating: 5, reviews: 3, price: "Tk 400.00 BDT", buttonText: "Choose options" },
];

const StreamingSection = () => {
  return (
    <div className="w-full bg-white py-10 border-t border-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* সেকশন টাইটেল */}
        <h2 className="text-black text-xl md:text-2xl font-bold mb-6 uppercase tracking-wide">
          STREAMING PLATFORMS
        </h2>

        {/* ১০টি কার্ডের গ্রিড (৫ কলাম) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-12">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group flex flex-col items-center bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-gray-500 transition-colors duration-300"
            >
              
              {/* ইমেজ */}
              <div className="relative w-full aspect-[3/4] bg-gray-900">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* কন্টেন্ট */}
              <div className="w-full p-3 flex flex-col items-center text-center">
                <h3 className="text-white text-xs md:text-sm font-medium leading-snug min-h-[35px] hover:text-red-500 transition-colors cursor-pointer line-clamp-2">
                  {product.title}
                </h3>

                {/* রেটিং (যদি থাকে) */}
                <div className="flex items-center gap-1 my-1.5 h-4">
                  {product.rating > 0 && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={10}
                          className={i < product.rating ? "text-white" : "text-gray-700"}
                        />
                      ))}
                      <span className="text-gray-400 text-[10px] ml-1">({product.reviews})</span>
                    </>
                  )}
                </div>

                <p className="text-white font-bold text-sm mb-3">
                  {product.price}
                </p>

                <button className="w-full border border-gray-600 text-white py-2 rounded-[4px] text-[10px] md:text-xs font-bold hover:border-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider">
                  {product.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================
             ব্যানার ইমেজ (কার্ডের নিচে)
           ========================================= */}
        <div className="w-full relative aspect-[2/1] md:aspect-[3/1] lg:aspect-[3.5/1] rounded-xl overflow-hidden border border-gray-800">
          <Image
            src="/products2/bottom-banner.jpg" // আপনার ব্যানারের পাথ দিন
            alt="Promotional Banner"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

      </div>
    </div>
  );
};

export default StreamingSection;