"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "./Blogs.css";
import { ButtonLeftSwiper, ButtonRigthSwiper } from "@/Ui/SwiperComponents";
import { PoppinFont } from "@/Ui/Fonts";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { WindowWidth } from "@/Hooks/WindowWidth";
import { BASE_API_URL } from "@/i18n/api";

interface Blog {
  id: number;
  image: string;
  title_tk: string;
  title_en: string;
  title_ru: string;
  text_tk: string;
  text_en: string;
  text_ru: string;
  date: string;
}

const BlogsCards = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [width, setWidth] = useState<number>(0);
  const witdhs = WindowWidth();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const locale = useLocale();
  const t = useTranslations("Blogs")


  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/blogs`);
        const data: Blog[] = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Ошибка при загрузке блогов:", err);
      }
    };
    fetchBlogs();
  }, []);

  const getFixedImageUrl = (path: string) =>
      `${BASE_API_URL.replace(/\/+$/, "")}/${path.replace(/\\/g, "/").replace(/^(\.\.\/)+/, "")}`;

  const getLocalized = (item: Blog, field: string) =>
      item[`${field}_${locale}` as keyof Blog] ||
      item[`${field}_en` as keyof Blog] ||
      item[`${field}_tk` as keyof Blog] ||
      "";

  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

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

  const forDescription = (text: string) =>
      text.length > getLimitByBreakpoint() ? text.slice(0, getLimitByBreakpoint()) + "..." : text;
  const forTitle = (text: string) =>
      text.length > getLimitByBreakpoints() ? text.slice(0, getLimitByBreakpoints()) + "..." : text;

  const forHovering = (hover: number | null, i: number) =>
      hover === i ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 };
  const forActive = (isActive: boolean) =>
      isActive ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 };

  return (
      <div className="w-full h-auto bg-mainForBackground py-10 md:py-20">
        <div className="container mx-auto px-5 relative">
          <h2 className={`${PoppinFont.className} md:mb-14 mb-10 font-bold text-2xl md:text-3xl xl:text-4xl`}>
            {t("blogs")}
          </h2>
          <Swiper
              slidesPerView={1}
              centeredSlides
              loop
              pagination={{
                el: ".bullets",
                clickable: true,
                renderBullet: (index, className) => `<span class="${className} designedBullets"></span>`,
              }}
              spaceBetween={10}
              breakpoints={{
                375: { slidesPerView: 1, spaceBetween: 20 },
                480: { slidesPerView: 2, spaceBetween: 10 },
                1023: { slidesPerView: 3, centeredSlides: true },
                1025: { slidesPerView: 3, centeredSlides: false },
                1150: { slidesPerView: 4, centeredSlides: false },
              }}
              navigation={{ prevEl: ".minus", nextEl: ".plus" }}
              modules={[Navigation, Pagination]}
              className="mySwiper h-auto relative z-20 w-full"
          >
            {blogs.map((blog, i) => (
                <SwiperSlide key={blog.id} className="flex justify-center items-center">
                  {({ isActive }) => (
                      <motion.div
                          onHoverStart={witdhs > 768 ? () => setHoverIndex(i) : undefined}
                          onHoverEnd={witdhs > 768 ? () => setHoverIndex(null) : undefined}
                          className="w-11/12 sm:w-11/12 mx-auto relative overflow-hidden rounded-3xl transition-all duration-300 h-[400px] md:h-[400px] lg:h-[450px] xl:h-[430px] 2xl:h-[500px]"
                      >
                        <Image
                            alt={stripHtml(String(getLocalized(blog, "title")))}
                            src={getFixedImageUrl(blog.image)}
                            width={600}
                            height={400}
                            className="w-full h-full rounded-3xl object-cover absolute top-0"
                        />
                        <div className="z-10 relative text-white px-5 py-7 h-full flex flex-col items-center justify-end">
                          <motion.div
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
                              className="flex flex-col justify-center relative z-20 text-center space-y-5 h-full"
                          >
                            <h3 className="text-xl md:text-2xl font-bold">
                              {forTitle(stripHtml(String(getLocalized(blog, "title"))))}
                            </h3>
                            <p className="text-sm md:text-md">
                              {forDescription(stripHtml(String(getLocalized(blog, "text"))))}
                            </p>
                            <p className="text-sm md:text-md">{new Date(blog.date).toLocaleDateString(locale)}</p>
                          </motion.div>

                          <motion.div
                              initial={{ height: "0%", opacity: 0 }}
                              animate={{ height: "100%", opacity: hoverIndex === i ? 0.4 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 z-0 bg-black hidden lg:block rounded-xl"
                          />
                          <div className="absolute inset-0 z-0 bg-black opacity-30 lg:hidden rounded-xl"></div>

                          <motion.div
                              initial={{ y: 100, opacity: 0 }}
                              animate={witdhs > 1025 ? forHovering(hoverIndex, i) : forActive(isActive)}
                              transition={{ duration: 0.4 }}
                              className="absolute z-20"
                          >
                            <Link href={`/blog/${blog.id}`}>
                              <button className="bg-white text-xs rounded-full w-fit font-bold p-2 lg:py-3 lg:text-sm text-black">
                                {t('learn')}
                              </button>
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                  )}
                </SwiperSlide>
            ))}
          </Swiper>
          <ButtonLeftSwiper />
          <ButtonRigthSwiper />
          <div className="bullets mt-10 md:mt-16 flex justify-center"></div>
        </div>
      </div>
  );
};

export default BlogsCards;
