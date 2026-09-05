"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "./Blogs.css";
import { ButtonLeftSwiper, ButtonRigthSwiper } from "@/Ui/SwiperComponents";
import { PoppinFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";
import BlogCard, { Blog } from "@/Components/CardProps/BlogCard";

/**
 * Статьи приходят пропсом из Server Component — так карточки попадают
 * в серверный HTML. Сам компонент остаётся клиентским из-за Swiper.
 */
const BlogsCards = ({ blogs }: { blogs: Blog[] }) => {
  const t = useTranslations("Blogs");

  return (
    <div className="w-full h-auto bg-gradient-to-b from-mainForBackground to-white py-10 md:py-20">
      <div className="container mx-auto px-5 relative">
        <h2
          className={`${PoppinFont.className} md:mb-14 mb-10 font-bold text-2xl md:text-3xl xl:text-4xl`}
        >
          {t("blogs")}
        </h2>
        <Swiper
          slidesPerView={1}
          centeredSlides
          loop
          pagination={{
            el: ".bullets",
            clickable: true,
            renderBullet: (index, className) =>
              `<span class="${className} designedBullets"></span>`,
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
          {blogs.slice(0, 8).map((blog) => (
            // h-auto нужен самому слайду: по умолчанию Swiper выравнивает
            // слайды по высоте самого высокого, а карточки теперь разной
            // высоты и без этого растягивалась бы только обёртка, не карточка.
            <SwiperSlide key={blog.id} className="h-auto">
              <BlogCard
                blog={blog}
                href={`/blog/${blog.id}`}
                className="mx-auto w-11/12"
              />
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
