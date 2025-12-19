// src/components/home/DatingSection.jsx
import Image from "next/image";

// ১টি ডেটিং আইটেমের ডাটা
const datingItems = [
  { 
    id: 1, 
    title: "Tinder Gold Subscription", 
    image: "/lifestyle/tinder.jpg", 
    price: "From Tk 890.00 BDT", 
    buttonText: "Choose options"
  }
];

const DatingSection = () => {
  return (
    <div className="w-full bg-white py-10 border-t border-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* সেকশন টাইটেল */}
        <h2 className="text-black text-xl md:text-2xl font-bold mb-8 uppercase tracking-wide">
          DATING & LIFESTYLE
        </h2>

        {/* ৫ কলামের গ্রিড (১টি আইটেম হওয়ায় বাম পাশে থাকবে) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {datingItems.map((item) => (
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

export default DatingSection;