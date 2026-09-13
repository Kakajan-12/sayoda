import React from "react";
import type { Metadata } from "next";
import HotelsList from "@/components/hotels/HotelsList";
import { PoppinFont } from "@/components/ui/Fonts";
import { getHotels } from "@/lib/api/hotels";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "hotels", "hotels");
}

export const revalidate = 300;

/**
 * Отели — общий список по всем странам.
 *
 * Данные берутся на сервере. Прежде страница тянула /api/hotels из браузера,
 * и в серверном HTML не было ни одного отеля: поисковик видел пустую
 * страницу с заголовком. Фильтр по городам остался клиентским, но сами
 * карточки теперь попадают в разметку.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Иначе next-intl в дочерних компонентах полезет за языком в заголовки,
  // и страница снова станет динамической. См. корневой макет локали.
  setRequestLocale(locale);

  const [hotels, t] = await Promise.all([
    getHotels(),
    getTranslations({ locale, namespace: "Hotels" }),
  ]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1
        className={`${PoppinFont.className} mb-8 text-3xl font-bold text-mainBlue`}
      >
        {t("title")}
      </h1>
      <HotelsList hotels={hotels} />
    </div>
  );
}
