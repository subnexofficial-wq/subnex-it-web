// src/components/home/VpnSection.jsx
import Image from "next/image";
import { FaStar } from "react-icons/fa";

// ১টি ভিপিএন আইটেমের ডাটা
const vpnItems = [
  { 
    id: 1, 
    title: "SurfShark VPN", 
    image: "/vpn/surfshark.jpg", 
    rating: 0, reviews: 0, 
    price: "From Tk 400.00 BDT", 
    buttonText: "Choose options",
    soldOut: false
  }
];

const VpnSection = () => {
  return (
    <div className="w-full bg-black py-10 border-t border-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* সেকশন টাইটেল */}
        <h2 className="text-white text-xl md:text-2xl font-bold mb-8 uppercase tracking-wide">
          VPN & SECURITY
        </h2>

        {/* ৫ কলামের গ্রিড (১টি আইটেম হওয়ায় বাম পাশে থাকবে) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {vpnItems.map((item) => (
            <div 
              key={item.id} 
              className="group flex flex-col items-center bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-500 transition-colors duration-300"
            >
              
              {/* ইমেজ কন্টেইনার */}
              <div className="relative w-full aspect-square bg-gray-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* কন্টেন্ট */}
              <div className="w-full p-4 flex flex-col items-center text-center flex-grow">
                
                {/* টাইটেল */}
                <h3 className="text-white text-sm font-bold leading-snug min-h-[40px] mb-2 hover:text-green-400 transition-colors cursor-pointer">
                  {item.title}
                </h3>

                {/* রেটিং (এই কার্ডে নেই, তবে স্ট্রাকচার ঠিক রাখার জন্য রাখা হলো) */}
                <div className="h-5 mb-1 flex items-center gap-1 justify-center w-full">
                  {/* রেটিং থাকলে এখানে দেখাবে */}
                </div>

                {/* দাম */}
                <p className="text-white font-medium text-sm mb-4">
                  {item.price}
                </p>

                {/* বাটন */}
                <button 
                  className="mt-auto w-full border border-gray-500 text-white py-2.5 rounded text-xs font-semibold hover:bg-white hover:text-black hover:border-white transition-all duration-300 uppercase tracking-wider"
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

export default VpnSection;