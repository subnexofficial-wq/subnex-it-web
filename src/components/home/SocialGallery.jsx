// src/components/home/SocialGallery.jsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Tilt } from "react-tilt"; // 3D ইফেক্ট লাইব্রেরি
import { FiX, FiCheckCircle } from "react-icons/fi";
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";

// === ১৯টি পোস্টের ডাটা ===
// নোট: public/gallery/ ফোল্ডারে g1.jpg থেকে g19.jpg ছবিগুলো থাকতে হবে।
const socialPosts = [
  {
    id: 1,
    image: "/gallery/g1.jpg",
    date: "7 March",
    text: `🔥 আপনার বিনোদন, আপনার নিয়ন্ত্রণে! YouTube Premium সাবস্ক্রিপশন এখন হাতের নাগালে।\n\nবিজ্ঞাপন ছাড়াই ভিডিও দেখুন, ব্যাকগ্রাউন্ডে গান শুনুন এবং অফলাইনে ভিডিও ডাউনলোড করুন। FanFlix BD দিচ্ছে সেরা দামে ইউটিউব প্রিমিয়াম।\n\n✅ ১ মাস ও ৩ মাসের প্যাকেজ।\n✅ পার্সোনাল মেইল এ অ্যাক্টিভেশন।\n\nঅর্ডার করতে ভিজিট করুন: fanflixbd.com`,
  },
  {
    id: 2,
    image: "/gallery/g2.jpg",
    date: "6 March",
    text: `🎬 Netflix Premium - বাফারিং ছাড়াই 4K স্ট্রিমিং!\n\nশেয়ার্ড এবং প্রাইভেট প্রোফাইল এভেলেবল। কোনো ভিপিএন লাগবে না। গ্যারান্টি সহ সেবা।\n\nপ্যাকেজ শুরু মাত্র ৩৯০ টাকা থেকে!`,
  },
  {
    id: 3,
    image: "/gallery/g3.jpg",
    date: "5 March",
    text: `🎵 Spotify Premium - মিউজিক লাভারদের জন্য সুখবর!\n\nআনলিমিটেড স্কিপ, নো অ্যাডস, হাই কোয়ালিটি অডিও। নিজের একাউন্টে প্রিমিয়াম নিন খুব সহজে।`,
  },
  {
    id: 4,
    image: "/gallery/g4.jpg",
    date: "4 March",
    text: `📦 আমদের সেরা কম্বো প্যাকেজ!\n\nNetflix + Prime Video + Spotify একসাথে কিনলে পাচ্ছেন বিশেষ ছাড়। দেরি না করে আজই অর্ডার করুন।`,
  },
  {
    id: 5,
    image: "/gallery/g5.jpg",
    date: "3 March",
    text: `🚀 ChatGPT Plus - আপনার কাজের গতি বাড়ান ১০ গুণ!\n\nGPT-4 এর সুবিধা নিন, ফাস্ট রেসপন্স এবং প্রাইওরিটি এক্সেস। সাথে আছে Quillbot এবং Grammarly সাপোর্ট।`,
  },
  {
    id: 6,
    image: "/gallery/g6.jpg",
    date: "2 March",
    text: `🎮 Gamers Alert! PUBG Mobile UC এবং Free Fire Diamond টপ-আপ করুন সবচেয়ে কম দামে এবং ট্রাস্টের সাথে।`,
  },
  {
    id: 7,
    image: "/gallery/g7.jpg",
    date: "1 March",
    text: `🔒 Surfshark & NordVPN - অনলাইন নিরাপত্তা এখন আপনার হাতে। প্রিমিয়াম ভিপিএন দিয়ে আনব্লক করুন যেকোনো কন্টেন্ট।`,
  },
  {
    id: 8,
    image: "/gallery/g8.jpg",
    date: "28 Feb",
    text: `📚 শিক্ষামূলক টুলস: Duolingo, Coursera এবং Udemy কোর্স আনলক করুন আমাদের মাধ্যমে।`,
  },
  {
    id: 9,
    image: "/gallery/g9.jpg",
    date: "27 Feb",
    text: `📺 SonyLIV এবং Zee5 সাবস্ক্রিপশন নিয়ে দেখুন ইন্ডিয়ান সব লেটেস্ট সিরিজ এবং মুভি।`,
  },
  {
    id: 10,
    image: "/gallery/g10.jpg",
    date: "26 Feb",
    text: `🍏 Apple One এবং iCloud স্টোরেজ আপগ্রেড করুন বিকাশ বা নগদের মাধ্যমে পেমেন্ট করে।`,
  },
  {
    id: 11,
    image: "/gallery/g11.jpg",
    date: "25 Feb",
    text: `🎨 Canva Pro - ডিজাইনারদের জন্য লাইফটাইম এক্সেস। আনলিমিটেড টেম্পলেট এবং প্রিমিয়াম ফিচার।`,
  },
  {
    id: 12,
    image: "/gallery/g12.jpg",
    date: "24 Feb",
    text: `💻 Windows 10/11 Pro জেনুইন রিটেইল কি (Retail Key) কিনুন লাইফটাইম গ্যারান্টি সহ।`,
  },
  {
    id: 13,
    image: "/gallery/g13.jpg",
    date: "23 Feb",
    text: `🛡️ Kaspersky এবং ESET এন্টিভাইরাস দিয়ে আপনার পিসি রাখুন সুরক্ষিত।`,
  },
  {
    id: 14,
    image: "/gallery/g14.jpg",
    date: "22 Feb",
    text: `📥 IDM Lifetime License - ডাউনলোড স্পিড বাড়ান এবং যেকোনো ভিডিও ডাউনলোড করুন এক ক্লিকে।`,
  },
  {
    id: 15,
    image: "/gallery/g15.jpg",
    date: "21 Feb",
    text: `🎁 Steam Wallet এবং Google Play Gift Card কিনুন ইনস্ট্যান্ট ডেলিভারিতে।`,
  },
  {
    id: 16,
    image: "/gallery/g16.jpg",
    date: "20 Feb",
    text: `⚽ খেলা দেখুন লাইভ! Bein Sports এবং Hotstar সাবস্ক্রিপশন এভেলেবল।`,
  },
  {
    id: 17,
    image: "/gallery/g17.jpg",
    date: "19 Feb",
    text: `🤖 Jasper AI এবং Midjourney দিয়ে কন্টেন্ট ক্রিয়েশন এবং আর্ট জেনারেট করুন প্রফেশনালভাবে।`,
  },
  {
    id: 18,
    image: "/gallery/g18.jpg",
    date: "18 Feb",
    text: `☁️ Google One (Drive) স্টোরেজ বাড়ান ১০০ জিবি থেকে ২ টিবি পর্যন্ত।`,
  },
  {
    id: 19,
    image: "/gallery/g19.jpg",
    date: "17 Feb",
    text: `❤️ Tinder Gold এবং Bumble সাবস্ক্রিপশন দিয়ে খুঁজে নিন আপনার পার্টনারকে।`,
  },
];

