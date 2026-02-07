"use client";
import React from 'react';
import { motion } from "framer-motion";

const PartnerSlider = ({ logos }) => {
    const duplicatedLogos = [...logos, ...logos];

    return (
        <section className="py-20 bg-[#020617] overflow-hidden flex flex-col gap-12">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-widest">
                    আমাদের পার্টনারসমূহ
                </h2>
                <div className="h-1 w-20 bg-cyan-500 mx-auto mt-4 rounded-full opacity-50"></div>
            </div>

            <div className="flex flex-col gap-8">
                {/* প্রথম স্লাইডার: বাম দিকে */}
                <div className="relative flex overflow-hidden">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <motion.div
                                key={`left-${index}`}
                                className="mx-6 w-44 h-24 flex items-center justify-center  backdrop-blur-sm rounded-2xl p-4 cursor-pointer shadow-lg"
                                // মাউস নিলে বড় হবে (scale: 1.15) এবং বর্ডার গ্লো করবে
                                whileHover={{ 
                                    scale: 1.15, 
                                    borderColor: "rgba(0, 229, 255, 0.6)",
                                    boxShadow: "0px 0px 20px rgba(0, 229, 255, 0.2)",
                                    transition: { duration: 0.3 } 
                                }}
                            >
                                <img src={logo} alt="Partner" className="max-w-full max-h-full object-contain" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* দ্বিতীয় স্লাইডার: ডান দিকে */}
                <div className="relative flex overflow-hidden">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <motion.div
                                key={`right-${index}`}
                                className="mx-6 w-44 h-24 flex items-center justify-center backdrop-blur-sm rounded-2xl p-4 cursor-pointer shadow-lg"
                             
                                whileHover={{ 
                                    scale: 1.15, 
                                    borderColor: "rgba(0, 229, 255, 0.6)",
                                    boxShadow: "0px 0px 20px rgba(0, 229, 255, 0.2)",
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <img src={logo} alt="Partner" className="max-w-full max-h-full object-contain" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PartnerSlider;