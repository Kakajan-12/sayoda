import React from "react";
import { getTranslations } from "next-intl/server";
import { PoppinFont } from "@/components/ui/Fonts";
import { localizedField, type ItineraryDay } from "@/lib/api/catalog";
import { plainText } from "@/lib/utils";

/**
 * Программа тура по дням.
 *
 * Серверный компонент: раньше дни забирались из браузера после гидрации, и
 * в HTML страницы оставался один заголовок над пустотой. У обоих сайтов,
 * на которые равняется заказчик, программа лежит в разметке целиком —
 * по ней страницу тура и находят в поиске.
 *
 * Дни раскрыты по умолчанию, как на stantrips: свёрнутый аккордеон прятал
 * ровно тот текст, ради которого на страницу и приходят. Свернуть день всё
 * же можно — это <details>, а не имитация на div c onClick, поэтому
 * раскрытие работает с клавиатуры и без JavaScript. Прежний аккордеон
 * открывался только мышью.
 */
/**
 * Убирает из заголовка дня его номер.
 *
 * Редакторы называют дни единообразно во всех трёх языках: «День 1. Ашхабад
 * – Дарваза», «Day 1: Konye-Urgench», «1-nji gün. Aşgabat». Номер теперь
 * стоит отдельным кружком слева, и без этой чистки строка читалась бы как
 * «День 1 — День 1. Ашхабад – Дарваза».
 *
 * Разделитель после номера обязателен: иначе заголовок, состоящий из одного
 * лишь «День 1», обнулился бы. Если после чистки ничего не осталось,
 * возвращаем исходную строку — пустая шапка хуже повтора.
 */
const DAY_PREFIX = /^\s*(?:(?:day|день)\s*\d+|\d+\s*-\s*n\w*\s*g[üu]n)\s*[.:–—-]\s*/i;

export function stripDayPrefix(title: string): string {
  const stripped = title.replace(DAY_PREFIX, "").trim();
  return stripped || title;
}

export default async function TourItinerary({
  days,
  locale,
}: {
  days: ItineraryDay[];
  locale: string;
}) {
  if (!days.length) return null;

  const t = await getTranslations({ locale, namespace: "SectionTitle" });
  const tp = await getTranslations({ locale, namespace: "TourPerPage" });

  return (
    <section id="itinerary" className="container mx-auto px-4 scroll-mt-24">
      <h2
        className={`${PoppinFont.className} text-2xl md:text-3xl 2xl:text-4xl font-bold text-tile`}
      >
        {t("itinerary")}
      </h2>

      <ol className="mt-8 flex flex-col gap-3">
        {days.map((day, index) => {
          const title = stripDayPrefix(
            plainText(localizedField(day, "title", locale)),
          );
          const text = localizedField(day, "text", locale);

          return (
            <li key={day.id}>
              {/* open по умолчанию: содержимое дня должно быть видно сразу
                  и попадать в HTML, а не открываться кликом. */}
              <details
                open
                className="group overflow-hidden rounded-lg ring-1 ring-sand"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 bg-tileMid px-4 py-4 text-white transition-colors hover:bg-tile [&::-webkit-details-marker]:hidden">
                  {/* Номер дня в кружке — у обоих референсов день пронумерован
                      явно, а у нас номер был только внутри текста из CMS.
                      Слово «День» рядом с цифрой не влезало бы в кружок на
                      русском, поэтому его слышно, но не видно: в списке дней
                      цифра и так читается однозначно. */}
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-bold leading-none"
                  >
                    {index + 1}
                  </span>
                  <span className="sr-only">
                    {tp("day")} {index + 1}
                  </span>

                  <span className="flex-1 font-semibold sm:text-lg">
                    {title}
                  </span>

                  {/* Стрелка нарисована в CSS: иконка из react-icons тянула бы
                      сюда клиентский компонент ради одного треугольника. */}
                  <span
                    aria-hidden
                    className="ml-auto h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 border-white transition-transform duration-300 group-open:-rotate-[135deg]"
                  />
                </summary>

                <div className="bg-white px-5 py-5">
                  <div
                    className="cms-text text-sm/relaxed text-ink lg:text-base/relaxed"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />

                  {day.li?.length ? (
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {day.li.map((entry, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brick" />
                          <span className="text-sm lg:text-base">
                            {entry.lii}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
