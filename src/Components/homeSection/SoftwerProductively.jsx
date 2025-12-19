
"use client"

// src/components/home/ProductivitySection.jsx
import Image from "next/image";
import { FaStar } from "react-icons/fa";

// ৬টি প্রোডাক্টিভিটি আইটেমের ডাটা
const productivityItems = [
  { 
    id: 1, 
    title: "Google One (Google Drive Storage)", 
    image: "/productivity/google-one.jpg", 
    rating: 0, reviews: 0, 
    price: "From Tk 300.00 BDT", 
    buttonText: "Choose options",
    soldOut: false
  },
  { 
    id: 2, 
    title: "Apple iCloud+ Storage Upgrade", 
    image: "/productivity/icloud.jpg", 
    rating: 0, reviews: 0, 
    price: "From Tk 900.00 BDT", 
    buttonText: "Choose options",
    soldOut: false
  },
  { 
    id: 3, 
    title: "Apple One Subscription", 
    image: "/productivity/apple-one.jpg", 
    rating: 5, reviews: 1, 
    price: "Tk 1,300.00 BDT", 
    buttonText: "Sold out",
    soldOut: true // সোল্ড আউট
  },
  { 
    id: 4, 
    title: "Windows Pro Retail Key", 
    image: "/productivity/windows.jpg", 
    rating: 5, reviews: 1, 
    price: "Tk 500.00 BDT", 
    buttonText: "Choose options",
    soldOut: false
  },
  { 
    id: 5, 
    title: "MS Office 365 Personal", 
    image: "/productivity/office365.jpg", 
    rating: 0, reviews: 0, 
    price: "Tk 600.00 BDT", 
    buttonText: "Add to cart",
    soldOut: false
  },
  { 
    id: 6, 
    title: "IDM Lifetime License", 
    image: "/productivity/idm.jpg", 
    rating: 5, reviews: 2, 
    price: "Tk 1,500.00 BDT", 
    buttonText: "Add to cart",
    soldOut: false
  }
];

const SoftwerProductively = () => {
  return (
    <div className="w-full bg-white py-10 border-t border-gray-900">
      <div className=" px-4 sm:px-6">
        
        {/* সেকশন টাইটেল */}
        <h2 className="text-black text-xl md:text-2xl font-bold mb-8 uppercase tracking-wide">
          SOFTWARE & PRODUCTIVITY
        </h2>

        {/* ৫ কলামের গ্রিড (৬টি আইটেম হওয়ায় ২য় সারিতে ১টি কার্ড থাকবে) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {productivityItems.map((item) => (
            <div 
              key={item.id} 
              className="group flex flex-col items-center bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-500 transition-colors duration-300"
            >
              
              {/* ইমেজ কন্টেইনার */}
              <div className="relative w-full aspect-[3/4] bg-gray-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={`object-cover transition-transform duration-500 group-hover:scale-105 ${item.soldOut ? 'opacity-60' : ''}`}
                />
                
                {/* Sold out ব্যাজ */}
                {item.soldOut && (
                  <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                    Sold out
                  </span>
                )}
              </div>

              {/* কন্টেন্ট */}
              <div className="w-full p-4 flex flex-col items-center text-center flex-grow">
                
                {/* টাইটেল */}
                <h3 className="text-white text-sm font-bold leading-snug min-h-[40px] mb-2 hover:text-green-400 transition-colors cursor-pointer">
                  {item.title}
                </h3>

                {/* রেটিং (যদি থাকে) */}
                <div className="h-5 mb-1 flex items-center gap-1 justify-center w-full">
                  {item.rating > 0 && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={10}
                          className={i < item.rating ? "text-white" : "text-gray-700"}
                        />
                      ))}
                      <span className="text-gray-400 text-[10px] ml-1">({item.reviews})</span>
                    </>
                  )}
                </div>

                {/* দাম */}
                <p className="text-white font-medium text-sm mb-4">
                  {item.price}
                </p>

                {/* বাটন */}
                <button 
                  disabled={item.soldOut}
                  className={`mt-auto w-full border text-white py-2.5 rounded text-xs font-semibold transition-all duration-300 uppercase tracking-wider
                    ${item.soldOut 
                      ? "border-gray-700 text-gray-500 cursor-not-allowed" 
                      : "border-gray-500 hover:bg-white hover:text-black hover:border-white"
                    }
                  `}
                >
                  {item.buttonText}
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default SoftwerProductively;