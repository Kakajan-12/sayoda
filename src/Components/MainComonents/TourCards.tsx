"use client";

import React from "react";
import { PoppinFont } from "@/Ui/Fonts";
import ImageWithSkeleton from "@/Ui/ImageWithSkeleton";
import { IoLanguage, IoLocationSharp } from "react-icons/io5";
// Link из i18n/navigation сам добавляет префикс локали: с обычным next/link
// ссылка вида /tours/16 каждый раз проходила через редирект middleware.
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  durationDays,
  localizedField,
  mediaUrl,
  type Tour,
} from "@/lib/api/catalog";

/**
 * Карточка тура. Одна на три места: блок «Популярное» на главной, каталог
 * туров и вкладка «Туры» у страны.
 *
 * Прежняя карточка показывала только заголовок, язык и цену, хотя маршрут,
 * описание, категория и страна лежат в базе переведёнными на три языка и
 * просто не доходили до экрана. Турист выбирает тур по маршруту и
 * длительности, поэтому теперь они на карточке есть.
 *
 * Порядок сверху вниз повторяет то, как читают карточку: страна и срок на
 * картинке, дальше название, маршрут, описание, и в самом низу цена.
 */

interface Props {
  tours: Tour[];
}

/**
 * Поля CMS приходят как HTML («<p>Дервезе</p>»), а на карточке нужен голый
 * текст: разметка внутри line-clamp ломает обрезку по строкам.
 */
const plainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/\s+/g, " ")
    .trim();

const TourCards: React.FC<Props> = ({ tours }) => {
  const locale = useLocale();
  const t = useTranslations("TourPerPage");
  const tc = useTranslations("Common");

  if (!tours || !tours.length) {
    return <p className="text-center py-10">{tc("noTours")}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {tours.map((tour) => {
        const title = plainText(localizedField(tour, "title", locale));
        const route = plainText(localizedField(tour, "destination", locale));
        const summary = plainText(localizedField(tour, "text", locale));
        const country = plainText(localizedField(tour, "location", locale));
        const category = plainText(localizedField(tour, "cat", locale));
        const lang = plainText(localizedField(tour, "lang", locale));
        const days = durationDays(localizedField(tour, "duration", locale));

        return (
          <Link
            key={tour.id}
            href={tour.slug ? `/tours/${tour.slug}` : "#"}
            className="group flex flex-col overflow-hidden rounded-lg bg-white ring-1 ring-sand shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-tileLight"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <ImageWithSkeleton
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={mediaUrl(tour.image)}
                width={480}
                height={360}
              />

              {/* Затемнение только снизу: под ним плашка страны, а верх
                  картинки должен остаться видимым. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />

              {country && (
                <span className="absolute bottom-3 left-3 flex items-center gap-1 text-sm font-semibold text-white drop-shadow">
                  <IoLocationSharp className="h-4 w-4 shrink-0" />
                  {country}
                </span>
              )}

              {days !== null && (
                <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-tile shadow-sm backdrop-blur">
                  {t("days", { count: days })}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
              {category && (
                <span className="w-fit rounded-full bg-tileTint px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-tile">
                  {category}
                </span>
              )}

              <h3
                className={`${PoppinFont.className} text-base/snug md:text-lg/snug font-semibold line-clamp-2 transition-colors group-hover:text-tileLight`}
              >
                {title}
              </h3>

              {route && (
                <p className="text-sm text-ink line-clamp-1" title={route}>
                  <span className="text-inkMuted">{t("destinations")}: </span>
                  {route}
                </p>
              )}

              {summary && (
                <p className="text-sm/relaxed text-inkMuted line-clamp-2">
                  {summary}
                </p>
              )}

              {/* mt-auto прижимает подвал вниз: в ряду карточки разной высоты,
                  и без этого цены оказывались на разном уровне. */}
              <div className="mt-auto flex items-end justify-between gap-3 border-t border-sand pt-3">
                {lang ? (
                  <span className="flex min-w-0 items-center gap-1.5 text-xs text-inkMuted">
                    <IoLanguage className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{lang}</span>
                  </span>
                ) : (
                  <span />
                )}

                {/* Цена — единственное место на карточке, где работает
                    акцентный кирпичный: он должен вести взгляд к деньгам. */}
                <span className="shrink-0 text-right leading-tight">
                  <span className="block text-xs text-inkMuted">
                    {t("from")}
                  </span>
                  <span
                    className={`${PoppinFont.className} block text-xl font-bold text-brick`}
                  >
                    {tour.price}$
                  </span>
                  <span className="block text-xs text-inkMuted">
                    {t("perPerson")}
                  </span>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default TourCards;
