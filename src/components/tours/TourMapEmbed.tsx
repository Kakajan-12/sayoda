"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LuMapPin } from "react-icons/lu";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

/**
 * Карта маршрута.
 *
 * Раньше здесь была фотография карты: её нельзя было ни приблизить, ни
 * подвинуть, ни понять, где именно проходит путь. У stantrips в этом месте
 * встроена карта Google My Maps — маршрут рисуют вручную и вставляют
 * ссылкой. Картинку по решению заказчика убрали совсем: два поля под одну
 * карту путали, а снимок карты всё равно проигрывал настоящей.
 *
 * Встроенная карта — это обращение к Google с куками, поэтому она ждёт
 * согласия наравне с аналитикой и чатом. Пока согласия нет, на месте карты
 * стоит заглушка с кнопкой: посетитель, отказавшийся от куков, всё равно
 * может открыть маршрут, но решает это сам и только для этой карты.
 */
export default function TourMapEmbed({
  embedUrl,
  alt,
}: {
  embedUrl: string;
  alt: string;
}) {
  const t = useTranslations("TourPerPage");
  const [allowed, setAllowed] = useState(false);
  const [askedToShow, setAskedToShow] = useState(false);

  useEffect(() => {
    setAllowed(readConsent() === "granted");

    // Согласие может прийти уже после отрисовки — карта должна
    // появиться сразу, без перезагрузки.
    const onChange = (e: Event) =>
      setAllowed((e as CustomEvent).detail === "granted");
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (allowed || askedToShow) {
    return (
      // Соотношение задаёт контейнер: у iframe своей высоты нет, и без
      // этого карта схлопнулась бы в полоску.
      <iframe
        src={embedUrl}
        title={alt}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] w-full border-0 sm:aspect-[16/9]"
      />
    );
  }

  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-sandLight px-6 text-center sm:aspect-[16/9]">
      <LuMapPin className="size-10 text-tileMid" aria-hidden />
      <button
        type="button"
        onClick={() => setAskedToShow(true)}
        className="rounded-lg bg-brick px-5 py-2.5 font-semibold text-white transition hover:bg-brickDark"
      >
        {t("showMap")}
      </button>
      <span className="text-xs text-inkMuted">{t("showMapNote")}</span>
    </div>
  );
}
