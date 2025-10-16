"use client";
import React, { useState, useEffect } from "react";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import Image from "next/image";
import { WindowWidth } from "@/Hooks/WindowWidth";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { BASE_API_URL } from "@/i18n/api";
import { useRouter } from "next/navigation";

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

const BlogsCardsProps = () => {
  const router = useRouter();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const width = WindowWidth();
  const t = useTranslations("SectionTitle");
  const k = useTranslations("Blogs");
  const locale = useLocale();

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/blogs`)
        .then((res) => res.json())
        .then((data) => setBlogs(data))
        .catch((err) => console.error("Failed to load blogs", err));
  }, []);

  const getLimitByBreakpoint = () => {
    if (width < 500) return 140;
    if (width < 640) return 70;
    if (width < 768) return 65;
    if (width < 1024) return 90;
    return 100;
  };

  const forDescription = (html: string) => {
    const limit = getLimitByBreakpoint();
    const text = html.replace(/<[^>]+>/g, "");
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const forTitle = (html: string, limit: number) => {
    const text = html.replace(/<[^>]+>/g, "");
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const getLocalizedField = (item: Blog, field: "title" | "text") => {
    switch (locale) {
      case "tk":
        return field === "title" ? item.title_tk : item.text_tk;
      case "ru":
        return field === "title" ? item.title_ru : item.text_ru;
      default:
        return field === "title" ? item.title_en : item.text_en;
    }
  };

  // --- Pagination logic ---
  const totalPages = Math.ceil(blogs.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
      <div className={`container mx-auto py-10 md:py-20 px-5 ${QuicksandFont.className}`}>
        <h2
            className={`text-xl md:text-2xl lg:text-2xl 2xl:text-3xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}
        >
          {t("blogs")}
        </h2>

        <div className="grid grid-cols-1 bas:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-10 sm:gap-7">
          {currentPosts.map((item, i) => (
              <motion.div
                  key={item.id}
                  onHoverStart={width > 768 ? () => setHoverIndex(i) : undefined}
                  onHoverEnd={width > 768 ? () => setHoverIndex(null) : undefined}
                  onViewportEnter={width < 768 ? () => setHoverIndex(i) : undefined}
                  onViewportLeave={width < 768 ? () => setHoverIndex(null) : undefined}
                  viewport={{ once: false, margin: "-50% 0px -50% 0px" }}
                  className="w-full relative overflow-hidden rounded-3xl transition-all duration-300 h-[400px] bas:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[430px] 2xl:h-[500px]"
              >
                <Image
                    alt="blog image"
                    className="w-full rounded-3xl h-full z-0 object-cover absolute top-0"
                    src={`${BASE_API_URL}/${item.image.replace(/\\/g, "/")}`}
                    width={500}
                    height={400}
                />
                <div className="z-10 relative text-white px-7 py-7 h-full flex flex-col items-center justify-end sm:p-7">
                  <motion.div
                      initial={{ bottom: 0 }}
                      animate={{ bottom: hoverIndex === i ? 80 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col relative z-20 justify-end space-y-5 h-full w-full"
                  >
                    <h3 className="text-xl md:text-2xl font-bold">
                      {forTitle(getLocalizedField(item, "title"), 30)}
                    </h3>
                    <p className="text-sm md:text-md">
                      {forDescription(getLocalizedField(item, "text"))}
                    </p>
                    <p className="text-sm md:text-md">
                      {new Date(item.date).toLocaleDateString(locale)}
                    </p>
                  </motion.div>

                  <motion.div
                      initial={{ height: "0%", opacity: 0 }}
                      animate={{
                        height: "100%",
                        opacity: hoverIndex === i ? 0.4 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 z-0 bg-black pointer-events-none rounded-xl"
                  />

                  <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{
                        y: hoverIndex === i ? 0 : 100,
                        opacity: hoverIndex === i ? 1 : 0,
                      }}
                      transition={{ duration: 0.4 }}
                      className="absolute"
                  >
                    <Link href={`/blog/${item.id}`}>
                      <button className="bg-white text-xs rounded-full w-36 font-bold self-center py-2 lg:py-3 lg:text-sm text-black"
                              onClick={() => router.push(`/blog/${item.id}`)}>
                        {k("learn")}
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
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