// === 3D অপশনস ===
const slideTiltOptions = {
  max: 15,
  scale: 1.05,
  speed: 400,
  glare: true,
  "max-glare": 0.5,
};

const popupTiltOptions = {
  max: 5,        
  scale: 1.00,   
  speed: 1000,
  glare: false,  
};

const SocialGallery = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="w-full bg-black py-16 border-t border-gray-900">
      <div className="w-full px-4">
        
        {/* === ১. অটোমেটিক স্লাইডার === */}
        <Swiper
          slidesPerView={2}
          spaceBetween={15}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 25 },
            1024: { slidesPerView: 5, spaceBetween: 30 },
            1400: { slidesPerView: 6, spaceBetween: 30 },
          }}
          modules={[Autoplay, Navigation]}
          className="w-full h-auto py-10"
        >
          {socialPosts.map((post) => (
            <SwiperSlide key={post.id} className="cursor-pointer">
              {/* কার্ডের 3D ইফেক্ট */}
              <Tilt options={slideTiltOptions}>
                <div 
                  className="relative w-full aspect-[9/16] rounded-xl overflow-hidden border-2 border-transparent hover:border-red-600 transition-colors duration-300 group shadow-lg"
                  onClick={() => setSelectedPost(post)}
                >
                  <Image
                    src={post.image}
                    alt={`Gallery Image ${post.id}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <FaFacebook className="text-white text-4xl drop-shadow-lg" />
                  </div>
                </div>
              </Tilt>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* === ২. পপআপ মোডাল (3D ইফেক্ট সহ) === */}
        {selectedPost && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 md:p-4 backdrop-blur-md">
            
            {/* ক্লোজ বাটন */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-white bg-gray-800/80 hover:bg-red-600 p-2 rounded-full transition-colors z-[110]"
            >
              <FiX size={24} />
            </button>

            {/* পপআপ কন্টেইনার (3D Tilt Wrapper) */}
            <Tilt options={popupTiltOptions} className="w-full h-full max-w-5xl md:h-[75vh]">
              <div className="bg-white w-full h-full rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in border border-gray-800">
                
                {/* --- বাম পাশ: ফুল ইমেজ --- */}
                <div className="w-full md:w-[60%] h-[40%] md:h-full relative bg-black">
                  <Image
                    src={selectedPost.image}
                    alt="Post Detail"
                    fill
                    // এখানে object-cover দেওয়া হয়েছে যাতে ইমেজ পুরো বক্স ফিল করে
                    className="object-cover"
                  />
                </div>

                {/* --- ডান পাশ: টেক্সট ডিটেইলস --- */}
                <div className="w-full md:w-[40%] h-[60%] md:h-full bg-white flex flex-col">
                  
                  {/* হেডার */}
                  <div className="p-4 border-b flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">F</div>
                    <div>
                      <h3 className="font-bold text-sm flex items-center gap-1">
                        fanflix.bd <FiCheckCircle className="text-blue-500 fill-blue-500 text-xs bg-white rounded-full" />
                      </h3>
                      <p className="text-xs text-gray-500">Suggested for you • {selectedPost.date}</p>
                    </div>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="ml-auto text-blue-600 hover:text-blue-700">
                      <FaFacebook className="text-2xl" />
                    </a>
                  </div>

                  {/* টেক্সট এরিয়া (স্ক্রল হবে) */}
                  <div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed font-medium">
                      {selectedPost.text}
                    </p>
                  </div>

                  {/* ফুটার বাটনস */}
                  <div className="p-4 border-t bg-gray-50 shrink-0">
                    <div className="flex gap-3">
                      <a 
                        href="https://fanflixbd.com" 
                        target="_blank"
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-md hover:shadow-lg text-center"
                      >
                        Visit Website
                      </a>
                      <a 
                        href="https://wa.me/01978134960" 
                        target="_blank"
                        className="flex-1 border border-green-500 text-green-600 py-3 rounded-lg text-sm font-bold hover:bg-green-50 transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <FaWhatsapp size={18} /> Chat Now
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </Tilt>
          </div>
        )}

      </div>
    </div>
  );
};

export default SocialGallery;