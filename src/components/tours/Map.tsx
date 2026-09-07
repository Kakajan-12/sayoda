import React from "react";
import { getTranslations } from "next-intl/server";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { PoppinFont } from "@/components/ui/Fonts";
import { mediaUrl } from "@/lib/api/catalog";

interface MapProps {
  data: { map?: string | null };
  /** Осмысленный alt — обычно название тура. */
  alt?: string;
  locale: string;
}

/**
 * Карта маршрута.
 *
 * У части туров карта не загружена — без этой проверки .replace падал на null.
 */
export default async function Map({ data, alt, locale }: MapProps) {
  if (!data?.map) return null;

  const t = await getTranslations({ locale, namespace: "SectionTitle" });
  const tp = await getTranslations({ locale, namespace: "TourPerPage" });

  return (
    <section id="map" className="container mx-auto scroll-mt-24 px-4 py-12 lg:py-20">
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
      >
        {t("map")}
      </h2>

      <div className="relative mt-8 overflow-hidden rounded-xl bg-white ring-1 ring-sand">
        {/*
          object-contain и авто-высота вместо прежних object-cover с
          жёсткими 400×300: карта маршрута принудительно кадрировалась под
          формат 4:3 и теряла края — ровно те, где начало и конец пути.
          Ширину и высоту задаём щедро, чтобы next/image не сжал исходник;
          реальные пропорции держит сама картинка.
        */}
        <ImageWithSkeleton
          src={mediaUrl(data.map)}
          alt={alt || tp("routeOnMap")}
          width={1600}
          height={1000}
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="h-auto w-full object-contain"
          skeletonClassName="rounded-xl"
        />
      </div>
    </section>
  );
}
