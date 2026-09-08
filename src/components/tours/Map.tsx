import React from "react";
import { getTranslations } from "next-intl/server";
import TourMapEmbed from "@/components/tours/TourMapEmbed";
import { PoppinFont } from "@/components/ui/Fonts";

interface MapProps {
  data: {
    /** Встроенная карта Google My Maps: маршрут рисуют вручную и вставляют ссылкой. */
    map_embed?: string | null;
  };
  /** Осмысленный alt — обычно название тура. */
  alt?: string;
  locale: string;
}

/**
 * Карта маршрута.
 *
 * Показывается только интерактивная карта. Прежняя картинка — снимок
 * карты, загруженный файлом, — убрана по решению заказчика: два поля под
 * одну карту путали, а сам снимок ничего не давал, кроме изображения.
 *
 * Колонка map в базе и загруженные файлы остались нетронутыми: решение
 * обратимо, и терять их из-за смены подхода незачем.
 *
 * Карты нет — нет и секции: пустой заголовок над ничем хуже отсутствия.
 */
export default async function Map({ data, alt, locale }: MapProps) {
  const embed = data?.map_embed?.trim() || "";
  if (!embed) return null;

  const t = await getTranslations({ locale, namespace: "SectionTitle" });
  const tp = await getTranslations({ locale, namespace: "TourPerPage" });

  return (
    <section id="map" className="container mx-auto scroll-mt-24 px-4 py-12 lg:py-20">
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
      >
        {t("map")}
      </h2>

      <div className="mt-8 overflow-hidden rounded-xl ring-1 ring-sand">
        <TourMapEmbed embedUrl={embed} alt={alt || tp("routeOnMap")} />
      </div>
    </section>
  );
}
