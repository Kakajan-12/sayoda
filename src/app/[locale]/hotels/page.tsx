import React from "react";
import type { Metadata } from "next";
import HotelsCatalog from "@/components/hotels/HotelsCatalog";
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

// Список отелей остаётся клиентским: он фильтруется по городам и не является
// поисковой посадочной. Серверная обёртка нужна ради metadata.
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Иначе next-intl в дочерних компонентах полезет за языком в заголовки,
  // и страница снова станет динамической. См. корневой макет локали.
  setRequestLocale(locale);

  return (
    <HotelsCatalog />
  );
}
