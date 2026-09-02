"use client";
import React, { useState } from "react";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { WindowWidth } from "@/Hooks/WindowWidth";
import { useTranslations } from "next-intl";
import BlogCard, { Blog } from "@/Components/CardProps/BlogCard";

/**
 * Список статей. Данные приходят пропсом из Server Component — раньше они
 * грузились в useEffect, и страница /blog отдавалась краулерам пустой.
 * Клиентской осталась только пагинация и hover-раскрытие карточек.
 */

const POSTS_PER_PAGE = 8;

const BlogsCardsProps = ({ blogs }: { blogs: Blog[] }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const width = WindowWidth();
  const t = useTranslations("SectionTitle");

  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const currentPosts = blogs.slice(
    indexOfLastPost - POSTS_PER_PAGE,
    indexOfLastPost,
  );

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`container mx-auto py-10 md:py-20 px-5 ${QuicksandFont.className}`}
    >
      <h2
        className={`text-xl md:text-2xl lg:text-2xl 2xl:text-3xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}
      >
        {t("blogs")}
      </h2>

      <div className="grid grid-cols-1 bas:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-10 sm:gap-7">
        {currentPosts.map((item, i) => (
          <BlogCard
            key={item.id}
            blog={item}
            expanded={hoverIndex === i}
            href={`/blog/${item.id}`}
            className="w-full"
            onHoverStart={width > 768 ? () => setHoverIndex(i) : undefined}
            onHoverEnd={width > 768 ? () => setHoverIndex(null) : undefined}
            onViewportEnter={width < 768 ? () => setHoverIndex(i) : undefined}
            onViewportLeave={width < 768 ? () => setHoverIndex(null) : undefined}
            viewport={{ once: false, margin: "-50% 0px -50% 0px" }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => changePage(idx + 1)}
              className={`px-4 py-2 rounded-md border ${
                currentPage === idx + 1
                  ? "bg-mainBlue text-white"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsCardsProps;
