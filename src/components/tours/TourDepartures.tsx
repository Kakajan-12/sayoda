import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PoppinFont } from "@/components/ui/Fonts";
import type { Departure } from "@/lib/api/catalog";

/**
 * Расписание заездов группового тура.
 *
 * У stantrips это «Dates & Availability», у advantour — «Upcoming Group
 * Departures». Приём один и тот же: конкретные даты со статусом превращают
 * тур из абстрактного предложения в поездку, на которую можно записаться,
 * а «мест нет» на соседних датах торопит сильнее любого баннера.
 *
 * Кнопка ведёт в форму брони с уже выбранной датой — она доезжает до
 * письма оператору и до заявки в базе. Без этого расписание было бы
 * витриной: турист выбрал бы дату, а менеджеру пришлось бы переспрашивать.
 */

/**
 * «ГГГГ-ММ-ДД» → Date в UTC.
 *
 * Через `new Date("2026-10-02")` вышло бы то же самое, а вот через
 * `new Date(2026, 9, 2)` — уже полночь по времени сервера, и при выводе
 * в UTC дата съехала бы на сутки назад. Поэтому собираем явно.
 */
function parseDay(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

/** Прибавляет дни, оставаясь в UTC. */
function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export default async function TourDepartures({
  departures,
  tourId,
  tourTitle,
  tourPrice,
  days,
  locale,
}: {
  departures: Departure[];
  tourId: number;
  tourTitle: string;
  tourPrice: number;
  /** Длительность тура — из неё считается дата конца, если её не заполнили. */
  days: number | null;
  locale: string;
}) {
  // Ни одного будущего заезда — секции нет вовсе. Пустое расписание хуже
  // отсутствующего: оно выглядит как отменённые поездки.
  if (!departures.length) return null;

  const t = await getTranslations({ locale, namespace: "TourPerPage" });
  const tb = await getTranslations({ locale, namespace: "Booking" });

  const dayFormat = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

  /** Группируем по годам: у stantrips год вынесен в отдельную вкладку. */
  const byYear = new Map<string, Departure[]>();
  for (const departure of departures) {
    const year = departure.start_date.slice(0, 4);
    const bucket = byYear.get(year);
    if (bucket) bucket.push(departure);
    else byYear.set(year, [departure]);
  }

  return (
    <section
      id="departures"
      className="w-full scroll-mt-24 bg-sandLight py-12 lg:py-20"
    >
      <div className="container mx-auto px-4">
        <h2
          className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
        >
          {t("dates")}
        </h2>
        <p className="mt-3 text-inkMuted">{t("chooseDeparture")}</p>

        <div className="mt-8 flex flex-col gap-8">
          {[...byYear.entries()].map(([year, rows]) => (
            <div key={year}>
              <h3 className="text-lg font-bold text-inkMuted">{year}</h3>

              <ul className="mt-3 overflow-hidden rounded-xl bg-white ring-1 ring-sand">
                {rows.map((departure, index) => {
                  const start = parseDay(departure.start_date);
                  const explicitEnd = departure.end_date
                    ? parseDay(departure.end_date)
                    : null;
                  // Тур на N дней, начавшийся 2-го, заканчивается 2 + N − 1.
                  const end =
                    explicitEnd ??
                    (start && days && days > 1 ? addDays(start, days - 1) : null);

                  const label = !start
                    ? departure.start_date
                    : end && end.getTime() !== start.getTime()
                      ? dayFormat.formatRange(start, end)
                      : dayFormat.format(start);

                  const price = departure.price ?? tourPrice;

                  // Статус «open» с нулём мест — не открытый заезд, а
                  // распроданный: редактор обнулил места и забыл про статус.
                  const soldOut =
                    departure.status === "sold_out" ||
                    departure.seats_left === 0;
                  const closed = departure.status === "closed";
                  const bookable = !soldOut && !closed;

                  const few =
                    bookable &&
                    departure.seats_left !== null &&
                    departure.seats_left > 0 &&
                    departure.seats_left <= 5;

                  return (
                    <li
                      key={departure.id}
                      className={`flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-5 ${
                        index > 0 ? "border-t border-sand" : ""
                      } ${bookable ? "" : "bg-paper"}`}
                    >
                      <span
                        className={`${PoppinFont.className} min-w-[9rem] font-semibold ${
                          bookable ? "text-ink" : "text-inkMuted"
                        }`}
                      >
                        {label}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          few
                            ? "bg-brick/10 text-brick"
                            : bookable
                              ? "bg-tileTint text-tile"
                              : "bg-sand text-inkMuted"
                        }`}
                      >
                        {soldOut
                          ? t("soldOut")
                          : closed
                            ? t("closedForBooking")
                            : few
                              ? t("seatsLeft", { count: departure.seats_left! })
                              : t("seatsAvailable")}
                      </span>

                      {/* Цена прижата вправо, кнопка — следом: так столбцы
                          выстраиваются даже когда даты разной длины. */}
                      <span
                        className={`${PoppinFont.className} ml-auto text-lg font-bold ${
                          bookable ? "text-brick" : "text-inkMuted"
                        }`}
                      >
                        {price}$
                      </span>

                      {bookable ? (
                        <Link
                          href={`/booking?tourId=${tourId}&tourTitle=${encodeURIComponent(
                            tourTitle,
                          )}&date=${departure.start_date}`}
                          className="rounded-lg bg-brick px-5 py-2.5 font-semibold text-white transition hover:bg-brickDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tileLight"
                        >
                          {tb("bookings")}
                        </Link>
                      ) : (
                        // Место кнопки не схлопываем: иначе цены в соседних
                        // строках стояли бы на разной высоте.
                        <span aria-hidden className="w-[7.5rem]" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
