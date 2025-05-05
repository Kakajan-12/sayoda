"use client";
import React, { useEffect, useState } from "react";
import { blogsArray } from "@/app/[locale]/ArrayForTest/ArrayForTest";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "./Blogs.css";
import { ButtonLeftSwiper, ButtonRigthSwiper } from "@/Ui/SwiperComponents";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { WindowWidth } from "@/Hooks/WindowWidth";
const BlogsCards = () => {
  const [width, setWidth] = useState(Number);
  const witdhs = WindowWidth();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const getLimitByBreakpoint = () => {
    if (width < 350) return 30;
    if (width < 500) return 200;
    if (width < 768) return 150;
    if (width < 1024) return 200;
    if (width < 1160) return 130;
    if (width < 1280) return 100;
    return 150;
  };
  const getLimitByBreakpoints = () => {
    if (width < 350) return 20;
    if (width < 500) return 40;
    if (width < 768) return 80;
    if (width < 1024) return 110;
    if (width < 1160) return 130;
    if (width < 1280) return 100;
    return 150;
  };
  const forDescription = (text: string) => {
    const limit = getLimitByBreakpoint();
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  const forTittle = (text: string) => {
    const limit = getLimitByBreakpoints();
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  ///////////////////----------------------------/////////////////////-------------------------
  const forHovering = (hover: number | null, i: number) => {
    if (hover === null) {
      return {
        y: 100,
        opacity: 0,
      };
    }
    return {
      y: hover === i ? 0 : 100,
      opacity: hover === i ? 1 : 0,
    };
  };
  const forActive = (isActive: boolean) => {
    return {
      y: isActive ? 0 : 100,
      opacity: isActive ? 1 : 0,
    };
  };
  const t = useTranslations("SectionTittle");
  return (
    <div className="w-full h-auto bg-mainForBackground py-10 md:py-20">
      <div className="container  mx-auto px-5  relative md:px-5">
        <h2
          className={`${PoppinFont.className} md:mb-14 mb-10  font-bold text-2xl md:text-3xl  xl:text-4xl  `}
        >
          {t("blogs")}
        </h2>
        <Swiper
          slidesPerView={1}
          centeredSlides={true}
          effect={"coverflow"}
          loop={true}
          pagination={{
            el: ".bullets",
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} designedBullets"></span>`;
            },
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          spaceBetween={10}
          breakpoints={{
            375: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            480: {
              spaceBetween: 10,
              slidesPerView: 2,
            },
            1023: {
              centeredSlides: true,
              slidesPerView: 3,
            },
            1025: {
              centeredSlides: false,
              slidesPerView: 3,
            },
            1150: {
              centeredSlides: false,
              slidesPerView: 4,
            },
          }}
          navigation={{
            prevEl: ".minus",
            nextEl: ".plus",
          }}
          modules={[Navigation, Pagination]}
          className="mySwiper h-auto  transition-all relative z-20  w-full"
        >
          {blogsArray.map((items, i) => {
            return (
              <SwiperSlide className="flex justify-center items-center">
                {({ isActive }) => (
                  <motion.div
                    onHoverStart={
                      witdhs > 768 ? () => setHoverIndex(i) : undefined
                    }
                    onHoverEnd={
                      witdhs > 768 ? () => setHoverIndex(null) : undefined
                    }
                    viewport={{ once: false, margin: "-50% 0px -50% 0px" }}
                    className="w-11/12 bas:w-full sm:w-11/12 mx-auto relative  overflow-hidden rounded-3xl transition-all duration-300 h-[400px] bas:h-[350px] md:h-[400px] lg:h-[450px]  xl:h-[430px]  2xl:h-[500px]"
                  >
                    <Image
                      alt="img "
                      className="w-full  rounded-3xl h-full z-10 object-cover  absolute top-0 "
                      src={items.img}
                    />
                    <div className="z-10 relative text-white px-5  py-7 h-full flex flex-col items-center  justify-end sm:p-7 ">
                      <motion.div
                        initial={{ bottom: 0 }}
                        animate={
                          witdhs > 1025
                            ? hoverIndex === i
                              ? { bottom: 70 }
                              : { bottom: 0 }
                            : isActive
                            ? { bottom: 40, opacity: 1 }
                            : { bottom: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.4 }}
                        className={`  flex flex-col relative z-20 text-center   justify-end space-y-5 bas:space-y-4 h-full `}
                      >
                        <h3 className="text-xl md:text-2xl font-bold 2xl:text-3xl xl:text-2xl">
                          {forTittle(items.tittle)}
                        </h3>
                        <p className="text-sm md:text-sm">
                          {forDescription(items.description)}{" "}
                        </p>
                        <p className="text-sm md:text-md self-center md:pb-5 md:self-start">
                          {items.date}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ height: "0%", opacity: 0 }}
                        animate={{
                          height: "100%",
                          opacity: hoverIndex === i ? 0.4 : 0,
                        }}
                        exit={{
                          y: "100%",
                          opacity: hoverIndex === i ? 0.4 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-0 bg-black hidden lg:block pointer-events-none rounded-xl"
                      />
                      <div className="absolute inset-0 z-0 bg-black opacity-30 lg:hidden pointer-events-none rounded-xl"></div>

                      <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={
                          witdhs > 1025
                            ? forHovering(hoverIndex, i)
                            : forActive(isActive)
                        }
                        transition={{ duration: 0.4 }}
                        className="absolute   z-20 "
                      >
                        <Link href={`/blog/${i}`}>
                          <button className="bg-white  text-xs rounded-full w-24 font-bold self-center py-2 lg:py-3 lg:text-sm text-black">
                            Learn More
                          </button>
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
        <ButtonLeftSwiper />
        <ButtonRigthSwiper />
        <div className="bullets rounded-2xl mt-10 md:mt-16 flex justify-center "></div>
      </div>
    </div>
  );
};

export default BlogsCards;
