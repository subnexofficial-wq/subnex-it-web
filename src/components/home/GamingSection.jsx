// src/components/home/GamingSection.jsx
import Image from "next/image";

// ৭টি গেমিং প্রোডাক্টের ডাটা
const gamingProducts = [
  { 
    id: 1, 
    title: "PUBG Mobile UC", 
    image: "/games/pubg.jpg", 
    price: "Tk 0.00 BDT", 
    buttonText: "Sold out",
    soldOut: true // সোল্ড আউট লজিক
  },
  { 
    id: 2, 
    title: "PlayStation (PSN) Gift Cards", 
    image: "/games/psn.jpg", 
    price: "From Tk 650.00 BDT", 
    buttonText: "Choose options",
    soldOut: false
  },
  { 
    id: 3, 
    title: "Steam Wallet Giftcard", 
    image: "/games/steam.jpg", 
    price: "From Tk 800.00 BDT", 
    buttonText: "Choose options",
    soldOut: false
  },
  { 
    id: 4, 
    title: "Valorant Points (VP)", 
    image: "/games/valorant.jpg", 
    price: "Tk 0.00 BDT", 
    buttonText: "Sold out",
    soldOut: true
  },
  { 
    id: 5, 
    title: "Free Fire Diamonds", 
    image: "/games/freefire.jpg", 
    price: "From Tk 85.00 BDT", 
    buttonText: "Choose options",
    soldOut: false
  },
  { 
    id: 6, 
    title: "Roblox Giftcard", 
    image: "/games/roblox.jpg", 
    price: "Tk 0.00 BDT", 
    buttonText: "Sold out",
    soldOut: true
  },
  { 
    id: 7, 
    title: "Google Play Gift Card", 
    image: "/games/googleplay.jpg", 
    price: "From Tk 500.00 BDT", 
    buttonText: "Choose options",
    soldOut: false
  }
];

const GamingSection = () => {
  return (
    <div className="w-full bg-white py-10 border-t border-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* সেকশন টাইটেল */}
        <h2 className="text-black text-xl md:text-2xl font-bold mb-8 uppercase tracking-wide">
          GAMES & TOP-UP
        </h2>

        {/* গ্রিড লেআউট */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {gamingProducts.map((item) => (
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
                
                {/* Sold out ব্যাজ (যদি soldOut সত্য হয়) */}
                {item.soldOut && (
                  <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                    Sold out
                  </span>
                )}
              </div>

              {/* কন্টেন্ট */}
              <div className="w-full p-4 flex flex-col items-center text-center flex-grow">
                
                {/* টাইটেল */}
                <h3 className="text-white text-sm font-bold leading-snug min-h-[40px] mb-3 hover:text-green-400 transition-colors cursor-pointer">
                  {item.title}
                </h3>

                {/* দাম */}
                <p className="text-white font-medium text-sm mb-4">
                  {item.price}
                </p>

                {/* বাটন */}
                <button 
                  disabled={item.soldOut} // সোল্ড আউট হলে বাটন কাজ করবে না
                  className={`mt-auto w-full border text-white py-2.5 rounded text-xs font-semibold transition-all duration-300 uppercase tracking-wider
                    ${item.soldOut 
                      ? "border-gray-700 text-gray-500 cursor-not-allowed" // সোল্ড আউট স্টাইল
                      : "border-gray-500 hover:bg-white hover:text-black hover:border-white" // একটিভ স্টাইল
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

export default GamingSection;