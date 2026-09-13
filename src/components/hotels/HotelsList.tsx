"use client";

import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { hotelCities, type Hotel } from "@/lib/api/hotels";
import HotelCard from "@/components/hotels/HotelCard";

/**
 * Список отелей с фильтром по городам.
 *
 * Отели приходят готовым списком от серверного родителя, а не запросом из
 * браузера. Прежде оба списка — и общий, и внутри страны — тянули /api/hotels
 * в useEffect: в серверном HTML страницы /en/hotels не было ни одного отеля,
 * поисковик видел пустую страницу. Клиентским компонент остался только
 * из-за фильтра, и это ничему не мешает: React отрисует его на сервере,
 * карточки попадут в разметку, а состояние фильтра оживёт после гидратации.
 *
 * Фильтр держит id города, а не название: названия переводятся, и на
 * туркменской версии «Ashgabat» и «Aşgabat» разъехались бы в два города.
 *
 * sticky у боковой колонки задаётся снаружи: на общей странице отсчёт идёт
 * от шапки, внутри вкладки страны — от липкой панели вкладок.
 */
export default function HotelsList({
  hotels,
  asideTopClassName = "lg:top-28",
}: {
  hotels: Hotel[];
  asideTopClassName?: string;
}) {
  const t = useTranslations("Hotels");
  const locale = useLocale();
  const [activeCity, setActiveCity] = useState<number | null>(null);

  const cities = useMemo(() => hotelCities(hotels, locale), [hotels, locale]);

  const filtered = activeCity
    ? hotels.filter((hotel) => hotel.city_id === activeCity)
    : hotels;

  if (!hotels.length) {
    return <p className="py-10 text-center text-gray-500">{t("notFound")}</p>;
  }

  const button = (active: boolean) =>
    `w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${
      active
        ? "bg-mainForBackground text-mainBlue"
        : "text-gray-600 hover:bg-mainForBackground/60"
    }`;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Города. Один-единственный город фильтровать нечем — тогда колонка
          только отнимает место, как и меню из одного пункта на визовой. */}
      {cities.length > 1 && (
        <aside
          className={`h-fit w-full shrink-0 rounded-2xl border border-gray-200 bg-white p-2 lg:sticky lg:w-56 lg:self-start ${asideTopClassName}`}
        >
          <ul className="flex flex-row flex-wrap gap-1 lg:flex-col">
            <li className="lg:w-full">
              <button
                type="button"
                onClick={() => setActiveCity(null)}
                className={button(activeCity === null)}
              >
                {t("all")}
              </button>
            </li>
            {cities.map((city) => (
              <li key={city.id} className="lg:w-full">
                <button
                  type="button"
                  onClick={() => setActiveCity(city.id)}
                  className={button(activeCity === city.id)}
                >
                  {city.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="flex flex-1 flex-col gap-4">
        {filtered.length ? (
          filtered.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
        ) : (
          <p className="py-10 text-center text-gray-500">{t("notFound")}</p>
        )}
      </div>
    </div>
  );
}
