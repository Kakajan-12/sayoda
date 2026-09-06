"use client";
import React from "react";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { useLocale, useTranslations } from "next-intl";
import { PoppinFont } from "@/components/ui/Fonts";
import { Link } from "@/i18n/navigation";
import { localizedField, mediaUrl } from "@/lib/api/catalog";

export interface Blog {
  id: number;
  /** Адрес статьи. Заполнен у всех записей миграцией 007. */
  slug: string;
  image: string;
  title_tk: string;
  title_en: string;
  title_ru: string;
  text_tk: string;
  text_en: string;
  text_ru: string;
  date: string;
}

/**
 * Вид карточки.
 *
 * `featured` — главная статья блока: крупная картинка, большой заголовок,
 * начало текста. `compact` — строка-спутник рядом с ней: миниатюра, дата и
 * заголовок, без текста. `default` — рядовая карточка в сетке.
 *
 * Три вида нужны, чтобы в блоке была очерёдность. Когда все карточки
 * одинаковые, глазу не за что зацепиться и список читается как обои.
 */
export type BlogCardVariant = "default" | "featured" | "compact";

interface BlogCardProps {
  blog: Blog;
  /**
   * Адрес статьи. Карточка — настоящая ссылка, а не div с onClick: иначе
   * статьи не видны краулерам, не открываются в новой вкладке и не получают
   * внутренних ссылок с главной.
   */
  href: string;
  variant?: BlogCardVariant;
  /** Доп. классы для внешней обёртки (например, ширина в сетке). */
  className?: string;
}

/**
 * Поля CMS приходят как HTML, а на карточке нужен голый текст: разметка
 * внутри line-clamp ломает обрезку по строкам.
 */
const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();

const CARD_BASE =
  "group block overflow-hidden rounded-lg bg-white ring-1 ring-sand shadow-sm transition duration-300 hover:shadow-xl hover:ring-tileLight";

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  href,
  variant = "default",
  className = "",
}) => {
  const locale = useLocale();
  const t = useTranslations("Blogs");

  const title = stripHtml(localizedField(blog, "title", locale));
  const summary = stripHtml(localizedField(blog, "text", locale));

  // В базе дата хранится как полночь UTC. Без явного timeZone браузер в
  // минусовом поясе показал бы предыдущий день, а сервер — правильный.
  let dateLabel = "";
  try {
    dateLabel = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(blog.date));
  } catch {
    dateLabel = String(blog.date).slice(0, 10);
  }

  // suppressHydrationWarning: набор данных ICU на сервере и в браузере может
  // расходиться, и из-за названия месяца React ругался бы на несовпадение.
  const dateEl = (size: string) => (
    <time
      dateTime={String(blog.date).slice(0, 10)}
      suppressHydrationWarning
      className={`font-medium uppercase tracking-wide text-inkMuted ${size}`}
    >
      {dateLabel}
    </time>
  );

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={`${CARD_BASE} flex gap-4 p-3 hover:-translate-y-0.5 ${className}`}
      >
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md sm:h-28 sm:w-36">
          <ImageWithSkeleton
            alt={title}
            src={mediaUrl(blog.image)}
            width={256}
            height={192}
            className="h-full w-full object-cover group-hover:scale-105"
            skeletonClassName="rounded-md"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center gap-1">
          {dateLabel && dateEl("text-[11px]")}
          <h3
            className={`${PoppinFont.className} text-sm/snug sm:text-base/snug font-semibold text-ink line-clamp-3 transition-colors group-hover:text-tileLight`}
          >
            {title}
          </h3>
        </div>
      </Link>
    );
  }

  const featured = variant === "featured";

  return (
    <Link
      href={href}
      className={`${CARD_BASE} flex h-full flex-col hover:-translate-y-1 ${className}`}
    >
      <div
        className={`relative w-full overflow-hidden ${
          featured ? "aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        <ImageWithSkeleton
          alt={title}
          src={mediaUrl(blog.image)}
          width={featured ? 1000 : 600}
          height={featured ? 563 : 375}
          className="h-full w-full object-cover group-hover:scale-105"
        />
      </div>

      <div
        className={`flex flex-1 flex-col gap-2 ${featured ? "p-5 md:p-6" : "p-4"}`}
      >
        {dateLabel && dateEl("text-xs")}

        <h3
          className={`${PoppinFont.className} font-semibold text-ink line-clamp-2 transition-colors group-hover:text-tileLight ${
            featured
              ? "text-xl/snug md:text-2xl/snug"
              : "text-base/snug md:text-lg/snug"
          }`}
        >
          {title}
        </h3>

        {summary && (
          <p
            className={`text-inkMuted line-clamp-3 ${
              featured ? "text-sm/relaxed md:text-base/relaxed" : "text-sm/relaxed"
            }`}
          >
            {summary}
          </p>
        )}

        {/* mt-auto держит ссылку у нижнего края: заголовки разной длины,
            и без этого «узнать больше» прыгало бы по высоте в ряду. */}
        <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold text-tile">
          {t("learn")}
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
