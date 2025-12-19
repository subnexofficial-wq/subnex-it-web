// src/components/home/HeroSlider.jsx
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// CSS Import
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { FiClock } from "react-icons/fi";

const HeroSlider = () => {
  // আপনার ৫টি ইমেজ
  const slides = [
    { id: 1, image: "/hero/banner1.jpg", alt: "Combo Offer" },
    { id: 2, image: "/hero/banner2.jpg", alt: "Why Choose Us" },
    { id: 3, image: "/hero/banner3.jpg", alt: "Easy Payment" },
    { id: 4, image: "/hero/banner4.jpg", alt: "All Subscriptions" },
    { id: 5, image: "/hero/banner5.jpg", alt: "Special Discount" },
  ];

  return (
    <div className="w-full bg-white">
      
      {/* --- Top Black Bar (Service Time) --- */}
      <div className="bg-black text-white text-[10px] md:text-xs py-2 text-center font-bold tracking-wide flex justify-center items-center gap-2">
        <FiClock className="text-pink-500 animate-pulse" />
        <span className="text-green-400">Service Time: 12 PM - 1 AM | ⏸ Friday After 2:30 PM</span>
      </div>

      {/* --- Main Slider --- */}
      <div className="relative w-full group">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          loop={true}
          effect={"fade"}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          // হাইট কমানো হয়েছে এখানে:
          // Mobile: 180px, Tablet: 280px, Desktop: 400px
          className="w-full h-[180px] sm:h-[280px] md:h-[380px] lg:h-[420px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={slide.id === 1}
                // object-fill দিলে ইমেজ চ্যাপ্টা হয়ে পুরো বক্স ভরবে
                // object-cover দিলে ইমেজ সুন্দরভাবে কেটে ফিট হবে
                className="object-cover w-full h-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSlider;