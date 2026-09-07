import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations } from "next-intl/server";
import { getTours } from "@/lib/api/catalog";
import TourCards from "@/components/home/TourCards";

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

  const tours = await getTours();

  /*
   * Тур привязан к направлению напрямую: локации туров и направления
   * объединены в одну сущность.
   *
   * Раньше связь шла через промежуточную таблицу локаций, а до неё —
   * вообще сравнением названий, из-за чего переименование в админке тихо
   * ломало подборку. Сейчас достаточно одного сравнения идентификаторов.
   *
   * Поле называется location_id по историческим причинам: API отдаёт под
   * этим именем идентификатор направления, чтобы не ломать уже выложенный
   * фронтенд.
   */
  const countryTours = tours.filter(
    (tour) => Number(tour.location_id) === destination.id,
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
