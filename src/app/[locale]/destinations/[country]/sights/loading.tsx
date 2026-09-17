"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ComfortaFont } from "@/components/ui/Fonts";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCardsSkeleton from "@/components/blog/BlogCardsSkeleton";

/**
 * Что видно, пока готовится вкладка «Достопримечательности».
 *
 * Next показывает этот файл вместо содержимого, пока серверный компонент
 * ждёт статьи. Раньше ожидание выглядело как готовый ответ «нет данных»:
 * статьи грузились из браузера, и пустой список в первое мгновение был
 * неотличим от настоящей пустоты.
 *
 * Заголовок тоже заглушкой: название страны приходит тем же запросом, что
 * и статьи, и подставить его здесь неоткуда — параметров адреса файлу
 * ожидания не передают.
 *
 * Компонент клиентский, и это не прихоть. Серверный вариант с
 * getTranslations уводил всю вкладку в рендер на каждый запрос: перевод на
 * сервере читает заголовки, а это для Next признак динамической страницы —
 * в сборке sights переставал быть заранее собранным, в отличие от соседних
 * вкладок. Клиентский перевод берёт словарь из провайдера и заголовков не
 * касается, поэтому статическая сборка сохраняется.
 */
export default function Loading() {
  const t = useTranslations("Common");

  return (
    <div className={ComfortaFont.className}>
      {/* Полоса под заголовком та же, что у настоящего: без неё при
          появлении содержимого сетка сдвинулась бы на её толщину. */}
      <div className="border-b-2 border-mainBlue pb-2 mb-6">
        <Skeleton className="h-7 w-72 max-w-full sm:h-8" />
      </div>

      <div role="status" aria-live="polite">
        <span className="sr-only">{t("loading")}</span>
        <BlogCardsSkeleton />
      </div>
    </div>
  );
}
