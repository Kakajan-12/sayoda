import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations } from "next-intl/server";
import { getToursPage } from "@/lib/api/catalog";
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

  /*
   * Отбор идёт на стороне сервера: раньше сюда приезжал весь каталог, и
   * страница страны отбрасывала из него всё чужое уже у себя. При сотне
   * туров это лишняя работа на каждый заход ради нескольких карточек.
   *
   * Локации туров и направления объединены, поэтому связь прямая —
   * промежуточного сопоставления больше нет.
   *
   * perPage с запасом: туров у одной страны немного, и разбивать их на
   * страницы внутри вкладки незачем — человек уже сузил выбор до страны.
   */
  const { items: countryTours } = await getToursPage({
    destination: destination.id,
    perPage: 100,
  });

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
