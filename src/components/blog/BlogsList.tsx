"use client";
import React, { useState } from "react";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { useTranslations } from "next-intl";
import BlogCard, { Blog } from "@/components/blog/BlogCard";

/**
 * Список статей. Данные приходят пропсом из Server Component — раньше они
 * грузились в useEffect, и страница /blog отдавалась краулерам пустой.
 * Клиентской осталась только пагинация: карточка больше ничего не прячет
 * за наведением, поэтому отслеживать его не нужно.
 *
 * Карточки здесь одинаковые. Выделять одну статью крупнее — дело главной
 * страницы, где надо зацепить взгляд; сюда человек уже пришёл читать и
 * выбирает сам, так что ровный список ему удобнее.
 */

const POSTS_PER_PAGE = 9;

const BlogsCardsProps = ({ blogs }: { blogs: Blog[] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const t = useTranslations("SectionTitle");

  // Запись без слага пропускаем: ссылка на неё вела бы на /blog/undefined.
  const published = blogs.filter((blog) => Boolean(blog.slug));

  const totalPages = Math.ceil(published.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const currentPosts = published.slice(
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
        className={`text-xl md:text-2xl lg:text-2xl 2xl:text-3xl leading-9 font-bold ${PoppinFont.className}`}
      >
        {t("blogs")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-8 md:gap-6 md:py-10">
        {currentPosts.map((item) => (
          <BlogCard
            key={item.id}
            blog={item}
            href={`/blog/${item.slug}`}
            className="w-full"
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
              className={`min-w-11 rounded-md border px-4 py-2 transition ${
                currentPage === idx + 1
                  ? "border-tile bg-tile text-white"
                  : "border-sand bg-white text-ink hover:border-tileLight hover:text-tileLight"
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
