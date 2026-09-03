"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Прокрутка в начало страницы при переходе.
 *
 * Своя прокрутка App Router срабатывает не всегда: при переходе по ссылке
 * без префикса локали (/tours вместо /en/tours) навигация проходит через
 * редирект middleware, и на ещё не прогретом маршруте страница открывалась
 * на той же позиции, где человек читал предыдущую. Воспроизводилось так:
 * /en/blog -> /en/tours оставляло скролл на 1155px вместо 0.
 *
 * Здесь прокрутка задаётся явно и потому не зависит от гонок роутера.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const cameFromHistory = useRef(false);

  useEffect(() => {
    // Кнопки «назад» и «вперёд» должны возвращать человека туда, где он был.
    const onPopState = () => {
      cameFromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (cameFromHistory.current) {
      cameFromHistory.current = false;
      return;
    }
    // Ссылка с якорем ведёт к конкретному блоку — перебивать её нельзя.
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
