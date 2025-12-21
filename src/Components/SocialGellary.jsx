"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheckCircle } from "react-icons/fi";
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";

// === Social Posts Data ===
const socialPosts = [
  { id: 1, image: "/socialpic/p1.jpg", date: "7 March", text: "🔥 YouTube Premium এখন হাতের নাগালে..." },
  { id: 2, image: "/socialpic/p2.jpg", date: "6 March", text: "🎬 Netflix Premium 4K স্ট্রিমিং!" },
  { id: 3, image: "/socialpic/p3.jpg", date: "5 March", text: "🎵 Spotify Premium নো অ্যাডস!" },
  { id: 4, image: "/socialpic/p4.jpg", date: "4 March", text: "📦 Combo Package স্পেশাল অফার!" },
  { id: 5, image: "/socialpic/p5.jpg", date: "3 March", text: "🚀 ChatGPT Plus GPT-4 এক্সেস!" },
  { id: 6, image: "/socialpic/p6.jpg", date: "2 March", text: "🎮 PUBG & Free Fire Top-up!" },
  { id: 7, image: "/socialpic/p7.jpg", date: "1 March", text: "🔒 Surfshark & NordVPN!" },
  { id: 8, image: "/socialpic/p2.jpg", date: "28 Feb", text: "📚 Duolingo, Coursera, Udemy!" },
  { id: 9, image: "/socialpic/p4.jpg", date: "27 Feb", text: "📺 SonyLIV & Zee5!" },
];

// =========================
export default function SocialGallery() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="w-full bg-white py-10 ">
      <div className="px-0">

        {/* ===== Slider ===== */}
        <Swiper
          slidesPerView={2}
          spaceBetween={15}
          loop
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1400: { slidesPerView: 6 },
          }}
          modules={[Autoplay, Navigation]}
          className="py-4"
        >
          {socialPosts.map(post => (
            <SwiperSlide key={post.id}>
              {/* === CARD with Framer Motion Hover === */}
              <motion.div
                whileHover={{
                  scale: 1.06,
                  rotateX: 6,
                  rotateY: -6,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={() => setSelectedPost(post)}
                className="relative cursor-pointer w-full aspect-[9/16] 
                           rounded-xl overflow-hidden shadow-lg
                           border-2 border-transparent hover:border-red-600 group"
              >
                <Image
                  src={post.image}
                  alt="Social Post"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/20 
                                group-hover:bg-black/40 transition
                                flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <FaFacebook className="text-white text-4xl" />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ===== Popup Modal ===== */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md 
                         flex items-center justify-center p-2 md:p-4"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 bg-gray-800/80 
                           hover:bg-red-600 p-2 rounded-full text-white z-[110]"
              >
                <FiX size={22} />
              </button>

              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.92, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 40 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full max-w-5xl h-full md:h-[75vh]"
              >
                <motion.div
                  whileHover={{ rotateX: 2, rotateY: -2 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  className="bg-white w-full h-full rounded-xl overflow-hidden
                             flex flex-col md:flex-row shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-[60%] h-[40%] md:h-full">
                    <Image
                      src={selectedPost.image}
                      alt="Post"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-[40%] flex flex-col">
                    <div className="p-4 border-b flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                        F
                      </div>
                      <div>
                        <h3 className="font-bold text-sm flex items-center gap-1">
                          fanflix.bd
                          <FiCheckCircle className="text-blue-500" />
                        </h3>
                        <p className="text-xs text-gray-500">
                          Suggested • {selectedPost.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 p-5 overflow-y-auto">
                      <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                        {selectedPost.text}
                      </p>
                    </div>

                    <div className="p-4 border-t bg-gray-50 flex gap-3">
                      <a
                        href="https://fanflixbd.com"
                        target="_blank"
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg 
                                   text-sm font-bold hover:bg-red-700 text-center"
                      >
                        Visit Website
                      </a>
                      <a
                        href="https://wa.me/01978134960"
                        target="_blank"
                        className="flex-1 border border-green-500 text-green-600 
                                   py-3 rounded-lg text-sm font-bold 
                                   hover:bg-green-50 flex items-center justify-center gap-2"
                      >
                        <FaWhatsapp size={18} /> Chat Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
