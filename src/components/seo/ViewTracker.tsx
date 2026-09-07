"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Отправляет отметку о просмотре страницы в наш бэкенд.
 *
 * Считать на сервере нельзя: страницы отдаются с ISR-кэша Vercel, и до
 * бэкенда доходит малая часть открытий. Поэтому запись шлёт браузер.
 *
 * usePathname срабатывает и на переходах внутри приложения, где полной
 * перезагрузки нет, — иначе в статистику попадала бы только первая страница
 * за визит.
 *
 * Ничего не рендерит и ничего не блокирует: sendBeacon уходит в фоне и не
 * задерживает отрисовку. Ошибку глотаем молча — упавший счётчик не повод
 * ломать страницу посетителю.
 */
export default function ViewTracker() {
  const pathname = usePathname();
  // React в строгом режиме вызывает эффект дважды; без этого каждая страница
  // считалась бы за два просмотра.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api || !pathname || lastSent.current === pathname) return;
    lastSent.current = pathname;

    // Первый сегмент пути — язык, /ru/tours → ru
    const locale = pathname.split("/")[1] || null;

    const payload = JSON.stringify({
      path: pathname,
      locale: locale && /^[a-z]{2}$/.test(locale) ? locale : null,
      referrer: document.referrer || null,
    });

    const url = `${api}/api/views`;

    // sendBeacon переживает уход со страницы: обычный fetch браузер отменил
    // бы, если человек сразу кликнул дальше, и такой просмотр терялся бы.
    //
    // Тип строго text/plain. sendBeacon не умеет ставить заголовки, а любой
    // другой тип делает запрос «сложным» — браузер сначала шлёт OPTIONS,
    // и для фонового маячка такой запрос просто отбрасывается. Бэкенд знает
    // об этом и разбирает тело как JSON независимо от типа.
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(url, new Blob([payload], { type: "text/plain" }));
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
