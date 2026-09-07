"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

/**
 * Подключение GA4. Идентификатор приходит из админки — если он не задан,
 * компонент не рендерит ничего, и на страницах без счётчика лишних запросов
 * не появляется.
 *
 * Скрипт грузится только после согласия. Канонический Consent Mode
 * предлагает грузить gtag.js всегда и лишь сообщать ему об отказе — тогда
 * Google достраивает статистику моделью. Здесь это не нужно: собственный
 * счётчик посещаемости собирает полный трафик независимо от согласия,
 * поэтому моделировать нечего, а вот запрос к серверам Google до согласия
 * раскрывал бы им IP посетителя.
 *
 * Next добавляет для afterInteractive-скриптов <link rel="preload"> в head,
 * то есть при постоянной отрисовке файл скачивался бы ещё до ответа
 * посетителя. Условная отрисовка убирает и preload.
 *
 * Значения по умолчанию для Consent Mode ставит ConsentDefaults — отдельным
 * встроенным скриптом, который исполняется раньше этого компонента.
 */
export default function Analytics({ ga4Id }: { ga4Id: string | null }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(readConsent() === "granted");

    // Согласие может прийти уже после отрисовки — счётчик должен
    // подключиться сразу, не дожидаясь перехода на другую страницу.
    const onChange = (e: Event) =>
      setAllowed((e as CustomEvent).detail === "granted");
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Пустая строка и мусорное значение из админки не должны попадать в URL.
  const id = (ga4Id || "").trim();
  if (!/^G-[A-Z0-9]+$/i.test(id) || !allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
