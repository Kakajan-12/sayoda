"use client";
import React from "react";
import ImageWithSkeleton from "@/Ui/ImageWithSkeleton";
import { useLocale, useTranslations } from "next-intl";
import { PoppinFont } from "@/Ui/Fonts";
import { Link } from "@/i18n/navigation";
import { localizedField, mediaUrl } from "@/lib/api/catalog";

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
  /**
   * Адрес статьи. Карточка — настоящая ссылка, а не div с onClick: иначе
   * статьи не видны краулерам, не открываются в новой вкладке и не получают
   * внутренних ссылок с главной.
   */
  href: string;
  /** Доп. классы для внешней обёртки (например, ширина в сетке/слайдере). */
  className?: string;
}

/**
 * Карточка статьи.
 *
 * Прежняя версия была картинкой на 400–500px с заголовком поверх неё, а дату,
 * описание и кнопку показывала только при наведении. Из-за этого:
 * читаемость заголовка зависела от того, светлая ли фотография; на телефоне
 * текст появлялся и исчезал сам по себе при прокрутке; а понять, о чём статья
 * и когда она вышла, без наведения было нельзя — то есть список статей
 * невозможно было просмотреть глазами.
 *
 * Теперь текст под картинкой и виден всегда: дата, заголовок, начало статьи.
 * Так же устроены карточки статей у Advantour и вообще принято в блогах —
 * и так же теперь выглядит карточка тура, чтобы сайт не распадался на два
 * разных по виду раздела.
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

const BlogCard: React.FC<BlogCardProps> = ({ blog, href, className = "" }) => {
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

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-lg bg-white ring-1 ring-sand shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-tileLight ${className}`}
    >
      <Link href={href} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <ImageWithSkeleton
            alt={title}
            src={mediaUrl(blog.image)}
            width={600}
            height={375}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {dateLabel && (
            // suppressHydrationWarning: набор данных ICU на сервере и в
            // браузере может немного расходиться, и из-за названия месяца
            // React ругался бы на несовпадение разметки.
            <time
              dateTime={String(blog.date).slice(0, 10)}
              suppressHydrationWarning
              className="text-xs font-medium uppercase tracking-wide text-inkMuted"
            >
              {dateLabel}
            </time>
          )}

          <h3
            className={`${PoppinFont.className} text-base/snug md:text-lg/snug font-semibold text-ink line-clamp-2 transition-colors group-hover:text-tileLight`}
          >
            {title}
          </h3>

          {summary && (
            <p className="text-sm/relaxed text-inkMuted line-clamp-3">
              {summary}
            </p>
          )}

          {/* mt-auto держит ссылку у нижнего края: заголовки разной длины,
              и без этого «узнать больше» прыгало бы по высоте в ряду. */}
          <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-tile">
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
    </article>
  );
};

export default BlogCard;
