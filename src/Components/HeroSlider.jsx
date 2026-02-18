"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FiChevronLeft, FiChevronRight, FiPause } from "react-icons/fi";

const HeroSlider = () => {

  const [slides] = useState([
    { _id: "1", image: "/silider/hero1.jpg", alt: "Slider 1" },
    { _id: "2", image: "/silider/hero2.jpg", alt: "Slider 2" },
    { _id: "3", image: "/silider/hero3.jpg", alt: "Slider 3" },
  ]);

  return (
    <div className="w-full bg-white">
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
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="py-3 w-52 mx-auto flex items-center justify-center gap-6">
          <button className="custom-prev-btn text-gray-400 hover:text-black transition">
            <FiChevronLeft size={22} />
          </button>

          <div className="custom-pagination-dots flex gap-3" />

          <button className="custom-next-btn text-gray-400 hover:text-black transition">
            <FiChevronRight size={22} />
          </button>

          <div className="border-l pl-4">
            <FiPause className="text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;