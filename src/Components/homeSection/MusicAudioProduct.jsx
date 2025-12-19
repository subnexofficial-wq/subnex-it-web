

"use client"

// src/components/home/MusicAudioSection.jsx
import Image from "next/image";
import { FaStar } from "react-icons/fa";

// ২টি মিউজিক প্রোডাক্টের ডাটা
const musicTools = [
  { 
    id: 1, 
    title: "Apple Music Premium", 
    image: "/music/apple-music.jpg", 
    rating: 5, 
    reviews: 1, 
    price: "From Tk 350.00 BDT", 
    buttonText: "Choose options" 
  },
  { 
    id: 2, 
    title: "Spotify Premium Subscription", 
    image: "/music/spotify.jpg", 
    rating: 5, 
    reviews: 2, 
    price: "Tk 3,000.00 BDT", 
    buttonText: "Add to cart" 
  }
];

const MusicAudioProduct = () => {
  return (
    <div className="w-full bg-white py-10 border-t border-gray-900">
      <div className=" px-4 sm:px-6">
        
        {/* সেকশন টাইটেল */}
        <h2 className="text-black text-xl md:text-2xl font-bold mb-8 uppercase tracking-wide">
          MUSIC & AUDIO
        </h2>

        {/* ৫ কলামের গ্রিড (যাতে বাম পাশে থাকে) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {musicTools.map((tool) => (
            <div 
              key={tool.id} 
              className="group flex flex-col items-center bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-500 transition-colors duration-300"
            >
              
              {/* ইমেজ */}
              <div className="relative w-full aspect-square bg-gray-900">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* কন্টেন্ট */}
              <div className="w-full p-4 flex flex-col items-center text-center flex-grow">
                
                {/* টাইটেল */}
                <h3 className="text-white text-sm font-bold leading-snug min-h-[40px] mb-2 hover:text-green-400 transition-colors cursor-pointer">
                  {tool.title}
                </h3>

                {/* রেটিং */}
                <div className="h-5 mb-1 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={10}
                      className={i < tool.rating ? "text-white" : "text-gray-700"}
                    />
                  ))}
                  <span className="text-gray-400 text-[10px] ml-1">({tool.reviews})</span>
                </div>

                {/* দাম */}
                <p className="text-white font-medium text-sm mb-4">
                  {tool.price}
                </p>

                {/* বাটন (নিচে ফিক্স করা হয়েছে) */}
                <button className="mt-auto w-full border border-gray-500 text-white py-2.5 rounded text-xs font-semibold hover:bg-white hover:text-black hover:border-white transition-all duration-300 uppercase tracking-wider">
                  {tool.buttonText}
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MusicAudioProduct;