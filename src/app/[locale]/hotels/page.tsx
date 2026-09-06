import React from "react";
import type { Metadata } from "next";
import HotelsCatalog from "@/components/hotels/HotelsCatalog";
import { pageMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

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
export default function Page() {
  return <HotelsCatalog />;
}
