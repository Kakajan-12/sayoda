import React from "react";
import PhotoGallery from "@/components/ui/PhotoGallery";
import { mediaUrl, type BlogPhoto } from "@/lib/api/catalog";

/**
 * Снимки статьи.
 *
 * Серверный компонент: раньше галерея запрашивала их из браузера, и в HTML
 * страницы её не было — ровно та же история, что была у галереи тура.
 * Клиентским остаётся только просмотрщик.
 *
 * Заголовка у секции нет намеренно: снимки идут продолжением текста статьи,
 * и отдельная шапка «Галерея» разрывала бы чтение.
 */
export default function ArticleGallery({
  images,
  title,
}: {
  images: BlogPhoto[];
  /** Название статьи — из него собираются подписи снимков. */
  title: string;
}) {
  if (!images.length) return null;

  return (
    <div className="container mx-auto px-4 pb-12 lg:pb-20">
      <PhotoGallery
        photos={images.map((photo, position) => ({
          id: photo.blog_gallery_id,
          src: mediaUrl(photo.image),
          // Было «Blog 12» — номер записи в базе как подпись к фотографии.
          alt: `${title} — ${position + 1}`,
        }))}
      />
    </div>
  );
}
