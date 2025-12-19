// src/components/home/FeaturedPromo.jsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const promos = [
  {
    id: 1,
    category: "SHARED",
    title: "CHATGPT PLUS",
    description:
      "Unlock Premium Features with ChatGPT Plus - Faster, Smarter, and Ready to Assist!",
    image: "/chatgpt.jpeg",
    reverse: false,
  },
  {
    id: 2,
    category: "PREMIUM",
    title: "QUILLBOT PREMIUM",
    description:
      "Writing Made Easy! Unlock QuillBot for Perfect Rephrasing, Summarizing & More!",
    image: "/quillbot.jpeg",
    reverse: true,
  },
  {
    id: 3,
    category: "IDM",
    title: "LIFETIME KEY",
    description:
      "Download Anything Faster! Boost Your Speed with IDM - The Ultimate Download Manager!",
    image: "/internet.jpeg",
    reverse: false,
  },
];

export default function FeaturedPromo() {
  return (
    <section className="w-full py-24 bg-[#121212] border-t border-green-500/10">
      <div className="container  mx-auto px-4 sm:px-7">
        <div className="flex flex-col gap-5 ">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`flex flex-col md:flex-row justify-between items-center gap-10 md:gap-10 lg:gap-20 ${
                promo.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* ===== Image Section ===== */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: -5,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="relative w-full  lg:w-3/4 h-[60vh] aspect-[4/3] md:aspect-video
                              overflow-hidden
                             hover:shadow-[0_0_60px_rgba(34,197,94,0.35)]"
                >
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className=""
                  />
                  {/* Glass glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* ===== Text Section ===== */}
              <motion.div
                initial={{ opacity: 0, x: promo.reverse ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full  space-y-6"
              >
                <span className="inline-block text-xs font-bold uppercase tracking-[0.3em]
                                 text-green-400 border-b border-green-400 pb-1">
                  {promo.category}
                </span>

                <h3 className="text-3xl md:text-5xl font-black uppercase text-green-500 leading-tight">
                  {promo.title}
                </h3>

                <p className="text-green-300/80 max-w-md leading-relaxed">
                  {promo.description}
                </p>

                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center
                             px-10 py-3.5 rounded-lg font-bold uppercase tracking-widest
                             bg-white text-black
                             hover:bg-green-500 hover:text-white
                             transition-all duration-300
                             shadow-md hover:shadow-[0_0_25px_rgba(34,197,94,0.7)]"
                >
                  Buy Now
                </motion.button>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
