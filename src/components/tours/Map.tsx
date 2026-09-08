import React from "react";
import { getTranslations } from "next-intl/server";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import TourMapEmbed from "@/components/tours/TourMapEmbed";
import { PoppinFont } from "@/components/ui/Fonts";
import { mediaUrl } from "@/lib/api/catalog";

interface MapProps {
  data: {
    map?: string | null;
    /** Встроенная карта Google My Maps, если оператор её завёл. */
    map_embed?: string | null;
  };
  /** Осмысленный alt — обычно название тура. */
  alt?: string;
  locale: string;
}

/**
 * Карта маршрута.
 *
 * Если оператор завёл встроенную карту — показываем её: по ней можно
 * двигаться и приближаться, как у stantrips. Если нет — остаётся прежняя
 * картинка. У части туров ни того, ни другого, тогда секции нет вовсе.
 */
export default async function Map({ data, alt, locale }: MapProps) {
  const image = data?.map ? mediaUrl(data.map) : "";
  const embed = data?.map_embed?.trim() || "";

  if (!image && !embed) return null;

  const t = await getTranslations({ locale, namespace: "SectionTitle" });
  const tp = await getTranslations({ locale, namespace: "TourPerPage" });
  const caption = alt || tp("routeOnMap");

  return (
    <section id="map" className="container mx-auto scroll-mt-24 px-4 py-12 lg:py-20">
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
      >
        {t("map")}
      </h2>

      <div className="mt-8 overflow-hidden rounded-xl ring-1 ring-sand">
        {embed ? (
          // Клиентский компонент: встроенная карта обращается к Google,
          // и показывать её можно только после согласия на куки.
          <TourMapEmbed embedUrl={embed} imageUrl={image} alt={caption} />
        ) : (
          /*
            object-contain и авто-высота: карта маршрута при object-cover
            принудительно кадрировалась и теряла края — ровно те, где
            начало и конец пути.
          */
          <ImageWithSkeleton
            src={image}
            alt={caption}
            width={1600}
            height={1000}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="h-auto w-full bg-white object-contain"
            skeletonClassName="rounded-xl"
          />
        )}
      </div>
    </section>
  );
}
