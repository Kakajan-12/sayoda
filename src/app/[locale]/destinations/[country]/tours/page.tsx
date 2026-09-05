import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/Ui/Fonts";
import { getTranslations } from "next-intl/server";
import { getTourLocations, getTours } from "@/lib/api/catalog";
import { plainText } from "@/lib/utils";
import TourCards from "@/Components/MainComonents/TourCards";

export const revalidate = 300;

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");

  const [tours, locations] = await Promise.all([getTours(), getTourLocations()]);

  /*
   * Локации отбираются по явной связи destination_id.
   *
   * Раньше здесь сравнивались названия: локация считалась принадлежащей стране,
   * если её название входило в название страны или наоборот. Переименование
   * локации в админке тихо ломало подборку.
   *
   * Сопоставление по названию оставлено запасным путём — на случай локаций,
   * которым связь ещё не проставили.
   */
  const linked = locations.filter(
    (loc) => Number(loc.destination_id) === destination.id,
  );

  const matched = linked.length
    ? linked
    : locations.filter((loc) => {
        const targets = [
          destination.slug,
          destField(destination, "name", "en"),
          destField(destination, "name", "ru"),
          destField(destination, "name", "tk"),
        ]
          .map((s) => s.toLowerCase())
          .filter(Boolean);

        return ["location_en", "location_ru", "location_tk"].some((key) => {
          const value = plainText(String(loc[key] ?? "")).toLowerCase();
          return (
            !!value &&
            targets.some((tn) => value === tn || value.includes(tn) || tn.includes(value))
          );
        });
      });

  const countryLocationIds = new Set(matched.map((loc) => Number(loc.id)));
  const countryTours = tours.filter((tour) =>
    countryLocationIds.has(Number(tour.location_id)),
  );

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabTours")} — {destField(destination, "name", locale)}
      </h2>

      {countryTours.length > 0 ? (
        <TourCards tours={countryTours} />
      ) : (
        <p className="text-center py-10 text-gray-500">{t("noTours")}</p>
      )}
    </div>
  );
}
