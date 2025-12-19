// src/components/home/FeaturedPromo.jsx
"use client"; // এটি যোগ করতে হবে কারণ react-tilt ক্লায়েন্ট সাইডে চলে

import Image from "next/image";
import { Tilt } from "react-tilt"; // টিল্ট ইম্পোর্ট

const promos = [
  {
    id: 1,
    category: "SHARED",
    title: "CHATGPT PLUS",
    description: "Unlock Premium Features with ChatGPT Plus - Faster, Smarter, and Ready to Assist!",
    image: "/promo/chatgpt-banner.jpg",
    reverse: false 
  },
  {
    id: 2,
    category: "PREMIUM",
    title: "QUILLBOT PREMIUM",
    description: "Writing Made Easy! Unlock QuillBot for Perfect Rephrasing, Summarizing & More!",
    image: "/promo/quillbot-banner.jpg",
    reverse: true 
  },
  {
    id: 3,
    category: "IDM",
    title: "LIFETIME KEY",
    description: "Download Anything Faster! Boost Your Speed with IDM - The Ultimate Download Manager!",
    image: "/promo/idm-banner.jpg",
    reverse: false 
  }
];

// 3D টিল্ট অপশন
const defaultOptions = {
	reverse:        false,  // reverse the tilt direction
	max:            25,     // max tilt rotation (degrees)
	perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1.02,   // 2 = 200%, 1.5 = 150%, etc..
	speed:          1000,   // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          true,   // If the tilt effect has to be reset on exit.
	easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
};

const FeaturedPromo = () => {
  return (
    <div className="w-full  py-20 border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col gap-16 md:gap-24">
          {promos.map((promo) => (
            <div 
              key={promo.id} 
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 
                ${promo.reverse ? "md:flex-row-reverse" : "md:flex-row"}
              `}
            >
              
              {/* === 3D ইমেজ পার্ট (৫০%) === */}
              <div className="w-full md:w-1/2">
                <Tilt options={defaultOptions} className="w-full h-full">
                  <div className="relative w-full aspect-[4/3] md:aspect-video rounded-xl overflow-hidden border border-gray-800 shadow-[0_0_30px_rgba(0,255,100,0.1)] hover:shadow-[0_0_50px_rgba(0,255,100,0.3)] transition-shadow duration-500 cursor-pointer">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-cover"
                    />
                    {/* গ্লাস ইফেক্ট ওভারলে (শাইন করার জন্য) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                  </div>
                </Tilt>
              </div>

              {/* === টেক্সট পার্ট (৫০%) === */}
              {/* টেক্সটেও হালকা 3D ইফেক্ট দেওয়া হয়েছে */}
              <div className="w-full md:w-1/2 text-left space-y-5 transform transition-all duration-500 hover:translate-x-2">
                
                <span className="text-sm font-bold text-green-500 uppercase tracking-[0.2em] border-b-2 border-green-500 pb-1 inline-block">
                  {promo.category}
                </span>

                <h3 className="text-3xl md:text-5xl font-black text-white uppercase leading-none drop-shadow-lg" style={{ fontFamily: 'sans-serif' }}>
                  {promo.title}
                </h3>

                <p className="text-base text-gray-400 font-medium leading-relaxed max-w-md">
                  {promo.description}
                </p>

                <button className="bg-white text-black px-10 py-3.5 rounded font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] mt-4 transform hover:-translate-y-1">
                  Buy Now
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeaturedPromo;