import { notFound } from "next/navigation";
import { getDestination, localize } from "@/data/destinations";
import { ComfortaFont } from "@/Ui/Fonts";
import { getTranslations } from "next-intl/server";
import { BASE_API_URL } from "@/i18n/api";
import TourCards from "@/Components/MainComonents/TourCards";

type TourLocation = {
  id: number;
  location_en?: string;
  location_ru?: string;
  location_tk?: string;
};

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = getDestination(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");

  const [tours, locations] = await Promise.all([
    fetchJson<{ location_id: number }>(`${BASE_API_URL}/api/tours`),
    fetchJson<TourLocation>(`${BASE_API_URL}/api/tour-location`),
  ]);

  // Resolve which tour-location ids belong to this country by matching the
  // localized location names (and slug) against the destination's names.
  const targets = [destination.slug, ...Object.values(destination.name)].map(
    (s) => s.toLowerCase(),
  );
  const countryLocationIds = new Set(
    locations
      .filter((loc) =>
        [loc.location_en, loc.location_ru, loc.location_tk].some((name) => {
          const v = (name ?? "").toLowerCase().trim();
          return (
            !!v && targets.some((tn) => v === tn || v.includes(tn) || tn.includes(v))
          );
        }),
      )
      .map((loc) => Number(loc.id)),
  );

  const countryTours = tours.filter((tour) =>
    countryLocationIds.has(Number(tour.location_id)),
  );

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-2xl font-bold text-mainBlue border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabTours")} — {localize(destination.name, locale)}
      </h2>

      {countryTours.length > 0 ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <TourCards tours={countryTours as any} />
      ) : (
        <p className="text-center py-10 text-gray-500">{t("noTours")}</p>
      )}
    </div>
  );
}
