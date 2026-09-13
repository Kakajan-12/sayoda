import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HotelsList from "@/components/hotels/HotelsList";
import { getHotels } from "@/lib/api/hotels";

export const revalidate = 300;

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

  // Отели берутся на сервере и отбираются по стране здесь же. Раньше этим
  // занимался браузер: вкладка тянула весь список и фильтровала его у себя,
  // а в серверном HTML отелей не было вовсе.
  const hotels = (await getHotels()).filter((hotel) => hotel.country === country);

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabHotels")} — {destField(destination, "name", locale)}
      </h2>

      {/* Отсчёт от липкой панели вкладок, а не от шапки. */}
      <HotelsList hotels={hotels} asideTopClassName="lg:top-[172px]" />
    </div>
  );
}
