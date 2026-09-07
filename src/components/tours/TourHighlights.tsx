import React from "react";
import { getTranslations } from "next-intl/server";
import { PiStarFourFill } from "react-icons/pi";
import { PoppinFont } from "@/components/ui/Fonts";
import { localizedField, type TourHighlight } from "@/lib/api/catalog";

/**
 * Главное о туре — короткий список «ради чего ехать».
 *
 * Так устроен блок Highlights у stantrips: он стоит сразу под первым
 * экраном, до программы и до цены. Смысл в том, что описание тура человек
 * читает не всегда, а четыре строки с самыми сильными доводами — почти
 * всегда. У нас эти доводы были растворены внутри абзаца описания.
 *
 * Порядок задаёт редактор через sort_order — бэкенд отдаёт список уже
 * отсортированным, пересортировывать здесь нечего.
 */
export default async function TourHighlights({
  items,
  locale,
}: {
  items: TourHighlight[];
  locale: string;
}) {
  if (!items.length) return null;

  const t = await getTranslations({ locale, namespace: "SectionTitle" });

  return (
    <section className="container mx-auto mt-8 px-4">
      <div className="rounded-2xl bg-tileTint px-5 py-6 sm:px-7 sm:py-7">
        <h2
          className={`${PoppinFont.className} text-xl font-bold text-tile sm:text-2xl`}
        >
          {t("highlights")}
        </h2>

        {/* Две колонки с четырёх пунктов и шире экрана: четыре строки
            в столбик на десктопе выглядят как обрывок списка. */}
        <ul className="mt-5 grid gap-x-8 gap-y-3 lg:grid-cols-2">
          {items.map((item) => {
            const text = localizedField(item, "text", locale);
            if (!text) return null;

            return (
              <li key={item.id} className="flex items-start gap-3">
                <PiStarFourFill
                  aria-hidden
                  className="mt-1 h-4 w-4 shrink-0 text-brick"
                />
                <span className="text-base/relaxed text-ink">{text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
