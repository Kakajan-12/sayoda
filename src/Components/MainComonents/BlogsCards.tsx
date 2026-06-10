"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "./Blogs.css";
import { ButtonLeftSwiper, ButtonRigthSwiper } from "@/Ui/SwiperComponents";
import { PoppinFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { WindowWidth } from "@/Hooks/WindowWidth";
import { BASE_API_URL } from "@/i18n/api";
import BlogCard, { Blog } from "@/Components/CardProps/BlogCard";

const BlogsCards = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [navigatingBlogId, setNavigatingBlogId] = useState<number | null>(null);
  const witdhs = WindowWidth();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const t = useTranslations("Blogs");

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

  const handleBlogClick = (blogId: number) => {
    setNavigatingBlogId(blogId);
    router.push(`/blog/${blogId}`);
  };

  return (
    <div className="w-full h-auto bg-mainForBackground py-10 md:py-20">
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
          {blogs.map((blog, i) => (
            <SwiperSlide
              key={blog.id}
              className="flex justify-center items-center"
            >
              {({ isActive }) => (
                <BlogCard
                  blog={blog}
                  expanded={witdhs > 1025 ? hoverIndex === i : isActive}
                  navigating={navigatingBlogId === blog.id}
                  onClick={() => handleBlogClick(blog.id)}
                  className="w-11/12 sm:w-11/12 mx-auto"
                  onHoverStart={
                    witdhs > 768 ? () => setHoverIndex(i) : undefined
                  }
                  onHoverEnd={
                    witdhs > 768 ? () => setHoverIndex(null) : undefined
                  }
                />
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
