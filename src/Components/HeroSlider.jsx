"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { FiClock, FiChevronLeft, FiChevronRight, FiPause } from "react-icons/fi";

const HeroSlider = () => {
  const slides = [
    { id: 1, image: "/hero1.webp", alt: "Combo Offer" },
    { id: 2, image: "/hero2.webp", alt: "Why Choose Us" },
    { id: 3, image: "/hero3.webp", alt: "Easy Payment" },
    { id: 4, image: "/hero4.webp", alt: "All Subscriptions" },
    { id: 5, image: "/hero5.jpg", alt: "Special Discount" },
  ];

  return (
    <div className="w-full bg-white">

      {/* Top Info Bar */}
      <div className="bg-black text-white text-[10px] md:text-xs py-2 text-center font-bold flex justify-center gap-2">
        <FiClock className="text-pink-500 animate-pulse" />
        <span className="text-green-400">
          Service Time: 12 PM - 1 AM | ⏸ Friday After 2:30 PM
        </span>
      </div>

      {/* Slider */}
      <div className="relative w-full bg-gray-100 border-b  border-gray-300">
        <Swiper
          dir="ltr"                  
          loop={true}
          speed={800}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            el: ".custom-pagination-dots",
            clickable: true,
          }}
          navigation={{
            nextEl: ".custom-next-btn",
            prevEl: ".custom-prev-btn",
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-[200px]  md:h-[400px] lg:h-[450px] xl:h-[650px]"
        >
          {slides.map(slide => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={slide.id === 1}
                  className=""
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom Controls */}
        <div className="  py-3 w-52 mx-auto flex items-center justify-center gap-6">

          {/* Prev */}
          <button className="custom-prev-btn text-gray-400 hover:text-black">
            <FiChevronLeft size={22} />
          </button>

          {/* Dots */}
          <div className="custom-pagination-dots flex gap-3" />

          {/* Next */}
          <button className="custom-next-btn text-gray-400 hover:text-black">
            <FiChevronRight size={22} />
          </button>

          {/* Pause Icon (UI only) */}
          <div className="border-l pl-4">
            <FiPause className="text-gray-400 hover:text-black cursor-pointer" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSlider;
