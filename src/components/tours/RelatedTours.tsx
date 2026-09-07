import React from "react";
import { getTranslations } from "next-intl/server";
import TourCards from "@/components/home/TourCards";
import { PoppinFont } from "@/components/ui/Fonts";
import { getToursPage, type Tour } from "@/lib/api/catalog";

/**
 * Похожие туры внизу страницы.
 *
 * Страница тура заканчивалась двумя кнопками и тупиком: если тур не подошёл,
 * уйти было некуда, кроме как назад в браузере. У advantour и stantrips из
 * любого тура видно соседние предложения — на каталог с турами по одному
 * кратеру за 530, 950 и 1540 долларов это работает особенно хорошо.
 *
 * Подбираем по категории тура, а если в ней ничего не осталось — по типу.
 * Берём с запасом и отбрасываем текущий тур уже здесь: просить у API
 * «четыре, кроме шестнадцатого» он не умеет.
 */
export default async function RelatedTours({
  tour,
  locale,
}: {
  tour: Tour;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "SectionTitle" });

  const pick = (tours: Tour[]) =>
    tours.filter((item) => item.id !== tour.id && Boolean(item.slug));

  let related: Tour[] = [];

  if (tour.tour_cat_id) {
    const byCategory = await getToursPage({
      cat: tour.tour_cat_id,
      perPage: 4,
    });
    related = pick(byCategory.items);
  }

  if (related.length < 3 && tour.tour_type_id) {
    const byType = await getToursPage({ type: tour.tour_type_id, perPage: 4 });
    const seen = new Set(related.map((item) => item.id));
    related = [
      ...related,
      ...pick(byType.items).filter((item) => !seen.has(item.id)),
    ];
  }

  related = related.slice(0, 3);
  if (!related.length) return null;

  return (
    <section className="w-full bg-sandLight py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <h2
          className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
        >
          {t("similar")}
        </h2>
        <div className="mt-8">
          <TourCards tours={related} />
        </div>
      </div>
    </section>
  );
}
