"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Turkmenistan from "../../../public/SliderBack/Turkmenistan.png";
import Image from "next/image";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MainSwiper = () => {
  
  return (
    <div className="w-full  h-auto">
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
        spaceBetween={0}
        navigation={{
          prevEl: ".swiper-button-prev-first",
          nextEl: ".swiper-button-next-first",
        }}
        modules={[]}
        className="mySwiper h-[70vh]   transition-all md:h-[80vh] lg:h-[89.1vh]    w-full"
      >
          <SwiperSlide className="relative ">
          <Image
            alt="test"
            className=" w-full h-full object-cover md:object-center   md:h-full  "
            width={800}
            height={800}
            quality={100}
            src={Turkmenistan}
          />
          <div className="absolute w-full h-full  top-0 flex justify-center gap-8   text-center flex-col  items-center ">
            <h1 className={`${PoppinFont.className} font-poppins px-2 text-2xl sm:text-3xl lg:text-4xl xl:text-4xl  font-semibold text-white leading-8 lg:leading-[70px] xl:leading-[70px] tracking-wider`}>"Discover the Unexplored  <br /> Turkmenistan!"</h1>
            <p className={`${QuicksandFont.className  } font-quicksand text-sm lg:text-xl text-white font-extralight`}>- Ancient Merv, the marble splendor of<br /> Ashgabat, and the buring cratar of <br /> Darvaza   await you </p>
            <button className={` ${PoppinFont.className} font-poppins font-medium px-9 py-2 md:py-3 md:px-12 lg:px-16 lg:py-3  xl:py-4 xl:px-20 rounded-full   border-2 bg-black bg-opacity-35 text-xs md:text-sm lg:text-lg xl:text-xl text-white  border-gradient-to-r from-[#E0ECF6] via-[#215584] to-[#DFE3EA]`}>Booking</button>
          </div>
        </SwiperSlide>
      </Swiper>
      {/* <div className="swiper-button-next swiper-button-next-first"></div>
      <div className="swiper-button-prev swiper-button-prev-first"></div> */}
    </div>
  );
};

export default MainSwiper;
