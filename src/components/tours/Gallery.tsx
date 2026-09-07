import React from "react";
import { getTranslations } from "next-intl/server";
import PhotoGallery from "@/components/ui/PhotoGallery";
import { PoppinFont } from "@/components/ui/Fonts";
import { mediaUrl, type TourPhoto } from "@/lib/api/catalog";

/**
 * Галерея тура.
 *
 * Серверный компонент: снимки приходят пропсами со страницы, а клиентским
 * остаётся только просмотрщик — заголовок секции должен попадать в HTML.
 *
 * Пустую галерею на странице тура лучше не показывать вовсе, чем печатать
 * «галерея пуста» — это мёртвый блок на продающей странице.
 */
export default async function Gallery({
  images,
  tourTitle,
  locale,
}: {
  images: TourPhoto[];
  tourTitle: string;
  locale: string;
}) {
  if (!images.length) return null;

  const t = await getTranslations({ locale, namespace: "SectionTitle" });

  return (
    <section
      id="gallery"
      className="container mx-auto scroll-mt-24 px-4 py-12 lg:py-20"
    >
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
      >
        {t("gallery")}
      </h2>

      <div className="mt-8">
        <PhotoGallery
          photos={images.map((photo, position) => ({
            id: photo.gallery_id,
            src: mediaUrl(photo.image),
            // Раньше здесь стояло «Tour 16» — номер записи в базе ничего
            // не говорит ни поисковику, ни тому, кто слушает страницу.
            alt: `${tourTitle} — ${position + 1}`,
          }))}
        />
      </div>
    </section>
  );
}
