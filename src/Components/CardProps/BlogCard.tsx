"use client";
import React from "react";
import ImageWithSkeleton from "@/Ui/ImageWithSkeleton";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ComfortaFont } from "@/Ui/Fonts";
import { BASE_API_URL } from "@/i18n/api";
import { WindowWidth } from "@/Hooks/WindowWidth";

export interface Blog {
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

interface BlogCardProps {
  blog: Blog;
  /** Раскрыта ли карточка (показывать описание, дату и кнопку). */
  expanded: boolean;
  /** Идёт ли переход на страницу этого блога. */
  navigating: boolean;
  onClick: () => void;
  /** Доп. классы для внешней обёртки (например, ширина в сетке/слайдере). */
  className?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onViewportEnter?: () => void;
  onViewportLeave?: () => void;
  viewport?: object;
}

const getFixedImageUrl = (path: string) =>
  `${BASE_API_URL.replace(/\/+$/, "")}/${path
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\/+/, "")
    .replace(/^app\//, "")}`;

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  expanded,
  navigating,
  onClick,
  className = "",
  onHoverStart,
  onHoverEnd,
  onViewportEnter,
  onViewportLeave,
  viewport,
}) => {
  const locale = useLocale();
  const t = useTranslations("Blogs");
  const width = WindowWidth();

  const getLocalized = (item: Blog, field: string) =>
    (item[`${field}_${locale}` as keyof Blog] as string) ||
    (item[`${field}_en` as keyof Blog] as string) ||
    (item[`${field}_tk` as keyof Blog] as string) ||
    "";

  const title = stripHtml(String(getLocalized(blog, "title")));

  return (
    <motion.article
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onViewportEnter={onViewportEnter}
      onViewportLeave={onViewportLeave}
      viewport={viewport}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 h-[400px] md:h-[400px] lg:h-[450px] xl:h-[430px] 2xl:h-[500px] ${className}`}
    >
      <ImageWithSkeleton
        alt={title}
        src={getFixedImageUrl(blog.image)}
        width={600}
        height={400}
        className="w-full h-full rounded-xl object-cover absolute top-0"
        skeletonClassName="rounded-xl"
      />
      <div className="absolute inset-0 z-[1] rounded-xl bg-gradient-to-t from-black/50 via-black/30 to-transparent pointer-events-none" />
      <div className="z-10 relative text-white px-3 py-10 h-full flex flex-col items-center justify-end">
        <motion.div
          animate={{ bottom: expanded ? 64 : 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-end relative z-20 text-center space-y-5 h-full w-full"
        >
          <h3
            className={`text-xl md:text-2xl font-bold line-clamp-3 ${ComfortaFont.className}`}
          >
            {title}
          </h3>
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: expanded ? 1 : 0,
              height: expanded ? "auto" : 0,
            }}
            transition={{ duration: 0.4 }}
            className="text-sm md:text-md overflow-hidden line-clamp-5"
          >
            {stripHtml(String(getLocalized(blog, "text")))}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: expanded ? 1 : 0,
              height: expanded ? "auto" : 0,
            }}
            transition={{ duration: 0.4 }}
            className="text-sm md:text-md overflow-hidden"
          >
            {new Date(blog.date).toLocaleDateString(locale)}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ height: "0%", opacity: 0 }}
          animate={{ height: "100%", opacity: expanded ? 0.4 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-0 bg-black rounded-xl pointer-events-none"
        />

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: expanded ? 0 : 100, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute z-20"
        >
          <button
            type="button"
            disabled={navigating}
            className="bg-white text-xs rounded-full w-fit font-bold px-4 py-2 lg:text-sm text-black disabled:opacity-70 disabled:cursor-wait"
            onClick={onClick}
          >
            {navigating ? (
              <span className="inline-flex items-center justify-center gap-2 px-2">
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                {t("learn")}
              </span>
            ) : (
              t("learn")
            )}
          </button>
        </motion.div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
