"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FiClock, FiChevronLeft, FiChevronRight, FiPause } from "react-icons/fi";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch("/api/admin/sliders")
      .then(res => res.json())
      .then(data => setSlides(data));
  }, []);

  if (slides.length === 0) return <div className="h-[200px] md:h-[400px] bg-gray-100 animate-pulse" />;

  return (
    <div className="w-full bg-white">
      <div className="bg-black text-white text-[10px] md:text-xs py-2 text-center font-bold flex justify-center gap-2">
        <FiClock className="text-pink-500 animate-pulse" />
        <span className="text-green-400">Service Time: 12 PM - 1 AM | ⏸ Friday After 2:30 PM</span>
      </div>

      <div className="relative w-full bg-gray-100 border-b border-gray-300">
        <Swiper
          loop={true}
          speed={800}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ el: ".custom-pagination-dots", clickable: true }}
          navigation={{ nextEl: ".custom-next-btn", prevEl: ".custom-prev-btn" }}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-[200px] md:h-[400px] lg:h-[450px] xl:h-[650px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide._id}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.alt || "Subnex Slider"}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="py-3 w-52 mx-auto flex items-center justify-center gap-6">
          <button className="custom-prev-btn text-gray-400 hover:text-black transition"><FiChevronLeft size={22} /></button>
          <div className="custom-pagination-dots flex gap-3" />
          <button className="custom-next-btn text-gray-400 hover:text-black transition"><FiChevronRight size={22} /></button>
          <div className="border-l pl-4"><FiPause className="text-gray-400 cursor-pointer" /></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;