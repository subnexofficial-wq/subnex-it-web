"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const promos = [
  {
    id: 1,
    category: "SHARED",
    title: "CHATGPT PLUS",
    description:
      "Unlock Premium Features with ChatGPT Plus - Faster, Smarter, and Ready to Assist!",
    image: "/chatgpt.jpg",
    reverse: false,
  },
  {
    id: 2,
    category: "PREMIUM",
    title: "QUILLBOT PREMIUM",
    description:
      "Writing Made Easy! Unlock QuillBot for Perfect Rephrasing, Summarizing & More!",
    image: "/quilbot.jpg",
    reverse: true,
  },
  {
    id: 3,
    category: "IDM",
    title: "LIFETIME KEY",
    description:
      "Download Anything Faster! Boost Your Speed with IDM - The Ultimate Download Manager!",
    image: "/internet.jpg",
    reverse: false,
  },
];

export default function FeaturedPromo() {
  return (
    <section className="w-full py-5 md:py-10 mt-20 bg-[#121212] border-t border-green-500/10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-7">
        <div className="flex flex-col gap-20">
          {" "}
       
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-20 ${
                promo.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
           {/* ===== Image Section  ===== */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  rotateX: 1,
                  rotateY: -1,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
             
                className="relative w-full md:w-[48%] h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-[2rem] overflow-hidden bg-[#0f0f0f] shadow-2xl border border-white/5"
              >
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
               
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  priority={promo.id === 1}
                />
                
                {/* Image Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem]" />
              </motion.div>
                            {/* ===== Text Section ===== */}
              <motion.div
                initial={{ opacity: 0, x: promo.reverse ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
           
                className={`w-full md:w-1/2 space-y-6 flex flex-col ${
                  promo.reverse
                    ? "md:items-end md:text-right"
                    : "md:items-start"
                }`}
              >
                <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-green-400 border-b border-green-400 pb-1">
                  {promo.category}
                </span>

                <h3 className="text-3xl md:text-5xl font-black uppercase text-green-500 leading-tight">
                  {promo.title}
                </h3>

                <p
                  className={`text-green-300/80 max-w-md leading-relaxed ${
                    promo.reverse ? "md:ml-auto" : ""
                  }`}
                >
                  {promo.description}
                </p>

                <Link href="/products">
                  <motion.span
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-10 py-3.5 rounded-lg font-bold uppercase tracking-widest bg-white text-black hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] cursor-pointer"
                  >
                    Buy Now
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
