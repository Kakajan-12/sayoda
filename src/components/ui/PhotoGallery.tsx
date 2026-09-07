"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";

/**
 * Сетка снимков с полноэкранным просмотром.
 *
 * Одна на две галереи: снимки тура и снимки статьи. До этого у каждой была
 * своя самодельная модалка, которая умела ровно две вещи — открыться и
 * закрыться. Ни листания, ни свайпа, ни зума, ни счётчика: открыв третье
 * фото из шестнадцати, посмотреть четвёртое было нельзя — только закрыть
 * и ткнуть в следующее.
 *
 * Просмотр отдан yet-another-react-lightbox. Из него берём стрелки и
 * клавиатуру, свайп и щипок на телефоне, зум колесом, счётчик, ленту
 * миниатюр и полный экран.
 *
 * Почему именно он:
 *   • lightgallery — GPLv3, для коммерческого сайта нужна платная лицензия;
 *   • fslightbox — зум и миниатюры только в платной версии;
 *   • react-image-lightbox — заброшен, с React 19 несовместим;
 *   • photoswipe — хорош, но требует знать размеры каждой картинки заранее,
 *     а в базе у нас лежит только путь к файлу.
 * Этот — MIT, без зависимостей, размеры ему не нужны.
 *
 * В сетке миниатюры идут через next/image: их на странице до шестнадцати,
 * и оптимизатор экономит здесь больше всего. В самом просмотре картинка
 * грузится напрямую — файлы в хранилище уже переведены в WebP, а вставлять
 * next/image внутрь слайда значит ломать зум, который работает с обычным
 * изображением.
 */

export interface Photo {
  /** Уникальный ключ строки в базе. */
  id: string | number;
  src: string;
  alt: string;
}

export default function PhotoGallery({
  photos,
  className,
}: {
  photos: Photo[];
  /** Классы сетки, если нужна другая раскладка. */
  className?: string;
}) {
  const t = useTranslations("Common");
  // −1 значит «закрыто»: отдельный флаг open рядом с индексом рассинхронился
  // бы при закрытии, и просмотр открывался бы на первом снимке вместо того,
  // на котором его закрыли.
  const [index, setIndex] = useState(-1);

  /*
   * Системная настройка «уменьшить движение».
   *
   * В globals.css она гасит переходы разом, но до просмотрщика не достаёт:
   * он двигает слайды не CSS-переходами, а через Web Animations API, и
   * правило с !important их не касается. Поэтому спрашиваем систему сами.
   *
   * Начинаем с «не уменьшать» и уточняем после отрисовки: на сервере
   * matchMedia нет, а обращение к нему в инициализаторе состояния уронило
   * бы страницу.
   */
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (!photos.length) return null;

  const plugins = [Counter, Fullscreen, Zoom];
  // Лента миниатюр на единственном снимке — полоса ради одной картинки.
  if (photos.length > 1) plugins.push(Thumbnails);

  return (
    <>
      <div
        className={
          className ??
          "columns-2 gap-2.5 md:columns-3 md:gap-4 xl:columns-4 [&>*]:mb-2.5 md:[&>*]:mb-4"
        }
      >
        {photos.map((photo, position) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setIndex(position)}
            className="group relative block w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tileLight"
          >
            <ImageWithSkeleton
              className="h-full max-h-[500px] w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              alt={photo.alt}
              src={photo.src}
              width={400}
              height={300}
              skeletonClassName="rounded-xl"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos.map((photo) => ({ src: photo.src, alt: photo.alt }))}
        plugins={plugins}
        // Подписи кнопок идут в aria-label: без перевода скринридер читал бы
        // их по-английски на любом языке сайта.
        labels={{
          Previous: t("prev"),
          Next: t("next"),
          Close: t("close"),
          // Ключи задают сами плагины и пишут их с заглавной: «Enter
          // Fullscreen», а не «Enter fullscreen». Опечатка тут не молчит —
          // тип Labels её ловит.
          "Zoom in": t("zoomIn"),
          "Zoom out": t("zoomOut"),
          "Enter Fullscreen": t("fullscreen"),
          "Exit Fullscreen": t("exitFullscreen"),
        }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        // Одиночный снимок не должен листаться по кругу сам в себя.
        carousel={{ finite: photos.length <= 1 }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .9)" } }}
        animation={
          reduceMotion ? { fade: 0, swipe: 0, navigation: 0 } : { swipe: 250 }
        }
      />
    </>
  );
}
