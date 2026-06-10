"use client";
import React, { useState, useEffect } from "react";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { WindowWidth } from "@/Hooks/WindowWidth";
import { useTranslations } from "next-intl";
import { BASE_API_URL } from "@/i18n/api";
import { useRouter } from "next/navigation";
import BlogCard, { Blog } from "@/Components/CardProps/BlogCard";

const BlogsCardsProps = () => {
  const router = useRouter();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [navigatingBlogId, setNavigatingBlogId] = useState<number | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const width = WindowWidth();
  const t = useTranslations("SectionTitle");

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Failed to load blogs", err));
  }, []);

  // --- Pagination logic ---
  const totalPages = Math.ceil(blogs.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBlogClick = (blogId: number) => {
    setNavigatingBlogId(blogId);
    router.push(`/blog/${blogId}`);
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
            navigating={navigatingBlogId === item.id}
            onClick={() => handleBlogClick(item.id)}
            className="w-full"
            onHoverStart={width > 768 ? () => setHoverIndex(i) : undefined}
            onHoverEnd={width > 768 ? () => setHoverIndex(null) : undefined}
            onViewportEnter={width < 768 ? () => setHoverIndex(i) : undefined}
            onViewportLeave={width < 768 ? () => setHoverIndex(null) : undefined}
            viewport={{ once: false, margin: "-50% 0px -50% 0px" }}
          />
        ))}
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
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
    </div>
  );
};

export default BlogsCardsProps;
