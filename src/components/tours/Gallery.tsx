"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { PoppinFont } from "@/components/ui/Fonts";
import { useTranslations } from "next-intl";
import { mediaUrl, type TourPhoto } from "@/lib/api/catalog";

/**
 * Галерея тура.
 *
 * Снимки приходят пропсами с сервера — раньше компонент забирал их сам
 * после гидрации, и в HTML страницы галереи не было. Клиентским он остаётся
 * только ради просмотра фото во весь экран.
 *
 * Пустую галерею на странице тура лучше не показывать вовсе, чем печатать
 * «галерея пуста» — это мёртвый блок на продающей странице.
 */
export default function Gallery({
  images,
  tourTitle,
}: {
  images: TourPhoto[];
  tourTitle: string;
}) {
  const t = useTranslations("SectionTitle");
  const tc = useTranslations("Common");
  const [active, setActive] = useState<TourPhoto | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setActive(null), []);

  const open = (photo: TourPhoto) => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setActive(photo);
  };

  /**
   * Escape закрывает просмотр, а фокус уходит на кнопку закрытия и потом
   * возвращается на миниатюру. Без этого открытое фото было ловушкой для
   * клавиатуры: выйти из него было нечем.
   */
  useEffect(() => {
    if (!active) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    // Фон не должен прокручиваться под открытым фото.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      restoreRef.current?.focus?.();
    };
  }, [active, close]);

  if (!images.length) return null;

  return (
    <section id="gallery" className="container mx-auto scroll-mt-24 px-4 py-12 lg:py-20">
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
      >
        {t("gallery")}
      </h2>

      <div className="mt-8 columns-2 gap-2.5 md:columns-3 md:gap-4 xl:columns-4 [&>*]:mb-2.5 md:[&>*]:mb-4">
        {images.map((photo, index) => (
          <button
            key={photo.gallery_id}
            type="button"
            onClick={() => open(photo)}
            className="group relative block w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tileLight"
          >
            <ImageWithSkeleton
              className="h-full max-h-[500px] w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              // Раньше здесь стояло «Tour 16» — номер записи в базе ничего не
              // говорит ни поисковику, ни тому, кто слушает страницу.
              alt={`${tourTitle} — ${index + 1}`}
              src={mediaUrl(photo.image)}
              width={400}
              height={300}
              skeletonClassName="rounded-xl"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={tourTitle}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={tc("close")}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl leading-none text-white transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            &times;
          </button>

          <Image
            src={mediaUrl(active.image)}
            alt={tourTitle}
            width={1600}
            height={1200}
            // Клик по самой фотографии не должен закрывать просмотр.
            onClick={(event) => event.stopPropagation()}
            className="block h-auto max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </section>
  );
}
