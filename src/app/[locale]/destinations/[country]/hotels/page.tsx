import type { Metadata } from "next";
import { destinationMetadata } from "@/lib/destinationMeta";
import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HotelsList from "@/components/hotels/HotelsList";
import { getHotels } from "@/lib/api/hotels";

export const revalidate = 300;

/**
 * Свой заголовок и свой канонический адрес.
 *
 * Без них вкладка наследовала заголовок страны и указывала канонической
 * страницу обзора — пять разных вкладок объявляли себя одной страницей.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  return destinationMetadata({ locale, country, tab: "hotels", path: "hotels" });
}

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");
  const seo = await getTranslations({ locale, namespace: "Seo" });

  // Отели берутся на сервере и отбираются по стране здесь же. Раньше этим
  // занимался браузер: вкладка тянула весь список и фильтровала его у себя,
  // а в серверном HTML отелей не было вовсе.
  const hotels = (await getHotels()).filter((hotel) => hotel.country === country);

  return (
    <div className={ComfortaFont.className}>
      {/* Заголовок первого уровня страницы: обложка над ним — общая на всю
          страну и главным заголовком быть не может, см. HeroHeading. */}
      <h1 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6">
        {seo("destinationTab.hotels.heading", {
          country: destField(destination, "name", locale),
        })}
      </h1>

      <HotelsList hotels={hotels} />
    </div>
  );
}
