"use client";

import React from "react";
import { MontserratFont, PoppinFont } from "@/Ui/Fonts";
import ImageWithSkeleton from "@/Ui/ImageWithSkeleton";
import { IoLanguage } from "react-icons/io5";
import Link from "next/link";
import { BASE_API_URL } from "@/i18n/api";
import { useLocale, useTranslations } from "next-intl";

interface Tour {
  id: number;
  slug?: string;
  image: string;
  popular: number;
  title_tk: string;
  title_en: string;
  title_ru: string;
  text_tk: string;
  text_en: string;
  text_ru: string;
  duration_tk: string;
  duration_en: string;
  duration_ru: string;
  lang_tk: string;
  lang_en: string;
  lang_ru: string;
  price: number;
  location_id: number;
}

interface Props {
  tours: Tour[];
}

const TourCards: React.FC<Props> = ({ tours }) => {
  const locale = useLocale();
  const t = useTranslations("TourPerPage");
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  const getLocalized = (item: Tour, field: string) =>
    (item[`${field}_${locale}` as keyof Tour] as string) ||
    (item[`${field}_en` as keyof Tour] as string) ||
    (item[`${field}_tk` as keyof Tour] as string) ||
    "";

  const getFixedImageUrl = (path: string) =>
    `${BASE_API_URL.replace(/\/+$/, "")}/${path
      .replace(/\\/g, "/")
      .replace(/^(\.\.\/)+/, "")
      .replace(/^\/+/, "")
      .replace(/^app\//, "")}`;

  if (!tours || !tours.length) {
    return <p className="text-center py-10">Нет туров</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tours.map((tour) => {
        const title = stripHtml(getLocalized(tour, "title"));
        const duration = stripHtml(getLocalized(tour, "duration"));
        const dayCount = Number.parseInt(duration, 10);
        const lang = stripHtml(getLocalized(tour, "lang"));

        return (
          <Link
            key={tour.id}
            href={tour.id ? `/tours/${tour.id}` : "#"}
            className="group flex flex-col overflow-hidden bg-white rounded-md ring-1 ring-[#E1E1E1] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[4/2.5] w-full overflow-hidden">
              <div className="relative h-full w-full overflow-hidden">
                <ImageWithSkeleton
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={getFixedImageUrl(tour.image)}
                  width={300}
                  height={200}
                />
                {duration && (
                  <span
                    className={`${MontserratFont.className} absolute bottom-3 right-3 rounded-full bg-white/80 px-3 py-1 text-sm font-bold shadow-md backdrop-blur`}
                  >
                    {Number.isFinite(dayCount)
                      ? t("days", { count: dayCount })
                      : duration}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-5 px-4 py-3">
              <h3
                className={`${PoppinFont.className} font-semibold text-base md:text-lg leading-snug line-clamp-2 min-h-[2lh] transition-colors group-hover:text-[#245483]`}
              >
                {title}
              </h3>

              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs md:text-sm">
                  <IoLanguage className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{lang}</span>
                </div>
                <span
                  className={`${PoppinFont.className} shrink-0 text-lg font-bold`}
                >
                  {tour.price}$
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
