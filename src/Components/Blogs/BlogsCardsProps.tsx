"use client";
import React, { useState } from "react";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";
import BlogCard, { Blog } from "@/Components/CardProps/BlogCard";

/**
 * Список статей. Данные приходят пропсом из Server Component — раньше они
 * грузились в useEffect, и страница /blog отдавалась краулерам пустой.
 * Клиентской осталась только пагинация: карточка больше ничего не прячет
 * за наведением, поэтому отслеживать его не нужно.
 *
 * На первой странице свежая статья показана крупно, а три следующие — рядом
 * строками: так у списка появляется начало. Со второй страницы это ни к чему,
 * там уже обычная сетка — «главной» статьи на второй странице не бывает.
 */

const POSTS_PER_PAGE = 9;
/**
 * Сколько статей рядом с крупной. Четыре подобраны по высоте: столько
 * помещается рядом с крупной карточкой без пустоты снизу.
 */
const SIDE_POSTS = 4;

const BlogsCardsProps = ({ blogs }: { blogs: Blog[] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const t = useTranslations("SectionTitle");

  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const currentPosts = blogs.slice(
    indexOfLastPost - POSTS_PER_PAGE,
    indexOfLastPost,
  );

  const isFirstPage = currentPage === 1;
  const lead = isFirstPage ? currentPosts[0] : undefined;
  const side = isFirstPage ? currentPosts.slice(1, 1 + SIDE_POSTS) : [];
  const grid = isFirstPage ? currentPosts.slice(1 + SIDE_POSTS) : currentPosts;

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

      {lead && (
        <div className="grid grid-cols-1 gap-5 pt-8 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <BlogCard blog={lead} href={`/blog/${lead.id}`} variant="featured" />
          </div>
          {side.length > 0 && (
            <div className="flex flex-col gap-4">
              {side.map((item) => (
                <BlogCard
                  key={item.id}
                  blog={item}
                  href={`/blog/${item.id}`}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {grid.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-8 md:gap-6 md:py-10">
          {grid.map((item) => (
            <BlogCard
              key={item.id}
              blog={item}
              href={`/blog/${item.id}`}
              className="w-full"
            />
          ))}
        </div>
      )}

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
